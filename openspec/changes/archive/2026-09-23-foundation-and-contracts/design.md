## Context

See [proposal](proposal.md), the approved [P00 basis](../../../../.brainstorming/2026-09-23-foundation-and-contracts-design.md), [system](../../../../architecture/system.md), [selection](../../../../architecture/selection-and-explanations.md) and [verification](../../../../architecture/implementation-and-verification.md). Starting revision is fd432c682d46e2a46cb003ddbeb5d4537d19438c, including published preparation 7d611a971e48b89c26776e6f10dbb4f5bfba7ee2. The existing untracked MVP draft was inspected as reference and is not an active implementation change or a publication input.

## Goals / Non-Goals

**Goals:** complete P00 with plain readonly TypeScript, labelled fixtures, focused consistency checks and a pinned base. The user requested all OpenSpec stages, including implementation and archive; the project authorization takes precedence over generated skill stop defaults.

**Non-Goals:** implement any product algorithm, loader, adapter, route or UI; add runtime validation machinery to contracts; claim P01–P07 complete. No delegations or additional services are needed.

## Decisions

### Public contract v1

Materialize the following exact field sets in `contracts/contractor-selection.ts`. All objects/arrays are readonly. JSON contains only these fields; optional fields are absent, not null. Types express structural boundaries; runtime validation is later HTTP work.

| Type | Fields |
| --- | --- |
| RecommendationRequest / NormalizedRequest | city, date, eventFormat, category: string; budgetKzt: number; language?: string; durationHours?: number |
| ComparisonContext | catalogVersion, selectionPolicyVersion: string |
| CatalogOptions | cities, categories, eventFormats, languages: string arrays; dateWindow: {min, max: string} |
| CatalogOptionsResponse | requestId: string; context: ComparisonContext; options: CatalogOptions |
| QualityFlags | synthetic, cityImputed, priceImputed: boolean |
| RecommendationCard | id, name, category, city, explanation: string; priceFromKzt: number; qualityFlags: QualityFlags |
| SelectionSummary | candidateCount, eligibleCount: number; exclusions: {busy, budget, format, language, duration: number}; busyProfileIds: string array |
| RecommendationResponse | requestId: string; normalizedRequest; context; outcome: matched/category_absent/no_match; cards: RecommendationCard array; summary; explanationMode: openai_evidence/mixed/catalog_fallback/not_needed |
| ErrorResponse | error: {code, message, requestId; fields?: array of {field: request key, message: string}} |

GET `/api/catalog/options` returns global unique fixed-string-sorted options and date window 2026-09-23 through 2026-12-31. POST `/api/recommendations` returns all three outcomes with HTTP 200. Errors: INVALID_REQUEST and DATE_OUT_OF_RANGE -> 400; CATALOG_UNAVAILABLE -> 503; INTERNAL_ERROR -> 500. No authentication, pagination, session or client retry contract.

Trim strings; canonicalize option values case-insensitively against global values. Reject unknown fields/options, blank optional strings, numeric strings, null inputs, impossible dates, nonpositive/unsafe integer budgets and nonpositive/nonfinite durations. Real dates outside the fixed window yield DATE_OUT_OF_RANGE. No aliases or moving-today rule. Fresh requestId precedes parsing; malformed JSON is INVALID_REQUEST; syntactically valid JSON gets catalogue 503 before catalogue-dependent validation when unavailable. Safe messages never echo source/provider content.

Comparison tokens are `sha256:` plus lowercase SHA-256 of loaded CSV bytes and `selection-v1`. Change the policy token when normalization, eligibility, exclusion or ordering changes. Browser comparison requires equal tokens and canonical non-date inputs; keep old/new cards and complete busy sets in memory. Errors/superseded responses never replace the last successful baseline. Context changes reset comparison. Retain the four date transitions in the linked selection architecture, including available-card displacement and already-available promotion; do not infer availability from card absence.

