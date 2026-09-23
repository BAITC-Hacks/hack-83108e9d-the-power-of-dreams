import { createOpenAIFromEnv } from '../../back/ai/openai.mjs';

const start = performance.now();
try {
  const result = await createOpenAIFromEnv().generate({
    input: 'Reply with exactly OPENAI_OK and nothing else.', maxOutputTokens: 32,
  });
  if (result.text.trim() !== 'OPENAI_OK') {
    console.error(JSON.stringify({ ok: false, code: 'CHECK_UNEXPECTED_TEXT', requestId: result.requestId }));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ ok: true, provider: result.provider, mode: result.mode, model: result.model,
      requestId: result.requestId, usage: result.usage, durationMs: Math.round(performance.now() - start) }));
  }
} catch (error) {
  console.error(JSON.stringify({ ok: false, code: error.code ?? 'CHECK_FAILED', requestId: error.requestId,
    durationMs: Math.round(performance.now() - start) }));
  process.exitCode = 1;
}
