# OpenAI response adapter

The user originally requested ready-to-use provider adapters, authorized autonomous
implementation and installations, and now confirms that keys are in the root .env.
Implement the OpenAI transport slice using the already agreed OpenAI-first
[architecture outcome](2026-09-23-contractor-selection-architecture-design.md).

Use native server fetch, the existing secrets loader, Responses API, and pinned
gpt-4.1-mini-2025-04-14. Default deadline is six seconds, zero automatic retries,
store:false and no provider fallback. Expose text generation and optional strict
JSON-schema response format for future evidence extraction; do not implement
selection, ranking, quote validation or a public HTTP endpoint in this slice.

Verify a short live request plus public-contract error/cancellation cases. Preserve
other local work and the no-commit/no-push/no-merge instruction. Provider access
does not establish application integration or product explanation acceptance.
