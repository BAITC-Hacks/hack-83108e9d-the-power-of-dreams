# P04 — Validated AI evidence

## Purpose and status

On 2026-09-23 the user requested a brainstorming file for [P04](../.proposals/04-evidence-module.md), with clarification of material ambiguities. This architectural refinement retains the [approved product direction](2026-09-23-contractor-selection-architecture-design.md), frozen P00 interfaces and the existing P01 implementation. It introduces no new provider, ranking policy or product feature.

This document is a planning basis for review and OpenSpec transfer. Creating it does not execute P04, accept P01, authorize a new live call or establish publication. Active requirements, assignments and stages belong in OpenSpec. No material product question requires reopening the agreed scope; implementation readiness must still be reconciled from current evidence.

## Sources and observed baseline

- [P04 proposal](../.proposals/04-evidence-module.md) and [shared plan](../.proposals/README.md): scope, dependencies and ownership.
- [Selection and explanations](../architecture/selection-and-explanations.md#ai-response-validation-boundary): batch versus per-card validation, grounding, cancellation and visible modes.
- [Archived P00 design](../openspec/changes/archive/2026-09-23-foundation-and-contracts/design.md), [current foundation specification](../openspec/specs/contractor-contract-foundation/spec.md) and [evidence port](../back/recommend/ports.ts): materialized boundary.
- [P01 planning outcome](2026-09-23-first-working-slice-design.md), [archived task card](../openspec/changes/archive/2026-09-23-first-working-slice/tasks.md), [existing evidence adapter](../back/ai/evidence/select.ts) and [controlled checks](../scripts/slice/contracts.test.mjs): existing behavior and historical verification.
- [Current first-slice specification](../openspec/specs/contractor-first-working-slice/spec.md): synchronized requirements after P01 acceptance and archive.
- [Existing transport](../back/ai/openai.mjs) and [transport task card](../openspec/changes/openai-response-adapter/tasks.md): transport responsibility and recorded evidence.

The accepted product baseline is `8aaad189393be78a21f1793afd2014c55794f7cd`. It already contains `createSelectEvidence`, `validateEvidence`, the renderer and controlled P01 checks. The user requested reconciliation after integrating P01 into the current branch. At that follow-up, HEAD was `907468aebabb6e5d20c55656a17534ce186a6862`, with a tracked tree identical to archive commit `470f674750eaff16c851d3f4414eab6150b68e37`. Comparison against the accepted product baseline found no changes in `back/`, `contracts/`, `scripts/slice/`, `scripts/openai/`, the CSV or package/lock files. P04 must extend the implementation only where criteria or evidence remain unmet, rather than recreate it.

The final P01 card records all four tasks integrated, 21/21 combined checks, clean build/start, a dense live pass and a production browser result in 2968 ms at candidate `8aaad189393be78a21f1793afd2014c55794f7cd`. It records exact feature/main publication and that P01 stopped writing transferred module paths, making that SHA the accepted common P02–P04 base. Preliminary history retains three failed quality probes followed by a narrow prompt repair. These are recorded results, not checks or remote verification rerun here. Rare/final quality and the final timing series remain open downstream.

The proposal index predates the separate P00 and now-archived `first-working-slice` changes. Reconcile current change placement and ownership before OpenSpec writes; do not blindly create the historical proposed MVP change. The P01 card records a subsequent user decision to control scheduling and supersede earlier deadline/reserve requirements. This planning document neither restarts a clock nor requests another schedule decision.

## Goal, approach and alternatives

P04 returns trustworthy, profile-specific excerpts for the already selected IDs, or explicit fallback facts. The model contributes excerpt selection; deterministic code retains authority over eligibility, ordering, factual rendering and validation.

| Approach | Trade-off | Decision |
| --- | --- | --- |
| Extend the existing one-batch extractor behind the frozen evidence port | Reuses working transport, validator and checks; keeps failure behavior small and explicit | Retain the agreed approach |
| Ask the model to write complete explanations or select contractors | Requires validating invented claims and changes selection authority | Outside the agreed architecture |
| Add a second evaluator, provider failover or per-card repair requests | Adds latency, cost and failure paths; violates the one-call budget | Excluded from P04 |

Keep ordinary module functions and the existing injected transport. No provider framework, prompt-management service, embedding index, persistent cache, queue or additional dependency is justified.

## Public operation and ownership

The frozen operation is `selectEvidence(request, selectedProfiles, signal): Promise<EvidenceResult>`, using a canonical `NormalizedRequest`, readonly `EvidenceProfile` records and the caller's `AbortSignal`.

Each profile contains only `id`, `description`, `eventFormats`, `priceFromKzt`, `languages` and `maxHours`. The normal caller supplies one to three distinct selected IDs. Preserve P01's defensive behavior: an empty input returns a validated empty mapping without a provider call; more than three profiles or duplicate input IDs return `unavailable/invalid_batch` without a call. An already cancelled caller receives `AbortError` before either outcome.

| Outcome | Meaning |
| --- | --- |
| `validated`, with `byId` | Exact selected-ID mapping; every value is `accepted` with a normalized quote or `fallback` with a per-card reason |
| `unavailable` | Entire batch cannot supply evidence; safe reason is `configuration`, `timeout`, `provider`, `invalid_response` or `invalid_batch` |
| Rejected `AbortError` | Caller cancelled; stop processing rather than create fallback for an abandoned request |

Per-card reasons remain `no_quote`, `blank`, `too_long`, `multiple_sentences` and `source_mismatch`. These are internal facts, not HTTP responses or user-facing diagnostic prose. Unexpected programming faults must not become ordinary successful fallback results.

After accepted P01 handoff, one P04 owner may change `back/ai/evidence/` and colocated checks. Public ports, domain types, `contracts/`, transport, secrets, composition, renderer, HTTP, UI, package files and shared OpenSpec state remain with their existing owners. Changes needed there go through the coordinator. Existing shared P01 checks are reused; P04 does not independently edit their coordinator-owned location.

Production dependencies are the public evidence/domain/JSON boundaries and the injected existing transport. Evidence never imports catalogue implementations, reads CSV or credentials, changes selected IDs, sorts recommendations or owns persistent data. Inputs remain unchanged.

## Request and prompt

Retain one non-streaming batch request through the existing transport. Send the canonical request and only the selected profiles' necessary facts and descriptions. Never include the complete catalogue, full calendars, filesystem paths or credentials. Descriptions are untrusted source data; instructions embedded in them are never authoritative.

Retain P01's narrow prompt and its `literalSentenceChoices`, derived from those same descriptions. These choices help literal extraction; they are not a second source, precomputed ranking or proof of relevance. A quote still has to pass validation against its own full description. Do not change the prompt merely for style: a change invalidates affected live evidence and needs a concrete quality reason.

Ask for one short contiguous excerpt conveying a concrete working style or specialization relevant to the requested event format. Preserve source wording, case and punctuation. Prefer a useful clause or sentence; allow `null` when no suitable excerpt exists. Avoid names as justification, generic praise, client lists, superlatives, invented user preferences and claims about price, location, languages, hours or availability competing with structured facts.

The output envelope remains `{items: [{id, evidenceQuote}]}` with required fields and no extras; each quote is string or null. The strict structural schema covers shape and types. Quote length, sentence and source checks remain per-card rules rather than structural constraints that reject the entire batch.

## Validation and failure boundary

Validate in two stages, completing the first for every item before accepting any quote.

| Stage | Rule | Failure scope |
| --- | --- | --- |
| Transport/provider | Response must be complete and usable; existing transport handles refusal, missing content and response status | Whole batch; never salvage a truncated prefix |
| JSON | Parse the entire returned text | Whole batch, `invalid_response` |
| Envelope/items | Exact object keys, array envelope, required string IDs and string-or-null quotes, expected item count | Whole batch, `invalid_batch` |
| Identity | Returned IDs equal the selected ID set exactly, without duplicates, unknown or missing IDs | Whole batch, `invalid_batch` |
| Quote | Validate each string against its own source after the complete batch is trusted | Only that card; preserve valid neighbors |

Provider array order is irrelevant. Consumers look up evidence by ID and retain local selection order. Use a mapping that safely handles arbitrary string IDs, as the current implementation does.

Normalize quote and source identically: collapse whitespace runs to one space and trim outer whitespace. Preserve other characters; do not lowercase, rewrite punctuation, remove accents, join separate excerpts or use fuzzy matching. The accepted normalized quote must be a contiguous, case-sensitive substring of that ID's normalized description.

Retain the implemented 180-Unicode-code-point boundary after normalization: 180 passes and 181 fails. Null becomes `no_quote`; an empty normalized string becomes `blank`. Reject multiple sentences before source acceptance. The current validator uses a conservative punctuation heuristic and the prompt avoids internal sentence-ending punctuation. This is not a linguistic parser; record focused observed sentence cases and limitations, and repair a reproduced acceptance defect within scope rather than adding NLP infrastructure. Source matching and sentence detection alone do not establish semantic quality.

The existing adapter maps `OPENAI_TIMEOUT` to `timeout` and other non-cancellation transport failures to `provider`; malformed generated JSON and invalid batches are classified locally. Missing configuration is handled by composition's unavailable adapter. Preserve the frozen outcomes; do not invent finer error fields or duplicate configuration loading.

## Deadline, cancellation and side effects

Retain `store: false`, the initial output limit of 450 tokens, zero automatic retries and one six-second transport deadline covering request and response-body consumption. The existing transport owns that deadline; no nested mechanism may restart or extend it. Evidence has at most one outbound call and no compensating call after a failure or cancellation.

Check caller cancellation before starting and after the await, including error handling. Cancellation wins over a simultaneously observed timeout or provider result and rejects with `AbortError`. An active caller's timeout yields whole-batch unavailability so the use case can render local facts. Aborting attempts to stop upstream work but does not guarantee that provider processing or billing stopped.

P05 owns factual rendering and the aggregate `explanationMode`, based on quotes actually included in cards: all accepted means `openai_evidence`, some means `mixed`, none means `catalog_fallback`; no cards means `not_needed`. P04 supplies accurate per-ID facts and never labels local fallback as AI evidence. P07 retains final rendered-text acceptance.

Do not log prompts, descriptions, quotes, provider bodies or keys. Existing permitted operational metadata is sufficient: request ID, operation, duration, mode, error category and available usage. No new logging layer is required.

## Verification plan and reuse

First reconcile existing P01/transport evidence with the pinned code, prompt, data and model. The inspected root `npm test` already includes `scripts/slice/contracts.test.mjs`; creating another colocated suite does not automatically add it to that command. Record and execute its explicit command, or have the coordinator update the shared script when needed. Reuse current facilities; do not create a generic runner or duplicate passing checks without a distinct evidence gap.

| Criterion | Required observation |
| --- | --- |
| Batch boundary | Invalid JSON, extra/missing fields, wrong types/count, duplicate/unknown/missing IDs invalidate the entire batch |
| Per-card boundary | Null, blank, overlong, multi-sentence and non-source quotes affect only their own cards; valid neighbors survive |
| Source and length | Consistent whitespace, own-source matching and the 180/181 code-point boundary; no fuzzy acceptance |
| Identity/order | Reordered provider items retain local selected order and exact mapping |
| Call discipline | One call for a valid nonempty batch; no calls for empty/invalid input or pre-cancellation; no retry after any outcome |
| Cancellation/failures | Before/during/post-await cancellation propagates as `AbortError`; active timeout/provider failure yields batch unavailability; unexpected faults remain errors |
| Transport obligations | Reuse matching transport evidence for refusal, incomplete response, body deadline, `store:false` and no retry; verify boundary mapping where evidence is missing |
| Prompt/data boundary | Only allowed selected-profile data reaches the transport; embedded source instructions remain data; no tools or full calendars are introduced |
| Consumer contract | Existing typecheck and applicable controlled validator/renderer checks preserve IDs, public projection and actual explanation modes |

Controlled responses prove behavior, not live semantic quality. No tests or provider calls were run while creating this document.

### Reconciled P01 coverage and remaining P04 work

The following assessment combines inspection of the unchanged implementation/checks with recorded P01 acceptance. It does not report a new test execution or replace OpenSpec task stages.

| Area | Evidence already available | P04 action |
| --- | --- | --- |
| Batch/per-card validation | P01 controlled checks execute pinned identity and quote-failure cases through the validator and renderer; malformed JSON, structural/type errors and all-null output are also covered | Reuse; add only a missing required case or a reproduced defect check |
| Source and length | Explicit checks for whitespace normalization, another profile's source rejection and 180/181 Unicode code points | Reuse unchanged evidence |
| Cancellation and timeout fallback | P01 covers pre-cancellation, cancellation during success/error, provider cancellation and active timeout with unchanged real IDs/order | Reuse; do not rebuild cancellation handling |
| Transport budget and response handling | Existing transport checks cover strict-schema forwarding, 450 tokens, `store:false`, no HTTP-error retries, malformed/incomplete/refused responses and a deadline including body consumption | Reuse at the unchanged transport revision |
| Input projection and modes | P01 checks selected IDs, omission of calendars/name/city from provider profiles, one-call behavior and renderer modes across failures | Preserve the existing projection and renderer boundary |
| Dense live quality | Accepted clean-candidate record contains source/relevance/final-text verdicts for all three IDs and names-hidden distinctiveness | Reuse while code, prompt, request, model and data remain pinned; this merge alone does not justify another paid probe |
| Rare live quality | No accepted `HK-39372` live result is recorded | Execute the agreed florist case during authorized P04 work and record source/relevance verdicts; repair only a demonstrated failure |
| Remaining narrow boundary evidence | Defensive empty/duplicate/over-three input behavior and unexpected-error propagation are visible in code; the inspected P01 suite does not explicitly exercise all of them | Close required evidence gaps with focused checks; preserve working behavior |
| Final rendering and timing | P01 has individual browser observations, not the complete P07 quality/timing set | Keep final renderer acceptance and the three uncached timing requests with P07 |

Provider-item reordering remains an explicit P04 acceptance criterion: inspect the pinned examples before adding a check and reuse one if it already covers this case. No outstanding item above establishes a need to rewrite the adapter, loosen quote validation or change the successful prompt in advance.

### Mandatory live quality sample

Retain the [P00 live acceptance set](../.proposals/00-foundation-and-contracts.md#минимальная-live-проверка-ai), omitting language and duration:

| Case | Request | Selected IDs |
| --- | --- | --- |
| Dense | Алматы / Ведущий / корпоратив / `2026-10-10` / `1500000` KZT | `HK-88430`, `HK-29829`, `HK-27222` |
| Rare | Алматы / Флорист / свадьба / `2026-10-10` / `500000` KZT | `HK-39372` |

For all four cards, record `pass`, `fail` or `not_run` for literal source validity and concrete request-relevant style/specialization, with the actual supporting fact. The dense three must differ in substance with names hidden; a different name or price is insufficient. The single rare card has no pairwise distinction requirement. Fallback is a resilience success, never a passing live quote.

P01 records a dense pass with facts about intelligent humour/organization, entertainment/dancing, and European presentation/respect for traditions. Reuse it only after establishing that the tested prompt, executable content, input, model and dataset match the accepted baseline. Its historical record does not close the rare case. P07 separately confirms final factual 1–2 sentence rendering and the complete live set; source matching alone cannot close that gate.

Record normalized request, ID, criterion verdict/reason, model, dataset revision/hash, tested source SHA, date/reviewer and overall outcome in the existing OpenSpec task card. Keep full prompts, provider payloads and full descriptions out of the record. A narrow prompt repair requires rechecking affected live cases and recording prior failures; do not silently select the best retry. Sufficient final timing calls may also supply quality evidence instead of duplicating paid requests.

## Organizer setup and handoff

Use the existing Node.js/npm environment, installed locked dependencies, local application and supplied CSV. Offline boundary checks require no credentials or paid calls. Live evidence requires network access and a funded OpenAI key with access to the configured model, loaded only through the existing server setup. The current default is `gpt-4.1-mini-2025-04-14`; record any configured override because it affects evidence reuse. No new account, database, Docker, GPU, second service or manual upload is needed. Do not promise a cost ceiling or measured latency from the design budget.

P01's archived card already identifies accepted common base `8aaad189393be78a21f1793afd2014c55794f7cd`, public contract v1 and cessation of writes to transferred module paths. Before implementation dispatch, verify that these pins and ownership remain current and check worktree/harness readiness. If the coordinator chooses a later documentation-only base, record that common choice for P02–P04 instead of silently changing one worker's base. The planned branch is `codex/cs-04-evidence`, in `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-04`; verify availability before creation. No future owner or acceptance result is invented here.

Link this outcome from the appropriate OpenSpec proposal and transfer its scope, operations, failure rules, checks and setup assumptions into specs/design/tasks. Preserve completed work and unmet publication conditions. This document creates no worker, worktree, integration reservation or separate task board.

Return met/remaining criteria, actual controlled and live checks, skips, contract revision and tested/committed/published SHAs as applicable. Report a reproduced shared-transport defect to its owner through the coordinator without editing that file. P05 owns backend integration and P07 final acceptance. If existing P01 behavior already meets a criterion with sufficient evidence, reuse it without rewriting code or creating an empty commit.

## Document verification

This file was reviewed against P04, materialized P00 ports, current P01 implementation/checks, synchronized specification and recorded evidence for scope and consistency. The follow-up verified tracked-tree equality between the current merge and the P01 archive revision, and unchanged P04-relevant executable/data content against the accepted product SHA. Local Markdown file targets were checked. Unchanged application tests and paid live calls were not repeated for this documentation update; fresh P01 acceptance, remote state and publication are not claimed. This brainstorming file is the sole intended output; existing P02/P03 drafts and other contributors' files are preserved.
