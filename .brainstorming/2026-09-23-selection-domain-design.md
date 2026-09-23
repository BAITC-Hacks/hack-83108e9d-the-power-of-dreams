# P03 — Deterministic selection and rejection facts

## Purpose and status

On 2026-09-23 the user requested a brainstorming file for [P03](../.proposals/03-selection-domain.md), with clarification of material ambiguities. This architectural refinement preserves the [approved product direction](2026-09-23-contractor-selection-architecture-design.md) and materialized P00 contracts. No new ranking policy or product decision is introduced.

This is a planning basis for OpenSpec transfer, refreshed after the user brought accepted P01 into the current branch. P01 implementation and historical acceptance are now available as described below; this document does not independently accept P03. Active requirements, assignments and stages belong in OpenSpec. The present request authorizes documentation review and updates; it does not start implementation, delegation or publication.

## Sources and observed baseline

- [Domain entry point](../domain/README.md) and [source rules](../domain/model-and-rules.md): original business meanings, distinguished from subsequent policy decisions.
- [Selection architecture](../architecture/selection-and-explanations.md): eligibility, exclusive reasons, deterministic order and date-change evidence.
- [Archived P00 design](../openspec/changes/archive/2026-09-23-foundation-and-contracts/design.md) and [current foundation specification](../openspec/specs/contractor-contract-foundation/spec.md): frozen interfaces and outcome invariants.
- [Domain types](../back/domain/types.ts), [public JSON types](../contracts/contractor-selection.ts) and [development examples](../contracts/examples/README.md): actual shared surfaces; examples are fixtures, not executed domain evidence.
- [P01 planning outcome](2026-09-23-first-working-slice-design.md) and [verification guide](../architecture/implementation-and-verification.md): prerequisites and later integrated checks.
- [Archived P01 task card](../openspec/changes/archive/2026-09-23-first-working-slice/tasks.md) and [current slice specification](../openspec/specs/contractor-first-working-slice/spec.md): accepted revision, executed checks, module handoff and remaining MVP obligations.
- [Existing selector](../back/domain/select.ts) and [controlled slice checks](../scripts/slice/contracts.test.mjs): actual implementation and existing coverage to reuse.

The initial inspection at `8ecba1901a434cb4c0c0f6a710d804bdc6ab825c` predates P01. The refreshed primary checkout is at `907468aebabb6e5d20c55656a17534ce186a6862` and contains accepted P01 candidate `8aaad189393be78a21f1793afd2014c55794f7cd` as an ancestor. Comparing that candidate with the current HEAD found no differences in `back/`, `contracts/`, the controlled slice suite, package/lock files or the dataset. The working tree had no tracked modifications during this review; other brainstorming files were preserved.

The P01 card records all four tasks integrated, 21/21 combined checks, clean installation/typecheck/build/start, dense live/browser acceptance, and confirmed publication of that exact candidate to remote main. It explicitly releases the transferred module paths to P02–P04. These are recorded P01 observations, not live/browser/remote checks repeated by this documentation review. Later date narratives, rare/final live cases and final MVP acceptance remain outside that evidence.

Both `foundation-and-contracts` and `first-working-slice` are now archived with synchronized current specifications. The proposal index's original readiness and single-change assumptions are historical. Reconcile the next OpenSpec change and owner before writes instead of recreating either completed change or assuming an active product change from the old proposed name.

## Goal, approach and alternatives

P03 verifies and, only where needed, completes the pure domain operation supplied by P01: determine which profiles qualify, return at most three ordered IDs, and supply complete factual diagnostics for downstream explanations. Inspection found the agreed filtering, first-failure counts, complete sorted busy IDs, price/ID ranking, top-three limit and three outcomes already implemented in `back/domain/select.ts`. No selector behavior change is currently demonstrated as necessary. Reuse accepted P01 behavior and evidence; the remaining work is focused verification and any repair justified by a failure.

| Approach | Trade-off | Decision |
| --- | --- | --- |
| Verify P01's pure selector and extend it only for a demonstrated gap | Reuses the implemented rules and accepted evidence while checking remaining criteria | Retain the agreed approach |
| Put filtering and diagnostics in HTTP or presentation code | Couples rules to consumers and risks different selection/explanation behavior | Incompatible with the agreed module boundary |
| Add semantic scoring or configurable weighted ranking | Requires new policy, failure behavior and acceptance expectations | Outside P03; optional P90 remains separate |

