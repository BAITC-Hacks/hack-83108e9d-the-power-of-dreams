// Narrow development-only mount/unmount check of the actual screen. Removes its temporary route.
import assert from 'node:assert/strict';
import { mkdir, writeFile, unlink, rmdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect } from '@playwright/test';
const directory = resolve('src/app/p06-unmount-check');
const file = resolve(directory, 'page.tsx');
await mkdir(directory); // Fail if the path is occupied; never replace another writer.
await writeFile(file, `'use client';
import { useState } from 'react';
import ContractorForm from '../../../front/ContractorForm';
export default function Check() {
 const [mounted, setMounted] = useState(true);
 return <><button onClick={() => setMounted(false)}>Unmount test screen</button>{mounted && <ContractorForm/>}</>;
}`, { flag: 'wx' });
let browser;
try {
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.addInitScript(() => {
    const original = fetch.bind(window);
    window.fetch = (input, init) => String(input).endsWith('/api/recommendations') ? new Promise(resolve => { window.p06Pending = { signal: init.signal, resolve }; }) : original(input, init);
  });
  await page.goto(`${process.env.P06_URL ?? 'http://127.0.0.1:3106'}/p06-unmount-check`);
  await page.getByRole('button', { name: 'Подобрать', exact: true }).click();
  await expect.poll(() => page.evaluate(() => !!window.p06Pending)).toBe(true);
  await page.getByRole('button', { name: 'Unmount test screen' }).click();
  assert.equal(await page.evaluate(() => window.p06Pending.signal.aborted), true);
  await page.evaluate(() => window.p06Pending.resolve(new Response('{}', { status: 200 })));
  await expect(page.locator('main')).toHaveCount(0);
  console.log('PASS controlled actual React unmount aborts recommendation; late completion cannot remount screen');
} finally {
  await browser?.close();
  await unlink(file);
  await rmdir(directory);
}
