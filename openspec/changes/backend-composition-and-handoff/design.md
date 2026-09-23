## Context

See [proposal](proposal.md), the [approved outcome](../../../.brainstorming/2026-09-23-backend-composition-and-handoff-design.md), and [architecture verification](../../../architecture/implementation-and-verification.md). Starting main and this clean feature worktree are e5cffc7683885764eaa1648ba9fac2f77d4efc6d; accepted modules are already ancestors. The occupied integration worktree is preserved until ownership/processes are reconciled.

## Goals / Non-Goals

**Goals:** Close explicit evidence gaps and give P06 an exact consumer snapshot. Keep coordinator-owned integration sequential, with one independent check-writing apply worker and a read-only evidence/package reviewer.

**Non-Goals:** Reimplement modules, change public DTOs, add dependencies or paid requests without invalidated live evidence, or implement P06/P07.

## Decisions

Use existing injection seams and Node checks. If synthetic configuration cannot reach the real factory safely, expose one narrow internal factory seam in composition, preserving its default path. Do not create a generic test server or DI framework. Use actual production startup in an isolated temporary runtime directory for missing/damaged CSV so canonical source data and credentials are never modified.

| Module / owner | Operations and contract | Data / allowed dependencies / checks |
| --- | --- | --- |
| Composition / coordinator | createServices(path, load, evidenceFactory) -> retained Services promise; optional narrow configuredEvidence seam | One process snapshot/failure; concrete catalogue and AI adapters; isolated real loader-to-composition checks |
| Recommendation / coordinator, repair only | normalized request + AbortSignal -> response without requestId | Request-local cards; domain types/selection and evidence port only; existing mode/order/cancellation checks |
| HTTP + thin API routes / coordinator, repair only | GET options, POST recommendation -> public DTO/error | Fresh requestId; validate/invoke/format only; real production HTTP rehearsals and safe injected faults |
| Focused configuration checks / apply worker | synthetic config through real composition -> observable responses | Own scripts/backend/configuration.test.mjs only; no real secrets/network; separate worktree/output |
| Production acceptance / coordinator | temporary runtime roots + production start -> observed lifecycle/rehearsals | Own scripts/backend/production.mjs and temporary runtime directories; local port 3105; no canonical CSV edits |
| Consumer package / coordinator | read-only v1 DTO/examples/README | Public data only; .shared/specs/contractor-selection; full byte/path comparison and independent review |

Preserve fixed 2026-09-23..2026-12-31 window, safe integer budgets, positive finite duration, omitted optional versus invalid null/blank, catalogue-unavailable precedence after JSON parsing, safe 400/503/500 bodies. Normal outcomes remain HTTP 200. Evidence keeps selected-only single batch, six-second deadline through body consumption, zero retries and cancellation propagation; no new logs/storage/retry machinery.

Run setup follows README: Node 24/npm locked install, typecheck, npm test, build, production start on 127.0.0.1:3105 after checking ownership. No database/GPU/account/session is required for local checks. npm ci needs network; controlled tests use synthetic keys and provider transport. Live P01/P04 evidence is reused only after executable/data/model/prompt equivalence is checked. No additional infrastructure is justified.

Package format is existing TypeScript DTO plus minimal JSON examples, not generated OpenAPI/client. Commit the prepared .shared/specs snapshot separately, record the known package commit and absent canonical paths/checksums, acquire exclusive ownership before materializing, and compare complete bytes/path set. Preserve immutable version contents and exact-revision links through archive; update mutable indexes only. Put the downstream pin in this change's P06 handoff section so no unrelated P06 implementation change is created.

## Risks / Trade-offs

- Historical live records do not prove fresh provider behavior -> compare relevant source/data and explicitly retain P07 final live/browser/timing obligations.
- A process-local getter check is not restart evidence -> launch and terminate actual production child processes with isolated CSV roots.
- Untracked canonical package can obstruct main promotion -> record ownership manifest and move only verified owned paths to a checked backup before fast-forward, then verify tracked incoming bytes.
- Occupied integration worktree or main can belong to another task -> exclusive shared marker; inspect owner/processes and never overwrite unrelated work.

## Migration Plan

Commit planning, then bounded checks/seam only, integrate accepted worker SHA, verify combined candidate using README installation/build/start and dense scenario. Publish backend feature branch and package commit; materialize exact snapshot under reservation. Fast-forward clean main and normally push, verify ancestry, mark delivered stages, synchronize specs and archive, publish report-only changes. No data migration. On failure preserve commits/evidence and report the actual stage; do not reset or force-push.