A few pure functions are sufficient. No rules engine, strategy framework, storage, cache or provider integration is needed.

## Public operation, inputs and ownership

The frozen `Select` operation is `select(profiles: readonly Profile[], request: NormalizedRequest): SelectionResult`. It is synchronous and returns `outcome`, `selectedIds` and `summary` as defined by P00. Consumers receive IDs and facts, not generated cards or prose.

Inputs are validated catalogue profiles with unique string IDs and a canonical, validated request. Catalogue decoding and record validation belong to P02; request parsing, canonicalization, unknown-field checks and date-window validation belong to HTTP. P03 uses exact canonical string equality and membership. It does not add city aliases, fuzzy categories, case normalization, a moving current-date rule or a second input-error policy.

After the accepted P01 handoff, one P03 owner may edit `back/domain/` excluding frozen `types.ts`, including colocated checks. Production dependencies are plain public/domain types and pure local functions only. No filesystem, CSV parser, HTTP, framework, AI, secret loader, concrete catalogue adapter or another module's internals may be imported.

Shared types/contracts, orchestration, composition, routes, UI, package files and OpenSpec task state remain coordinator-owned. If the frozen shape cannot express an accepted requirement, stop affected implementation and request coordinator reconciliation rather than bypassing the boundary.

P01 also added [the pure calendar-date helper](../back/domain/date.ts), imported by both `back/catalog/load.ts` and `back/http/normalize.ts`; the selector itself does not import it. Preserve that existing helper and its consumers. Its cross-module use needs explicit coordinator treatment in the next ownership/allowed-dependencies record, since the original P02 card only names public domain types. Do not relocate it or change its semantics as incidental P03 cleanup, and do not treat the directory's ownership as permission for an uncoordinated shared-boundary change. Validation decisions still belong to catalogue/HTTP; sharing a pure date predicate does not move those decisions into selection.

## Eligibility and exclusive rejection policy

First form candidates whose `city` equals the requested city and whose `categories` contains the requested category. A multi-category profile is counted once. Profiles outside that set contribute neither exclusions nor busy IDs.

For each candidate, apply these checks in order and count only the first failure:

| Order / bucket | Exclusion condition | Boundary meaning |
| --- | --- | --- |
| 1 / `busy` | `busyDates` contains the requested date | Applies equally to people and venues; no partial-day or timezone inference |
| 2 / `budget` | `priceFromKzt > budgetKzt` | Equality passes; price is starting KZT per event, never multiplied by hours |
| 3 / `format` | `eventFormats` does not contain `eventFormat` | Exact membership |
| 4 / `language` | A language was requested and `languages` does not contain it | Omitted language neither filters nor rewards profiles |
| 5 / `duration` | Duration was requested, `maxHours` is numeric and `durationHours > maxHours` | Equality passes; `maxHours: null` means duration is inapplicable, not unlimited |

Absent optional fields remain absent, not null. HTTP rejects invalid optional values before this operation. Structured fields govern eligibility; `description`, name and provenance flags cannot override a price, location, format, language, duration or busy date. A profile's prose cannot establish travel, capacity or quality.

Every remaining candidate is eligible. Counts describe the complete candidate set before limiting the displayed selection. Always preserve:

`candidateCount = eligibleCount + busy + budget + format + language + duration`

These buckets express the first decisive reason, not counts of every condition a profile violates. A busy and over-budget profile belongs only to `busy`.

## Ordering, outcomes and diagnostic data

Sort eligible profiles by `priceFromKzt` ascending, then by a fixed ordinal string comparison of `id` ascending. Do not use locale-dependent comparison, numeric ID interpretation, random order, source-row position or provider scores. Return the first `min(eligibleCount, 3)` IDs. Equal-price input rows presented in another order must produce the same selected IDs.

| Outcome | Required facts |
| --- | --- |
| `category_absent` | No city/category candidates; zero candidate/eligible counts and exclusions; empty selected IDs and busy IDs |
| `no_match` | Positive candidate count; zero eligible count and selected IDs; exclusions account for every candidate |
| `matched` | Positive eligible count; one to three selected IDs in price/ID order; counts still cover all candidates |

`summary.busyProfileIds` contains every busy ID in the city/category candidate set, including profiles that would also fail other conditions or never appear in the top three. IDs are unique and fixed-string sorted, as already specified by P00. Its length equals the `busy` bucket because busy is the first exclusion check. Do not return full calendars.

