// P05 real production HTTP acceptance. No provider calls or canonical CSV edits.
// Run after npm run build; temporary runtimes and public observations stay in test-results/.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, mkdtemp, copyFile, writeFile, symlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { loadCatalog } from '../../back/catalog/load.ts';

const root = process.cwd();
const port = Number(process.env.P05_PORT ?? 3105);
const url = `http://127.0.0.1:${port}`;
const catalog = await loadCatalog(resolve('raw/dataset.csv'));
assert.equal(catalog.status, 'ready');
await mkdir('test-results', { recursive: true });
const output = await mkdtemp(resolve('test-results/p05-'));
const dense = { city: 'Алматы', category: 'Ведущий', eventFormat: 'корпоратив', date: '2026-10-10', budgetKzt: 1500000 };
const observations = {};
const requestIds = new Set();
let child;
async function start(directory) {
  child = spawn(process.execPath, [resolve('node_modules/next/dist/bin/next'), 'start', directory, '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: directory, windowsHide: true, env: { ...process.env, OPENAI_API_KEY: '', NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((done, fail) => {
    const timer = setTimeout(() => fail(new Error('Production startup timeout')), 30000);
    const onData = data => { if (data.toString().includes('Ready in')) { clearTimeout(timer); done(); } };
    child.stdout.on('data', onData);
    child.stderr.on('data', () => {});
    child.once('error', error => { clearTimeout(timer); fail(error); });
    child.once('exit', code => { clearTimeout(timer); fail(new Error(`Production exited before readiness: ${code}`)); });
  });
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  const stopped = once(child, 'exit');
  child.kill();
  await stopped;
  child = undefined;
}
async function runtime(name, mode) {
  const directory = join(output, name);
  await mkdir(join(directory, 'raw'), { recursive: true });
  await mkdir(join(directory, 'back/ai'), { recursive: true });
  await mkdir(join(directory, 'back/config'), { recursive: true });
  for (const file of ['package.json', 'back/ai/openai.mjs', 'back/config/secrets.mjs']) await copyFile(join(root, file), join(directory, file));
  for (const dir of ['.next', 'node_modules']) await symlink(join(root, dir), join(directory, dir), 'junction');
  if (mode === 'ready') await copyFile(resolve('raw/dataset.csv'), join(directory, 'raw/dataset.csv'));
  if (mode === 'damaged') await writeFile(join(directory, 'raw/dataset.csv'), 'invalid,csv\nnot,a,catalogue');
  return directory;
}
async function call(value, status = 200, raw = false) {
  const response = await fetch(url + (value === undefined ? '/api/catalog/options' : '/api/recommendations'), value === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: raw ? value : JSON.stringify(value),
  });
  assert.equal(response.status, status);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const body = await response.json();
  const id = body.requestId ?? body.error.requestId;
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert.ok(!requestIds.has(id));
  requestIds.add(id);
  return body;
}
function checkSummary(body) {
  const candidates = catalog.snapshot.profiles.filter(p => p.city === body.normalizedRequest.city && p.categories.includes(body.normalizedRequest.category));
  assert.deepEqual(body.summary.busyProfileIds, candidates.filter(p => p.busyDates.includes(body.normalizedRequest.date)).map(p => p.id).sort());
  assert.equal(body.summary.candidateCount, candidates.length);
  assert.equal(body.summary.eligibleCount + Object.values(body.summary.exclusions).reduce((a, b) => a + b, 0), candidates.length);
  assert.equal(body.explanationMode, body.cards.length ? 'catalog_fallback' : 'not_needed');
}
try {
  const ready = await runtime('ready', 'ready');
  await start(ready);
  observations.options = await call();
  const cases = [
    ['dense', '2026-10-10', 5, ['HK-88430', 'HK-29829', 'HK-27222']],
    ['october11', '2026-10-11', 4, ['HK-44923', 'HK-27222', 'HK-44733']],
    ['october1', '2026-10-01', 3, ['HK-88430', 'HK-44923', 'HK-75012']],
    ['october6', '2026-10-06', 7, ['HK-88430', 'HK-44923', 'HK-29829']],
  ];
  for (const [name, date, count, ids] of cases) {
    const result = await call({ ...dense, date });
    assert.deepEqual(result.cards.map(c => c.id), ids);
    assert.equal(result.summary.eligibleCount, count);
    assert.equal(result.summary.candidateCount, 10);
    assert.deepEqual(result.context, observations.options.context);
    checkSummary(result);
    observations[name] = result;
  }
  assert.ok(observations.october1.summary.busyProfileIds.includes('HK-29829'));
  assert.ok(!observations.october6.summary.busyProfileIds.includes('HK-29829'));
  for (const name of ['october1', 'october6']) assert.ok(!observations[name].summary.busyProfileIds.includes('HK-75012'));
  observations.rare = await call({ ...dense, category: 'Флорист', eventFormat: 'свадьба', budgetKzt: 500000 });
  assert.deepEqual(observations.rare.cards.map(c => c.id), ['HK-39372']);
  observations.no_match = await call({ ...dense, budgetKzt: 1 });
  observations.category_absent = await call({ ...dense, city: 'Зарубежье', category: 'Флорист', eventFormat: 'свадьба', budgetKzt: 500000 });
  assert.equal(observations.no_match.outcome, 'no_match');
  assert.equal(observations.category_absent.outcome, 'category_absent');
  const venue = catalog.snapshot.profiles.find(p => p.id === 'HK-64395');
  const venueRequest = { city: venue.city, category: 'Банкетный зал', eventFormat: 'свадьба', date: '2026-09-23', budgetKzt: 2500000 };
  assert.ok(venue.busyDates.includes(venueRequest.date));
  assert.ok(venue.eventFormats.includes(venueRequest.eventFormat));
  observations.busy_venue = await call(venueRequest);
  assert.ok(observations.busy_venue.summary.busyProfileIds.includes(venue.id));
  assert.ok(!observations.busy_venue.cards.some(c => c.id === venue.id));
  for (const name of ['rare', 'no_match', 'category_absent', 'busy_venue']) checkSummary(observations[name]);
  const stable = body => ({ ids: body.cards.map(c => c.id), context: body.context, summary: body.summary });
  // Dense above is request one; two further identical requests complete three repeats.
  for (let i = 0; i < 2; i++) assert.deepEqual(stable(await call(dense)), stable(observations.dense));
  await stop();
  await start(ready);
  assert.deepEqual(stable(await call(dense)), stable(observations.dense));
  await stop();
  for (const mode of ['missing', 'damaged']) {
    const directory = await runtime(mode, mode);
    await start(directory);
    for (const value of [undefined, {}]) assert.equal((await call(value, 503)).error.code, 'CATALOG_UNAVAILABLE');
    assert.equal((await call('{', 400, true)).error.code, 'INVALID_REQUEST');
    await copyFile(resolve('raw/dataset.csv'), join(directory, 'raw/dataset.csv'));
    for (const value of [undefined, dense]) assert.equal((await call(value, 503)).error.code, 'CATALOG_UNAVAILABLE');
    await stop();
    await start(directory);
    assert.deepEqual((await call()).context, observations.options.context);
    assert.deepEqual(stable(await call(dense)), stable(observations.dense));
    await stop();
  }
  await writeFile(join(output, 'observations.json'), JSON.stringify(observations, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'passed', mode: 'real CSV / production HTTP / AI disabled', observations: join(output, 'observations.json'), requests: requestIds.size, processStarts: 6, venue: { id: venue.id, ...venueRequest } }));
} finally { await stop(); }
