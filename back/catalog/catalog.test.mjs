import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, unlink, rmdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'csv-parse/sync';
import { loadCatalog } from './load.ts';

const header = 'id,anon_name,categories,city,city_imputed,synthetic,price_from_kzt,price_imputed,event_formats,languages,max_hours,busy_dates,description';
const rows = [
  ['HK-001', 'Ансамбль', 'Музыка|Шоу', 'Астана', 'TRUE', 'FALSE', '150000', 'FALSE', 'той|концерт', 'русский|казахский', '', '2026-10-10', 'Полное описание, с "кавычками"\nи второй строкой.'],
  ['HK-002', 'Ведущий', 'Ведущий|Шоу', 'Алматы', 'FALSE', 'TRUE', '250000', 'TRUE', 'концерт|свадьба', 'английский|русский', '4.5', '', 'Другое полное описание.'],
];
const csv = records => `${header}\n${records.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')}\n`;
const digest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const invalid = { status: 'unavailable', error: { kind: 'invalid' } };

async function temporaryCatalog(t) {
  const directory = await mkdtemp(resolve('back/catalog/.acceptance-'));
  const path = join(directory, 'catalog.csv');
  t.after(async () => {
    await unlink(path).catch(error => { if (error.code !== 'ENOENT') throw error; });
    await rmdir(directory);
  });
  return path;
}

async function snapshot(path) {
  const result = await loadCatalog(path);
  assert.equal(result.status, 'ready');
  return result.snapshot;
}

test('supplied catalogue has 66 unique profiles, nine null durations and complete source mappings', async () => {
  const path = resolve('raw/dataset.csv');
  const catalog = await snapshot(path);
  assert.equal(catalog.profiles.length, 66);
  assert.equal(new Set(catalog.profiles.map(profile => profile.id)).size, 66);
  assert.equal(catalog.profiles.filter(profile => profile.maxHours === null).length, 9);
  const source = parse(await readFile(path, 'utf8'), { columns: true });
  const selected = [source.find(row => row.id === 'HK-88430'), source.find(row => row.max_hours === ''), source.find(row => row.synthetic === 'TRUE')];
  for (const row of selected) {
    assert.ok(row);
    const profile = catalog.profiles.find(profile => profile.id === row.id);
    assert.deepEqual(profile, {
      id: row.id, name: row.anon_name, city: row.city, description: row.description,
      categories: row.categories.split('|'), eventFormats: row.event_formats.split('|'), languages: row.languages.split('|'),
      priceFromKzt: Number(row.price_from_kzt), maxHours: row.max_hours === '' ? null : Number(row.max_hours),
      busyDates: row.busy_dates === '' ? [] : row.busy_dates.split('|'),
      qualityFlags: { synthetic: row.synthetic === 'TRUE', cityImputed: row.city_imputed === 'TRUE', priceImputed: row.price_imputed === 'TRUE' },
    });
  }
});

test('quoted UTF-8 fields, lists, flags and nullable or numeric hours retain their meanings', async t => {
  const path = await temporaryCatalog(t);
  await writeFile(path, `\uFEFF${csv(rows)}`);
  const catalog = await snapshot(path);
  assert.deepEqual(catalog.profiles, [
    { id: 'HK-001', name: 'Ансамбль', city: 'Астана', categories: ['Музыка', 'Шоу'],
      eventFormats: ['той', 'концерт'], languages: ['русский', 'казахский'], priceFromKzt: 150000,
      maxHours: null, busyDates: ['2026-10-10'], description: 'Полное описание, с "кавычками"\nи второй строкой.',
      qualityFlags: { synthetic: false, cityImputed: true, priceImputed: false } },
    { id: 'HK-002', name: 'Ведущий', city: 'Алматы', categories: ['Ведущий', 'Шоу'],
      eventFormats: ['концерт', 'свадьба'], languages: ['английский', 'русский'], priceFromKzt: 250000,
      maxHours: 4.5, busyDates: [], description: 'Другое полное описание.',
      qualityFlags: { synthetic: true, cityImputed: false, priceImputed: true } },
  ]);
});

