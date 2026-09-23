import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtures } from '../../contracts/examples/fixtures.ts';
import { catalogFailures, identityCases, perCardCases, normalization, withOptionalInputs } from '../../contracts/examples/boundaries.ts';

test('public fixtures cover outcomes/modes with consistent counts and safe projections', () => {
  assert.deepEqual(new Set(fixtures.recommendations.map(r => r.outcome)), new Set(['matched', 'category_absent', 'no_match']));
  assert.deepEqual(new Set(fixtures.recommendations.map(r => r.explanationMode)), new Set(['openai_evidence', 'mixed', 'catalog_fallback', 'not_needed']));
  const profiles = fixtures.moduleBoundaries.catalogReady.snapshot.profiles;
  for (const response of fixtures.recommendations) {
    const { summary, cards, normalizedRequest: request } = response;
    const candidates = profiles.filter(p => p.city === request.city && p.categories.includes(request.category));
    assert.equal(summary.candidateCount, candidates.length);
    assert.equal(summary.candidateCount, summary.eligibleCount + Object.values(summary.exclusions).reduce((a, b) => a + b, 0));
    assert.equal(cards.length, Math.min(summary.eligibleCount, 3));
    assert.deepEqual(summary.busyProfileIds, candidates.filter(p => p.busyDates.includes(request.date)).map(p => p.id).sort());
    assert.equal(summary.busyProfileIds.length, summary.exclusions.busy);
    assert.equal(cards.length === 0, response.explanationMode === 'not_needed');
    assert.equal(response.outcome === 'category_absent', candidates.length === 0);
    assert.equal(response.outcome === 'matched', cards.length > 0);
    assert.deepEqual(response.context, fixtures.optionsResponse.context);
    for (const card of cards) {
      const profile = profiles.find(p => p.id === card.id);
      assert.ok(profile);
      assert.equal(card.priceFromKzt, profile.priceFromKzt);
      assert.equal(card.category, request.category);
      assert.deepEqual(Object.keys(card).sort(), ['id', 'name', 'category', 'city', 'priceFromKzt', 'explanation', 'qualityFlags'].sort());
    }
    const quotes = cards.filter(c => c.explanation.includes('«')).length;
    const mode = !cards.length ? 'not_needed' : quotes === cards.length ? 'openai_evidence' : quotes ? 'mixed' : 'catalog_fallback';
    assert.equal(response.explanationMode, mode);
  }
});

test('material errors and normalization preserve the public contract', () => {
  const statuses = { INVALID_REQUEST: 400, DATE_OUT_OF_RANGE: 400, CATALOG_UNAVAILABLE: 503, INTERNAL_ERROR: 500 };
  assert.deepEqual(new Set(fixtures.errors.map(e => e.body.error.code)), new Set(Object.keys(statuses)));
  for (const { status, body } of fixtures.errors) {
    assert.equal(status, statuses[body.error.code]);
    assert.ok(body.error.requestId && body.error.message);
  }
  assert.equal('language' in normalization.expected, false);
  assert.equal('durationHours' in normalization.expected, false);
  assert.equal(withOptionalInputs.durationHours, 4);
  for (const field of ['city', 'eventFormat', 'category']) {
    assert.equal(normalization.input[field].trim().toLowerCase(), normalization.expected[field].toLowerCase());
  }
  assert.deepEqual(catalogFailures.map(f => f.error.kind), ['missing', 'unreadable', 'invalid']);
});

test('module fixtures retain exact identities and per-card fallback boundaries', () => {
  const { catalogReady, selection, providerEnvelope } = fixtures.moduleBoundaries;
  assert.deepEqual(selection.selectedIds, fixtures.recommendations[0].cards.map(c => c.id));
  for (const item of providerEnvelope.items) {
    assert.ok(catalogReady.snapshot.profiles.find(p => p.id === item.id).description.includes(item.evidenceQuote));
  }
  const expectedIds = [...selection.selectedIds].sort();
  for (const c of identityCases) {
    const actualIds = c.items.map(i => i.id).sort();
    if (c.expected.status === 'validated') {
      assert.deepEqual(actualIds, expectedIds);
      assert.deepEqual(Object.keys(c.expected.byId).sort(), expectedIds);
    } else {
      assert.notDeepEqual(actualIds, expectedIds);
    }
  }
  for (const c of perCardCases) {
    assert.deepEqual(Object.keys(c.expected.byId).sort(), expectedIds);
    assert.equal(c.expected.byId['FX-001'].status, 'accepted');
    assert.equal(c.expected.byId['FX-002'].status, 'accepted');
    assert.equal(c.expected.byId['FX-003'].status, 'fallback');
  }
});