Matched has 1–3 cards and positive eligibleCount; category_absent has zero candidates/counts/cards/busy IDs; no_match has positive candidates and zero eligible/cards. Card count is min(eligibleCount,3). Empty outcomes use not_needed. Nonempty modes describe actually rendered quotes: all/some/none = openai_evidence/mixed/catalog_fallback. Candidate count equals eligible plus exclusive first-failure buckets in busy, budget, format, language, duration order. Busy IDs are unique, fixed-string sorted and include every busy city/category candidate. Selection sorts eligible starting price then fixed-string ID; structured fields govern eligibility, null maxHours means inapplicable, not unlimited.

### Module contracts and owners

Coordinator owns the three shared source files and fixtures. No implementation bodies are introduced. `back/domain/types.ts` provides:

- Profile: id, name, city, description strings; categories/eventFormats/languages/busyDates readonly string arrays; priceFromKzt number; maxHours number|null; qualityFlags.
- CatalogSnapshot: profiles, options and catalogVersion. CatalogLoadResult: `{status: ready, snapshot}` or `{status: unavailable, error: {kind: missing|unreadable|invalid}}`.
- SelectionResult: outcome, selectedIds and summary. LoadCatalog: `(path: string) => Promise<CatalogLoadResult>`; Select: `(profiles, normalizedRequest) => SelectionResult`.

`back/recommend/ports.ts` provides EvidenceProfile (id, description, eventFormats, priceFromKzt, languages, maxHours), EvidenceItem (accepted quote or fallback reason no_quote/blank/too_long/multiple_sentences/source_mismatch), EvidenceResult (validated byId mapping or unavailable reason configuration/timeout/provider/invalid_response/invalid_batch), SelectEvidence `(request, selectedProfiles, signal) => Promise<EvidenceResult>`, and Recommend `(request, signal) => Promise<Omit<RecommendationResponse, requestId>>`.

| Future owner/path | Purpose, operation and owned data | Allowed dependencies / verification |
| --- | --- | --- |
| P02 back/catalog/ | loadCatalog, immutable decoded snapshot/global options | filesystem, csv-parse, existing validation, shared types; actual CSV + temporary negative files |
| P03 back/domain/ except types | select, IDs/counts | plain shared types only, no I/O; deterministic dataset/boundary cases |
| P04 back/ai/evidence/ | selectEvidence, validated quote map | injected existing transport and shared ports; controlled failures + live sample |
| Coordinator back/recommend/ except ports | recommend, factual text/modes | injected ready snapshot, select and evidence; no concrete adapters; real connected slice |
| Coordinator back/http/, composition, src/app/ | validation, request IDs, retained startup and adapter wiring; thin framework shell | server modules; production startup/restart, build and real HTTP |
| P06 front/ | form/cards and previous success in memory | React and public contracts only; real backend, keyboard/mobile/desktop |

Loader reads once per caller, with no retries; unexpected faults reject instead of becoming routine unavailable. Composition stores the single shared loading promise before awaiting it, retains ready snapshot or safe failure category, creates fresh 503 responses for each request and does not reread until restart. Expected CSV failures must not crash route import. No AI on catalogue failure. AI secret loading is separately isolated: CONFIG_REQUIRED/CONFIG_FILE_UNREADABLE give unavailable evidence; CONFIG_INVALID_REQUEST and unexpected faults propagate. Existing secrets/transport files remain unchanged.

Evidence accepts at most three selected profiles, with no calendars or unrelated profiles. One six-second deadline includes response consumption, zero retries. Whole-envelope validation and exact ID set precede per-card quote checks. Invalid type/structure/duplicate/unknown/missing IDs or provider failure make the whole batch unavailable. Valid string-or-null items are checked individually: normalized whitespace, <=180 Unicode code points, one clause/sentence, exact substring of that profile's normalized description. Bad quote only affects that card. Returned order never changes local order. Active timeout yields local text; cancellation rejects AbortError with no fallback or retry, without promising billing cancellation. Renderer uses 1–2 factual sentences, attributed quotes, and truthful aggregate modes.

