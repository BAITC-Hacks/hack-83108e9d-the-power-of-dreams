# P02 — Catalogue and global form options

## Purpose and status

On 2026-09-23 the user authorized preparing a brainstorming file for [P02](../.proposals/02-catalog-module.md) before P01 finishes, with clarification if material ambiguity arises. This is an architectural refinement of the [approved product direction](2026-09-23-contractor-selection-architecture-design.md), limited to the catalogue module. It preserves existing decisions rather than reopening the architecture.

This document is a planning basis for OpenSpec transfer, updated after the user brought the accepted P01 implementation into the current branch. P01 acceptance and module release are now recorded in its archived task card; they are not inferred from this brainstorming document. P02 still needs its own scope/evidence reconciliation and ownership assignment, not another implementation of the completed slice. Active requirements, assignments and stages belong in OpenSpec; this file is not a second task board.

## Sources and observed baseline

- [Domain entry point](../domain/README.md) and [source data contract](../domain/data-contract.md): CSV representation, field meanings and historical dataset statistics.
- [System architecture](../architecture/system.md): module boundaries, ownership and local runtime.
- [P01 planning outcome](2026-09-23-first-working-slice-design.md): the first real slice and conditions for transferring its modules.
- [Archived P01 acceptance record](../openspec/changes/archive/2026-09-23-first-working-slice/tasks.md) and [current slice specification](../openspec/specs/contractor-first-working-slice/spec.md): accepted revision, actual checks, release of module ownership and remaining downstream obligations.
- [Implemented loader](../back/catalog/load.ts) and [controlled slice checks](../scripts/slice/contracts.test.mjs): existing behaviour and executable coverage to reuse.
- [Archived P00 design](../openspec/changes/archive/2026-09-23-foundation-and-contracts/design.md) and [current foundation specification](../openspec/specs/contractor-contract-foundation/spec.md): frozen contracts and failure semantics.
- [Domain types](../back/domain/types.ts), [public JSON types](../contracts/contractor-selection.ts) and [development examples](../contracts/examples/README.md): materialized interfaces and explicitly synthetic examples.

The initial preparation inspected `8ecba1901a434cb4c0c0f6a710d804bdc6ab825c`, before the loader was present. The post-P01 inspection on 2026-09-23 found current HEAD `907468aebabb6e5d20c55656a17534ce186a6862`. The archived P01 record identifies accepted product SHA `8aaad189393be78a21f1793afd2014c55794f7cd`, confirmed main publication, 21/21 combined checks, clean installation/typecheck/build/start and a successful real dense browser/live scenario. It explicitly releases the transferred modules for P02–P04.

The accepted product revision and current HEAD have no differences under `back/`, `contracts/`, `scripts/slice/` or `package.json`. Reuse the recorded P01 evidence for this unchanged content. This update inspected source and evidence; it did not rerun tests/live calls or recheck the remote. Current HEAD includes later archive/report history and is distinct from the tested product SHA.

The earlier proposal index's single-change placement is historical: P00 and P01 were subsequently completed and archived as separate `foundation-and-contracts` and `first-working-slice` changes. Before future OpenSpec writes, reconcile the next change and its owner. Do not reopen either archive or overwrite another task's drafts based only on the original proposed name.

## Goal, approach and alternatives

P02 verifies and, only where required, completes the existing P01 loader's catalogue criteria. The loader already reads the supplied CSV without modifying it, retains complete server-side profile data, freezes the snapshot and returns either a complete valid snapshot or a safe typed failure. Missing evidence does not by itself imply missing functionality.

| Approach | Trade-off | Decision |
| --- | --- | --- |
| Extend the P01 loader using the frozen P00 boundary | Reuses the proven slice and limits work to missing catalogue criteria | Retain the agreed approach |
| Skip or repair malformed rows and return a partial catalogue | Keeps some data available but silently changes candidates and explanations | Incompatible with the agreed invalid-catalogue failure |
| Add a database, import pipeline or generic repository layer | Adds setup and lifecycle work without an accepted write or scale requirement | Outside MVP scope |

No new service, account, dependency, AI call, HTTP endpoint or UI is required for P02. Selection rules, request normalization, explanation generation and process-level lifecycle remain outside this module.

## Public operation and ownership

The frozen operation is `loadCatalog(path: string): Promise<CatalogLoadResult>` from `back/domain/types.ts`. Composition supplies the filesystem path. The loader returns:

- `{ status: 'ready', snapshot }`, where `CatalogSnapshot` contains `profiles`, `options` and `catalogVersion`.
- `{ status: 'unavailable', error: { kind } }`, where `kind` is `missing`, `unreadable` or `invalid` for the corresponding expected failure.

Unexpected programming faults reject rather than being relabelled as ordinary catalogue unavailability. Failure results contain no source row, description, path, raw exception or HTTP response. The loader does not terminate the process.

After P01 releases the module, one P02 owner may edit only `back/catalog/` and its colocated checks. Allowed dependencies are filesystem access, the already pinned CSV parser, existing validation facilities, platform hashing and public plain types. Shared contracts/types, package and lock files, composition, routes, other modules and `raw/dataset.csv` remain outside this ownership. A necessary shared-contract change goes through the coordinator before dependent work continues.

