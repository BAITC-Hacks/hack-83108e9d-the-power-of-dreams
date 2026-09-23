import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createInterpretBrief, BriefError } from './interpret.ts';
const fixture = JSON.parse(readFileSync(new URL('../../../contracts/examples/brief.json', import.meta.url)));
const brief = fixture.interpretResponse.brief;
const signal = () => new AbortController().signal;
const adapter = value => ({ generate: async () => ({ text: JSON.stringify(value) }) });
test('reviewable literal wishes preserve qualified unknown avoidances', async () => {
  const result = await createInterpretBrief(adapter({ conditions: brief.conditions }))(brief.text, signal());
  assert.deepEqual(result, brief);
});
test('invented spans, duplicates, unsupported traits and extra fields are rejected', async () => {
  for (const data of [
    { conditions: [{ trait: 'discreet', intent: 'prefer', text: 'not in source' }] },
    { conditions: [brief.conditions[0], brief.conditions[0]] },
    { conditions: [{ ...brief.conditions[0], trait: 'best' }] },
    { conditions: brief.conditions, explanation: 'invented' },
    { conditions: [{ ...brief.conditions[0], extra: true }] },
  ]) await assert.rejects(createInterpretBrief(adapter(data))(brief.text, signal()), e => e.code === 'BRIEF_UNAVAILABLE');
});
test('invalid input does not call model; expected failure is safe; faults stay faults', async () => {
  const client = createInterpretBrief({ generate: async () => assert.fail('unexpected call') });
  for (const input of ['', 'x'.repeat(1001)]) await assert.rejects(client(input, signal()), e => e.code === 'INVALID_REQUEST');
  await assert.rejects(createInterpretBrief({ generate: async () => { throw { code: 'OPENAI_TIMEOUT' }; } })(brief.text, signal()), BriefError);
  await assert.rejects(createInterpretBrief({ generate: async () => { throw new Error('programming'); } })(brief.text, signal()), /programming/);
});
test('cancellation wins before dispatch and after a late success or failure', async () => {
  await assert.rejects(createInterpretBrief({ generate: async () => assert.fail('unexpected call') })(brief.text, AbortSignal.abort()), { name: 'AbortError' });
  for (const fail of [false, true]) {
    const controller = new AbortController();
    const client = createInterpretBrief({ generate: async () => { controller.abort(); if (fail) throw { code: 'OPENAI_TIMEOUT' }; return { text: JSON.stringify({ conditions: brief.conditions }) }; } });
    await assert.rejects(client(brief.text, controller.signal), { name: 'AbortError' });
  }
});
