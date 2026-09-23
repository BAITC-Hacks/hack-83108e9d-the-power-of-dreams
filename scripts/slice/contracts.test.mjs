// Controlled acceptance checks: real catalogue plus pinned synthetic boundary examples; no provider calls.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, unlink, rmdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { loadCatalog } from '../../back/catalog/load.ts';
import { select } from '../../back/domain/select.ts';
import { createServices } from '../../back/composition.ts';
import { createHandlers } from '../../back/http/handlers.ts';
import { createRecommend } from '../../back/recommend/recommend.ts';
import { createSelectEvidence, validateEvidence } from '../../back/ai/evidence/select.ts';
import { fixtures } from '../../contracts/examples/fixtures.ts';
import { normalization, withOptionalInputs, identityCases, perCardCases } from '../../contracts/examples/boundaries.ts';

const dense = fixtures.request;
const denseIds = ['HK-88430', 'HK-29829', 'HK-27222'];
const real = await loadCatalog(resolve('raw/dataset.csv'));
assert.equal(real.status, 'ready');
const fixture = fixtures.moduleBoundaries.catalogReady;
const profiles = fixture.snapshot.profiles.slice(0, 3);
const envelope = fixtures.moduleBoundaries.providerEnvelope;
const signal = () => new AbortController().signal;
const post = (value, options = {}) => new Request('http://localhost/api/recommendations', {
  method: 'POST', body: JSON.stringify(value), ...options,
});
const handlersFor = (catalog, evidence) => createHandlers(async () => ({
  catalog, recommend: createRecommend(catalog.snapshot, select, evidence),
}));
const ids = result => result.cards.map(card => card.id);
const uuid = value => assert.match(value, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

test('real catalogue -> HTTP: global options, dense counts/order, safe cards and fallback', async () => {
  let calls = 0;
  const handlers = handlersFor(real, createSelectEvidence({ generate: async input => {
    calls++;
    const payload = JSON.parse(input.input);
    assert.deepEqual(payload.request, dense);
    assert.deepEqual(payload.profiles.map(p => p.id), denseIds);
    assert.ok(payload.profiles.every(p => !('busyDates' in p) && !('name' in p) && !('city' in p)));
    assert.equal(input.maxOutputTokens, 450);
    throw Object.assign(new Error('controlled provider failure'), { code: 'OPENAI_TIMEOUT' });
  } }));
  const optionsResponse = await handlers.options();
  assert.equal(optionsResponse.status, 200);
  const options = await optionsResponse.json();
  uuid(options.requestId);
  assert.equal(options.context.catalogVersion, `sha256:${createHash('sha256').update(await readFile(resolve('raw/dataset.csv'))).digest('hex')}`);
  for (const [key, values] of Object.entries({ cities: real.snapshot.profiles.map(p => p.city),
    categories: real.snapshot.profiles.flatMap(p => p.categories), eventFormats: real.snapshot.profiles.flatMap(p => p.eventFormats),
    languages: real.snapshot.profiles.flatMap(p => p.languages) })) {
    assert.deepEqual(options.options[key], [...new Set(values)].sort());
  }
  const response = await handlers.recommendations(post(normalization.input));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const result = await response.json();
  uuid(result.requestId);
  assert.deepEqual(result.normalizedRequest, dense);
  assert.deepEqual(result.context, options.context);
  assert.equal(result.outcome, 'matched');
  assert.deepEqual(ids(result), denseIds);
  assert.equal(result.summary.candidateCount, 10);
  assert.equal(result.summary.eligibleCount, 5);
  assert.deepEqual(result.summary.exclusions, { busy: 4, budget: 1, format: 0, language: 0, duration: 0 });
  assert.equal(result.summary.busyProfileIds.length, 4);
  assert.equal(result.explanationMode, 'catalog_fallback');
  assert.equal(calls, 1);
  for (const card of result.cards) {
    const source = real.snapshot.profiles.find(p => p.id === card.id);
    assert.deepEqual(Object.keys(card).sort(), ['id', 'name', 'category', 'city', 'priceFromKzt', 'explanation', 'qualityFlags'].sort());
    assert.equal(card.priceFromKzt, source.priceFromKzt);
    assert.deepEqual(card.qualityFlags, source.qualityFlags);
    assert.ok(card.explanation.length > 0);
    assert.ok(!card.explanation.includes('Из описания:'));
  }
});

test('real no-match and pinned category-absent return HTTP 200/not_needed without evidence', async () => {
  const noEvidence = async () => assert.fail('Empty selection must not call evidence');
  for (const [catalog, input, outcome, candidates] of [
    [real, { ...dense, budgetKzt: 1 }, 'no_match', 10],
    [fixture, { ...dense, city: 'Астана' }, 'category_absent', 0],
  ]) {
    const response = await handlersFor(catalog, noEvidence).recommendations(post(input));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.outcome, outcome);
    assert.deepEqual(result.cards, []);
    assert.equal(result.explanationMode, 'not_needed');
    assert.equal(result.summary.candidateCount, candidates);
    assert.equal(result.summary.eligibleCount, 0);
    assert.equal(Object.values(result.summary.exclusions).reduce((a, b) => a + b, 0), candidates);
  }
});