The implemented loader imports `isCalendarDate` from `back/domain/date.ts`, which is not one of the frozen public boundaries and lies in the proposed P03 ownership area. Record this existing dependency before parallel assignments: the coordinator must either explicitly publish/pin the helper as a shared boundary with one owner or remove the cross-module implementation dependency through a scoped change. P02 must not silently edit the helper or treat P03 internals as public. This is an ownership reconciliation, not a request to redesign date behaviour or a finding that the existing date check fails.

## Loading and data interpretation

Use a CSV parser for UTF-8 input with headers and quoted fields; a comma inside a quoted description must not shift columns. Validate the source structure and required values before publishing any snapshot. Duplicate IDs or a damaged record invalidate the catalogue instead of silently dropping or repairing a profile.

Preserve the source meanings when constructing `Profile`:

| Source | Catalogue representation |
| --- | --- |
| `id`, `anon_name`, `city` | String `id`, `name`, `city`; do not interpret IDs numerically |
| `categories`, `event_formats`, `languages` | Arrays from pipe-separated values, retaining exact membership |
| `price_from_kzt` | Integer `priceFromKzt`, starting price in KZT per event; no hourly multiplication |
| `max_hours` | Numeric `maxHours`; an empty cell becomes `null`, meaning presence duration is inapplicable |
| `busy_dates` | Date-only ISO strings in `busyDates`; no timezone conversion or availability inference from descriptions |
| `description` | Complete source description for permitted server consumers; no truncation, AI rewrite or evidence normalization here |
| `synthetic`, `city_imputed`, `price_imputed` | Explicit `TRUE`/`FALSE` decoding into the corresponding `qualityFlags` booleans |

Source-record validation is distinct from HTTP request normalization. P02 does not infer aliases, apply eligibility rules, or use prose to overwrite structured values. Snapshot objects and nested data must remain immutable to consumers; the concrete protection mechanism follows the accepted P01 implementation and must be verified beyond merely compiling readonly types.

P01 already uses `Object.freeze` for the snapshot, profile objects, their lists/flags, options and date window. Its loader requires the exact 13-header set (allowing a different column order), a nonempty catalogue, unique `HK-` numeric-suffix IDs, nonblank name/city/description, positive safe-integer prices and positive finite hours or an exactly empty hours cell. Pipe lists are trimmed and reject blank/duplicate entries; an empty busy-date list is permitted. Busy dates must be real dates inside the fixed window. UTF-8 decoding is strict, with BOM support in parsing. These are observed P01 behaviours to preserve and check against accepted requirements, not new universal source-format decisions imposed by this document.

## Options, calendar and catalogue version

Derive unique global `cities`, `categories`, `eventFormats` and `languages` from the complete valid catalogue. Use the fixed string ordering already specified by P00, without locale-dependent sorting. A category remains available in global options when absent from a particular city or unavailable on a selected date.

Return the agreed inclusive `dateWindow` of `2026-09-23` through `2026-12-31`. It is the supplied calendar's supported window, not a moving window based on today's date or the earliest/latest busy date.

Set `catalogVersion` to `sha256:` followed by the lowercase SHA-256 digest of the exact loaded CSV bytes. Parse and hash the same read; do not hash a reconstructed representation or reuse the fixture's placeholder digest. A formatting-only byte change may change the token, as accepted by P00. Selection policy versioning and browser comparison behavior belong to their existing owners.

The server snapshot retains descriptions, calendars and provenance flags. P02 does not make the snapshot a public catalogue endpoint; HTTP consumers receive only the fields allowed by their contracts.

## Side effects and lifecycle boundary

One invocation makes one file-read attempt, with no retry, network access, writes or hidden reload. The frozen loader port has no cancellation parameter or provider deadline; do not introduce an independent retry/timer framework.

Composition owns one shared attempt per process, including concurrent first requests, and retains either success or expected failure until restart. P05 verifies that missing, unreadable or invalid CSV leaves the server reachable, yields fresh-request-ID `CATALOG_UNAVAILABLE` responses and prevents AI calls. P02 supplies the typed result; it does not implement process caching, HTTP 503, request IDs or restart handling.

## Verification plan

Separate implementation, existing execution evidence and remaining focused checks. P01's recorded successful run covers the existing slice suite; reading an assertion or implementation in this update is not a fresh execution result.