The result supports truthful empty/short-result text and subsequent date comparisons. P03 does not retain previous requests, compare snapshots, generate replacement narratives, call AI or assign explanation modes. The use case and UI consume these facts under their own contracts. A profile missing from the cards is not necessarily busy: it may have been displaced by a cheaper eligible candidate or the ID tie-break.

P00's initial policy token is `selection-v1`. Its publication in comparison context belongs outside `Select`; do not change the return shape to include it. Changes to normalization, eligibility, exclusions or ordering require coordinator reconciliation and the agreed policy-version treatment.

## Side effects, failures and setup

The operation has no I/O, persistence, logging, provider calls or mutation of the input request, profile objects or nested arrays. Sorting must not reorder the supplied catalogue array. Keep per-call intermediate state local; previous invocations must not affect later results.

The synchronous pure port needs no retry, timeout, cancellation parameter or service-failure union. Both empty outcomes are normal values. Do not catch an unexpected programming failure and present it as `no_match`; safe service-error handling remains with the existing outer boundary.

Use the repository's existing Node.js/npm environment, lockfile and verification tools. Dependency installation can require network access; P03 execution and checks require no account, key, paid call, port, database, Docker, GPU or additional service. No new dependency is justified by this scope. The updated P01 outcome and task card record the user's superseding instruction that the user controls the schedule: do not enforce the earlier four-hour limit, deadline reconciliation or 60-minute reserve. Required scope and verification remain unchanged.

## Verification plan

Use the evidence reconciliation below before assigning work. The following criterion table defines the complete P03 obligation, not a claim that every row is untested. Reuse sufficient P01 evidence tied to unchanged content; run checks for remaining criteria or invalidated evidence.

| Criterion | Smallest useful observation |
| --- | --- |
| Candidate scope | Exact city/category membership, including a multi-category profile; unrelated profiles do not affect counts or busy IDs |
| Boundaries | Equal budget/hours pass; lower budget, unsupported format, missing requested language and exceeded numeric hours fail; omitted optionals and null profile hours behave as specified; duration does not multiply price |
| First-failure accounting | Focused overlapping failures exercise the declared priority; every rejection is counted once and the count invariant holds |
| Busy diagnostics | Busy person and venue excluded; busy IDs include candidates outside the displayed set and with other failures, exclude other city/category profiles, and are unique and fixed-string sorted |
| Stable selection | More than three eligible profiles yield three IDs but retain the full eligible count; equal-price ties, repeated calls and reordered input preserve the required selected order |
| Input preservation | A deeply frozen representative request/catalogue works without mutation; before/after values and array order remain unchanged |
| Outcome semantics | Empty category, existing category with no eligible profiles, and one/two/three-or-more eligible profiles produce the specified distinct outcomes and counts |
| Structured authority | Conflicting descriptive prose does not alter eligibility, IDs or diagnostics |
| Contract compatibility | Existing typecheck and applicable shared-example checks pass; actual colocated domain checks are run explicitly |

### Existing evidence and remaining checks

| P03 area | Available P01 evidence | Remaining evidence need |
| --- | --- | --- |
| Dense real selection | Real CSV through HTTP asserts exact October 10 IDs, 10 candidates, 5 eligible, busy=4/budget=1 and four busy IDs; recorded accepted suite passed | Full busy-ID identities/order and remaining date cases are not asserted by that check |
| Boundaries and exclusive priority | The controlled `optional eligibility, exclusive first failure, numeric/null duration and deterministic ties` case asserts every bucket, equality at budget/hours, null hours, omitted optionals and A-before-B tie ordering | Preserve this evidence; do not duplicate the same cases as new work |
| Empty outcomes | Real budget-1 no-match and pinned synthetic category-absent cases assert HTTP 200, no cards, no evidence call and count totals | Real overseas-florist absence and one-card florist expectations remain separate dataset checks |
| Stable order and input preservation | Selector sorts newly filtered arrays; real loader freezes the supplied snapshot; existing checks exercise an equal-price tie | Focused evidence for repeated/reordered input, a frozen request, complete before/after preservation, and two/three-plus result limits as needed beyond existing cases |
| Candidate and busy-set scope | Code uses exact city/category membership and collects all busy candidate IDs before selection | Explicit multi-category, out-of-scope busy profile, full sorted busy set and busy-venue checks remain unrecorded in the inspected suite |
| Structured authority | Selector never reads description, name or quality flags | Record this direct inspection; add a controlled conflicting-prose check only if needed to resolve an actual uncertainty |

