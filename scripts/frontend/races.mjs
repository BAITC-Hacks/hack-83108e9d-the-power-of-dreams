// Controlled browser-only response timing. No fixture is installed in the application.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const url = process.env.P06_URL ?? 'http://127.0.0.1:3106';
const output = process.env.P06_OUTPUT ?? 'test-results/p06';
await mkdir(output, { recursive: true });
const examples = JSON.parse(await readFile('.shared/specs/contractor-selection/versions/v1/examples/real-http.json', 'utf8'));
const controlled = JSON.parse(await readFile('.shared/specs/contractor-selection/versions/v1/examples/controlled.json', 'utf8'));
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();
const checks = [];
// Deliberately ignores abort while recording it; this proves identity guards as well as cancellation.
await page.addInitScript(() => {
  const original = window.fetch.bind(window);
  window.pendingP06 = [];
  window.fetch = (input, init) => {
    if (String(input).endsWith('/api/recommendations')) return new Promise((resolve, reject) => {
      window.pendingP06.push({ request: JSON.parse(init.body), signal: init.signal, resolve, reject });
    });
    return original(input, init);
  };
});
const count = () => page.evaluate(() => window.pendingP06.length);
async function submit() {
  const before = await count();
  await page.getByRole('button', { name: 'Подобрать', exact: true }).click();
  await expect.poll(count).toBe(before + 1);
  return before;
}
async function finish(index, data, status = 200) {
  await page.evaluate(({ index, data, status }) => window.pendingP06[index].resolve(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })), { index, data, status });
}
const result = () => page.locator('.results');
const dense = examples.dense;
try {
  await page.goto(url);
  await expect(page.locator('#city')).toBeVisible();
  let i = await submit();
  await finish(i, dense);
  await expect(page.locator('.contractor')).toHaveCount(3);
  await page.locator('#date').fill('2026-10-11');
  i = await submit();
  await expect(page.locator('.action-status')).toContainText('Подбираем');
  await expect(page.locator('.changed-message')).toHaveCount(0);
  await page.locator('#date').fill('2026-10-12');
  await expect(page.locator('.changed-message')).toContainText('неотправленные');
  await expect(page.locator('.condition-labels')).toContainText('10 октября 2026');
  await expect(page.locator('.condition-labels')).not.toContainText('12 октября 2026');
  await page.locator('#date').fill('2026-10-11');
  await expect(page.locator('.changed-message')).toHaveCount(0);
  await page.getByRole('button', { name: 'Подобрать', exact: true }).click();
  assert.equal(await count(), i + 1);
  await expect(result()).toContainText('10 октября 2026');
  await expect(result()).toContainText(/предыдущ/i);
  await page.locator('#date').fill('2026-10-01');
  const newer = await submit();
  assert.equal(await page.evaluate(i => window.pendingP06[i].signal.aborted, i), true);
  await finish(i, examples.october11);
  await expect(result()).toContainText('1 октября 2026');
  await expect(result()).toContainText(/подбира|выполня|подбор.*…/i);
  await page.locator('#budgetKzt').focus();
  await page.locator('#budgetKzt').fill('1600000');
  const editingScroll = await page.evaluate(() => scrollY);
  await finish(newer, examples.october1);
  await expect(page.locator('#budgetKzt')).toBeFocused();
  assert.equal(await page.evaluate(() => scrollY), editingScroll);
  await expect(result()).toContainText(examples.october1.cards[2].name);
  await expect(page.getByText('Условия изменены — выполните подбор', { exact: true })).toBeVisible();
  checks.push('duplicate blocked, superseded signal aborted, late success/finalizer cannot clear newer pending, edits remain enabled and completion retains editing focus');

  await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
  i = await submit();
  await page.locator('#date').fill('2026-10-11');
  const latest = await submit();
  await finish(latest, examples.october11);
  await page.evaluate(i => window.pendingP06[i].reject(new Error('late network error')), i);
  await expect(page.locator('.contractor').first()).toContainText(examples.october11.cards[0].name);
  await expect(page.locator('.error')).toHaveCount(0);
  i = await submit();
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
  assert.equal(await page.evaluate(i => window.pendingP06[i].signal.aborted, i), true);
  await finish(i, examples.october11);
  await expect(page.locator('.contractor')).toHaveCount(0);
  await expect(page.locator('#city')).toBeFocused();
  checks.push('late rejected request cannot overwrite newer success; reset aborts and invalidates late success');

  i = await submit(); await finish(i, dense);
  await expect(page.locator('.contractor')).toHaveCount(3);
  for (const bad of [null, {}, { ...dense, cards: [{ id: 'broken' }] }]) {
    i = await submit(); await finish(i, bad);
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.contractor').first()).toContainText(dense.cards[0].name);
  }
  i = await submit();
  await finish(i, { error: { code: 'INTERNAL_ERROR', message: 'internal path MUST NOT appear', requestId: 'controlled-safe-support-id' } }, 500);
  await expect(page.locator('.error')).toContainText('controlled-safe-support-id');
  await expect(page.locator('body')).not.toContainText('internal path MUST NOT appear');
  await page.locator('#date').fill('2026-10-11');
  i = await submit(); await finish(i, examples.october11);
  await expect(result()).toContainText('10 октября 2026');
  await expect(result()).toContainText('11 октября 2026');
  checks.push('malformed/500 keep success and safe support ID; retry after error compares with retained baseline');

  const mixed = controlled.recommendations.find(r => r.explanationMode === 'mixed');
  i = await submit(); await finish(i, mixed);
  await expect(result()).toContainText('Часть объяснений сформирована без ИИ');
  await expect(result()).toContainText(/синтет|аноним/i);
  checks.push('controlled mixed and source quality labels');

  // Presentation edge cases are controlled public responses, not catalogue claims.
  const long = structuredClone(dense);
  long.normalizedRequest.language = 'русский';
  long.cards[0].category = 'Организация и техническое сопровождение праздничных мероприятий';
  long.cards[0].name = 'Команда праздничных мероприятий с длинным названием';
  long.cards[0].priceFromKzt = 9007199254740991;
  i = await submit(); await finish(i, long);
  await expect(page.locator('.condition-labels')).toContainText('Язык: русский');
  await expect(page.locator('.condition-labels')).toContainText('Без ограничения по длительности');
  const unknownPath = await page.locator('.category-icon path').first().getAttribute('d');
  assert.ok(unknownPath.includes('M4 4h6'), 'unknown category neutral icon');
  for (const width of [375, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await page.locator('.explanation').first().innerText(), long.cards[0].explanation);
    await page.screenshot({ path: `${output}/long-${width}.png`, fullPage: true });
  }
  delete long.normalizedRequest.language;
  long.normalizedRequest.durationHours = 2.5;
  await page.getByRole('button', { name: 'Условия', exact: true }).isVisible().then(async visible => {
    if (visible) await page.getByRole('button', { name: 'Условия', exact: true }).click();
  });
  i = await submit(); await finish(i, long);
  await expect(page.locator('.condition-labels')).toContainText('Без ограничения по языку');
  await expect(page.locator('.condition-labels')).toContainText('Длительность: 2,5 ч');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#budgetKzt').focus();
  assert.equal(await page.locator('#budgetKzt').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
  assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).scrollBehavior), 'auto');
  await page.setViewportSize({ width: 375, height: 900 });
  await page.locator('.optional-conditions > summary').click();
  await page.locator('#durationHours').focus();
  const focused = await page.locator('#durationHours').boundingBox();
  const actionBar = await page.locator('.mobile-results-nav').boundingBox();
  assert.ok(focused.y >= 0 && focused.y + focused.height + 4 < actionBar.y, 'mobile focused field clears fixed action bar');
  await page.screenshot({ path: `${output}/mobile-focus.png`, fullPage: false });
  await page.setViewportSize({ width: 1280, height: 900 });
  checks.push('passive snapshot unaffected by pending/draft; partial optionals explicit; unknown/long category and large price wrap at 375/390/1280; full text, focus and reduced motion');

  await page.route('**/api/catalog/options', route => route.fulfill({ status: 503, json: { error: { code: 'CATALOG_UNAVAILABLE', requestId: 'controlled-options' } } }));
  await page.reload();
  const retry = page.getByRole('button', { name: 'Загрузить снова', exact: true });
  await expect(retry).toBeVisible(); await page.unroute('**/api/catalog/options'); await retry.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#city')).toBeVisible();
  const opts = structuredClone(examples.options);
  opts.options.cities = ['Астана']; opts.options.categories = ['Флорист']; opts.options.eventFormats = ['свадьба'];
  opts.options.dateWindow = { min: '2026-11-01', max: '2026-11-30' };
  await page.route('**/api/catalog/options', route => route.fulfill({ json: opts }));
  await page.reload();
  await expect(page.locator('#city')).toHaveValue('Астана');
  await expect(page.locator('#date')).toHaveValue('2026-11-01');
  await expect(page.locator('#date')).toHaveAttribute('max', '2026-11-30');
  await expect(page.locator('.form-panel')).toContainText('30 ноября 2026');
  checks.push('controlled options failure keyboard retry and dynamic bounds/default fallback');
  await writeFile(`${output}/controlled.json`, JSON.stringify({ mode: 'controlled-public-responses', checks }, null, 2));
  console.log(JSON.stringify({ passed: checks, mode: 'controlled' }));
} finally { await browser.close(); }
