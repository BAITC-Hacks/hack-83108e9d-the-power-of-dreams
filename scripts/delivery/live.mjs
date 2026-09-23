// Three paid real UI submissions. Public output only; no provider payload or secrets.
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { chromium, expect } from '@playwright/test';
import { loadSecrets } from '../../back/config/secrets.mjs';

const root = process.cwd();
const port = Number(process.env.P07_PORT ?? 3107);
const output = resolve(process.env.P07_OUTPUT ?? 'test-results/p07-live');
const envFile = process.env.P07_ENV_FILE ?? join(root, '.env');
const config = { ...loadSecrets({ required: ['OPENAI_API_KEY'], envFile }), OPENAI_MODEL: '' };
try { Object.assign(config, loadSecrets({ required: ['OPENAI_MODEL'], envFile })); }
catch (error) { if (error.code !== 'CONFIG_REQUIRED') throw error; }
const portProbe = createServer();
await new Promise((done, fail) => { portProbe.once('error', fail); portProbe.listen(port, '127.0.0.1', done); });
await new Promise(done => portProbe.close(done));
await mkdir(output, { recursive: true });
const evidence = {
  sourceSha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  datasetSha256: createHash('sha256').update(await readFile('raw/dataset.csv')).digest('hex'),
  model: config.OPENAI_MODEL?.trim() || 'gpt-4.1-mini-2025-04-14',
  recordedAt: new Date().toISOString(), mode: 'real-live-browser', samples: [],
};
let child, browser;
try {
  child = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: root, windowsHide: true, env: { ...process.env, ...config, NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((done, fail) => {
    const timer = setTimeout(() => fail(new Error('Production startup timeout')), 30000);
    child.stdout.on('data', data => { if (String(data).includes('Ready in')) { clearTimeout(timer); done(); } });
    child.stderr.on('data', () => {});
    child.once('error', error => { clearTimeout(timer); fail(error); });
    child.once('exit', code => { clearTimeout(timer); fail(new Error(`Production exited: ${code}`)); });
  });
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  await page.addInitScript(() => document.addEventListener('submit', () => { window.p07SubmittedAt = performance.now(); }, true));
  await page.goto(`http://127.0.0.1:${port}`);
  const submit = page.getByRole('button', { name: 'Подобрать', exact: true });
  for (const [index, kind] of ['dense', 'rare', 'dense'].entries()) {
    await page.locator('#category').selectOption(kind === 'rare' ? 'Флорист' : 'Ведущий');
    await page.locator('#eventFormat').selectOption(kind === 'rare' ? 'свадьба' : 'корпоратив');
    await page.locator('#budgetKzt').fill(kind === 'rare' ? '500000' : '1500000');
    const pending = page.waitForResponse(r => r.url().endsWith('/api/recommendations'), { timeout: 30000 });
    await submit.click();
    const response = await pending;
    const body = await response.json();
    const sample = { sequence: index + 1, kind, firstAfterStartup: index === 0, httpStatus: response.status(), response: body };
    evidence.samples.push(sample);
    // Persist failures too: an unsuccessful sample must not be replaced silently.
    await writeFile(join(output, 'evidence.json'), JSON.stringify(evidence, null, 2));
    assert.equal(response.status(), 200);
    assert.deepEqual(body.cards.map(card => card.id), kind === 'rare' ? ['HK-39372'] : ['HK-88430', 'HK-29829', 'HK-27222']);
    await expect(page.locator('.contractor')).toHaveCount(body.cards.length);
    for (const card of body.cards) await expect(page.locator(`[data-profile-id="${card.id}"] .explanation`)).toHaveText(card.explanation);
    await expect(submit).toBeEnabled();
    sample.visibleDurationMs = await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(() => done(Math.round(performance.now() - window.p07SubmittedAt))))));
    sample.underTenSeconds = sample.visibleDurationMs < 10000;
    sample.renderedMatches = true;
    await page.screenshot({ path: join(output, `${index + 1}-${kind}.png`), fullPage: true });
    await writeFile(join(output, 'evidence.json'), JSON.stringify(evidence, null, 2));
    assert.equal(body.explanationMode, 'openai_evidence', 'Fallback/mixed is not a live quality pass');
  }
  console.log(JSON.stringify({ output, sourceSha: evidence.sourceSha, samples: evidence.samples.map(s => ({ sequence: s.sequence, kind: s.kind, visibleDurationMs: s.visibleDurationMs, underTenSeconds: s.underTenSeconds })) }));
} finally {
  await writeFile(join(output, 'evidence.json'), JSON.stringify(evidence, null, 2));
  if (browser) await browser.close();
  if (child && child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await exited; }
}
