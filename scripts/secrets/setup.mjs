import { readFileSync, writeFileSync } from 'node:fs';

try {
  const template = readFileSync(new URL('../../.env.example', import.meta.url));
  writeFileSync(new URL('../../.env', import.meta.url), template, { flag: 'wx', mode: 0o600 });
  console.log('Created root .env. Fill the settings needed by your server. Keep this file private.');
} catch (error) {
  if (error.code === 'EEXIST') {
    console.log('Root .env already exists; left unchanged.');
  } else {
    console.error('SETUP_FAILED: Cannot create .env. Check template availability and local file access.');
    process.exitCode = 1;
  }
}
