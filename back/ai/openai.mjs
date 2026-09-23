// Server only: never import into browser components.
import { randomUUID } from 'node:crypto';
import { loadSecrets } from '../config/secrets.mjs';

export const DEFAULT_MODEL = 'gpt-4.1-mini-2025-04-14';

export class OpenAIError extends Error {
  constructor(code, message, requestId = randomUUID()) {
    super(message);
    this.name = 'OpenAIError';
    this.code = code;
    this.requestId = requestId;
  }
}

export function createOpenAIFromEnv({ env, envFile, ...options } = {}) {
  const { OPENAI_API_KEY } = loadSecrets({ required: ['OPENAI_API_KEY'], env, envFile });
  let model = DEFAULT_MODEL;
  try {
    model = loadSecrets({ required: ['OPENAI_MODEL'], env, envFile }).OPENAI_MODEL;
  } catch (error) {
    if (error.code !== 'CONFIG_REQUIRED') throw error;
  }
  return createOpenAIAdapter({ ...options, apiKey: OPENAI_API_KEY, model: options.model ?? model });
}

export function createOpenAIAdapter({ apiKey, model = DEFAULT_MODEL, timeoutMs = 6000, fetchImpl = globalThis.fetch } = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim() || typeof model !== 'string' || !model.trim() ||
      !Number.isFinite(timeoutMs) || timeoutMs <= 0 || timeoutMs > 6000 || typeof fetchImpl !== 'function') {
    throw new OpenAIError('OPENAI_CONFIG', 'Invalid OpenAI server configuration.');
  }
  return Object.freeze({
    async generate({ input, instructions, maxOutputTokens = 450, format, signal } = {}) {
      const requestId = randomUUID();
      const fail = (code, message) => new OpenAIError(code, message, requestId);
      if (typeof input !== 'string' || !input.trim() ||
          (instructions !== undefined && typeof instructions !== 'string') ||
          !Number.isInteger(maxOutputTokens) || maxOutputTokens < 16 ||
          (signal !== undefined && !(signal instanceof AbortSignal)) ||
          (format !== undefined && (!format || typeof format.name !== 'string' ||
            !/^[A-Za-z0-9_-]{1,64}$/.test(format.name) || !format.schema ||
            typeof format.schema !== 'object' || Array.isArray(format.schema)))) {
        throw fail('OPENAI_INPUT', 'Invalid OpenAI request input.');
      }
      const body = { model, input, store: false, max_output_tokens: maxOutputTokens };
      if (instructions !== undefined) body.instructions = instructions;
      if (format) body.text = { format: { type: 'json_schema', name: format.name, schema: format.schema, strict: true } };
      let serialized;
      try { serialized = JSON.stringify(body); }
      catch { throw fail('OPENAI_INPUT', 'Request must be JSON serializable.'); }

      const controller = new AbortController();
      const combined = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        combined.throwIfAborted();
        const response = await fetchImpl('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-Client-Request-Id': requestId },
          body: serialized, signal: combined,
        });
        if (!response.ok) {
          await response.body?.cancel();
          const [code, message] = response.status === 401 || response.status === 403
            ? ['OPENAI_AUTH', 'OpenAI rejected access. Check the key and project permissions.']
            : response.status === 429 ? ['OPENAI_RATE_LIMIT', 'OpenAI rate or account quota limit reached.']
            : response.status >= 500 ? ['OPENAI_UNAVAILABLE', 'OpenAI is temporarily unavailable.']
            : ['OPENAI_REQUEST_REJECTED', 'OpenAI rejected the request. Check the model and request configuration.'];
          throw fail(code, message);
        }
        let data;
        try { data = await response.json(); }
        catch { throw fail('OPENAI_RESPONSE', 'OpenAI returned an invalid response.'); }
        combined.throwIfAborted();
        if (!data || !Array.isArray(data.output) || typeof data.id !== 'string' || !data.id ||
            typeof data.model !== 'string' || !data.model) {
          throw fail('OPENAI_RESPONSE', 'OpenAI returned an invalid response.');
        }
        if (data.status !== 'completed') throw fail('OPENAI_INCOMPLETE', 'OpenAI did not complete the response.');
        const parts = [];
        for (const item of data.output) {
          if (item?.type !== 'message') continue;
          if (!Array.isArray(item.content)) throw fail('OPENAI_RESPONSE', 'OpenAI returned an invalid message.');
          for (const part of item.content) {
            if (part?.type === 'refusal') throw fail('OPENAI_REFUSED', 'OpenAI declined the request.');
            if (part?.type === 'output_text') {
              if (typeof part.text !== 'string') throw fail('OPENAI_RESPONSE', 'OpenAI returned invalid text.');
              parts.push(part.text);
            }
          }
        }
        const text = parts.join('');
        if (!text.trim()) throw fail('OPENAI_RESPONSE', 'OpenAI returned no usable text.');
        const result = { provider: 'openai', mode: 'live', text, model: data.model, responseId: data.id, requestId };
        if (data.usage != null) {
          if (!['input_tokens', 'output_tokens', 'total_tokens'].every(k => Number.isSafeInteger(data.usage[k]) && data.usage[k] >= 0)) {
            throw fail('OPENAI_RESPONSE', 'OpenAI returned invalid usage data.');
          }
          result.usage = { inputTokens: data.usage.input_tokens, outputTokens: data.usage.output_tokens, totalTokens: data.usage.total_tokens };
        }
        return result;
      } catch (error) {
        if (combined.aborted) {
          throw signal?.aborted
            ? fail('OPENAI_CANCELLED', 'OpenAI request cancelled by the caller.')
            : fail('OPENAI_TIMEOUT', 'OpenAI request exceeded its deadline.');
        }
        if (error instanceof OpenAIError) throw error;
        throw fail('OPENAI_NETWORK', 'Cannot reach OpenAI. Check the network connection.');
      } finally {
        clearTimeout(timer);
      }
    },
  });
}
