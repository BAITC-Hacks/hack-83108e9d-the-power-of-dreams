# P06 — Approved frontend flow design

## Approval and scope

On 2026-09-23 the user requested a brainstorming outcome for [P06](../.proposals/06-frontend-flow.md), asked to reconcile the published P05, and approved explicit submission, retention of previous results, optional fields in a disclosure, reset behavior, and the implementation outline below. This is a planning deliverable; application implementation is not started by this document.

Complete the existing single-screen contractor selection flow. Preserve the [P01 visual direction](2026-09-23-first-working-slice-design.md#approved-visual-direction), public contract v1 and existing application stack. The priorities remain truthful explanations, complete input/result states, and understandable date changes. Booking, accounts, saved searches, persistent history, new providers and new selection rules are outside scope.

The approved outcome is historical discussion evidence. When implementation is requested, transfer it into the local OpenSpec proposal, specifications, design and tasks; OpenSpec then owns current requirements and execution state. Do not implement directly from this document or create a separate Superpowers plan.

## Reconciled baseline and immutable pins

P05 is integrated, published and archived. Its [handoff card](../openspec/changes/archive/2026-09-23-backend-composition-and-handoff/tasks.md#p06-handoff-card) supplies:

| Item | Pin |
| --- | --- |
| Accepted backend branch | `codex/cs-05-backend` |
| Accepted backend SHA | `4ade2fa4022d633e9d96b50188be4cee4fb99539` |
| Contract version | `v1` |
| Package commit / original consumer base | `e424a13fec851d7f9f0f4e076f70649e716336f7` |
| Canonical immutable path | `D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/specs/contractor-selection/versions/v1` |
| Remote main verified during discussion | `c603e3acf9da372f65658b6fefc8c4e61d1ff912` |
| Local HEAD at document preparation | `f7f7836e12c878782e4db0020adfce3b15a9129e` (`upd readme`) |

During this discussion, a remote fetch confirmed local/remote main equality at c603e3a and ancestry of both accepted pins. All six immutable v1 files matched the package commit by complete path set and raw Git blob hashes, with no differences. No runtime files under `back/`, `front/`, `contracts/` or `src/` differed between accepted backend 4ade2fa and c603e3a. The subsequent README commit does not itself repin the backend or package; its remote publication was not checked here.

The P05 record reports 44 passing combined checks, typecheck/build, 26 production HTTP requests across six starts, and historical live-evidence reuse. These are inherited records, not tests rerun for P06. P05 did not complete optional controls, date narratives or final browser acceptance.

Before P06 implementation/resume, verify the actual committed base, backend ancestry and full canonical version directory against the package commit again. Use an agreed descendant containing the pins; do not silently follow the mutable index. A missing or changed package stops dependent work. Read the [version README](../.shared/specs/contractor-selection/versions/v1/README.md) and version-local examples; controlled examples are not observed live results.

## Interaction approach and alternatives

Use explicit submission with `Подобрать`. Editing any field, including the date, sends no recommendation request. This allows several edits before a potentially billable request and gives a clear comparison boundary.

Automatic submission after every field change was rejected because it produces unnecessary intermediate requests and complicates editing. Automatic submission only after date changes was rejected because otherwise similar controls would have different behavior. No debounce, background refresh or automatic recommendation retry is needed.

Retain the previous successful output while editing, submitting and recovering from a failure. Each output is visibly attached to its own successful normalized conditions. Never relabel old cards with the draft date or new request conditions.

## Form and reset

- Required fields: city, date, event format, contractor category and budget in KZT.
- A keyboard-operable `Дополнительные условия` disclosure contains optional language and duration in hours. Start collapsed; opening or closing it does not change values or submit. If a hidden field fails validation, expand before focusing it.
- Language offers an unfiltered choice; blank duration is omitted. Omit unused keys rather than sending empty strings, zero or null. A supplied duration must be positive and finite; fractional hours are valid. Budget must be a positive safe integer. The backend remains authoritative for validation.
- Load canonical options and the inclusive date window from the real options endpoint. Keep all globally valid categories selectable regardless of city. Derive date help and out-of-window messages from returned bounds; remove hardcoded window copy from the form.
- Preserve the existing demonstration defaults when supported: Алматы, Ведущий, корпоратив, `2026-10-10`, and 1,500,000 KZT; optional values start empty. If a preferred option is absent, use the first returned choice; if the preferred date is outside the returned window, use its minimum. Do not replace the fixed dataset window with a moving today rule.
- `Сбросить` restores those initial supported defaults, clears optional values, closes the disclosure, clears results/comparison/errors and aborts pending recommendation work. Invalidate request identity as well as aborting so a late response cannot restore cleared content. Return focus to the first required control and send no recommendation request.

## State and request lifecycle

Keep draft values, options loading/error, the active submission and the last successful response separate. A compact set of local state and request identity is enough; no state-management dependency or generic state-machine framework is required.

| Event/state | Visible behavior and retained data |
| --- | --- |
| Options loading | Explain that the catalogue is loading; selection is unavailable until valid options arrive. |
| Options failure | Show an understandable error and explicit `Загрузить снова`; do not invent local options. |
| No successful result | Show the initial instruction that up to three options will appear after submission. |
| Draft differs from displayed success | Retain its cards or empty outcome and successful conditions; show `Условия изменены — выполните подбор`. Remove the notice if the user restores equivalent conditions. |
| Validation failure | Show field errors without submitting invalid data or replacing the last success; focus the first invalid field. |
| Submission pending | Show progress and the submitted conditions. Keep previous success visibly identified as the previous result. Keep form controls editable. |
| Duplicate of the pending request | Ignore the duplicate; at most one current request for equivalent submitted values. |
| Different valid submission | Abort the superseded request, establish a new identity, and wait for the new response. |
| Current successful response | Compute any justified comparison against the previous success, then atomically replace the displayed response and successful snapshot. |
| Error / cancellation / stale response | An error is visible with retry guidance; none replaces the successful snapshot. Superseded/reset cancellation is not a service error. |

Prevent duplicates only while the same request is pending; allow intentional retries after completion or failure. Both request identity and cancellation checks guard success, failure and final pending cleanup. Superseded requests cannot clear the newer loading state. Abort pending operations on unmount. No automatic retries or promise of cancelled provider billing.

Editing without submitting does not supersede an in-flight submission. If that submission succeeds, show its actual normalized conditions; retain the changed-conditions notice if the current draft differs. The next explicit submission establishes a new request. This avoids hiding a valid response or presenting it as a match for unsent edits.

Treat HTTP 200 empty outcomes as successes. They replace previous cards and become the latest comparison snapshot. In contrast, malformed/unusable responses and transport/HTTP errors never do. Handle invalid response shapes safely at the public boundary without importing backend validators or building a second general schema system.

## Results and visual hierarchy

Continue the calm working screen: form left/results right on desktop; form above results on mobile; left-aligned content and no promotional screen. Preserve the system Cyrillic font stack and existing tokens: page `#FFFFFF`, form `#F3F5F7`, text `#202936`, accent/focus `#2457C5`, borders `#D9DFE7`. Keep errors readable in the existing red treatment. No downloaded fonts, illustrations, new design framework or decorative animation is needed.

The result header identifies the successful city, date, format, category, budget and any supplied optional conditions. Contractor explanation remains prominent alongside name and `от … ₸`. Secondary information covers the chosen category/city, absence of a busy mark on the successful request date, and source quality flags. Render server explanations as plain text; do not invent ratings or guaranteed availability.

| Outcome/mode | Required meaning |
| --- | --- |
| `matched` | One to three cards are a valid result; report eligible count versus displayed count and the ascending starting-price order, with ID as the equal-price tie-break. |
| `category_absent` | The city has no catalogue profiles in that category; suggest changing city or category, not a date change as a remedy. |
| `no_match` | Candidates exist but none satisfy all conditions. Show actual exclusion information and invite review of relevant conditions without guaranteeing a match. |
| `openai_evidence` | AI selected source excerpts; eligibility and order remain catalogue rules. |
| `mixed` | Show `Часть объяснений сформирована без ИИ`. |
| `catalog_fallback` | Show `Объяснения сформированы по полям каталога без ИИ`. This is a real selection, not fixture mode. |
| `not_needed` | Show the normal empty outcome without an AI-generation claim. |

Exclusion counts represent the first failed condition and are not independent overlapping totals. Preserve synthetic/anonymized and imputed city/price meanings; synthetic does not mean a profile added by this team. Missing calendar marks and starting prices do not confirm bookings or final quotes.

Use explicit labels, associated field errors, visible keyboard focus, and polite progress/result announcements. Keep focus stable during editing and completion so a response does not steal focus from a user editing another field. Show service errors clearly, with the safe request ID available for support; do not expose internal paths/provider payloads. Verify keyboard access to the disclosure, submit, retry and reset, and readable cards without horizontal page overflow on mobile.

## Date comparison

Store the complete last successful normalized request, cards with IDs/names/prices, summary busy IDs and comparison context. Before replacing it, compare with the new current success only if the date differs and every other normalized input, `catalogVersion` and `selectionPolicyVersion` agrees. Raw field spelling or busy counts cannot establish comparability or identity.

A successful request with other changed inputs/context replaces the snapshot but produces no date narrative. It is the baseline for a later date-only success. Errors leave the previous successful baseline intact, so a later valid date-only retry can compare against it. Reset removes the baseline. Keep only the latest success and the current derived narrative in memory, not a user-visible persistent history.

Derive the following facts from the two public responses, following the [comparison rules](../architecture/selection-and-explanations.md#explaining-date-changes):

| Transition | Evidence and permissible explanation |
| --- | --- |
| Previously displayed contractor is now busy | Previous card ID occurs in the new busy set; explain its busy mark on the new date. |
| New card has become available in the catalogue | Its ID was in the old busy set and is absent from the new busy set; explain removal of that mark and entry under the fixed ordering. |
| Previous card is displaced while still available | Its ID is absent from both the new cards and the new busy set; explain displacement by newly available candidates ahead in price/ID order, not new busyness. |
| Already available contractor enters the cards | Its ID was absent from both previous cards and previous busy set; explain promotion after higher-ranked options became busy, not newly gained availability. |

Compare actual known prices before using `дешевле`. For equal prices, describe the catalogue ID tie-break without implying better quality. Several facts may coexist; do not invent one-to-one replacement pairs. Do not recreate filtering or top-three selection in the browser. If displayed IDs/order are unchanged, say the displayed list is unchanged and use the ordinary calendar summary, without a replacement story. Empty-to-matched and matched-to-empty comparisons are permitted only where these same facts prove the claims.

Place the short comparison explanation beside the result summary and state the two dates. Old cards are replaced after success; a previously busy or displaced card may be named in the narrative but must not remain among current recommendations.

## Implementation boundaries

One frontend owner can complete this sequentially. The following are proposed logical boundaries; do not create a generic component library or split trivial markup solely to match a file count.

| Boundary / suggested path | Public responsibility and owned state | Dependencies / verification |
| --- | --- | --- |
| `front/ContractorForm.tsx` | Existing public default screen export; composes form/results, owns drafts, options, active request identity, successful snapshot and reset; same-origin requests produce state/error updates | React, public DTOs, local presentation/helper modules; real browser request, duplicate/supersession/reset checks |
| `front/EventConditionsForm.tsx` | Renders values/options/errors/pending status; reports edit/submit/reset actions; owns only disclosure presentation if appropriate | React and public form types; optional omission/validation, keyboard checks |
| `front/RecommendationResults.tsx` | Renders successful conditions, cards/empty outcomes, modes and proven date narrative; no selection or networking | Public response and derived display facts; state/mode/flag checks |
| `front/compareRecommendations.ts` | Pure comparison of two successful public responses; returns non-comparable/unchanged/proven transitions; no I/O or hidden catalogue access | Public DTOs only; real date pairs and controlled promotion/tie cases |
| Frontend-local styles and focused checks | Only necessary additions for new controls/states and their acceptance evidence | Existing tooling; mobile/desktop and interaction checks |

Keep module dependencies acyclic. Browser modules do not import `back/`, secret loading, CSV, complete calendars or provider implementation. The two public HTTP operations and their DTOs remain unchanged. No new external ports, storage, automatic retries or provider calls originate from frontend code.

The existing page entrypoint already imports the public frontend screen. Base styles currently live in coordinator-owned `src/app/style.css`; use frontend-local styles for additions, and list any necessary shell/import adjustment explicitly in the OpenSpec coordinator scope. Shared files, package scripts, test registration, dependencies and lockfiles remain coordinator-owned; do not claim they fall within a worker's `front/` ownership.

## Implementation sequence and organizer setup

1. When implementation is requested, discover current OpenSpec changes, create the P06 change through the standard workflow, and link this approved outcome. Record criteria, exact pins, scope and the stage table. Do not reopen accepted P05 implementation or silently switch another active change.
2. Verify the intended branch/worktree and committed base. Planned branch: `codex/cs-06-front`; worktree: `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-06`. Check occupied paths and the canonical package. No worker or worktree is created by this planning document.
3. First observe the existing dense form-to-real-backend scenario using the pinned backend in the same application. Preserve its working connection while adding optional controls and explicit form state.
4. Implement retained-result labeling, request supersession/reset, outcome/error rendering and pure date comparison. Complete the primary screen before expanding to the remaining acceptance cases.
5. Execute the checks below, recording exact tested content, run mode, browser observations and skips in OpenSpec. Review accepted changes and follow the project's publication/integration protocol when implementation is authorized. Acquire shared ownership before integration/main/package operations; none is needed for this document.
6. Hand P07 the accepted frontend SHA, backend/package pins and actual browser evidence. P07 retains final rendered live quality, three uncached submission-to-visible-result timing measurements including first use, and submission checks.

Use the existing Node 24-compatible runtime, locked npm dependencies, one Next.js application and supplied CSV. Preview on `127.0.0.1:3106` after checking ownership; keep `.next`, temporary output and test results inside the isolated worktree. Frontend and backend use the same origin; no additional frontend service, proxy, CORS setup, database, GPU or cloud account is necessary.

Installation needs network access. Catalogue/fallback execution needs no private key or personal browser session. Required live UI evidence needs the existing private server OpenAI configuration, model access, network and API budget; frontend receives no secrets. No new paid call or credential read is authorized by this planning-only deliverable. Missing live access must be recorded as a missing check, not replaced with fixture evidence.

## Verification plan

These are future P06 checks, not completed results. Use the existing checks and smallest focused additions; do not build generic mock infrastructure or test copies of implementation logic.

| Criterion | Check and expected observation |
| --- | --- |
| Primary real scenario | Real browser form -> same-origin pinned backend, Алматы / Ведущий / корпоратив / `2026-10-10` / 1,500,000 KZT, optional fields omitted: five eligible, cards HK-88430/HK-29829/HK-27222, correct conditions and mode. |
| Optional input and validation | Select a supported language and valid fractional duration; observe actual request and backend eligibility. Blank optionals are absent; zero/negative/non-finite duration and invalid budget cannot become a success. Exercise real HTTP field errors and dynamic date bounds. |
| Rare and empty results | Real rare florist example returns HK-39372; budget 1 returns `no_match`; Зарубежье / Флорист returns `category_absent`. Successful empty results remove old cards and update the successful snapshot. |
| Retained results | Edit without a request, submit, then exercise a real HTTP error; previous success keeps its own conditions and changed/pending/error status. A success for submitted values while draft differs remains correctly labeled. |
| October 10 -> 11 | Real dense date-only requests change HK-88430/HK-29829/HK-27222 to HK-44923/HK-27222/HK-44733; narrative follows complete busy sets. |
| October 1 -> 6 | Real cards change HK-88430/HK-44923/HK-75012 to HK-88430/HK-44923/HK-29829; HK-29829 loses its busy mark; HK-75012 remains available and is displaced by starting price. |
| Comparison limits | First success, same date, unchanged cards, changed other inputs/context, error then retry, reset, and successful empty transitions yield only justified narratives. Controlled public examples cover already-available promotion and equal-price ID ordering. |
| Request races | Controlled delayed responses verify duplicate blocking, changed submission supersession, old success/error/finalizer arriving last, reset during pending and unmount cancellation. None replaces or clears newer state. |
| Explanation modes | Observe real live and fallback browser interactions; verify mode agrees with response and visible text. Label separately the controlled mixed and other rare states from version-local examples. Do not pass live with controlled examples. |
| Errors | Real invalid-request response exercises field mapping; isolated real catalogue-unavailable response exercises service error without modifying canonical data. Controlled examples can cover remaining rare 500/network/malformed response UI behavior; preserve the last success and safe request ID where present. |
| Readability and accessibility | Browser at representative mobile 375px and desktop 1280px widths: no horizontal page overflow, readable explanations/prices, keyboard disclosure/submit/reset/retry, focus/error association, stable focus on asynchronous completion and progress announcements. |
| Combined candidate | Existing `npm run typecheck`, `npm test`, `npm run build`, then README installation/configuration/launch and primary scenario from a clean checkout without personal sessions or hidden files in fallback mode. Add only the focused frontend checks required above using existing facilities. |

Keep controlled fixtures visibly identified when running a fixture demonstration; do not introduce fixture substitution in the real application. Reuse sufficient unchanged P05/backend evidence while still performing P06's real browser interactions. Record live failures/skips separately and leave affected acceptance unmet until resolved. Repeat checks only for changed content, missing evidence or reproduced failures.

## Document verification and next action

This plan was reconciled with the current P06 proposal, existing frontend/page/styles, P01 approved visual direction, immutable public DTO/readme/examples, date-comparison rules and archived P05 handoff. The user approved the interaction decisions before this document was written. It preserves one local application, fixed contract v1 and the existing primary screen.

The current deliverable adds planning documentation and a P06 link only. No application tests, live provider calls, browser acceptance, frontend implementation, contract publication or product integration are claimed. The next product-work stage is OpenSpec preparation when the user requests implementation.