test('missing/unreadable/invalid source and retained failure survive file repair until restart', async t => {
  const directory = await mkdtemp(resolve('.slice-check-'));
  const path = join(directory, 'catalog.csv');
  t.after(async () => { await unlink(path).catch(error => { if (error.code !== 'ENOENT') throw error; }); await rmdir(directory); });
  assert.deepEqual(await loadCatalog(path), { status: 'unavailable', error: { kind: 'missing' } });
  assert.deepEqual(await loadCatalog(directory), { status: 'unavailable', error: { kind: 'unreadable' } });
  for (const bytes of ['wrong,headers\n1,2\n', Buffer.from([0xff, 0xfe])]) {
    await writeFile(path, bytes);
    assert.deepEqual(await loadCatalog(path), { status: 'unavailable', error: { kind: 'invalid' } });
  }
  let loads = 0;
  let factories = 0;
  const getServices = createServices(path, async p => { loads++; return loadCatalog(p); }, () => {
    factories++;
    return async () => ({ status: 'unavailable', reason: 'configuration' });
  });
  const first = getServices();
  assert.equal(getServices(), first, 'Concurrent startup must share the in-flight promise');
  await first;
  await writeFile(path, await readFile(resolve('raw/dataset.csv')));
  const handlers = createHandlers(getServices);
  const responses = await Promise.all([handlers.options(), handlers.recommendations(post(dense)), handlers.recommendations(post(dense))]);
  const requestIds = [];
  for (const response of responses) {
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.error.code, 'CATALOG_UNAVAILABLE');
    uuid(body.error.requestId);
    requestIds.push(body.error.requestId);
    assert.ok(body.error.message);
    assert.ok(!JSON.stringify(body).includes(directory));
  }
  assert.equal(new Set(requestIds).size, responses.length);
  assert.equal(loads, 1);
  assert.equal(factories, 0);
  const restarted = createServices(path, loadCatalog, () => async () => ({ status: 'unavailable', reason: 'configuration' }));
  const ready = await restarted();
  assert.equal(ready.catalog.status, 'ready');
  await writeFile(path, 'invalid after successful startup');
  assert.equal(await restarted(), ready, 'Successful snapshot must also be retained');
});

test('HTTP validates malformed/unknown/null/optional/date input before evidence', async () => {
  const handlers = handlersFor(real, async () => assert.fail('Invalid input must not call evidence'));
  const invalid = [null, [], {}, { ...dense, extra: true },
    ...['city', 'category', 'eventFormat', 'date', 'budgetKzt', 'language', 'durationHours'].map(field => ({ ...dense, [field]: null })),
    ...['city', 'category', 'eventFormat', 'language'].map(field => ({ ...dense, [field]: 'unknown-option' })),
    ...[0, -1, 1.5, '1500000', Number.MAX_SAFE_INTEGER + 1].map(budgetKzt => ({ ...dense, budgetKzt })),
    ...[0, -1, '4'].map(durationHours => ({ ...dense, durationHours })),
    ...['2026-02-30', '2026-10-1', '2026-10-10T00:00:00Z'].map(date => ({ ...dense, date })),
  ];
  const requests = invalid.map(value => post(value));
  requests.push(new Request('http://localhost/api/recommendations', { method: 'POST', body: '{' }));
  for (const request of requests) {
    const response = await handlers.recommendations(request);
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error.code, 'INVALID_REQUEST');
    uuid(body.error.requestId);
  }
  for (const date of ['2026-09-22', '2027-01-01']) {
    const response = await handlers.recommendations(post({ ...dense, date }));
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error.code, 'DATE_OUT_OF_RANGE');
    assert.equal(body.error.fields[0].field, 'date');
  }
  const valid = handlersFor(real, async () => ({ status: 'unavailable', reason: 'configuration' }));
  for (const input of [withOptionalInputs, { ...dense, durationHours: 0.5 },
    { ...dense, date: '2026-09-23' }, { ...dense, date: '2026-12-31' }]) {
    const response = await valid.recommendations(post(input));
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).normalizedRequest, input);
  }
});