| Area | Existing P01 implementation / evidence | Remaining P02 evidence |
| --- | --- | --- |
| Real catalogue and dense path | Loader feeds real HTTP handlers; existing check asserts dense 10/5/counts/ordered IDs and safe projected cards | Explicit 66 unique profiles / 9 null hours and selected source-to-profile decoding assertions |
| CSV decoding and validation | Parser, list/flag/scalar/date checks and duplicate-ID rejection exist; executed negative checks cover wrong headers and invalid UTF-8 | Focused quoted-comma, pipe/flag/null mapping, duplicate-ID and damaged-record cases on temporary data |
| Safe missing/unreadable failures | Existing checks use an absent file and a directory path, returning missing/unreadable | Reuse; a directory-path test is not evidence of OS permission-denial handling |
| Global options and identity | Existing real HTTP check verifies all four unique sorted option arrays and the independent raw-byte hash | Explicit fixed window plus unchanged/changed valid-source token behaviour |
| Immutability | Nested snapshot data are frozen in the implementation | Observable attempted-mutation check, rather than a type-only assertion |
| Retained failure and recovery | Existing controlled checks cover shared in-flight promise, one load, fresh 503 IDs, no evidence factory on failure, recovery with a new service instance and retained success | Reuse at module/handler level; do not describe service-instance recreation as an OS process restart test |

The target observations below still apply. Fulfil them by reusing sufficient existing evidence and adding only missing checks or bounded repairs.

| Criterion | Smallest useful check and expected result |
| --- | --- |
| Real source loading | Read the supplied CSV: 66 unique profiles and 9 `maxHours: null`; lists, full descriptions and flags retain source values |
| Correct decoding | Focused temporary input with quoted commas, pipe lists and boolean values maps to the expected fields; blank hours do not become zero |
| Validation and safe failure | Missing file, controlled unreadable input, malformed structure/value and duplicate ID produce the applicable safe category, without a partial snapshot |
| Global options and window | Options equal the unique fixed-string-sorted catalogue values, independent of city/date filters; window matches the fixed contract |
| Immutable data | A representative consumer mutation attempt cannot change profiles, nested lists, flags or options visible to another consumer |
| Catalogue identity | Token matches an independently computed digest of the loaded bytes; unchanged bytes give the same token and a changed valid temporary source changes it |
| Contract compatibility | Existing `npm run typecheck` passes; relevant existing contract checks remain valid |

The dataset counts above are historical facts from the data contract and acceptance expectations for this supplied snapshot, not universal loader limits or fresh measurements. Negative cases use temporary files; never corrupt the original CSV. Retain the existing real-filesystem directory-path unreadable case. If a separate permission-denial case is needed but unavailable on the platform, describe that limit rather than treating the existing case as proof of all permission failures.

The current `npm test` includes `scripts/slice/contracts.test.mjs` alongside the existing secrets, transport and fixture suites. It does not automatically discover new colocated catalogue checks. Record an explicit command for any new P02 checks; coordinator ownership applies to changing the root test script or the existing shared slice suite. Avoid a generic test harness and tests that mirror private functions. P05 verifies the combined backend after P02–P04 using unchanged P01 checks where sufficient; full final clean-checkout acceptance remains with P07. P01's earlier clean production success is already recorded and must not be relabelled as unperformed work.

## Setup, handoff and OpenSpec transfer

P02 uses the accepted repository stack and lockfile, the supplied CSV, and compatible Node.js/npm. Dependency installation may need network access; catalogue execution and checks need no credentials, paid API, server port, database, Docker or GPU. The updated P01 outcome and task card record the user's explicit removal of the historical deadline/reserve constraints: the user controls timing. Do not ask for a deadline or impose a four-hour/60-minute gate; required verification remains unchanged.

The archived handoff already supplies accepted P01 real-slice/live evidence, product SHA `8aaad189393be78a21f1793afd2014c55794f7cd`, unchanged public contract v1 and the coordinator's statement that implementation writes to transferred paths have stopped. Do not wait for P01 again. Before implementation, pin the same agreed base for P02–P04, verify harness/current ownership and resolve the date-helper dependency above. If choosing the later current HEAD to include archive records, record that choice explicitly and retain the mapping to the tested product SHA. P01 main publication is recorded; this update does not independently reconfirm it or mark P02 delivered.

Transfer the remaining evidence and any demonstrated defects into the next appropriate OpenSpec proposal/specs/design/tasks; do not plan a new loader, hashing mechanism, snapshot-freezing mechanism or lifecycle implementation. Link this document and retain the frozen operation, error categories, global ordering, fixed window and byte-hash token. Reconcile change placement and ownership instead of treating the old proposal index as current task state. If focused checks pass unchanged implementation, P02 may consist of checks and acceptance documentation, with no runtime-code change.

If delegated later, use the planned `codex/cs-02-catalog` branch and sibling worktree `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-02` only after availability/base/harness checks. No worktree or worker is created by this document. Return met/remaining criteria, actual checks/skips, contract revision and tested/committed/published SHAs as applicable. P05 consumes the public loader operation, not decoder or validator internals. A module already satisfying all criteria needs no duplicate implementation or empty commit.

## Document verification

This update inspected the P02 card, P00 contracts, accepted P01 task/design/spec records, loader, composition and existing slice checks; compared relevant product paths with the accepted SHA; and checked local Markdown targets. It preserves the other P03/P04 brainstorming files. No application tests, CSV remeasurement, credential access, remote verification, P02 implementation or Git publication was performed. Historical test/live/publication results above remain attributed to the P01 acceptance record.
