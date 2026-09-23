// Controlled domain acceptance profiles; real catalogue/HTTP checks stay in scripts/slice.
import test from 'node:test';
import assert from 'node:assert/strict';
import { select } from './select.ts';

const request = {
  city: 'Алматы', category: 'Ведущий', date: '2026-10-10',
  eventFormat: 'Свадьба', budgetKzt: 100000,
};
const noExclusions = { busy: 0, budget: 0, format: 0, language: 0, duration: 0 };
const profile = (id, overrides = {}) => ({
  id, name: id, city: request.city, categories: [request.category],
  priceFromKzt: 50000, eventFormats: [request.eventFormat], languages: ['Русский'],
  maxHours: 4, busyDates: [], description: 'Controlled acceptance profile.',
  qualityFlags: { synthetic: true, cityImputed: false, priceImputed: false },
  ...overrides,
});

test('S1: exact scope counts multi-category profiles once and excludes unrelated busy profiles', () => {
  const result = select([
    profile('multi', { categories: ['DJ', request.category] }),
    profile('other-city', { city: 'Астана', busyDates: [request.date] }),
    profile('other-category', { categories: ['DJ'], busyDates: [request.date] }),
    profile('city-case', { city: 'алматы', busyDates: [request.date] }),
    profile('category-case', { categories: ['ведущий'], busyDates: [request.date] }),
  ], request);
  assert.deepEqual(result, {
    outcome: 'matched', selectedIds: ['multi'],
    summary: { candidateCount: 1, eligibleCount: 1, exclusions: noExclusions, busyProfileIds: [] },
  });
});

test('S3: all busy IDs survive the display limit, including a venue and overlapping failures', () => {
  const venueRequest = { ...request, category: 'Площадка' };
  const venue = (id, overrides = {}) => profile(id, { categories: ['Площадка'], maxHours: null, ...overrides });
  const result = select([
    venue('b', { busyDates: [request.date] }),
    venue('2', { busyDates: [request.date], priceFromKzt: 200000, eventFormats: [] }),
    venue('a', { busyDates: [request.date] }),
    venue('10', { busyDates: [request.date] }),
    venue('A', { busyDates: [request.date] }),
    venue('free'),
    venue('outside', { city: 'Астана', busyDates: [request.date] }),
    profile('person-outside', { busyDates: [request.date] }),
  ], venueRequest);
  assert.deepEqual(result, {
    outcome: 'matched', selectedIds: ['free'],
    summary: { candidateCount: 6, eligibleCount: 1,
      exclusions: { ...noExclusions, busy: 5 }, busyProfileIds: ['10', '2', 'A', 'a', 'b'] },
  });
  assert.equal(new Set(result.summary.busyProfileIds).size, result.summary.exclusions.busy);
});

test('S4: zero/short/full outcomes preserve total counts and ordinal ties across input orders', () => {
  const ranked = [profile('cheapest', { priceFromKzt: 10000 }),
    ...['10', '2', 'A', 'a', 'b'].map(id => profile(id))];
  for (const count of [0, 1, 2, 3, 6]) {
    const candidates = ranked.slice(0, count);
    const expected = {
      outcome: count ? 'matched' : 'category_absent',
      selectedIds: ['cheapest', '10', '2'].slice(0, Math.min(count, 3)),
      summary: { candidateCount: count, eligibleCount: count, exclusions: noExclusions, busyProfileIds: [] },
    };
    assert.deepEqual(select(candidates, request), expected);
    assert.deepEqual(select([...candidates].reverse(), request), expected);
  }
  const tied = ranked.slice(1);
  for (const order of [tied, [...tied].reverse(), [tied[3], tied[1], tied[4], tied[0], tied[2]]]) {
    assert.deepEqual(select(order, request).selectedIds, ['10', '2', 'A']);
  }
  assert.deepEqual(select([profile('busy', { busyDates: [request.date] })], request), {
    outcome: 'no_match', selectedIds: [],
    summary: { candidateCount: 1, eligibleCount: 0,
      exclusions: { ...noExclusions, busy: 1 }, busyProfileIds: ['busy'] },
  });
});

test('S5: deeply frozen inputs and catalogue order survive repeated and intervening requests', () => {
  const freeze = value => {
    if (value && typeof value === 'object') {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };
  const inputs = freeze({
    request: { ...request, language: 'Русский', durationHours: 4 },
    profiles: [profile('B'), profile('busy', { busyDates: [request.date] }),
      profile('A', { categories: ['DJ', request.category] })],
  });
  const before = structuredClone(inputs);
  const expected = {
    outcome: 'matched', selectedIds: ['A', 'B'],
    summary: { candidateCount: 3, eligibleCount: 2,
      exclusions: { ...noExclusions, busy: 1 }, busyProfileIds: ['busy'] },
  };
  assert.deepEqual(select(inputs.profiles, inputs.request), expected);
  const otherRequest = freeze({ ...inputs.request, date: '2026-10-11', budgetKzt: 1 });
  assert.deepEqual(select(inputs.profiles, otherRequest), {
    outcome: 'no_match', selectedIds: [],
    summary: { candidateCount: 3, eligibleCount: 0,
      exclusions: { ...noExclusions, budget: 3 }, busyProfileIds: [] },
  });
  assert.deepEqual(select(inputs.profiles, inputs.request), expected);
  assert.deepEqual(inputs, before);
});
