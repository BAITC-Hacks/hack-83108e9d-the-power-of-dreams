## Context

See [proposal](proposal.md), [approved P01](../../../../.brainstorming/2026-09-23-first-working-slice-design.md), [P00](../2026-09-23-foundation-and-contracts/design.md), [system](../../../../architecture/system.md) and [selection](../../../../architecture/selection-and-explanations.md). Accepted base 9327715f06f7729ae58d4f322a8cf044f5a35c7a is in HEAD 8ecba1901a434cb4c0c0f6a710d804bdc6ab825c with unchanged back/contracts. Other listed tooling changes are not selected for implementation; their files and reference drafts remain untouched. On 2026-09-23 the user explicitly removed agent-enforced time limits/deadline questions/reserves and retains schedule control; this supersedes historical timing text in linked sources.

## Goals / Non-Goals

**Goals:** one sequential real slice with frozen v1 contracts, thin boundaries, existing dependencies and transport. Coordinator owns the slice; requested role subagents handle bounded independent review or explicitly scoped implementation only after the external probe and readiness checks.

**Non-Goals:** finish P02–P07, implement optional controls/date narratives, introduce infrastructure or rewrite transport. No immutable frontend handoff is claimed: P01 stays coordinator-owned; the full published frontend package remains P05.

## Decisions

### Operations and ownership

All public and internal inputs/outputs/errors remain the exact P00 types in contracts/contractor-selection.ts, back/domain/types.ts and back/recommend/ports.ts. Existing success/error examples remain the pinned contract basis. Coordinator owns all paths below unless a task card explicitly transfers a disjoint implementation responsibility. No workers share writers.

| Module / owned data | Operations and dependencies | Verification |
| --- | --- | --- |
| back/catalog / immutable snapshot | loadCatalog(path): Promise<CatalogLoadResult>; fs, csv-parse, domain types; validate required headers, IDs, scalar/list/date/flag fields; hash original bytes; missing/unreadable/invalid expected results, unexpected faults reject | real dataset, malformed/missing temporary sources |
| back/domain except types / pure selection | select(profiles, normalizedRequest): SelectionResult; plain types only; exclusive busy/budget/format/language/duration counts; price then ID | dense IDs/counts, empty and optional constraints |
| back/ai/evidence / quote map | create evidence operation from injected existing generate transport; frozen SelectEvidence port; no filesystem/calendars; exact envelope/IDs then individual quote checks | controlled batch/card failures, cancellation, dense live |
| back/recommend except ports / rendered result | createRecommend(snapshot, select, evidence): Recommend; injected operations only; one factual sentence plus attributed accepted quote | real module interaction and all modes |
| back/http / request validation and safe JSON | options and recommendations handlers; fresh UUID before parse, normalize against ready catalogue, map expected errors; cancellation propagates | HTTP success/errors/no AI for invalid or empty |
| back/composition.ts / retained load promise | wire concrete adapters, store promise before await, retain expected load failures; expected CONFIG_REQUIRED/CONFIG_FILE_UNREADABLE disable evidence, unexpected configuration faults propagate | retained failure/restart, production endpoints |
| src/app / thin route and page shell | Node runtime Web Request/Response adapters, compose front page; no domain rules | build and production browser |
| front / form and current request state | same-origin options/recommendations, public types only; AbortController plus stale response guard, pending duplicate prevention, clear old result on new submission | keyboard/mobile/desktop, visible states |

Loading does one read with no retries. Evidence uses the existing transport's deadline of 6000 ms, zero retries, strict schema and 450 output tokens. Structural/type/identity/provider failures return all-card unavailable; null/blank/long/multiple-sentence/nonliteral quotes affect only their card. Translate OPENAI_CANCELLED into AbortError. Check incoming cancellation before and after awaited work, including fallback paths. Selection never depends on provider output.

### Screen

Use approved frontend-design direction: white #FFFFFF page, #F3F5F7 form, #202936 text, #2457C5 action/focus, #D9DFE7 borders; Cyrillic system fonts. Desktop left form/right results, mobile stacked. Make explanation, name and starting price strongest; no hero, ratings or decorative badges. Calendar caption uses successful response date. Show explicit quality flag meanings and truthful aggregate modes. Do not expose paths, provider payloads or internal jargon in errors.

### Setup and checks

Reuse locked Node 24/npm dependencies, one Next.js app and CSV, no database/GPU/new accounts/services. npm ci, npm run typecheck, npm test, npm run build, npm start -- --port 3101. Live mode requires a funded OpenAI key/model access and network via the existing server secrets boundary; no key still gives labelled catalogue fallback. No persistent cache or automatic provider retry.

First probe strict evidence on the three dense real profiles before splitting implementation. Reuse unchanged transport checks as historical evidence, not domain evidence. After two meaningful access/model/network/quota failures stop repeating the probe; local work may continue but live acceptance remains blocked. Record sanitized per-card live findings and dataset/source revisions in tasks.md. Verify production and clean checkout using README. P01 preliminary dense evidence does not pass P04/P07 rare/final/timing obligations.

## Risks / Trade-offs

- Literal evidence can still be generic: manually review relevance and distinctiveness, adjust only narrow prompt if necessary.
- Retained failures need restart: deliberate one-attempt contract, explain safe service error without leaking paths.
- UI is intentionally small: optional controls and comparison remain supported by contract but deferred in UI.

## Migration Plan

Commit scoped accepted content on codex/cs-01-slice, normally push/confirm branch. Acquire exclusive shared integration ownership before shared candidate/main writes; verify a clean exact candidate, promote/push main normally, record exact evidence and then sync/archive. Never overwrite unrelated work or claim missing live checks passed. No data migration.
