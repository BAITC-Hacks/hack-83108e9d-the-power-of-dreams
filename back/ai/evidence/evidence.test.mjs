// Controlled evidence boundary checks; no live provider calls.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createSelectEvidence } from './select.ts';
import { fixtures } from '../../../contracts/examples/fixtures.ts';

const request = Object.freeze({ ...fixtures.request });
const profile = Object.freeze({ id: 'selected', description: 'Interactive games. Quiet hosting.',
  eventFormats: Object.freeze(['корпоратив']), priceFromKzt: 100000,
  languages: Object.freeze(['русский']), maxHours: null });
const signal = () => new AbortController().signal;

test('selected payload projects only permitted fields without changing inputs', async () => {
  const extended = Object.freeze({ ...profile, name: 'private name', busyDates: Object.freeze(['2026-10-10']),
    path: 'private/path', credentials: 'synthetic forbidden value' });
  const profiles = Object.freeze([extended]);
  const before = JSON.stringify({ request, profiles });
  let calls = 0;
  const evidence = createSelectEvidence({ generate: async input => {
    calls++;
    assert.equal(input.input, JSON.stringify({ request, profiles: [{ ...profile,
      literalSentenceChoices: ['Interactive games.', 'Quiet hosting.'] }] }));
    assert.equal(input.maxOutputTokens, 450);
    return { text: JSON.stringify({ items: [{ id: profile.id, evidenceQuote: 'Interactive games.' }] }) };
  } });
  const result = await evidence(request, profiles, signal());
  assert.equal(calls, 1);
  assert.deepEqual(result.byId.selected, { status: 'accepted', quote: 'Interactive games.' });
  assert.equal(JSON.stringify({ request, profiles }), before);
});

test('empty, duplicate, oversized and pre-aborted inputs never call transport', async () => {
  let calls = 0;
  const evidence = createSelectEvidence({ generate: async () => { calls++; throw new Error('Unexpected call'); } });
  const batches = [[], [profile, profile], Array.from({ length: 4 }, (_, i) => ({ ...profile, id: String(i) }))];
  for (const profiles of batches) {
    assert.deepEqual(await evidence(request, profiles, signal()), profiles.length === 0
      ? { status: 'validated', byId: {} } : { status: 'unavailable', reason: 'invalid_batch' });
  }
  const controller = new AbortController();
  controller.abort();
  for (const profiles of [...batches, [profile]]) {
    await assert.rejects(evidence(request, profiles, controller.signal), { name: 'AbortError' });
  }
  assert.equal(calls, 0);
});

test('unexpected transport faults retain their identity without retries', async () => {
  const fault = new Error('Controlled programming fault');
  let calls = 0;
  const evidence = createSelectEvidence({ generate: async () => { calls++; throw fault; } });
  await assert.rejects(evidence(request, [profile], signal()), error => error === fault);
  assert.equal(calls, 1);
});

test('arbitrary string IDs remain own evidence entries', async () => {
  const profiles = ['__proto__', 'constructor', 'toString'].map((id, i) => ({ ...profile, id, description: `Style ${i}` }));
  const evidence = createSelectEvidence({ generate: async () => ({ text: JSON.stringify({
    items: profiles.map(p => ({ id: p.id, evidenceQuote: p.description })),
  }) }) });
  const result = await evidence(request, profiles, signal());
  assert.equal(result.status, 'validated');
  assert.equal(Object.getPrototypeOf(result.byId), null);
  assert.deepEqual(Object.keys(result.byId).sort(), profiles.map(p => p.id).sort());
  for (const p of profiles) {
    assert.ok(Object.hasOwn(result.byId, p.id));
    assert.deepEqual(result.byId[p.id], { status: 'accepted', quote: p.description });
  }
});
