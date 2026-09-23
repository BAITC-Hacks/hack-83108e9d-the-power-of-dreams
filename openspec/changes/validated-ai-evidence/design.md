## Context

See [proposal](proposal.md), [approved outcome](../../../.brainstorming/2026-09-23-evidence-module-design.md) and [validation architecture](../../../architecture/selection-and-explanations.md#ai-response-validation-boundary). Base f9ed31fb5b4c99d42c1051d3cd43cc9f5af59766 retains identical back/contracts/slice/transport/data/package content to accepted P01 8aaad189393be78a21f1793afd2014c55794f7cd. P01 transferred evidence ownership. Other active changes remain independently owned.

## Goals / Non-Goals

**Goals:** close specific P04 acceptance gaps with existing functions and focused checks; keep public contract v1 stable.

**Non-Goals:** change selection, prompt style, transport/configuration, renderer or UI; new frameworks, dependencies, per-card retries, persistent storage or final P07 timing series.

## Decisions

| Module/owner | Operation and boundary | Owned data/dependencies | Verification |
| --- | --- | --- | --- |
| Evidence, apply role; back/ai/evidence/ | selectEvidence(NormalizedRequest, readonly EvidenceProfile[], AbortSignal): Promise<EvidenceResult>; validateEvidence(text, profiles) | No persistent data; public evidence types and injected transport only | Existing slice checks plus colocated missing boundary checks |
| Coordinator | Shared test command, architecture index, task state, live verification, Git integration | Existing composition, transport, fixtures and CSV are consumed unchanged | Combined tests/typecheck/build/production HTTP scenario |

Evidence returns validated byId values (accepted normalized quote or per-card fallback reason), unavailable with frozen reason, or rejects AbortError/unexpected faults. Its complete shape and cases are in [spec](specs/contractor-evidence/spec.md) and frozen [ports](../../../back/recommend/ports.ts). No consumer imports evidence internals for public types. No frontend package is needed: P05 owns that handoff.

Retain the existing two-pass batch/quote validation and null-prototype map. Retain the existing prompt and literalSentenceChoices. A read-only probe reproduced that spreading a profile forwards additional runtime fields; explicitly project the six permitted fields, preserving their serialized order and values for existing canonical inputs. This repairs the declared boundary without changing the valid P01 provider payload. Add a regression check and prove canonical input/prompt equality with baseline; no speculative extractor rewrite or new evaluator.

The existing transport owns one deadline spanning request/body, store:false, 450 initial output tokens, zero retries. Evidence checks cancellation before input handling and after await/catch; cancellation wins. It maps OPENAI_TIMEOUT to timeout, other OPENAI_* transport failures to provider, and propagates other faults. Configuration remains composition-owned. No new logs; retain only approved operational metadata.

Verification first runs the existing real catalogue-to-HTTP dense scenario. Apply then closes defensive input, arbitrary/reordered ID, failure propagation, immutable input and projection evidence gaps. Reuse existing batch/per-card/Unicode/cancellation/transport tests. Coordinator runs rare live once using the existing server secret loader; repair/recheck only a demonstrated failure, recording every attempt. Dense historical reuse requires baseline provider-payload equivalence, unchanged prompt/model/data and relevant executable behavior; otherwise repeat affected dense quality.

Run method: existing Node/npm lockfile; npm ci, npm run typecheck, npm test, npm run build, npm start -- --port 3104 following README. Local checks use real CSV and labelled controlled provider responses, require no key. Rare live requires network and existing funded OpenAI access (default gpt-4.1-mini-2025-04-14); normal API cost applies. No new services/accounts/manual upload. Keep build/temp outputs in the assigned worktree. Organizer submission and P07 remain separate.

## Risks / Trade-offs

- Conservative sentence punctuation heuristic can reject abbreviations and is not a linguistic parser → record observed limits; do not add NLP infrastructure.
- Source matching does not establish relevance → retain human live source/relevance verdicts.
- Aborting cannot guarantee upstream billing stopped → no retry; retain caller cancellation semantics.
- Concurrent main changes can invalidate candidate checks → reserve shared integration exclusively, combine latest accepted main, and recheck affected cases.

## Migration Plan

No data/schema migration. Commit accepted bounded changes, publish feature branch, verify one combined candidate under shared reservation, promote and confirm remote main, then sync/archive documentation. A rollback is a scoped revert of P04 changes; never reset others' work. Archive does not substitute for acceptance.
