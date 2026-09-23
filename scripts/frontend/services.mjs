// Real production UI service checks in isolated runtime directories; never edits canonical CSV.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, mkdtemp, copyFile, symlink, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { chromium, expect } from '@playwright/test';
import { loadSecrets } from '../../back/config/secrets.mjs';

const root = process.cwd();
const live = process.argv.includes('--live');
const port = Number(process.env.P06_SERVICE_PORT ?? (live ? 3107 : 3108));
const url = `http://127.0.0.1:${port}`;
await mkdir('test-results', { recursive: true });
const output = await mkdtemp(resolve(`test-results/p06-${live ? 'live' : 'service'}-`));
let child;
const browser = await chromium.launch({ channel: 'msedge', headless: true });
async function runtime(name, ready) {
  const directory = join(output, name);
  await mkdir(join(directory, 'raw'), { recursive: true });
  await mkdir(join(directory, 'back/ai'), { recursive: true });
  await mkdir(join(directory, 'back/config'), { recursive: true });
  for (const file of ['package.json', 'back/ai/openai.mjs', 'back/config/secrets.mjs']) await copyFile(join(root, file), join(directory, file));
  for (const dir of ['.next', 'node_modules']) await symlink(join(root, dir), join(directory, dir), 'junction');
  if (ready) await copyFile(join(root, 'raw/dataset.csv'), join(directory, 'raw/dataset.csv'));
  return directory;
}
async function start(directory) {
  const env = { ...process.env, OPENAI_API_KEY: '', NEXT_TELEMETRY_DISABLED: '1' };
  if (live) Object.assign(env, loadSecrets({ required: ['OPENAI_API_KEY'], envFile: process.env.P06_ENV_FILE ?? join(root, '.env') }));
  child = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'start', directory, '--hostname', '127.0.0.1', '--port', String(port)], { cwd: directory, windowsHide: true, env, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((done, fail) => {
    const timer = setTimeout(() => fail(new Error('Production startup timeout')), 30000);
    child.stdout.on('data', data => { if (String(data).includes('Ready in')) { clearTimeout(timer); done(); } });
    child.stderr.on('data', () => {});
    child.once('exit', code => { clearTimeout(timer); fail(new Error(`Production exited: ${code}`)); });
    child.once('error', error => { clearTimeout(timer); fail(error); });
  });
}
async function stop() { if (child && child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await exited; } child = undefined; }
try {
  await start(await runtime('ready', true));
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url);
  let responsePromise = page.waitForResponse(r => r.url().endsWith('/api/recommendations'));
  await page.getByRole('button', { name: 'Подобрать', exact: true }).click();
  const success = await (await responsePromise).json();
  assert.deepEqual(success.cards.map(c => c.id), ['HK-88430', 'HK-29829', 'HK-27222']);
  await expect(page.locator('.contractor')).toHaveCount(3);
  if (live) {
    assert.equal(success.explanationMode, 'openai_evidence', 'Required live UI must return actual validated AI evidence');
    await expect(page.locator('.mode')).toContainText('ИИ');
    for (const card of success.cards) await expect(page.locator(`[data-profile-id="${card.id}"] .explanation`)).toHaveText(card.explanation);
    await page.screenshot({ path: join(output, 'live.png'), fullPage: true });
    await writeFile(join(output, 'evidence.json'), JSON.stringify({ mode: 'real-live', response: success, renderedMatches: true }, null, 2));
  } else {
    assert.equal(success.explanationMode, 'catalog_fallback');
    await stop(); await start(await runtime('missing-catalogue', false));
    await page.locator('#date').fill('2026-10-11');
    responsePromise = page.waitForResponse(r => r.url().endsWith('/api/recommendations'));
    await page.getByRole('button', { name: 'Подобрать', exact: true }).click();
    const failure = await responsePromise;
    assert.equal(failure.status(), 503);
    const body = await failure.json();
    assert.equal(body.error.code, 'CATALOG_UNAVAILABLE');
    await expect(page.locator('.error')).toContainText(body.error.requestId);
    await expect(page.locator('.contractor')).toHaveCount(3);
    await expect(page.locator('.successful-conditions')).toContainText('2026-10-10');
    await page.screenshot({ path: join(output, 'retained-503.png'), fullPage: true });
    await page.reload();
    await expect(page.getByRole('button', { name: 'Загрузить снова', exact: true })).toBeVisible();
    await writeFile(join(output, 'evidence.json'), JSON.stringify({ mode: 'real-catalogue-error', success, error: body, retainedCards: 3, optionsError: true }, null, 2));
  }
  console.log(JSON.stringify({ passed: true, mode: live ? 'real-live' : 'real-catalogue-error', output }));
} finally { await browser.close(); await stop(); }