The current `npm test` includes `scripts/slice/contracts.test.mjs` and the P01 record reports 21/21 combined checks. A future new colocated domain suite is not automatically included: record its actual command and request any shared package-script update through the coordinator. Reuse the accepted test facilities and pinned public examples without creating a generic runner or tests that merely mirror private helpers.

During this documentation refresh, `node --test --test-name-pattern="optional eligibility|real catalogue -> HTTP|real no-match" scripts/slice/contracts.test.mjs` failed during module loading with `ERR_MODULE_NOT_FOUND` for `csv-parse`. No selected test executed, so this is an environment limitation, not a reproduced domain failure or a fresh passing run. Dependencies were not installed for this document-only review. Historical accepted evidence remains tied to the unchanged candidate; future execution requires the documented dependency installation.

### Real-data integration obligations

The [data-derived rehearsal cases](../architecture/implementation-and-verification.md#data-derived-rehearsal-cases) remain required expectations for the pinned dataset. For Алматы / Ведущий / корпоратив / 1,500,000 KZT, with optional filters omitted:

| Date | Eligible count | Ordered selected IDs |
| --- | --- | --- |
| `2026-10-10` | 5 | `HK-88430`, `HK-29829`, `HK-27222` |
| `2026-10-11` | 4 | `HK-44923`, `HK-27222`, `HK-44733` |
| `2026-10-01` | 3 | `HK-88430`, `HK-44923`, `HK-75012` |
| `2026-10-06` | 7 | `HK-88430`, `HK-44923`, `HK-29829` |

These requests have ten city/category candidates. The October 1 to 6 transition must preserve evidence that `HK-29829` became available while `HK-75012` remained available but lost its displayed position. The October 10/11 busy counts are both four; identities, not count changes alone, explain replacement.

Also retain the florist one-card case, budget-1 `no_match`, overseas-florist `category_absent`, and a real busy venue ID/date selected and recorded by the coordinator. October 10 and budget-1 now have recorded P01 execution evidence; the other dataset expectations remain historical computed values in the inspected sources. None were freshly recomputed in this refresh. Reconcile them if the dataset changes.

P05 owns the remaining combined-backend verification through the actual CSV loader, reusing unchanged P01 integration evidence where sufficient. P03 may use the public loader from its committed P01 base in checks, but never unpublished P02 content or production adapter imports. Controlled plain-data cases prove domain behavior, not CSV decoding, HTTP statuses, browser narratives, live AI quality or process-restart acceptance. Do not erase existing P01 observations or count them as passage of different later cases.

## Handoff and OpenSpec transfer

The archived P01 card supplies accepted slice/live evidence, public contract v1, the common downstream base `8aaad189393be78a21f1793afd2014c55794f7cd`, and confirmation that its coordinator stops implementation writes to transferred module paths. P01 is no longer an unfulfilled prerequisite. Before dispatch, verify those pins and current ownership; if the coordinator selects a newer common base for P02–P04, record that choice explicitly and compare affected content. The current HEAD is a reviewed snapshot, not an automatic replacement for the pinned common base.

Link this outcome from the applicable OpenSpec proposal and carry its operation, invariants, ownership, checks and setup assumptions into specs/design/tasks. Retain current task stages and evidence rather than treating unchecked publication tasks as unimplemented work. Resolve change placement with the current coordinator instead of unilaterally selecting a competing product change.

The planned implementation branch is `codex/cs-03-domain`, in sibling worktree `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-03`. Verify path availability, base, harness and ownership before creating or assigning it. This document creates no worker, worktree or shared integration reservation.

Return met/remaining criteria, actual checks and skips, representative result facts, contract revision and tested/committed/published SHAs as applicable. The coordinator owns shared stages, P05 integration and publication. If P01 already meets every P03 criterion with sufficient evidence, hand off that evidence without rewriting the selector or making an empty commit.

## Document verification

This planning document was reviewed against the P03 proposal, P00 interfaces/design, current selector and consumers, controlled slice checks, archived P01 evidence, synchronized slice specification and updated P01 planning outcome. The accepted candidate is an ancestor of the inspected HEAD and relevant tracked implementation/data/contracts are unchanged. Local Markdown file targets were checked. The attempted focused test run was blocked before test execution by missing `csv-parse`; no fresh application test pass, dataset recomputation, remote-state check, credential access, live call, implementation or Git publication is claimed.
