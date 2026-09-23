## Why

The user has supplied OpenAI credentials but only the secret reader and Brev
tooling exist. A tested server adapter is needed before the application can call
OpenAI. Scope follows [the approved adapter outcome](../../../.brainstorming/2026-09-23-openai-response-adapter-design.md)
and the existing OpenAI-first architecture.

## What Changes

- Add a small server Responses API adapter and environment factory.
- Support text input/instructions and optional strict JSON-schema output format.
- Normalize successful text/usage and safe errors; enforce timeout/cancellation,
  zero automatic retries, and no fallback provider.
- Add a short live verification command, focused contract checks and run docs.

## Capabilities

### New Capabilities

- `openai-response-adapter`: configured, bounded server calls and safe results.

### Modified Capabilities

None.

## Impact

back/ai/, scripts/openai/, .env.example and README's OpenAI section. No new npm
dependencies, model downloads, browser credentials, public endpoints, or Brev
changes. Domain evidence selection and full recommendation integration remain
separate. Existing no-commit/no-push/no-merge hold applies.
