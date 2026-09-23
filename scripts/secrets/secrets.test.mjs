import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadSecrets } from '../../back/config/secrets.mjs';

function temporary(t) {
  const dir = mkdtempSync(join(tmpdir(), 'dreams-secrets-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('selected values, quoting, environment precedence, no global mutation', t => {
  const envFile = join(temporary(t), '.env');
  writeFileSync(envFile, 'OPENAI_API_KEY="fixture # key"\nNVIDIA_API_KEY=fixture-nvidia\nDATABASE_URL=fixture-db\nOTHER_SECRET=fixture-other\n');
  const before = { ...process.env };
  const config = loadSecrets({ envFile, env: { NVIDIA_API_KEY: 'fixture-override' },
    required: ['OPENAI_API_KEY', 'NVIDIA_API_KEY', 'DATABASE_URL'] });
  assert.deepEqual(config, { OPENAI_API_KEY: 'fixture # key', NVIDIA_API_KEY: 'fixture-override', DATABASE_URL: 'fixture-db' });
  assert.ok(Object.isFrozen(config));
  assert.deepEqual({ ...process.env }, before);
});

test('environment-only and future names; blank overrides fail safely', t => {
  const envFile = join(temporary(t), '.env');
  assert.deepEqual(loadSecrets({ envFile, env: { FUTURE_SECRET: 'fixture' }, required: ['FUTURE_SECRET'] }), { FUTURE_SECRET: 'fixture' });
  writeFileSync(envFile, 'OPENAI_API_KEY=fixture-sensitive\n');
  assert.throws(() => loadSecrets({ envFile, env: { OPENAI_API_KEY: '  ' }, required: ['OPENAI_API_KEY'] }), error => {
    assert.equal(error.code, 'CONFIG_REQUIRED');
    assert.match(error.message, /OPENAI_API_KEY/);
    assert.ok(error.requestId);
    assert.doesNotMatch(JSON.stringify(error), /fixture-sensitive/);
    return true;
  });
});

test('unreadable file and invalid requests do not reveal supplied input', t => {
  const envFile = temporary(t);
  assert.throws(() => loadSecrets({ envFile, env: {}, required: ['OPENAI_API_KEY'] }), error => {
    assert.equal(error.code, 'CONFIG_FILE_UNREADABLE');
    assert.ok(error.requestId);
    assert.ok(!error.message.includes(envFile));
    return true;
  });
  for (const required of [[], ['fixture-sensitive-value'], ['NEXT_PUBLIC_API_KEY']]) {
    assert.throws(() => loadSecrets({ envFile, required }), error => error.code === 'CONFIG_INVALID_REQUEST' && !error.message.includes('fixture-sensitive-value'));
  }
});

test('organizer workflow from a subdirectory, repeat setup, CLI redaction, Git ignores', t => {
  const root = temporary(t);
  for (const path of ['back/config', 'scripts/secrets']) {
    cpSync(new URL(`../../${path}`, import.meta.url), join(root, path), { recursive: true });
  }
  for (const path of ['.env.example', '.gitignore']) {
    cpSync(new URL(`../../${path}`, import.meta.url), join(root, path));
  }
  const cwd = join(root, 'front');
  mkdirSync(cwd);
  const run = (script, ...args) => spawnSync(process.execPath, [join(root, 'scripts/secrets', script), ...args], {
    cwd, encoding: 'utf8', env: { SystemRoot: process.env.SystemRoot ?? '', PATH: process.env.PATH ?? '' },
  });
  assert.equal(run('setup.mjs').status, 0);
  assert.equal(readFileSync(join(root, '.env'), 'utf8'), readFileSync(join(root, '.env.example'), 'utf8'));
  const missing = run('check.mjs', 'OPENAI_API_KEY');
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /CONFIG_REQUIRED.*OPENAI_API_KEY/);
  const fixture = 'OPENAI_API_KEY="fixture-secret # never print"\n';
  writeFileSync(join(root, '.env'), fixture);
  assert.equal(run('setup.mjs').status, 0);
  assert.equal(readFileSync(join(root, '.env'), 'utf8'), fixture);
  const success = run('check.mjs', 'OPENAI_API_KEY');
  assert.equal(success.status, 0);
  assert.match(success.stdout, /not tested/);
  const failure = run('check.mjs', 'OPENAI_API_KEY', 'NVIDIA_API_KEY');
  assert.equal(failure.status, 1);
  assert.doesNotMatch(success.stdout + success.stderr + failure.stdout + failure.stderr, /fixture-secret/);
  assert.equal(run('check.mjs').status, 1);
  assert.equal(spawnSync('git', ['init', '--quiet', root]).status, 0);
  for (const path of ['.env', '.env.local', 'back/.env', '.env.backup']) {
    assert.equal(spawnSync('git', ['check-ignore', '--quiet', path], { cwd: root }).status, 0);
  }
  assert.equal(spawnSync('git', ['check-ignore', '--quiet', '.env.example'], { cwd: root }).status, 1);
});