test('optional eligibility, exclusive first failure, numeric/null duration and deterministic ties', () => {
  const profile = profiles[0];
  const candidates = [
    { ...profile, id: 'busy', busyDates: [dense.date], priceFromKzt: 2000000 },
    { ...profile, id: 'budget', priceFromKzt: 2000000, eventFormats: [] },
    { ...profile, id: 'format', eventFormats: [], languages: [] },
    { ...profile, id: 'language', languages: [], maxHours: 1 },
    { ...profile, id: 'duration', maxHours: 3 },
    { ...profile, id: 'B', maxHours: null },
    { ...profile, id: 'A', maxHours: 4 },
  ];
  const result = select(candidates, { ...withOptionalInputs, budgetKzt: profile.priceFromKzt });
  assert.deepEqual(result.selectedIds, ['A', 'B']);
  assert.deepEqual(result.summary.exclusions, { busy: 1, budget: 1, format: 1, language: 1, duration: 1 });
  assert.equal(result.summary.candidateCount, 7);
  assert.equal(result.summary.eligibleCount, 2);
  assert.deepEqual(select([candidates[3], candidates[4]], dense).selectedIds, ['duration', 'language']);
});

test('pinned batch identity/types and per-card quote failures execute against validator and renderer', async () => {
  const cases = [
    ...identityCases.map(c => ({ name: c.name, value: { items: c.items }, expected: c.expected })),
    ...perCardCases.map(c => ({ name: c.expected.byId['FX-003'].reason, value: c.providerEnvelope, expected: c.expected })),
    ...[{ items: envelope.items, extra: true }, { items: [envelope.items[0], envelope.items[1], { id: 'FX-003', evidenceQuote: 123 }] },
      { items: [envelope.items[0], envelope.items[1], { id: 'FX-003' }] }, { items: null }]
      .map(value => ({ name: 'invalid structure/type', value, expected: { status: 'unavailable', reason: 'invalid_batch' } })),
    { name: 'invalid JSON', text: '{', expected: { status: 'unavailable', reason: 'invalid_response' } },
    { name: 'all null', value: { items: envelope.items.map(i => ({ ...i, evidenceQuote: null })) }, mode: 'catalog_fallback' },
  ];
  for (const c of cases) {
    const text = c.text ?? JSON.stringify(c.value);
    const result = validateEvidence(text, profiles);
    if (c.expected) assert.deepEqual(JSON.parse(JSON.stringify(result)), c.expected, c.name);
    let calls = 0;
    const evidence = createSelectEvidence({ generate: async () => { calls++; return { text }; } });
    const rendered = await createRecommend(fixture.snapshot, select, evidence)(dense, signal());
    const accepted = c.expected?.status === 'validated' ? Object.values(c.expected.byId).filter(i => i.status === 'accepted').length : 0;
    assert.equal(rendered.explanationMode, c.mode ?? (accepted === 3 ? 'openai_evidence' : accepted ? 'mixed' : 'catalog_fallback'), c.name);
    assert.deepEqual(ids(rendered), profiles.map(p => p.id), c.name);
    assert.equal(rendered.cards.filter(card => card.explanation.includes('Из описания:')).length, accepted, c.name);
    assert.equal(calls, 1, c.name);
  }
});

test('quote whitespace normalization, own-source matching and Unicode 180-code-point boundary', () => {
  const check = (description, quote) => validateEvidence(JSON.stringify({ items: [{ id: 'unicode', evidenceQuote: quote }] }), [{ ...profiles[0], id: 'unicode', description }]).byId.unicode;
  assert.deepEqual(check('Командные\n игры', '  Командные   игры  '), { status: 'accepted', quote: 'Командные игры' });
  assert.equal(check('😀'.repeat(180), '😀'.repeat(180)).status, 'accepted');
  assert.deepEqual(check('😀'.repeat(181), '😀'.repeat(181)), { status: 'fallback', reason: 'too_long' });
  assert.deepEqual(check(profiles[0].description, profiles[1].description), { status: 'fallback', reason: 'source_mismatch' });
});

test('cancellation before/during evidence rejects AbortError through HTTP without fallback or retries', async () => {
  for (const phase of ['before', 'during-success', 'during-provider-error', 'provider-cancelled']) {
    const controller = new AbortController();
    let calls = 0;
    const evidence = createSelectEvidence({ generate: async () => {
      calls++;
      await Promise.resolve();
      if (phase !== 'provider-cancelled') controller.abort();
      if (phase === 'during-provider-error') throw Object.assign(new Error('controlled'), { code: 'OPENAI_TIMEOUT' });
      if (phase === 'provider-cancelled') throw Object.assign(new Error('controlled'), { code: 'OPENAI_CANCELLED' });
      return { text: JSON.stringify(envelope) };
    } });
    if (phase === 'before') controller.abort();
    await assert.rejects(handlersFor(fixture, evidence).recommendations(post(dense, { signal: controller.signal })), { name: 'AbortError' }, phase);
    assert.equal(calls, phase === 'before' ? 0 : 1, phase);
  }
});
