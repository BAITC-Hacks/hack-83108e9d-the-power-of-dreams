## Context

The key is present in private .env. Existing back/config/secrets.mjs owns secret loading. Follow the approved brainstorming outcome linked in proposal.md and architecture/system.md and architecture/selection-and-explanations.md. Preserve unrelated local work and the no-commit/no-push/no-merge hold.

## Goals / Non-Goals

Deliver an executable server adapter and real access evidence. Domain selection, public HTTP routes, UI and NVIDIA inference are separate work.

## Decisions

- back/ai/openai.mjs owns transport only; coordinator owns this file. Public createOpenAIAdapter(options) and createOpenAIFromEnv(options) expose generate({input,instructions,maxOutputTokens,format,signal}). Input is text, optional instructions and developer-supplied {name,schema} strict JSON format. Output contains text, provider, mode, model, responseId, requestId and optional numeric usage. Errors expose code, safe message and requestId. Domain consumers validate structured output themselves.
- Depend only on native fetch, node:crypto and existing secret loader. Fixed OpenAI Responses URL; pinned gpt-4.1-mini-2025-04-14 default, optional OPENAI_MODEL override. No owned persistent data. No prompts, key or provider body logging.
- Calls incur API usage. store:false, default max_output_tokens 450, deadline 6000ms covers fetch and body, caller AbortSignal, zero retries and no fallback. Cancellation cannot guarantee provider billing cancellation.
- scripts/openai/check.mjs owns the benign live probe; contract.test.mjs owns observable request/result/error checks with controlled transports. No new dependency or application endpoint.
- Run on existing Node 24 installation with .env or process environment; key and funded OpenAI account are required. Brev and GPU are not involved. Documentation uses project-delivery guidance.

## Risks / Trade-offs

The six-second budget can reject a slow otherwise successful provider response; report this explicitly. A successful probe verifies provider transport, not future application integration. Keys never belong in tracked artifacts.

## Migration Plan

Add module and operator command, execute a short real call, verify success/error/cancellation contracts, align README and .env.example and record evidence. Existing consumers are unchanged. Rollback consists of removing these unused files; no data migration.
