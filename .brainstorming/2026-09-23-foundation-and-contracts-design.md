# P00 — Foundation and contracts

## Purpose and status

This document is the brainstorming basis for the P00 proposal, requested on 2026-09-23. It refines only [00-foundation-and-contracts](../.proposals/00-foundation-and-contracts.md), under the [shared implementation plan](../.proposals/README.md). The architectural path applies because P00 establishes interfaces used by several modules. The already [approved product direction](2026-09-23-contractor-selection-architecture-design.md) is retained; provider strategy and product scope are not reopened.

The user authorized creating this new document. That does not establish acceptance of a working P00 implementation or approval of every new contract detail. This is a planning result for review and transfer into OpenSpec, not a second task board. No application implementation, dependency installation, live call, worker dispatch or publication is part of this request.

## Source context and observed starting point

- [System architecture](../architecture/system.md) defines the single application, module boundaries and organizer setup.
- [Selection and explanations](../architecture/selection-and-explanations.md) defines normalization, selection, evidence, cancellation and visible modes.
- [Implementation and verification](../architecture/implementation-and-verification.md) defines the first real scenario and data-derived acceptance cases.
- [Domain index](../domain/README.md) and [data contract](../domain/data-contract.md) retain source requirements and dataset facts.
- [Secrets task card](../openspec/changes/unified-local-secrets/tasks.md) and [transport publication record](../openspec/changes/openai-response-adapter/tasks.md#preparation-baseline-publication) distinguish historical holds from the subsequent authorization and published preparation.

Read-only inspection in this request found branch `codex/cs-00-foundation` at `fd432c682d46e2a46cb003ddbeb5d4537d19438c`, in `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-00`. The preparation record reports source baseline `7d611a971e48b89c26776e6f10dbb4f5bfba7ee2` published to main, with 4 secrets and 6 transport checks passing in an isolated checkout. These are historical results, not tests rerun here; the current remote head was not checked.

An untracked `openspec/changes/contractor-selection-mvp/` draft already exists, including proposal, design, specs and contract examples. It was left unchanged. Its existence does not prove approval, strict validation or readiness. A later OpenSpec step must reconcile it rather than blindly create a duplicate or overwrite another author's work. The observed package manifest has pinned dependencies but no application scripts and no `csv-parse` dependency.

## Goal and scope boundary

P00 prepares one implementation-ready product change, exact shared interfaces/examples and a reproducible committed base for P01. The coordinator owns it.

Permitted future P00 work is limited to product OpenSpec artifacts, `contracts/`, `back/domain/types.ts`, `back/recommend/ports.ts`, necessary shared configuration/dependencies and an explicitly selected existing preparation baseline. The concrete file set must be recorded before Git writes.

P00 does not implement selection algorithms, CSV loading, evidence extraction, recommendation orchestration, HTTP routes or screens. It specifies their boundaries. Existing secrets and transport implementations are reused; changing them requires reconciliation with their owners. Brev, GPU work, NVIDIA experiments, new services, databases, caching, booking and account workflows are excluded. P01–P07 appear only as dependency and acceptance planning within the one product change; this document does not authorize executing them.

## Approaches considered

| Approach | Trade-off | Decision |
| --- | --- | --- |
| Freeze shared JSON and module boundaries in P00; verify a real slice in P01 | A small up-front contract cost prevents incompatible provider/consumer assumptions | Recommended; matches the existing decomposition |
| Let each module define its own fields during implementation | Faster individual starts, but normalization, date comparison and failure shapes diverge | Reject; contradicts the agreed handoff boundary |
| Add generated clients, a schema registry or a generic integration framework | More tooling and setup without a demonstrated acceptance need | Reject; plain types and minimal shared examples are sufficient |

The recommendation implements the documented boundary-first approach without adding another infrastructure layer.

## Public contract decisions for proposal transfer

Use framework-independent JSON types owned by the coordinator. Freeze their exact fields and examples in OpenSpec and then materialize them in P00; a list of type names alone is insufficient.

| Surface | Required content |
| --- | --- |
| `GET /api/catalog/options` | `requestId`, global city/category/format/language options, fixed supported date window and comparison context |
| `POST /api/recommendations` input | Required `city`, `date`, `eventFormat`, `category`, `budgetKzt`; optional `language`, `durationHours` |
| Successful recommendation | `requestId`, `normalizedRequest`, `context`, `outcome`, `cards`, `summary`, `explanationMode` |
| Card | String `id`, `name`, selected `category`, `city`, integer `priceFromKzt`, `explanation`, `qualityFlags` with `synthetic`, `cityImputed`, `priceImputed` |
| Summary | `candidateCount`, `eligibleCount`, exclusive `exclusions` buckets for busy/budget/format/language/duration, and `busyProfileIds` for the complete city/category candidate set |
| Error | `{error: {code, message, requestId}}`, with optional field details; safe messages without source/provider contents |

The three HTTP 200 outcomes remain `matched`, `category_absent`, `no_match`. Explanation modes remain `openai_evidence`, `mixed`, `catalog_fallback`, `not_needed`, determined by actually rendered evidence. Empty outcomes have no cards and use `not_needed`. Cards contain at most three profiles; candidate count equals eligible count plus exclusive exclusion counts. No descriptions or full calendars are sent to the browser.

Strings are trimmed and option values canonicalized case-insensitively against global catalogue values. Reject unknown fields/options, invalid numeric types and invalid calendar dates. Budget is a positive safe integer in KZT; duration is a positive finite number. Optional absent inputs remain omitted, never `null`; internal `maxHours: null` retains its separate meaning of inapplicable presence duration. Dates use `YYYY-MM-DD` within 2026-09-23 through 2026-12-31. Do not add fuzzy aliases or a moving-today rule.

Errors retain HTTP 400 for `INVALID_REQUEST` / `DATE_OUT_OF_RANGE`, 503 for `CATALOG_UNAVAILABLE`, and 500 for safe `INTERNAL_ERROR`. Generate a fresh request ID per HTTP request. Malformed JSON is a request error; when the catalogue is unavailable, syntactically valid POST JSON receives the catalogue 503 before catalogue-dependent validation.

### One concrete date-comparison context

Recommend `normalizedRequest` in every successful recommendation plus `context: {catalogVersion, selectionPolicyVersion}` in both successful operations. Use `sha256:` plus the lowercase hash of loaded CSV bytes for the catalogue token and `selection-v1` for the initial policy token; clients treat both as opaque equality values. Change the policy token when normalization, eligibility, exclusion or ordering semantics change.

The browser compares previous/current successful canonical inputs only when all non-date fields and both tokens match. It keeps old/new cards and complete busy-ID sets in memory. This supports becoming busy, becoming available, displacement by price/ID and promotion of an already available candidate, without exposing calendars. Changed context resets comparison; errors and superseded responses do not become successful baselines. No server session or persistent history is required. Raw-byte hashing can reset comparison after harmless source formatting changes; this conservative behavior is acceptable and avoids semantic hashing machinery.

## Module contracts and ownership

| Owner / boundary | Operation and owned result | Dependencies and verification obligation |
| --- | --- | --- |
| Coordinator: `contracts/`, `back/domain/types.ts`, `back/recommend/ports.ts` | JSON/domain data types and evidence port; minimal success/material-error examples | Plain types/data, no UI/provider/storage implementations; examples agree across consumers |
| P02: `back/catalog/` | `loadCatalog(path)` returns immutable snapshot with global options and catalogue version, or typed expected failure | Filesystem, parser, existing validation and public domain types; actual CSV and negative temporary files |
| P03: `back/domain/` except shared types | `select(profiles, normalizedRequest)` returns ordered IDs, counts, exclusive exclusions and busy IDs | Pure functions/public types; deterministic dataset cases and boundaries |
| P04: `back/ai/evidence/` | `selectEvidence(request, selectedProfiles, signal)` returns an exact ID mapping of accepted quotes/per-card fallback, or typed batch unavailable | Existing transport and public port; batch/quote failures and live relevance checks |
| Coordinator: `back/recommend/` except shared port | `recommend(request, signal)` returns public result data using an injected ready snapshot, selection and evidence | No concrete adapter imports; real connections verified in later stages |
| Coordinator: composition and HTTP, later P05 | Wire adapters, retain catalogue state, validate requests, attach request IDs and format HTTP | Startup/failure isolation and production-route checks |

Profiles, requests and snapshots are readonly across boundaries. Pure selection has no I/O. The loader has no retries; expected failures are typed safe categories `missing`, `unreadable`, `invalid`, while unexpected faults remain errors. Evidence performs at most one call for up to three selected profiles, with one six-second deadline including response consumption and no automatic retry. Cancellation propagates through the use case to the provider attempt; it does not trigger fallback work for an abandoned caller or guarantee cessation of provider billing.

Validate the entire evidence envelope and exact selected ID set before per-card quotes. Invalid identity/structure or provider failure makes the whole batch unavailable. In a valid batch, null/blank/overlong/multiple-sentence/source-mismatched quotes fall back only for their own cards. Timeout for an active caller produces honest local text. Neither fallback changes selected IDs or order. Existing secret-reader configuration errors are isolated in AI setup as already specified by the system architecture.

### Retained catalogue failure

Composition stores one shared loading attempt per process before awaiting it; concurrent first requests use the same attempt. Its retained state is `ready(snapshot)` or `unavailable(safe category)`. Expected CSV failure must not escape route import as an unhandled rejection or prevent the HTTP server from remaining available.

For missing, unreadable or invalid CSV, both endpoints return fresh-request-ID 503 responses as above, without invoking AI. Retain the category, not file contents or a prebuilt HTTP response. Further requests do not reread the file; repair requires restart. Never classify unexpected programming faults as routine catalogue unavailability. P02 owns the typed loader outcome; P05 owns retention, response formatting and the production startup/restart check.

## Examples and acceptance evidence to carry forward

P00 supplies minimal shared examples for all three outcomes and four explanation modes, request normalization/omission, material HTTP errors, loader success/failure, pure-selection results and evidence batch/per-card failures. Clearly label handcrafted examples as fixtures. These are development contracts; the verified immutable frontend package belongs to P05 after backend verification.

Carry the P00 card's mandatory live sample into OpenSpec unchanged:

- Dense: Алматы / Ведущий / корпоратив / `2026-10-10` / `1500000` KZT; `HK-88430`, `HK-29829`, `HK-27222`.
- Rare: Алматы / Флорист / свадьба / `2026-10-10` / `500000` KZT; `HK-39372`.
- Omit language and duration in both requests.

For each card record `pass`, `fail` or `not_run` for literal source validity, a concrete request-relevant style/specialization fact, and a factual 1–2 sentence final explanation. All three dense explanations must additionally differ in substance with names hidden; that comparison is inapplicable to the single rare card. Fallback is not a passing live quote. Store normalized request, card ID, reasons, model, dataset revision/hash, source SHA, date/reviewer and overall verdict without keys, full descriptions or provider payloads. Reuse valid existing evidence when executable content, prompt, model, data and rendering are unchanged. Timing requests may also supply this sample; do not require duplicate calls or silently choose the best retry.

P01 supplies the preliminary dense probe and first complete text. P04 checks source/relevance/distinctiveness for dense and rare; P07 confirms the final renderer and complete set. P00 records these obligations, not passing execution results.

## Reproducible base and organizer constraints

Retain the declared Node.js / Next.js / React / TypeScript stack and `back/` / `front/` split. The intended run is one local application at `127.0.0.1:3000`. P00 adds only the necessary `csv-parse` dependency, lockfile update and minimal actual build/typecheck/test/run configuration. Resolve concrete technology API/configuration questions through Context7 at that step; this documentation pass introduces no new API recipe.

Organizer setup requires compatible Node.js/npm, lockfile installation, repository CSV, and network access for installation and live OpenAI. Reuse the existing private environment setup and transport. Live checks require a funded key with model access; no free-use or cost-cap promise is made. No GPU, Docker, database, second service or additional cloud account is needed. Missing AI configuration permits visibly local explanations but cannot satisfy live acceptance. P07 will document and verify the actual resulting installation/configuration/build/launch commands through project-delivery.

Before handing P01 a base, reconcile owners, stage tables, historical evidence and effective holds; retain the documented supersession of the old preparation-publication prohibition. Record the exact selected files and committed SHA, remote, harness revision and required tools. An existing preparation commit does not establish a completed P00 contract base. Never include unrelated untracked work by default. If a current restriction prevents a commit, record the handoff blocker and continue only authorized local work.

## OpenSpec transfer and completion boundary

The next planning step uses the local standard-schema `contractor-selection-mvp` change. Inspect its actual status and existing draft before creating or revising artifacts. Link this P00 basis and the approved product brainstorming outcome from the proposal; transfer the architecture's detailed policies coherently into specs/design and the P00–P07 groups into tasks with stable IDs, scenario links, file owners, dependencies and the project stage table.

P00 acceptance requires strict OpenSpec validation, consistent exact DTO/module types and materialized examples, recorded catalogue-failure/live-sample policies, actual tool/dependency readiness, and a pinned reproducible handoff base. Structural validation alone is not application acceptance. Intermediate handoff requires sufficient checks tied to exact content, the previous writer stopped, a named next owner and no material dependency blocker. It does not require prematurely marking tasks integrated; `[x]` retains the project's final publication meaning.

The current implementation/demo deadline and remaining time are unknown. The earlier four-hour statement must not restart a clock. Before P01, record actual timing, stage estimates, separate base/worktree and package/integration overhead, and a concrete protected P07 reserve/latest start using the shared plan. This missing timing does not block writing this document. Do not invent times or readiness evidence.

P01 starts from accepted P00 and verifies the external AI risk plus one real end-to-end scenario sequentially. P02–P04 do not start before that checkpoint. No worker is dispatched by this brainstorming result.

## Document verification

This request checks consistency with P00 and its linked architecture, local Markdown link targets, scope boundaries and preservation of existing files. Application tests, live AI, dependency readiness, OpenSpec strict validation, remote publication and independent-worktree readiness are not claimed by this document. The new file is the sole intended output; later OpenSpec artifacts own active implementation decisions and task state.
