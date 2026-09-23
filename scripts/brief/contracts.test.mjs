import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createServices } from '../../back/composition.ts';
import { createHandlers } from '../../back/http/handlers.ts';
import { loadCatalog } from '../../back/catalog/load.ts';
import { createInterpretBrief } from '../../back/ai/brief/interpret.ts';
const f = JSON.parse(readFileSync(new URL('../../contracts/examples/brief.json', import.meta.url)));
const request = { city: 'Алматы', date: '2026-10-10', eventFormat: 'корпоратив', category: 'Ведущий', budgetKzt: 1500000 };
const confirmed = { ...request, brief: f.interpretResponse.brief };
const post = data => new Request('http://localhost/api/recommendations', { method: 'POST', body: JSON.stringify(data) });
const offline = async () => ({ status: 'unavailable', reason: 'configuration' });
const services = createServices('raw/dataset.csv', undefined, () => offline);
const handlers = createHandlers(services);
test('confirmed wishes consider all eligible candidates without another provider call', async () => {
  const base = await (await handlers.recommendations(post(request))).json();
  assert.deepEqual(base.cards.map(c => c.id), ['HK-88430', 'HK-29829', 'HK-27222']);
  const r = await handlers.recommendations(post(confirmed)); const result = await r.json();
  assert.equal(r.status, 200); assert.equal(result.explanationMode, 'brief_evidence');
  assert.deepEqual(result.cards.map(c => c.id), ['HK-77838', 'HK-88430', 'HK-29829']);
  assert.deepEqual(result.summary, base.summary);
  assert.equal(result.cards[0].briefAdvice.unknownConditions[0].text, 'без принудительных конкурсов');
  assert.match(result.cards[0].briefAdvice.question, /без принудительных конкурсов/);
  assert.notEqual(result.context.selectionPolicyVersion, base.context.selectionPolicyVersion);
});
test('style never overrides hard budget, busy date, or empty outcomes', async () => {
  const catalog = (await services()).catalog.snapshot;
  const host = catalog.profiles.find(p => p.id === 'HK-77838');
  for (const altered of [{ budgetKzt: 900000 }, { date: host.busyDates[0] }]) {
    const result = await (await handlers.recommendations(post({ ...confirmed, ...altered }))).json();
    assert.ok(!result.cards.some(c => c.id === host.id));
  }
  for (const [altered, outcome] of [[{ budgetKzt: 1 }, 'no_match'], [{ city: 'Зарубежье', category: 'Флорист' }, 'category_absent']]) {
    const result = await (await handlers.recommendations(post({ ...confirmed, ...altered }))).json();
    assert.equal(result.outcome, outcome); assert.deepEqual(result.cards, []); assert.equal(result.explanationMode, 'not_needed');
  }
});
test('same confirmed request survives parallel calls and process restart', async () => {
  const results = await Promise.all(Array.from({ length: 4 }, async () => (await (await handlers.recommendations(post(confirmed))).json()).cards.map(c => c.id)));
  for (const ids of results) assert.deepEqual(ids, results[0]);
  const code = `import {createServices} from './back/composition.ts'; const s=await createServices('raw/dataset.csv')(); const r=await s.recommend(${JSON.stringify(confirmed)},new AbortController().signal); console.log(JSON.stringify(r.cards.map(c=>c.id)));`;
  const restarted = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', env: { ...process.env, OPENAI_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'] }));
  assert.deepEqual(restarted, results[0]);
});
test('stale index fails only brief selection and invalid confirmed briefs return 400', async () => {
  const load = async path => { const result = await loadCatalog(path); return { ...result, snapshot: { ...result.snapshot,
    profiles: result.snapshot.profiles.map((p, i) => i ? p : { ...p, description: p.description + ' changed' }) } }; };
  const stale = createHandlers(createServices('raw/dataset.csv', load, () => offline));
  assert.equal((await stale.recommendations(post(request))).status, 200);
  const response = await stale.recommendations(post(confirmed));
  assert.equal(response.status, 503); assert.equal((await response.json()).error.code, 'BRIEF_INDEX_UNAVAILABLE');
  for (const brief of [null, { ...confirmed.brief, vocabularyVersion: 'old' }, { ...confirmed.brief, conditions: [{ trait: 'discreet', intent: 'prefer', text: 'invented' }] }]) {
    assert.equal((await handlers.recommendations(post({ ...request, brief }))).status, 400);
  }
});
test('interpretation HTTP retains strict input, safe provider failures and source conditions', async () => {
  const ready = await services();
  const h = createHandlers(async () => ({ ...ready, interpretBrief: createInterpretBrief({ generate: async () => ({ text: JSON.stringify({ conditions: confirmed.brief.conditions }) }) }) }));
  const response = await h.brief(post({ text: confirmed.brief.text })); assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).brief, confirmed.brief);
  for (const value of [{ text: '' }, { text: 'x'.repeat(1001) }, { text: 'ok', model: 'other' }]) assert.equal((await h.brief(post(value))).status, 400);
  const noProvider = createHandlers(async () => ({ catalog: ready.catalog }));
  const failed = await noProvider.brief(post({ text: 'Ненавязчивый ведущий' }));
  assert.equal(failed.status, 503); const error = (await failed.json()).error;
  assert.equal(error.code, 'BRIEF_UNAVAILABLE'); assert.ok(error.requestId); assert.ok(!JSON.stringify(error).includes('OPENAI'));
});
