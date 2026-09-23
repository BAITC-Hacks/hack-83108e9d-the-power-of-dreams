// Verify the installed CodeGraph CLI and MCP on disposable source code.
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const npmRoot = spawnSync('npm root -g', { shell: true, encoding: 'utf8', windowsHide: true });
assert.equal(npmRoot.status, 0, 'Cannot find global npm installation');
const shim = path.join(npmRoot.stdout.trim(), '@colbymchenry/codegraph/npm-shim.js');
const workspace = mkdtempSync(path.join(tmpdir(), 'dreams-codegraph-check-'));
let child;
let buffer = '';
let stderr = '';
let nextId = 0;
const pending = new Map();
const testEnv = { ...process.env, CODEGRAPH_NO_DAEMON: '1' };

function cli(...args) {
  const result = spawnSync(process.execPath, [shim, ...args], {
    cwd: workspace, encoding: 'utf8', windowsHide: true, timeout: 60000, env: testEnv,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message || result.stdout);
  return result.stdout;
}

function request(method, params) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 30000);
    pending.set(id, { resolve, reject, timer });
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
  });
}

try {
  writeFileSync(path.join(workspace, 'sample.ts'),
    'export function harnessDouble(value: number) { return value * 2; }\n' +
    'export function harnessTotal(value: number) { return harnessDouble(value) + 1; }\n');
  cli('init', '--yes');
  assert.match(cli('query', 'harnessDouble', '--json'), /harnessDouble/);
  console.log('PASS CodeGraph CLI: indexed and found TypeScript symbol');

  writeFileSync(path.join(workspace, 'extra.ts'),
    'export function harnessAddedLater() { return 42; }\n');
  cli('sync');
  assert.match(cli('query', 'harnessAddedLater', '--json'), /harnessAddedLater/);
  console.log('PASS CodeGraph sync: new symbol found after an edit');

  child = spawn(process.execPath, [shim, 'serve', '--mcp', '--path', workspace, '--no-watch'], {
    cwd: workspace, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true, env: testEnv,
  });
  child.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-4000); });
  child.stdout.on('data', chunk => {
    buffer += chunk;
    let end;
    while ((end = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
      let message;
      try { message = JSON.parse(line); } catch { continue; }
      const waiter = pending.get(message.id);
      if (!waiter) continue;
      clearTimeout(waiter.timer); pending.delete(message.id);
      if (message.error) waiter.reject(new Error(JSON.stringify(message.error)));
      else waiter.resolve(message.result);
    }
  });
  child.on('error', error => {
    for (const waiter of pending.values()) { clearTimeout(waiter.timer); waiter.reject(error); }
    pending.clear();
  });
  child.on('exit', () => {
    for (const waiter of pending.values()) {
      clearTimeout(waiter.timer); waiter.reject(new Error(`MCP exited: ${stderr}`));
    }
    pending.clear();
  });
  const init = await request('initialize', {
    protocolVersion: '2024-11-05', capabilities: {},
    clientInfo: { name: 'dreams-harness-check', version: '1.0.0' },
  });
  assert.ok(init.serverInfo);
  child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);
  const catalogue = await request('tools/list', {});
  const explore = catalogue.tools.find(tool => tool.name === 'codegraph_explore');
  assert.ok(explore, 'codegraph_explore not advertised');
  const result = await request('tools/call', {
    name: explore.name, arguments: { query: 'harnessDouble harnessTotal', projectPath: workspace },
  });
  assert.ok(!result.isError, JSON.stringify(result));
  assert.match(JSON.stringify(result), /harnessDouble/);
  console.log(`PASS CodeGraph MCP: initialized ${init.serverInfo.name}; tools/list and tools/call returned source`);
} finally {
  if (child && child.exitCode === null) {
    child.stdin.end();
    await new Promise(resolve => {
      const timer = setTimeout(() => { child.kill(); resolve(); }, 3000);
      child.once('exit', () => { clearTimeout(timer); resolve(); });
    });
  }
  const resolved = path.resolve(workspace);
  const allowedParent = path.resolve(tmpdir());
  assert.equal(path.dirname(resolved), allowedParent, 'Unsafe temporary cleanup path');
  assert.ok(path.basename(resolved).startsWith('dreams-codegraph-check-'));
  rmSync(resolved, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
