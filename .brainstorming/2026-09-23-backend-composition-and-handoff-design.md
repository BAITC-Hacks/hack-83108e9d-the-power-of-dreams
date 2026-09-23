# P05 — Backend acceptance and frontend contract handoff

## Approved outcome and scope

On 2026-09-23 the user approved completing [P05](../.proposals/05-backend-composition-and-handoff.md) by reconciling existing implementation and evidence, closing missing backend acceptance cases, making only demonstrated repairs, and publishing a pinned frontend contract package. The user also approved reusing sufficient live evidence instead of automatically adding another paid OpenAI request to P05.

This document is the approved brainstorming outcome for later OpenSpec transfer. The current request is planning and document creation only. It does not start implementation, delegation, worktree changes, provider calls, contract publication or main promotion. Active requirements and task stages will belong to the subsequent OpenSpec change; this file preserves the agreed direction rather than becoming a second task board.

The coordinator owns this bounded integration work sequentially. No extra service, account, database, dependency, generic dependency-injection framework, generated client or replacement backend is justified. Public v1 DTOs, module ports, selection policy, dataset and provider strategy remain the baseline. UI completion and date-change wording belong to P06; final browser/live/timing and submission acceptance belong to P07.

## Sources and observed baseline

- [P00 design](../openspec/changes/archive/2026-09-23-foundation-and-contracts/design.md): frozen public and internal interfaces, normalization, catalogue lifecycle and error precedence.
- [Current slice specification](../openspec/specs/contractor-first-working-slice/spec.md) and [P01 evidence](../openspec/changes/archive/2026-09-23-first-working-slice/tasks.md): existing end-to-end behavior and historical dense live/browser acceptance.
- [P02 evidence](../openspec/changes/archive/2026-09-23-catalog-module/tasks.md), [P03 evidence](../openspec/changes/archive/2026-09-23-selection-domain/tasks.md), [P04 evidence](../openspec/changes/archive/2026-09-23-validated-ai-evidence/tasks.md): accepted module checks, combined candidates and recorded publication.
- [Public DTOs](../contracts/contractor-selection.ts), [examples](../contracts/examples/README.md), [domain types](../back/domain/types.ts) and [recommendation ports](../back/recommend/ports.ts): actual boundary definitions.
- [Composition](../back/composition.ts), [recommendation use case](../back/recommend/recommend.ts), [HTTP handlers](../back/http/handlers.ts), [normalization](../back/http/normalize.ts), [slice checks](../scripts/slice/contracts.test.mjs): existing behavior and executable coverage.
- [Verification scenarios](../architecture/implementation-and-verification.md#data-derived-rehearsal-cases), [domain entry point](../domain/README.md) and [P06 proposal](../.proposals/06-frontend-flow.md): source expectations and consumer needs.

The inspected primary checkout is `main` at `b658175d5c73020f65893396ad0fb1bb432fe2c6`, with no pre-existing working-tree changes observed. It already contains the combined P02/P03/P04 candidate `a8cefb933bdededdf013fe8a196df956ac2ae352`. Comparing that candidate with HEAD found no differences in `back/`, `contracts/`, `src/`, package/lock files or `scripts/`.

The P03 archive records 36/36 combined checks, successful typecheck/build, clean installation, and production HTTP dense/empty checks for that exact candidate, followed by confirmed publication. These are historical execution records, not fresh passes in this planning session. The current primary checkout lacks the installed `csv-parse` dependency; no application tests were run or dependencies installed during this review.

The canonical proposed `contractor-selection/versions/v1/` directory was absent at inspection. Its availability must be checked again before publication. The proposed integration worktree already exists at `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-integration`, on `codex/p04-integration` at `6f59353`. It is not an empty location to overwrite or silently retarget. The implementation coordinator must reconcile its owner, processes, branch, current files and base under the shared reservation before using it.

The original proposal describes merging P02–P04 as future work. The current baseline has already done that. Verify ancestry and accepted content when implementation starts; do not repeat those merges. Earlier deadline/reserve language in historical planning was superseded by the user's schedule-control decision recorded in P01 and the architecture index; it does not create a new scheduling gate.

## Approach and alternatives

**Selected: acceptance-led completion of the existing backend.** Map every P05 criterion to sufficient recorded evidence or a specific remaining check. Keep passing behavior, repair only reproduced failures, then package the exact accepted public interface for P06.

A backend redesign would reopen already accepted boundaries without a demonstrated requirement. Packaging alone would leave process-lifecycle and configuration-integration evidence incomplete. Neither alternative is warranted by the observed code and task cards.

## Runtime boundaries to preserve

| Owner / component | Public operation, inputs and outputs | Owned state, dependencies and verification |
| --- | --- | --- |
| Coordinator: `back/composition.ts` | `createServices(path, load, evidenceFactory)` returns a retained service getter; production `getServices` connects real adapters | One promise and immutable catalogue result per Node process, including failures. Only composition instantiates concrete catalogue/AI adapters. Verify real lifecycle and isolated configuration cases. |
| Coordinator: `back/recommend/`, excluding frozen ports | Injected snapshot + selection + evidence produce `Recommend(request, signal)` and a response without requestId | Request-local cards and modes. Depend on pure domain contracts and injected operations, not CSV/provider parsers. Verify stable IDs, truthful text and modes through the connected flow. |
| Coordinator: `back/http/` | Options handler; recommendation handler accepting a Request; normalization against catalogue options | Fresh requestId, validation and response formatting. No eligibility/ranking logic or retained user history. Verify public bodies/statuses and safe faults. |
| Coordinator: thin `src/app/api/` routes | Existing GET `/api/catalog/options` and POST `/api/recommendations` | Framework entrypoints call shared handlers/services. Verify actual production HTTP startup, requests and restart. |
| Existing P02/P03/P04 modules | `loadCatalog`, `select`, `SelectEvidence` under frozen ports | Preserve accepted module ownership and behavior. A failure requiring changes outside P05's scope goes back to the coordinator for scoped reconciliation. |
| Coordinator: versioned contract package | Read-only consumer snapshot tied to backend and package commits | Public DTOs, examples and consumer instructions only. Verify content, references and the canonical pin before P06 starts. |

GET returns catalogue options and comparison context. POST parses JSON, obtains the retained catalogue, normalizes valid input, selects locally, requests evidence only for selected profiles, renders cards in local selected-ID order and attaches requestId. No provider output may change eligibility, order or cardinality.

Preserve the fixed window `2026-09-23` through `2026-12-31`, canonical option normalization, safe positive integer budgets, positive finite durations, and the distinction between omitted optional fields and invalid null/blank values. Malformed JSON receives 400. With syntactically valid JSON and an unavailable catalogue, 503 precedes catalogue-dependent validation, as P00 specifies.

Normal outcomes `matched`, `category_absent` and `no_match` return 200. `INVALID_REQUEST` and `DATE_OUT_OF_RANGE` return 400; `CATALOG_UNAVAILABLE` returns 503; unexpected faults return a safe `INTERNAL_ERROR` 500. Responses do not expose descriptions, complete calendars, secrets, source paths or stack traces. Preserve the public `normalizedRequest`, comparison context and complete relevant `busyProfileIds` needed by P06.

The renderer uses one factual sentence and, when accepted, one attributed source quote. Explanation modes describe rendered quotes: all accepted → `openai_evidence`; some → `mixed`; none → `catalog_fallback`; no cards → `not_needed`. Empty selection performs no evidence request.

Expected catalogue failure stays retained until process restart and does not prevent serving HTTP. Repairing a file during the same process must not trigger reload. AI configuration has a separate narrow boundary: missing/blank key and `CONFIG_FILE_UNREADABLE` disable evidence while retaining catalogue selection; `CONFIG_INVALID_REQUEST` and unexpected faults are not ordinary AI fallback. Do not widen catches to hide defects.

Keep the existing single provider batch, six-second deadline including body consumption, and zero retries. Caller cancellation propagates as AbortError without fallback work; forward the signal to upstream and preserve existing transport evidence. This does not promise cancellation of provider billing. Do not add retry, storage or logging machinery; any required diagnostics remain within the project's safe metadata policy.

## Evidence reconciliation and remaining checks

The following is a verification plan, not a statement that the unexecuted rows have passed. Before implementation, attach existing results to exact content and record only missing or invalidated evidence as work.

| Criterion | Available evidence | P05 action |
| --- | --- | --- |
| Dense selection, empty outcomes and DTO shape | Existing slice checks plus production dense/empty HTTP records | Reuse unchanged evidence; first verify the agreed dense scenario in the chosen candidate before expanding work. |
| Validation and optional eligibility | Slice checks cover unknown/null fields/options, budget/hours, dates and domain boundaries | Preserve these checks; add only an identified gap. Verify normalization and error examples match the public package. |
| Modes, source mismatch, batch failure and cancellation | Slice/P04 checks exercise real validator/renderer with controlled provider output, including reordered IDs | Reuse sufficient cases; distinguish controlled transport from live OpenAI. Check unaffected selection and actual rendered modes. |
| Real rehearsal cases | Dense baseline executed; remaining expectations documented, with domain-only coverage for some boundaries | Run remaining real CSV-to-HTTP date/rare/absent/busy-venue cases and record exact observations. |
| Retained catalogue failure and repair | Slice test proves one retained getter/load, separate requestIds, no evidence factory and recovery with a new getter | Add actual process-level missing/damaged CSV startup, retained failure, file repair and restart recovery. A new getter in one test is not a process restart. |
| Repeatability | Deterministic domain checks and dense production smoke | Observe three repeated HTTP requests and one actual restart preserving ordered IDs and comparison context for unchanged bytes. Explanation strings need not be identical. |
| Optional AI configuration | Loader unit checks, narrow composition catch by inspection, blank-key production fallback | Verify missing/blank key, unreadable file even with populated process variable, and missing file with a usable process variable through composition using isolated synthetic configuration. Expected failures send no provider request; unexpected faults stay failures. |
| Safe unexpected errors | HTTP 500 mapping exists by inspection | Inject a controlled unexpected failure through the connected boundary; observe 500, fresh requestId and absence of private detail. Do not infer this from loader-only checks. |
| Frontend handoff | Public types/examples exist; no published v1 package observed | Produce and verify the immutable consumer package after backend acceptance. Fixtures alone do not satisfy this row. |

Use the existing test facilities and smallest sufficient observations. Controlled failures may use temporary catalogue paths, synthetic configuration or the existing injection seams. Tests must exercise the real configuration-to-composition behavior where claimed; replacing it with a prebuilt unavailable evidence function does not prove that boundary. Never alter the canonical CSV or real credentials. If safe isolation requires a narrow internal test seam, document its purpose and preserve public contracts; do not introduce general infrastructure for it.

For the pinned dataset, the dense request is Алматы / Ведущий / корпоратив / 1,500,000 KZT, with language and duration omitted:

| Date | Eligible count | Ordered IDs |
| --- | --- | --- |
| `2026-10-10` | 5 | `HK-88430`, `HK-29829`, `HK-27222` |
| `2026-10-11` | 4 | `HK-44923`, `HK-27222`, `HK-44733` |
| `2026-10-01` | 3 | `HK-88430`, `HK-44923`, `HK-75012` |
| `2026-10-06` | 7 | `HK-88430`, `HK-44923`, `HK-29829` |

Each has ten city/category candidates. Verify complete busy identities and count invariants, not only displayed IDs. The October 1→6 pair must show that `HK-29829` became available while `HK-75012` remained available but was displaced; P06 owns the visible narrative.

Also verify Алматы / Флорист / свадьба / `2026-10-10` / 500,000 KZT → sole eligible `HK-39372`; dense budget 1 → `no_match`; Зарубежье / Флорист / свадьба / same date and 500,000 KZT → `category_absent`. Select a real venue and busy date from the dataset during implementation, recording the exact ID/date, sufficient budget, supported format and busy exclusion. Do not invent an unverified venue pin in this plan.

After executable repairs, rerun the failed and affected cases. Before declaring the candidate accepted, run the applicable combined tests/typecheck/build and documented production launch. Reuse prior unchanged observations where sufficient; do not expand into a new broad audit after success. Clean-checkout/run documentation work uses project-delivery when performed.

## Live evidence policy

P01 records the dense live sample. P04 records the rare sample and exact provider-argument equivalence for canonical dense/rare requests after the explicit projection repair. P04 also preserves model, dataset and source/relevance/distinctiveness evidence. These records support reuse for unchanged behavior.

A new P05 paid request is not an automatic acceptance gate. Recheck the evidence chain against the actual candidate. Repeat the affected live sample when relevant executable behavior, model, prompt, projection, validation/rendering or data changes invalidate the prior observation, or when required evidence is absent or ambiguous. Controlled transport failures remain separately labelled. Missing live access never converts an unmet live criterion into a pass.

P07 still owns final rendered quality and three uncached submission-to-visible-result timing observations, including first use after startup. P05 reuse neither completes nor removes those obligations.

## Implementation sequence and setup

1. Create the subsequent OpenSpec change using the standard workflow, link this outcome, and transfer scope, criteria, boundary ownership and checks into proposal/specs/design/tasks. Reconcile actual task stages and current accepted SHAs first. Existing archived module work is not new unfinished implementation.
2. Verify the current agreed main, module ancestry, harness and safe worktree ownership. Acquire the canonical shared reservation by exclusive creation before shared integration or package writes. Record owner and resources in the task card. Reconcile the occupied integration worktree instead of replacing it. Pin the selected candidate base and allowed paths.
3. Install locked dependencies in the selected isolated checkout when needed. Verify the existing real dense scenario, reconcile the evidence matrix, then execute only remaining cases. Repair demonstrated P05 defects within its file scope and preserve frozen interfaces.
4. Complete candidate checks and record exact tested content, modes, failures/skips and remaining downstream obligations. Commit accepted backend changes when implementation/publication is authorized; if no runtime repair is needed, do not manufacture one or make an empty backend commit. Pin the actual accepted backend branch and SHA.
5. Prepare, commit and materialize the consumer package under the protocol below. Record its commit after it exists, then hand off P06 against the pinned candidate containing backend and package commits.

Use the existing Node/npm versions, lockfile, single Next.js application and local CSV. Planned backend preview is `127.0.0.1:3105`, after checking port ownership; builds and temporary test files stay local to the chosen worktree. Package installation requires network; local/controlled acceptance requires no paid account, GPU, Docker or extra server. Only an invalidated required live sample needs existing private OpenAI configuration, network/model access and API budget. Do not inspect or copy secrets merely to write this plan.

Coordinator-owned repair paths are `back/recommend/` except ports, `back/http/`, `back/composition.ts`, thin API route entrypoints, necessary integration checks, and the contract package. Shared test registration, configuration or documentation edits need explicit inclusion in the OpenSpec scope; unrelated dependencies, UI and module internals remain outside it. No subagent is needed for the approved sequential approach.

## Immutable package and P06 handoff

Use the canonical absolute root `D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/specs`. Proposed feature/version paths are `contractor-selection/versions/v1/`, only if still unoccupied. Root and version README files are English. The mutable root index may identify the current version; an active consumer follows only its pinned immutable directory.

Use the existing public TypeScript DTO format as the package's single contract format, with a version-local snapshot and minimal JSON examples. Avoid introducing OpenAPI generation or a parallel schema system for two established operations. Verify the snapshot against the accepted `contracts/contractor-selection.ts`; browser consumers must not import server modules.

Include operations, no-auth behavior, required/optional/non-null fields, formats/units, normalization/date window, errors/statuses/requestId, three outcomes, four explanation modes, quality flags, comparison context/busy-ID meaning, and the visible states P06 must handle. Include minimal success/material-error examples and only necessary labelled controlled examples for otherwise rare states. Document same-origin launch, required environment-variable names without values, supported scenarios, exact backend branch/SHA, verification/integration status, revision-pinned source/OpenSpec links and a short real-backend check. Exclude provider internals, full calendars/descriptions, secret values and unsupported API capabilities.

Prepare the snapshot inside the candidate worktree and commit it there separately from backend changes. Before creating files in the canonical primary root, record the owner task ID, package commit, exact previously absent paths and checksums in the task card, including an index if newly created. Materialize the exact committed snapshot under the same reservation and verify complete path/content equality. Do not overwrite an existing tracked, modified or foreign file; conflicts block publication. Do not commit an external path from a worktree or make an incidental package commit on dirty primary main.

After the package commit exists, record in the P06 task card its commit, absolute immutable version path, public contract version, backend SHA and candidate base. Do not put the package's own unknown future SHA inside its contents. Before every P06 start/resume, compare the complete version directory against that commit. Missing/mismatched content blocks dependent work; the root index cannot silently repin a consumer. Any published package-content change requires a new version, with affected consumers paused and explicitly reconciled.

Preserve the P05 proposal's [transition into Git ownership](../.proposals/05-backend-composition-and-handoff.md#переход-пакета-под-контроль-git) for P07. Supply its materialization manifest and ownership evidence. Identical untracked bytes do not guarantee a successful fast-forward. Stop consumers before temporarily moving only verified owned untracked paths into a checked backup; never clean/stash/delete the shared tree. Verify restoration or the incoming tracked snapshot before resuming consumers, and verify remote publication separately.

P06 readiness means the exact checked backend and committed immutable package are available and consistent, with launch/check instructions and honest limitations. It is distinct from final MVP integration. Preserve achieved stages and any publication hold; only confirmed integration/publication satisfies project delivery checkboxes. Missing package/commit evidence is a handoff blocker, not grounds to substitute arbitrary untracked files or mock-only responses.

## Document verification and next step

This outcome was checked against the P05/P06 proposals, frozen P00 design, current interfaces/composition/HTTP/use case, existing slice checks, and archived P01–P04 evidence. Baseline comparisons and the absence of the proposed package version were observed locally. Markdown file links are checked as part of document completion.

No new application pass, process restart, remote-state lookup, credential read, live request, package publication or Git integration is claimed. The next implementation-stage action, when requested, is OpenSpec proposal preparation from this approved outcome; do not invoke a separate Superpowers implementation plan or implement directly from this document.
