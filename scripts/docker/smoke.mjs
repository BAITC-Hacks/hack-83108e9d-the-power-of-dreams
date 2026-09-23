// Public HTTP acceptance against an already running app. With AI configured,
// the four non-empty submissions can each make one billable provider request.
import assert from 'node:assert/strict';

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:3000');
const dense = { city: 'Алматы', category: 'Ведущий', eventFormat: 'корпоратив', date: '2026-10-10', budgetKzt: 1500000 };
const requestIds = new Set();
const modes = new Set();

async function call(path, request, status = 200) {
  const response = await fetch(new URL(path, base), {
    ...(request === undefined ? {} : {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request),
    }),
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, status, `HTTP status for ${path}`);
  const body = await response.json();
  const requestId = body.requestId ?? body.error?.requestId;
  assert.match(requestId, /^[0-9a-f-]{36}$/);
  assert.ok(!requestIds.has(requestId), 'Each response has its own requestId');
  requestIds.add(requestId);
  return body;
}

try {
  const options = await call('/api/catalog/options');
  assert.ok(options.options.cities.includes(dense.city));
  assert.ok(options.options.categories.includes(dense.category));
  const cases = [
    ['primary', dense, 10, 5, ['HK-88430', 'HK-29829', 'HK-27222'], 'matched'],
    ['repeat', dense, 10, 5, ['HK-88430', 'HK-29829', 'HK-27222'], 'matched'],
    ['changed date', { ...dense, date: '2026-10-11' }, 10, 4, ['HK-44923', 'HK-27222', 'HK-44733'], 'matched'],
    ['rare category', { ...dense, category: 'Флорист', eventFormat: 'свадьба', budgetKzt: 500000 }, 2, 1, ['HK-39372'], 'matched'],
    ['no match', { ...dense, budgetKzt: 1 }, 10, 0, [], 'no_match'],
    ['category absent', { ...dense, city: 'Зарубежье', category: 'Флорист', eventFormat: 'свадьба', budgetKzt: 500000 }, 0, 0, [], 'category_absent'],
  ];
  for (const [name, request, candidates, eligible, ids, outcome] of cases) {
    const body = await call('/api/recommendations', request);
    assert.deepEqual(body.cards.map(card => card.id), ids, name);
    assert.equal(body.summary.candidateCount, candidates, name);
    assert.equal(body.summary.eligibleCount, eligible, name);
    assert.equal(body.outcome, outcome, name);
    assert.deepEqual(body.context, options.context, name);
    assert.ok(body.cards.every(card => typeof card.explanation === 'string' && card.explanation.trim().length > 0), name);
    assert.ok((ids.length ? ['catalog_fallback', 'mixed', 'openai_evidence'] : ['not_needed']).includes(body.explanationMode), name);
    modes.add(body.explanationMode);
    console.log(`PASS ${name}`);
  }
  const invalid = await call('/api/recommendations', { ...dense, date: '2027-01-01' }, 400);
  assert.equal(invalid.error.code, 'DATE_OUT_OF_RANGE');
  console.log('PASS invalid date');
  console.log(`Container HTTP smoke passed; explanation modes: ${[...modes].join(', ')}`);
} catch (error) {
  console.error(`Container HTTP smoke failed: ${error.message}`);
  process.exitCode = 1;
}
