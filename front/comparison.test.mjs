import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compareRecommendations, requestKey } from './compareRecommendations.ts';
import { isOptionsResponse, isRecommendationResponse, publicError } from './publicResponses.ts';
const examples = JSON.parse(await readFile(new URL('../.shared/specs/contractor-selection/versions/v1/examples/real-http.json', import.meta.url)));
const controlled = JSON.parse(await readFile(new URL('../.shared/specs/contractor-selection/versions/v1/examples/controlled.json', import.meta.url)));
const copy = value => structuredClone(value);

test('historical public October responses explain busy identities and available displacement', () => {
  const busy = compareRecommendations(examples.dense, examples.october11).join('\n');
  assert.match(busy, /2026-10-10 → 2026-10-11/);
  for (const id of ['HK-88430', 'HK-29829']) assert.match(busy, new RegExp(`${id}.*появилась отметка`));
  const displaced = compareRecommendations(examples.october1, examples.october6).join('\n');
  assert.match(displaced, /HK-29829.*нет прежней отметки/);
  assert.match(displaced, /HK-75012.*отметки занятости нет.*дешевле/);
});

test('comparison boundaries exclude first, same date and changed canonical conditions/context', () => {
  assert.deepEqual(compareRecommendations(undefined, examples.dense), []);
  assert.deepEqual(compareRecommendations(examples.dense, examples.dense), []);
  for (const field of ['city', 'category', 'eventFormat', 'budgetKzt', 'language', 'durationHours']) {
    const next = copy(examples.october11); next.normalizedRequest[field] = field === 'budgetKzt' || field === 'durationHours' ? 9 : 'different';
    assert.deepEqual(compareRecommendations(examples.dense, next), [], field);
  }
  for (const field of ['catalogVersion', 'selectionPolicyVersion']) {
    const next = copy(examples.october11); next.context[field] = 'different';
    assert.deepEqual(compareRecommendations(examples.dense, next), []);
  }
  const next = copy(examples.dense); next.normalizedRequest.date = '2026-10-12';
  assert.deepEqual(compareRecommendations(examples.dense, next), ['2026-10-10 → 2026-10-12: отображаемый список не изменился.']);
  assert.equal(requestKey(examples.dense.normalizedRequest), requestKey({ ...examples.dense.normalizedRequest, language: undefined }));
});

test('controlled promotion, equal-price displacement and empty transitions make only proven claims', () => {
  const old = copy(examples.dense); const next = copy(examples.dense);
  old.cards = [{ ...old.cards[0], id: 'FX-002', name: 'Old', priceFromKzt: 100 }];
  next.cards = [{ ...old.cards[0], id: 'FX-001', name: 'New' }];
  next.normalizedRequest.date = '2026-10-11'; old.summary.busyProfileIds = ['FX-001']; next.summary.busyProfileIds = [];
  const tie = compareRecommendations(old, next).join('\n');
  assert.match(tie, /равной стартовой цене.*ID/); assert.doesNotMatch(tie, /дешевле/);
  old.summary.busyProfileIds = []; next.summary.busyProfileIds = ['FX-002'];
  const promotion = compareRecommendations(old, next).join('\n');
  assert.match(promotion, /FX-001.*не было и на предыдущую дату.*поднялся/);
  assert.doesNotMatch(promotion, /нет прежней отметки/);
  next.cards = [];
  assert.match(compareRecommendations(old, next).join('\n'), /FX-002.*появилась отметка/);
  assert.doesNotMatch(compareRecommendations(old, next).join('\n'), /поднялся|дешевле/);
  const empty = copy(old); empty.cards = []; empty.summary.busyProfileIds = ['FX-001'];
  next.cards = [{ ...old.cards[0], id: 'FX-001' }]; next.summary.busyProfileIds = [];
  assert.match(compareRecommendations(empty, next).join('\n'), /FX-001.*нет прежней отметки/);
});

test('public boundary accepts pinned modes/outcomes and rejects unusable shapes safely', () => {
  assert.ok(isOptionsResponse(examples.options));
  for (const [key, value] of Object.entries(examples)) if (key !== 'options') assert.ok(isRecommendationResponse(value), key);
  for (const value of controlled.recommendations) assert.ok(isRecommendationResponse(value));
  for (const value of [null, {}, [], { cards: null }, { error: null }]) assert.equal(isRecommendationResponse(value), false);
  for (const mutate of [value => { value.cards[0].qualityFlags = null; }, value => { value.summary.busyProfileIds = null; },
    value => { value.normalizedRequest.date = '2026-99-99'; }, value => { value.cards = []; }, value => { value.explanationMode = 'unknown'; }]) {
    const value = copy(examples.dense); mutate(value); assert.equal(isRecommendationResponse(value), false);
  }
  const options = copy(examples.options); options.options.cities = []; assert.equal(isOptionsResponse(options), false);
  assert.equal(publicError({ error: { code: 'INTERNAL_ERROR', requestId: '/private/path secret', message: 'private' } }).requestId, '');
});
