// Operator tooling only. Never import this script from an application endpoint.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { loadSecrets, ConfigurationError } from '../../back/config/secrets.mjs';

const usage = 'Usage: node scripts/brev/run.mjs [--instance NAME] status|refresh|gpu|smoke|setup|exec "REMOTE COMMAND"';
let key = '';
try {
  const args = process.argv.slice(2);
  let instance = 'dreams-gpu';
  if (args[0] === '--instance') {
    args.shift();
    instance = args.shift();
  }
  const operation = args.shift();
  if (operation === '--help' && args.length === 0) {
    console.log(usage);
  } else {
    if (!instance || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,100}$/.test(instance) ||
        !['status', 'refresh', 'gpu', 'smoke', 'setup', 'exec'].includes(operation) ||
        (operation === 'exec' ? args.length !== 1 || !args[0].trim() : args.length !== 0)) {
      throw new ConfigurationError('BREV_USAGE', usage);
    }
    key = loadSecrets({ required: ['BREV_API_KEY'] }).BREV_API_KEY;
    let command;
    let input;
    if (operation === 'status') {
      command = ['brev', 'ls', '--json'];
    } else if (operation === 'refresh') {
      command = ['brev', 'refresh'];
    } else {
      let remote = args[0];
      if (operation === 'gpu') remote = 'nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader';
      if (operation === 'smoke' || operation === 'setup') {
        input = readFileSync(new URL(operation === 'smoke' ? './gpu-smoke.py' : './setup.sh', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
        remote = operation === 'smoke' ? '/data/dreams-gpu/.venv/bin/python -' : 'bash -s';
      }
      command = ['ssh', '-T', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', '-o', 'ForwardAgent=no', instance, remote];
    }
    const env = { ...process.env, BREV_API_KEY: key };
    if (process.platform === 'win32') {
      const forwarded = (env.WSLENV || '').split(':').filter(value => value && !value.startsWith('BREV_API_KEY'));
      env.WSLENV = [...forwarded, 'BREV_API_KEY'].join(':');
      command = ['wsl.exe', '-d', 'Ubuntu-22.04', '-u', 'root', '--exec', ...command];
    }
    const result = spawnSync(command[0], command.slice(1), {
      env, input, encoding: 'utf8', timeout: operation === 'setup' ? 600_000 : 120_000,
      maxBuffer: 8 * 1024 * 1024,
    });
    for (const [stream, value] of [[process.stdout, result.stdout], [process.stderr, result.stderr]]) {
      if (value) stream.write(value.split(key).join('[REDACTED]'));
    }
    if (result.error) {
      throw new ConfigurationError(result.error.code === 'ETIMEDOUT' ? 'BREV_TIMEOUT' : 'BREV_EXEC_FAILED',
        'Brev command could not finish. Check installed tools and connectivity; remote work may still be running.');
    }
    process.exitCode = result.status ?? 1;
    if (process.exitCode !== 0) throw new ConfigurationError('BREV_REMOTE_FAILED', 'Remote command failed; see diagnostic output.');
  }
} catch (error) {
  const known = error instanceof ConfigurationError;
  console.error(JSON.stringify({ code: known ? error.code : 'BREV_EXEC_FAILED',
    message: known ? error.message : 'Brev command failed.', requestId: known ? error.requestId : randomUUID() }));
  if (!process.exitCode) process.exitCode = 1;
}