### Fixture and verification approach

Materialize the inspected draft's controlled FX fixture data as `contracts/examples/fixtures.ts`, exporting a literal object checked with `satisfies` shared boundary types. Keep handwritten case data beside it for normalization, all safe loader failures, evidence and comparison boundaries. These are development contracts, not observed provider responses or a verified frontend package. Focused Node tests check DTO relationships and literal fixture consistency, not nonexistent algorithms. Typecheck proves example compatibility. Reuse existing secrets/transport tests unchanged. No generic schema registry or generated clients.

### Setup

Retain pinned package versions and add only exact csv-parse. Minimal tsconfig: strict, no emit, exact optional properties and readonly source types; include future front/src trees without creating them. npm test uses Node's existing test runner; npm run typecheck uses TypeScript. dev/build/start are normal Next.js commands (local hostname 127.0.0.1, default port 3000); no dummy screen merely to pass a build. P00 verifies command readiness, not application launch. README records that distinction.

Organizer needs compatible Node 24/npm and network for lockfile install. Foundation checks need neither keys nor personal sessions. Future live checks require a funded OpenAI key/model access and network using existing private setup. No GPU, Docker, database or second service. Native Node test support avoids another dependency.

## Risks / Trade-offs

- Types cannot enforce all JSON/runtime semantics -> freeze rules/examples here; later HTTP/adapter checks remain required.
- Raw-byte hashing can reset comparisons after harmless formatting -> conservative and avoids semantic-hash machinery.
- Fixture passes could be mistaken for product acceptance -> label every bundle and record live/product checks not_run.
- Unknown demo deadline -> do not restart historical four-hour clock; timing plan below is untimed and must be reconciled before P01.

## Migration Plan

Commit only the P00 allowlist, verify a clean committed candidate in the sibling integration worktree under exclusive ownership, publish feature/main normally, then sync/archive and publish report-only records. No user API or data migration. Preserve the existing draft and other contributors' work. A failed publication leaves an accurate achieved stage, not checked delivery boxes. Keep the foundation branch/worktree after delivery for P01 handoff.

## Downstream plan and live acceptance

P01 sequentially probes the external dependency then real CSV -> selection -> explanation -> HTTP -> first screen. P02 loader, P03 selection and P04 evidence only follow accepted P01. P05 integrates backend and publishes an immutable verified frontend contract. P06 completes the UI against that pin. P07 runs clean install/build/start, real primary scenario, required live quality/timing and integration; P90 is outside scope. These are future groups, not tasks executed by this P00 change.

Untimed estimates: P01 60–80 min, P02/P03/P04 20–35 min each, P05 20–30 min plus package overhead 10–15 min, P06 30–45 min. Base/worktree overhead 10–15 min counted once in P00. Protect 60 min for P07 including 10–20 min integration overhead; latest start is supplied deadline minus 60 min. Actual deadline/remaining budget is unknown; reconcile before P01 and do not promise schedule feasibility.

Mandatory live sample (language/duration omitted): dense Алматы / Ведущий / корпоратив / 2026-10-10 / 1500000 KZT -> HK-88430, HK-29829, HK-27222; rare Алматы / Флорист / свадьба / 2026-10-10 / 500000 KZT -> HK-39372. For each record pass/fail/not_run for literal source, concrete request-relevant style/specialization, factual 1–2 sentence final explanation; all dense texts must differ in substance with names hidden. Pair comparison is inapplicable for rare. Fallback is not a live pass. Record normalized request, ID, reasons, model, dataset revision/hash, source SHA, date/reviewer, overall verdict, no full descriptions/keys/provider payloads. P01 preliminary dense; P04 dense+rare source/relevance/distinctiveness; P07 final renderer/all criteria. Reuse unchanged sufficient evidence; timing calls can supply the same samples. P00 status for every live criterion: not_run.