test('invalid records and damaged CSV fail completely without leaking input or a partial snapshot', async t => {
  const path = await temporaryCatalog(t);
  // Keep a valid first row: a damaged later row must invalidate the whole catalogue.
  const badValues = [
    [0, 'HK-001'], [0, 'invalid-id'],
    [1, ' '], [3, ''], [12, ' '],
    [2, 'Музыка||Шоу'], [8, 'концерт|концерт'], [9, ''],
    [4, 'true'], [5, ''], [7, '1'],
    [6, '0'], [6, '1.5'], [6, '9007199254740992'],
    [10, '0'], [10, 'Infinity'], [10, ' '], [10, 'unknown'],
    [11, '2026-11-31'], [11, '2026-10-1'], [11, '2026-10-10T00:00:00Z'],
    [11, '2026-09-22'], [11, '2027-01-01'],
  ];
  for (const [column, value] of badValues) {
    const damaged = [...rows[1]];
    damaged[column] = value;
    await writeFile(path, csv([rows[0], damaged]));
    assert.deepEqual(await loadCatalog(path), invalid, `${header.split(',')[column]}=${JSON.stringify(value)}`);
  }
  for (const source of [header + '\n', csv([rows[0]]) + '"unfinished', csv([rows[0]]) + 'HK-003,too,few,columns\n']) {
    await writeFile(path, source);
    assert.deepEqual(await loadCatalog(path), invalid);
  }
});

test('options cover all profiles in fixed string order and retain the inclusive fixed window', async t => {
  const path = await temporaryCatalog(t);
  await writeFile(path, csv(rows));
  const expected = {
    cities: ['Алматы', 'Астана'], categories: ['Ведущий', 'Музыка', 'Шоу'],
    eventFormats: ['концерт', 'свадьба', 'той'], languages: ['английский', 'казахский', 'русский'],
    dateWindow: { min: '2026-09-23', max: '2026-12-31' },
  };
  assert.deepEqual((await snapshot(path)).options, expected);
  // Busy-date extrema and record order cannot determine options or the supported window.
  const changed = rows.map(row => [...row]).reverse();
  changed[0][11] = '2026-09-23|2026-12-31';
  await writeFile(path, csv(changed));
  assert.deepEqual((await snapshot(path)).options, expected);
});

test('consumer mutation cannot change the shared snapshot or its nested values', async t => {
  const path = await temporaryCatalog(t);
  await writeFile(path, csv(rows));
  const catalog = await snapshot(path);
  const otherConsumer = catalog;
  const original = structuredClone(catalog);
  const profile = catalog.profiles[0];
  const mutations = [
    () => { catalog.catalogVersion = 'changed'; },
    () => { catalog.profiles = []; },
    () => { catalog.profiles.push(profile); },
    () => { profile.description = 'changed'; },
    () => { profile.qualityFlags.synthetic = true; },
    () => { catalog.options = {}; },
    () => { catalog.options.dateWindow.min = '2020-01-01'; },
    ...['categories', 'eventFormats', 'languages', 'busyDates'].map(key => () => { profile[key].push('changed'); }),
    ...['cities', 'categories', 'eventFormats', 'languages'].map(key => () => { catalog.options[key][0] = 'changed'; }),
  ];
  for (const mutate of mutations) {
    assert.throws(mutate, TypeError);
    assert.deepEqual(otherConsumer, original);
  }
});

test('identity hashes exact source bytes, stays stable and changes for valid formatting-only edits', async t => {
  const path = await temporaryCatalog(t);
  const bytes = Buffer.from(csv(rows));
  await writeFile(path, bytes);
  const first = await snapshot(path);
  const repeated = await snapshot(path);
  assert.equal(first.catalogVersion, digest(bytes));
  assert.equal(repeated.catalogVersion, first.catalogVersion);
  const changedBytes = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), bytes]);
  await writeFile(path, changedBytes);
  const changed = await snapshot(path);
  assert.deepEqual(changed.profiles, first.profiles);
  assert.equal(changed.catalogVersion, digest(changedBytes));
  assert.notEqual(changed.catalogVersion, first.catalogVersion);
});

test('unexpected invalid-call faults reject instead of becoming an expected source failure', async () => {
  await assert.rejects(loadCatalog(null), { code: 'ERR_INVALID_ARG_TYPE' });
});
