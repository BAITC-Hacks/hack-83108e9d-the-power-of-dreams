// P06 focused browser acceptance. Real same-origin requests unless explicitly labelled controlled.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const url = process.env.P06_URL ?? 'http://127.0.0.1:3106';
const primaryOnly = process.argv.includes('--primary');
const live = process.argv.includes('--live');
const output = process.env.P06_OUTPUT ?? 'test-results/p06';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const observations = { mode: live ? 'real-live' : 'real-catalog-fallback', checks: [] };
const requests = [];
page.on('request', r => { if (r.url().endsWith('/api/recommendations')) requests.push(r.postDataJSON()); });
async function click() { await page.getByRole('button', { name: 'Подобрать', exact: true }).focus(); await page.keyboard.press('Enter'); }
async function submit() {
  const response = page.waitForResponse(r => r.url().endsWith('/api/recommendations'));
  await click();
  const result = await response;
  const data = await result.json();
  await expect(page.locator('.contractor')).toHaveCount(data.cards?.length ?? 3);
  if (data.cards?.length) await expect(page.locator('.contractor').first()).toContainText(data.cards[0].name);
  return { status: result.status(), data };
}
async function reset() { await page.getByRole('button', { name: 'Сбросить', exact: true }).focus(); await page.keyboard.press('Enter'); }
async function fields(values) {
  for (const [key, value] of Object.entries(values)) {
    const el = page.locator(`#${key}`);
    if (['city', 'category', 'eventFormat', 'language'].includes(key)) await el.selectOption(value);
    else await el.fill(String(value));
  }
}
const ids = response => response.data.cards.map(c => c.id);
try {
  await page.goto(url);
  await expect(page.locator('#city')).toBeVisible();
  const dense = await submit();
  assert.equal(dense.status, 200);
  assert.equal(dense.data.summary.eligibleCount, 5);
  assert.deepEqual(ids(dense), ['HK-88430', 'HK-29829', 'HK-27222']);
  assert.ok(!('language' in requests[0]) && !('durationHours' in requests[0]));
  if (live) assert.equal(dense.data.explanationMode, 'openai_evidence');
  else assert.equal(dense.data.explanationMode, 'catalog_fallback');
  await expect(page.locator('.results')).toContainText(live ? 'ИИ' : 'Объяснения сформированы по полям каталога без ИИ');
  observations.dense = dense.data;
  observations.checks.push('real dense POST, omitted optionals, IDs/count/rendered mode');
  if (primaryOnly || live) {
    await page.screenshot({ path: `${output}/${live ? 'live' : 'primary'}.png`, fullPage: true });
  } else {
    const beforeEdit = requests.length;
    await fields({ date: '2026-10-11' });
    await expect(page.getByText('Условия изменены — выполните подбор', { exact: true })).toBeVisible();
    assert.equal(requests.length, beforeEdit);
    await expect(page.locator('.results')).toContainText('2026-10-10');
    await fields({ date: '2026-10-10' });
    await expect(page.getByText('Условия изменены — выполните подбор', { exact: true })).toHaveCount(0);
    await fields({ date: '2026-10-11' });
    const next = await submit();
    assert.deepEqual(ids(next), ['HK-44923', 'HK-27222', 'HK-44733']);
    await expect(page.locator('.results')).toContainText('2026-10-10');
    await expect(page.locator('.results')).toContainText('2026-10-11');
    observations.october11 = next.data;
    await fields({ date: '2026-10-01' });
    const first = await submit();
    assert.deepEqual(ids(first), ['HK-88430', 'HK-44923', 'HK-75012']);
    await fields({ date: '2026-10-06' });
    const sixth = await submit();
    assert.deepEqual(ids(sixth), ['HK-88430', 'HK-44923', 'HK-29829']);
    await expect(page.locator('.results')).toContainText(first.data.cards[2].name);
    observations.dateDisplacementText = await page.locator('.results').innerText();
    observations.checks.push('real October 10→11 and October 1→6, no request on edit, equivalent draft clears notice');

    await reset();
    await expect(page.locator('#city')).toBeFocused();
    await expect(page.locator('.contractor')).toHaveCount(0);
    await expect(page.locator('details')).not.toHaveAttribute('open', '');
    const disclosure = page.locator('summary');
    await disclosure.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#durationHours')).toBeVisible();
    const languages = await page.locator('#language option').evaluateAll(nodes => nodes.map(n => n.value).filter(Boolean));
    await fields({ language: languages[0], durationHours: '2.5' });
    const optional = await submit();
    assert.equal(requests.at(-1).durationHours, 2.5);
    assert.equal(requests.at(-1).language, languages[0]);
    assert.equal(optional.data.normalizedRequest.durationHours, 2.5);
    observations.optional = optional.data;
    for (const value of ['0', '-1', '1e309']) {
      const count = requests.length;
      await fields({ durationHours: value }); await click();
      await expect(page.locator('#durationHours')).toHaveAttribute('aria-invalid', 'true');
      assert.equal(requests.length, count);
    }
    await fields({ durationHours: '0' });
    await disclosure.click(); await click();
    await expect(page.locator('#durationHours')).toBeVisible();
    await expect(page.locator('#durationHours')).toBeFocused();
    await reset();
    const invalidCount = requests.length;
    await fields({ budgetKzt: '1.5' }); await click();
    await expect(page.locator('#budgetKzt')).toBeFocused();
    assert.equal(requests.length, invalidCount);
    await reset(); await fields({ date: '2027-01-01' }); await click();
    await expect(page.locator('#date')).toHaveAttribute('aria-invalid', 'true');
    observations.checks.push('real optional language/fractional hours; local positive/finite/safe integer/date validation; keyboard disclosure and hidden error focus');

    await reset(); await fields({ category: 'Флорист', eventFormat: 'свадьба', budgetKzt: 500000 });
    const rare = await submit(); assert.deepEqual(ids(rare), ['HK-39372']); observations.rare = rare.data;
    await fields({ city: 'Зарубежье' });
    const absent = await submit(); assert.equal(absent.data.outcome, 'category_absent');
    await expect(page.locator('.results')).toContainText(/город|категор/i);
    await reset(); await fields({ budgetKzt: 1 });
    const empty = await submit(); assert.equal(empty.data.outcome, 'no_match');
    observations.checks.push('real rare florist, category_absent and no_match replace prior cards');
    await reset(); await submit();

    // This interception modifies only input. The error itself comes from the actual backend.
    await page.route('**/api/recommendations', async route => {
      const response = await route.fetch({ postData: { ...route.request().postDataJSON(), date: '2027-01-01' } });
      assert.equal(response.status(), 400);
      await route.fulfill({ response });
    }, { times: 1 });
    await click();
    await expect(page.locator('#date')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#date')).toBeFocused();
    await expect(page.locator('.contractor')).toHaveCount(3);
    observations.checks.push('real HTTP 400 field mapping and retained success (test-altered outgoing input)');

    await reset(); await submit();
    for (const width of [1280, 375]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const form = await page.locator('.form-panel').boundingBox();
      const results = await page.locator('.results').boundingBox();
      assert.ok(width === 375 ? results.y > form.y + form.height : results.x > form.x + form.width);
      await page.screenshot({ path: `${output}/width-${width}.png`, fullPage: true });
    }
    observations.checks.push('375px/1280px layout, no horizontal overflow, screenshots');
  }
  await writeFile(`${output}/${live ? 'live' : primaryOnly ? 'primary' : 'browser'}.json`, JSON.stringify(observations, null, 2));
  console.log(JSON.stringify({ passed: observations.checks, mode: observations.mode }));
} finally { await browser.close(); }
