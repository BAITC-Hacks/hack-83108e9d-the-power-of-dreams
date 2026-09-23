import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createOpenAIAdapter, createOpenAIFromEnv, DEFAULT_MODEL } from '../../back/ai/openai.mjs';

const success = () => ({ id: 'resp_test', model: DEFAULT_MODEL, status: 'completed',
  output: [{ type: 'reasoning' }, { type: 'message', content: [
    { type: 'output_text', text: 'OPENAI_' }, { type: 'output_text', text: 'OK' },
  ] }], usage: { input_tokens: 17, output_tokens: 4, total_tokens: 21 } });
const adapter = fetchImpl => createOpenAIAdapter({ apiKey: 'synthetic-secret', fetchImpl });
const hasCode = code => error => error.code === code && typeof error.requestId === 'string' &&
  !JSON.stringify(error).includes('synthetic-secret') && !error.message.includes('private-body');

test('Responses contract, schema forwarding and all output text parts', async () => {
  let calls = 0;
  const format = { name: 'evidence', schema: { type: 'object', properties: {}, additionalProperties: false } };
  const result = await adapter(async (url, options) => {
    calls++;
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer synthetic-secret');
    assert.deepEqual(JSON.parse(options.body), { model: DEFAULT_MODEL, input: 'test', instructions: 'brief',
      store: false, max_output_tokens: 450, reasoning: { effort: 'none' }, text: { format: { type: 'json_schema', ...format, strict: true } } });
    return Response.json(success());
  }).generate({ input: 'test', instructions: 'brief', format });
  assert.equal(calls, 1);
  assert.equal(result.text, 'OPENAI_OK');
  assert.equal(result.mode, 'live');
  assert.deepEqual(result.usage, { inputTokens: 17, outputTokens: 4, totalTokens: 21 });
});

test('environment factory requires key and supports default / override', async () => {
  const envFile = new URL('./absent-test.env', import.meta.url);
  assert.throws(() => createOpenAIFromEnv({ env: {}, envFile }), hasCode('CONFIG_REQUIRED'));
  for (const configured of ['', 'model-override']) {
    await createOpenAIFromEnv({ env: { OPENAI_API_KEY: 'synthetic-secret', OPENAI_MODEL: configured }, envFile,
      fetchImpl: async (_, options) => {
        assert.equal(JSON.parse(options.body).model, configured || DEFAULT_MODEL);
        assert.deepEqual(JSON.parse(options.body).reasoning, configured ? undefined : { effort: 'none' });
        return Response.json(success());
      },
    }).generate({ input: 'test' });
  }
});

test('HTTP errors are safe and never retried', async () => {
  for (const [status, code] of [[401, 'OPENAI_AUTH'], [403, 'OPENAI_AUTH'], [429, 'OPENAI_RATE_LIMIT'],
    [500, 'OPENAI_UNAVAILABLE'], [400, 'OPENAI_REQUEST_REJECTED']]) {
    let calls = 0;
    await assert.rejects(adapter(async () => {
      calls++;
      return new Response('private-body synthetic-secret', { status });
    }).generate({ input: 'test' }), hasCode(code));
    assert.equal(calls, 1);
  }
  await assert.rejects(adapter(async () => { throw new Error('private-body synthetic-secret'); })
    .generate({ input: 'test' }), hasCode('OPENAI_NETWORK'));
});

test('malformed, incomplete, refusal and empty responses fail explicitly', async () => {
  for (const [data, code] of [[null, 'OPENAI_RESPONSE'],
    [{ ...success(), status: 'incomplete' }, 'OPENAI_INCOMPLETE'],
    [{ ...success(), output: [] }, 'OPENAI_RESPONSE'],
    [{ ...success(), usage: { input_tokens: '17' } }, 'OPENAI_RESPONSE'],
    [{ ...success(), output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'private-body' }] }] }, 'OPENAI_REFUSED']]) {
    await assert.rejects(adapter(async () => Response.json(data)).generate({ input: 'test' }), hasCode(code));
  }
  await assert.rejects(adapter(async () => new Response('not-json')).generate({ input: 'test' }), hasCode('OPENAI_RESPONSE'));
});

test('invalid input and already cancelled calls never contact provider', async () => {
  const client = adapter(async () => { assert.fail('must not send'); });
  await assert.rejects(client.generate({ input: '' }), hasCode('OPENAI_INPUT'));
  await assert.rejects(client.generate({ input: 'test', signal: AbortSignal.abort() }), hasCode('OPENAI_CANCELLED'));
});

test('native fetch deadline includes body consumption and supports caller cancellation', async () => {
  const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.flushHeaders();
    res.write('{'); // Deliberately never complete the body.
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    const client = createOpenAIAdapter({ apiKey: 'synthetic-secret', timeoutMs: 100,
      fetchImpl: (_, options) => fetch(url, { ...options, headers: { 'Content-Type': 'application/json' } }) });
    await assert.rejects(client.generate({ input: 'test' }), hasCode('OPENAI_TIMEOUT'));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30);
    try { await assert.rejects(client.generate({ input: 'test', signal: controller.signal }), hasCode('OPENAI_CANCELLED')); }
    finally { clearTimeout(timer); }
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
