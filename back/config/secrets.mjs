// Server only. Never import this module from browser components.
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { randomUUID } from 'node:crypto';

export class ConfigurationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ConfigurationError';
    this.code = code;
    this.requestId = randomUUID();
  }
}

/** Read only the names required by this server consumer. Never mutates process.env. */
export function loadSecrets({ required, env = process.env, envFile = new URL('../../.env', import.meta.url) } = {}) {
  if (!Array.isArray(required) || required.length === 0 || required.some(name =>
    typeof name !== 'string' || !/^[A-Z_][A-Z0-9_]*$/.test(name) || name.startsWith('NEXT_PUBLIC_'))) {
    throw new ConfigurationError('CONFIG_INVALID_REQUEST', 'Specify required server variable names; public browser variables are not supported.');
  }
  let file = {};
  try {
    file = parseEnv(readFileSync(envFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw new ConfigurationError('CONFIG_FILE_UNREADABLE', 'Cannot read the secrets file. Check local file access.');
    }
  }
  const result = {};
  const missing = [];
  for (const name of new Set(required)) {
    const value = Object.hasOwn(env, name) ? env[name] : file[name];
    if (typeof value !== 'string' || value.trim() === '') missing.push(name);
    else result[name] = value;
  }
  if (missing.length) {
    throw new ConfigurationError('CONFIG_REQUIRED', `Missing required settings: ${missing.join(', ')}. Fill .env or the process environment.`);
  }
  return Object.freeze(result);
}
