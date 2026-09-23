// Real loader -> composition -> HTTP checks; synthetic configuration and controlled transport only.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { configuredEvidence, createServices } from '../../back/composition.ts';
import { createHandlers } from '../../back/http/handlers.ts';
import { createOpenAIFromEnv } from '../../back/ai/openai.mjs';
import { loadSecrets } from '../../back/config/secrets.mjs';
import { fixtures } from '../../contracts/examples/fixtures.ts';

const selectedIds = ['HK-88430', 'HK-29829', 'HK-27222'];
const post = () => new Request('http://localhost/api/recommendations', {
  method: 'POST', body: JSON.stringify(fixtures.request),
});
const handlersFor = factory => createHandlers(createServices(resolve('raw/dataset.csv'), undefined,
  () => configuredEvidence(factory)));
const uuid = value => assert.match(value, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

async function configuration(t, contents) {
  const directory = await mkdtemp(resolve('.configuration-check-'));
  const envFile = join(directory, '.env');
  t.after(async () => {
    await unlink(envFile).catch(error => { if (error.code !== 'ENOENT') throw error; });
    await rmdir(directory);
  });
  if (contents !== undefined) await writeFile(envFile, contents);
  return { directory, envFile };
}

test('missing/blank keys and unreadable file with populated environment give connected catalogue fallback', async t => {
  for (const scenario of [
    { name: 'absent file and key', env: {}, code: 'CONFIG_REQUIRED' },
    { name: 'missing key in file', contents: 'OPENAI_MODEL=synthetic-model\n', env: {}, code: 'CONFIG_REQUIRED' },
    { name: 'blank file key', contents: 'OPENAI_API_KEY="   "\n', env: {}, code: 'CONFIG_REQUIRED' },
    { name: 'blank environment overrides file key', contents: 'OPENAI_API_KEY=synthetic-file-key\n',
      env: { OPENAI_API_KEY: ' \t ' }, code: 'CONFIG_REQUIRED' },
    { name: 'unreadable directory with populated environment', env: { OPENAI_API_KEY: 'synthetic-env-key', OPENAI_MODEL: 'synthetic-model' },
      unreadable: true, code: 'CONFIG_FILE_UNREADABLE' },
  ]) {
    await t.test(scenario.name, async t => {
      const paths = await configuration(t, scenario.contents);
      let calls = 0;
      let configurationCode;
      const handlers = handlersFor(() => {
        try {
          return createOpenAIFromEnv({ env: scenario.env, envFile: scenario.unreadable ? paths.directory : paths.envFile,
            fetchImpl: async () => { calls++; throw new Error('Unexpected controlled transport request'); } });
        } catch (error) { configurationCode = error.code; throw error; }
      });
      const response = await handlers.recommendations(post());
      assert.equal(response.status, 200);
      const body = await response.json();
      uuid(body.requestId);
      assert.equal(body.outcome, 'matched');
      assert.equal(body.explanationMode, 'catalog_fallback');
      assert.deepEqual(body.cards.map(card => card.id), selectedIds);
      assert.ok(body.cards.every(card => card.explanation.length > 0));
      assert.equal(configurationCode, scenario.code);
      assert.equal(calls, 0);
    });
  }
});

test('usable environment with absent file reaches controlled provider through real factory and HTTP', async t => {
  const { envFile } = await configuration(t);
  const requests = [];
  const handlers = handlersFor(() => createOpenAIFromEnv({
    env: { OPENAI_API_KEY: 'synthetic-env-key', OPENAI_MODEL: 'synthetic-model' }, envFile,
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      const { profiles } = JSON.parse(JSON.parse(options.body).input);
      return Response.json({ id: 'synthetic-response', model: 'synthetic-model', status: 'completed',
        output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify({
          items: profiles.map(profile => ({ id: profile.id, evidenceQuote: null })),
        }) }] }] });
    },
  }));
  const response = await handlers.recommendations(post());
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.outcome, 'matched');
  assert.deepEqual(body.cards.map(card => card.id), selectedIds);
  assert.equal(body.explanationMode, 'catalog_fallback', 'Controlled provider intentionally returns no quotes');
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, 'https://api.openai.com/v1/responses');
  assert.equal(requests[0].options.headers.Authorization, 'Bearer synthetic-env-key');
  const payload = JSON.parse(requests[0].options.body);
  assert.equal(payload.model, 'synthetic-model');
  assert.deepEqual(JSON.parse(payload.input).profiles.map(profile => profile.id), selectedIds);
});

test('invalid loader request and unexpected configuration faults stay safe connected HTTP 500 failures', async t => {
  const { envFile, directory } = await configuration(t);
  const privateDetail = 'synthetic-private-detail';
  const requestIds = [];
  for (const fault of ['CONFIG_INVALID_REQUEST', 'unexpected']) {
    let observed;
    const handlers = handlersFor(() => {
      try {
        if (fault === 'CONFIG_INVALID_REQUEST') {
          // Production uses fixed valid names; exercise the actual loader's invalid-request boundary.
          return loadSecrets({ required: [`NEXT_PUBLIC_${privateDetail}`], env: {}, envFile });
        }
        throw new Error(`${privateDetail}: ${directory}`);
      } catch (error) { observed = error; throw error; }
    });
    for (const response of [await handlers.options(), await handlers.recommendations(post()), await handlers.recommendations(post())]) {
      assert.equal(response.status, 500);
      const body = await response.json();
      assert.deepEqual(Object.keys(body), ['error']);
      assert.deepEqual(Object.keys(body.error).sort(), ['code', 'message', 'requestId']);
      assert.equal(body.error.code, 'INTERNAL_ERROR');
      assert.equal(body.error.message, 'Не удалось выполнить подбор. Попробуйте ещё раз.');
      uuid(body.error.requestId);
      requestIds.push(body.error.requestId);
      const serialized = JSON.stringify(body);
      for (const detail of [privateDetail, directory, envFile, observed.message, observed.stack]) {
        assert.ok(!serialized.includes(detail), 'HTTP error must not expose private configuration details');
      }
    }
    if (fault === 'CONFIG_INVALID_REQUEST') assert.equal(observed.code, fault);
    else assert.equal(observed.message, `${privateDetail}: ${directory}`);
  }
  assert.equal(new Set(requestIds).size, requestIds.length);
});
