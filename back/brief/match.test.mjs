import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadCatalog } from '../catalog/load.ts';
import { loadBriefIndex, BriefIndexError } from '../catalog/brief-index.ts';
import { matchBrief } from './match.ts';
import { isBriefAdvice } from '../../contracts/brief.ts';

const loaded = await loadCatalog(new URL('../../raw/dataset.csv', import.meta.url));
assert.equal(loaded.status, 'ready');
const profiles = loaded.snapshot.profiles;
const raw = JSON.parse(await readFile(new URL('../catalog/brief-index.json', import.meta.url), 'utf8'));
const index = loadBriefIndex(profiles);
const examples = JSON.parse(await readFile(new URL('../../contracts/examples/brief.json', import.meta.url), 'utf8'));
const brief = examples.interpretResponse.brief;
const condition = (trait, intent = 'prefer', text = trait ?? 'неизвестное пожелание') => ({ trait, intent, text });
const request = conditions => ({ vocabularyVersion: 'brief-v1', text: conditions.map(c => c.text).join(', '), conditions });

// Source review: literal style/service statements only; awards, biography and client lists
// do not prove services. 'Без банальных конкурсов' is not 'без конкурсов'. A gift for
// children is not a children's programme; equipment availability does not prove ownership.
test('B2: all 66 source descriptions validate, unasserted traits stay unknown, no mutable source aliases', () => {
  assert.equal(Object.keys(index.byId).length, 66);
  assert.ok(Object.values(index.byId).some(assertions => assertions.length === 0));
  assert.deepEqual(index.byId['HK-77838'].find(a => a.trait === 'discreet'), {
    trait: 'discreet', value: true, quote: examples.advice.evidence[0].quote,
  });
  assert.equal(index.byId['HK-58385'].find(a => a.trait === 'contests'), undefined);
  const copied = structuredClone(raw);
  const validated = loadBriefIndex(profiles, copied);
  copied.profiles[0].assertions[0].quote = 'changed';
  assert.deepEqual(validated, index);
  assert.throws(() => { validated.byId['HK-39372'][0].value = false; }, TypeError);
});

test('B2: invalid version, identity, hash, quote, trait and contradictory assertions fail closed', () => {
  const mutations = [
    data => { data.version = 'catalog-brief-v2'; },
    data => { data.profiles.pop(); },
    data => { data.profiles[1].id = data.profiles[0].id; },
    data => { data.profiles[0].id = 'HK-unknown'; },
    data => { data.profiles[0].descriptionHash = 'sha256:stale'; },
    data => { data.profiles[0].assertions[0].quote = examples.advice.evidence[0].quote; },
    data => { data.profiles[0].assertions[0].quote = ''; },
    data => { data.profiles[0].assertions[0].quote = 'я'.repeat(241); },
    data => { data.profiles[0].assertions[0].trait = 'invented'; },
    data => { data.profiles[0].assertions[0].value = 'true'; },
    data => { data.profiles[0].assertions.push({ ...data.profiles[0].assertions[0], value: false }); },
  ];
  for (const mutate of mutations) {
    const changed = structuredClone(raw); mutate(changed);
    assert.throws(() => loadBriefIndex(profiles, changed), BriefIndexError);
  }
  assert.throws(() => loadBriefIndex(profiles.map((p, i) => i === 0 ? { ...p, description: `${p.description} changed` } : p)), BriefIndexError);
});

test('B2/B3: real discreet-host scenario promotes HK-77838 and retains every supplied eligible profile', () => {
  // Public matcher receives a hard-eligible subset; full filter/restart HTTP checks are coordinator-owned.
  const eligible = profiles.filter(p => p.city === 'Алматы' && p.categories.includes('Ведущий') &&
    p.eventFormats.includes('корпоратив') && !p.busyDates.includes('2026-10-10') && p.priceFromKzt <= 1500000);
  const before = structuredClone({ eligible, brief, index });
  const results = matchBrief(eligible, brief, index);
  assert.equal(results.length, eligible.length);
  assert.equal(new Set(results.map(r => r.id)).size, eligible.length);
  assert.ok(results.slice(0, 3).some(r => r.id === 'HK-77838'));
  const host = results.find(r => r.id === 'HK-77838');
  assert.deepEqual(host.advice, examples.advice);
  assert.deepEqual(matchBrief([...eligible].reverse(), brief, loadBriefIndex(profiles)), results);
  assert.deepEqual(structuredClone({ eligible, brief, index }), before);
  assert.ok(results.every(result => isBriefAdvice(result.advice)));
  assert.deepEqual(matchBrief(eligible.filter(p => p.id !== 'HK-77838'), brief, index).map(r => r.id).includes('HK-77838'), false);
});

test('B3: fewer conflicts, more matches, price and ordinal ID; both polarities and intents', () => {
  const candidates = ['a', 'b', 'c', 'd', 'e'].map((id, i) => ({ ...profiles[0], id, priceFromKzt: [200, 100, 100, 1, 100][i] }));
  const positive = trait => ({ trait, value: true, quote: 'positive' });
  const negative = trait => ({ trait, value: false, quote: 'negative' });
  const assertions = { version: 'test', byId: {
    a: [positive('humor'), negative('contests')],
    b: [positive('humor'), negative('contests')],
    c: [positive('humor')],
    d: [positive('humor'), positive('contests')],
    e: [positive('humor'), negative('contests')],
  } };
  const wishes = request([condition('humor'), condition('contests', 'avoid')]);
  const result = matchBrief(candidates, wishes, assertions);
  assert.deepEqual(result.map(r => r.id), ['b', 'e', 'a', 'c', 'd']);
  assert.deepEqual(result.map(r => [r.conflicts, r.matches]), [[0, 2], [0, 2], [0, 2], [0, 1], [1, 1]]);
  assert.equal(result.at(-1).advice.evidence[0].relation, 'conflict');
  const reversed = matchBrief([candidates[0]], request([condition('humor', 'avoid'), condition('contests')]), assertions)[0];
  assert.equal(reversed.conflicts, 2);
  assert.equal(reversed.matches, 0);
  assert.equal(reversed.advice.question, 'Сможете ли вы учесть пожелание «humor»?');
  assert.deepEqual(matchBrief(candidates, request([]), assertions).map(r => r.id), ['d', 'b', 'c', 'e', 'a']);
  assert.deepEqual(matchBrief([], wishes, assertions), []);
});

test('B2: absent positive/negative evidence and null traits remain unknown; avoidance question has priority', () => {
  const wishes = request([condition('children'), condition(null, 'avoid', 'без принудительных конкурсов'), condition('contests', 'avoid')]);
  const result = matchBrief([profiles.find(p => p.id === 'HK-77838')], wishes, index)[0];
  assert.equal(result.matches, 0);
  assert.equal(result.conflicts, 0);
  assert.deepEqual(result.advice.unknownConditions, wishes.conditions);
  assert.equal(result.advice.question, 'Сможете ли вы учесть пожелание «без принудительных конкурсов»?');
});
