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
  await expect(page.locator('.brand')).toContainText('join city');
  await expect(page.locator('.selection-motif')).toBeVisible();
  await page.screenshot({ path: `${output}/initial.png`, fullPage: true });
  const dense = await submit();
  assert.equal(dense.status, 200);
  assert.equal(dense.data.summary.eligibleCount, 5);
  assert.deepEqual(ids(dense), ['HK-88430', 'HK-29829', 'HK-27222']);
  assert.ok(!('language' in requests[0]) && !('durationHours' in requests[0]));
  if (live) assert.equal(dense.data.explanationMode, 'openai_evidence');
  else assert.equal(dense.data.explanationMode, 'catalog_fallback');
  await expect(page.locator('.results')).toContainText(live ? 'ИИ' : 'Объяснения сформированы по полям каталога без ИИ');
  observations.dense = dense.data;
  await expect(page.locator('.condition-labels li')).toHaveCount(7);
  await expect(page.locator('.condition-labels')).toContainText('Без ограничения по языку');
  await expect(page.locator('.condition-labels')).toContainText('Без ограничения по длительности');
  assert.equal(await page.locator('.condition-labels button, .condition-labels a, .condition-labels input').count(), 0);
  for (const card of dense.data.cards) {
    assert.equal(await page.locator(`[data-profile-id="${card.id}"] .explanation`).innerText(), card.explanation);
  }
  observations.checks.push('real dense POST, omitted optionals, IDs/count/rendered mode');
  if (primaryOnly || live) {
    await page.screenshot({ path: `${output}/${live ? 'live' : 'primary'}.png`, fullPage: true });
  } else {
    const beforeEdit = requests.length;
    await fields({ date: '2026-10-11' });
    await expect(page.getByText('Условия изменены — выполните подбор', { exact: true })).toBeVisible();
    assert.equal(requests.length, beforeEdit);
    await expect(page.locator('.results')).toContainText('10 октября 2026');
    await fields({ date: '2026-10-10' });
    await expect(page.getByText('Условия изменены — выполните подбор', { exact: true })).toHaveCount(0);
    await fields({ date: '2026-10-11' });
    const next = await submit();
    assert.deepEqual(ids(next), ['HK-44923', 'HK-27222', 'HK-44733']);
    await expect(page.locator('.results')).toContainText('10 октября 2026');
    await expect(page.locator('.results')).toContainText('11 октября 2026');
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
    await expect(page.locator('.optional-conditions')).not.toHaveAttribute('open', '');
    const disclosure = page.locator('.optional-conditions > summary');
    await disclosure.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('#durationHours')).toBeVisible();
    const languages = await page.locator('#language option').evaluateAll(nodes => nodes.map(n => n.value).filter(Boolean));
    await fields({ language: languages[0], durationHours: '2.5' });
    const optional = await submit();
    assert.equal(requests.at(-1).durationHours, 2.5);
    assert.equal(requests.at(-1).language, languages[0]);
    assert.equal(optional.data.normalizedRequest.durationHours, 2.5);
    await expect(page.locator('.condition-labels')).toContainText(`Язык: ${languages[0]}`);
    await expect(page.locator('.condition-labels')).toContainText('Длительность: 2,5 ч');
    observations.optional = optional.data;
    const optionalRequestCount = requests.length;
    await disclosure.click();
    await expect(disclosure).toContainText(languages[0]);
    await expect(disclosure).toContainText('2,5 ч');
    assert.equal(requests.length, optionalRequestCount);
    await disclosure.click();
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
    for (const date of ['2027-01-01', '10000-01-01']) {
      await reset(); await fields({ date }); await click();
      await expect(page.locator('#date')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#date')).toBeFocused();
    }
    observations.checks.push('real optional language/fractional hours; local positive/finite/safe integer/date validation; keyboard disclosure and hidden error focus');

    await reset(); await fields({ category: 'Флорист', eventFormat: 'свадьба', budgetKzt: 500000 });
    const rare = await submit(); assert.deepEqual(ids(rare), ['HK-39372']); observations.rare = rare.data;
    await expect(page.getByText(/Почему меньше трёх:/)).toBeVisible();
    await expect(page.locator('.outcome-reason').last()).toContainText('занятость на дату — 1');
    await expect(page.locator('.outcome-reason').last()).toBeVisible();
    await expect(page.locator('.selection-details')).not.toHaveAttribute('open', '');
    await fields({ city: 'Зарубежье' });
    const absent = await submit(); assert.equal(absent.data.outcome, 'category_absent');
    await expect(page.locator('.results')).toContainText(/город|категор/i);
    await expect(page.getByRole('heading', { name: 'В этом городе нет такой категории' })).toBeVisible();
    await reset(); await fields({ budgetKzt: 1 });
    const empty = await submit(); assert.equal(empty.data.outcome, 'no_match');
    await expect(page.getByRole('heading', { name: 'По этим условиям вариантов нет' })).toBeVisible();
    await expect(page.locator('.outcome-reason')).toBeVisible();
    await expect(page.locator('.outcome-reason')).toContainText('бюджет — 6');
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
    for (const width of [1280, 375, 390]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      const form = await page.locator('.form-panel').boundingBox();
      const results = await page.locator('.results').boundingBox();
      assert.ok(width < 760 ? results.y > form.y + form.height : results.x > form.x + form.width);
      if (width === 1280) {
        await page.evaluate(() => window.scrollTo(0, 0));
        for (const selector of ['.card-heading', '.explanation']) {
          const box = await page.locator(selector).first().boundingBox();
          assert.ok(box.y >= 0 && box.y + box.height <= 900, `${selector} fully visible in initial desktop viewport`);
        }
        const cards = await page.locator('.contractor-list').boundingBox();
        const first = await page.locator('.contractor').nth(0).boundingBox();
        const second = await page.locator('.contractor').nth(1).boundingBox();
        assert.ok(second.y - first.y - first.height >= 12, 'distinct recommendation surfaces');
        const details = await page.locator('.selection-details').boundingBox();
        assert.ok(details.y >= cards.y + cards.height);
      } else {
        const beforeNavigation = requests.length;
        const budget = await page.locator('#budgetKzt').inputValue();
        await page.getByRole('button', { name: 'К результатам', exact: true }).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#results-heading')).toBeFocused();
        await expect(page.locator('.form-panel')).not.toHaveAttribute('open', '');
        const firstCard = await page.locator('.contractor').first().boundingBox();
        assert.ok(firstCard.y < 600);
        await page.screenshot({ path: `${output}/results-${width}.png`, fullPage: true });
        await page.getByRole('button', { name: 'Условия', exact: true }).click();
        await expect(page.locator('#city')).toBeFocused();
        await expect(page.locator('#budgetKzt')).toHaveValue(budget);
        assert.equal(requests.length, beforeNavigation);
      }
      await page.screenshot({ path: `${output}/width-${width}.png`, fullPage: true });
    }
    observations.checks.push('375px/390px/1280px layout, no overflow, complete desktop explanation visible, mobile keyboard navigation/collapse retains values without requests, screenshots');
  }
  await writeFile(`${output}/${live ? 'live' : primaryOnly ? 'primary' : 'browser'}.json`, JSON.stringify(observations, null, 2));
  console.log(JSON.stringify({ passed: observations.checks, mode: observations.mode }));
} finally { await browser.close(); }
