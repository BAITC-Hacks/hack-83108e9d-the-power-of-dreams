## Context

See [proposal](proposal.md) and the approved P02 outcome. Base f9ed31fb5b4c99d42c1051d3cd43cc9f5af59766 includes accepted P01 product 8aaad189393be78a21f1793afd2014c55794f7cd plus later documentation. Existing loader behavior is reused. [System architecture](../../../architecture/system.md) governs the surrounding application.

## Goals / Non-Goals

**Goals:** close the specific catalogue evidence gaps with colocated public-operation checks and bounded repairs only if needed.

**Non-Goals:** process caching/restart, HTTP errors, AI, selection, UI and final P07 submission verification. Existing slice checks supply module/handler compatibility evidence; service recreation is not an OS restart test.

## Decisions

| Boundary | Purpose / operation | Data / errors | Dependencies / owner | Verification |
| --- | --- | --- | --- | --- |
| Catalogue | `loadCatalog(path: string): Promise<CatalogLoadResult>` reads one supplied file | Owns immutable profiles/options/version; ready snapshot or unavailable kind missing/unreadable/invalid; unexpected faults reject | Filesystem, pinned CSV parser, platform hashing, public plain types and shared date predicate; apply owner writes only back/catalog/ | Colocated acceptance checks plus existing slice suite |
| Shared date predicate | `isCalendarDate(value: string): boolean` validates exact real YYYY-MM-DD | No owned state; false for invalid strings; no trimming, window policy or local-time conversion | Built-ins only; coordinator exclusively owns back/domain/date.ts | Existing callers and invalid-date catalogue cases |

Publish/pin the existing date predicate at f9ed31fb5b4c99d42c1051d3cd43cc9f5af59766 as a shared backend boundary. Catalogue and request validation may import it. P03 ownership of back/domain/ excludes this coordinator-owned file. Its changes require reconciliation of both consumers. The design-role review selected this over relocation or duplicated validation because no behavior change is needed.

Retain the existing exact header set, strict UTF-8, nonempty catalogue, unique HK-numeric IDs, scalar/list/date validation and nested freezing. Reuse existing missing/directory-unreadable/header/UTF-8 and lifecycle checks. New checks target real counts/mapping, quoted records, duplicates/damaged values, fixed window, observable mutation and stable/changed raw-byte identity. Temporary files only; never edit raw/dataset.csv.

One call performs one filesystem read, no retry, network or writes. There is no new timeout/cancellation API; composition owns caching and process lifecycle. Preserve public contract v1 and its existing success/error examples. No new consumer package or frontend assignment is introduced.

Run with Node 24 and lockfile-installed dependencies using `node --test back/catalog/catalog.test.mjs`, existing `npm test`, and `npm run typecheck`. Coordinator installs dependencies and runs the combined build/launch scenario. No key, fee, server port or account is needed for catalogue checks; installation needs network. Production smoke uses a dedicated local port and explicit catalogue fallback, with no live provider call. P01 live evidence remains historical and is not repeated for unchanged runtime code.

## Risks / Trade-offs

- Directory unreadability does not prove operating-system permission denial → label this evidence precisely; no ACL mutation needed.
- New colocated tests are not discovered by the existing root command → coordinator adds the explicit catalogue test path to npm test after worker acceptance.
- Concurrent feature integrations can advance main → reserve shared integration ownership and reconcile the candidate before publication.

## Migration Plan

No data migration or dependency change. Integrate only accepted P02 commits, run affected checks against the candidate, publish main, synchronize specs and archive. Rollback is a normal revert of the P02 changes; source data remains untouched.
