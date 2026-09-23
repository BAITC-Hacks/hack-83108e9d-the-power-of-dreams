## Why

P01 needs stable public and module contracts and a reproducible starting revision. Implement the approved [P00 design](../../../../.brainstorming/2026-09-23-foundation-and-contracts-design.md), retaining the [product direction](../../../../.brainstorming/2026-09-23-contractor-selection-architecture-design.md), with plain types and fixtures instead of extra infrastructure.

## What Changes

- Freeze public JSON DTOs, immutable domain data and injected function ports, with material success/error fixtures.
- Record downstream selection, catalogue failure, evidence and live acceptance obligations without implementing P01–P07.
- Add the CSV parser and minimal typecheck/test/build/run configuration; verify the foundation from a committed clean checkout.
- Publish the accepted P00 base, sync its specification and archive this change.
- The user explicitly requested a new change. This name supersedes the source document's suggested change name for P00 only. The existing untracked `contractor-selection-mvp` draft is reference material, preserved unchanged and excluded from publication. Future product implementation must reconcile that draft with these frozen interfaces.

## Capabilities

### New Capabilities

- `contractor-contract-foundation`: framework-independent interfaces, consistent development examples and reproducible P00 handoff.

### Modified Capabilities

None. Existing transport and secrets implementations are reused unchanged.

## Impact

Coordinator-owned `contracts/`, `back/domain/types.ts`, `back/recommend/ports.ts`, package/lockfile, TypeScript configuration, focused contract checks, README setup notes, tooling evidence and architecture index. No algorithms, CSV loader, evidence adapter, HTTP routes or screens; no database, GPU, Docker, service, schema generator or cloud account. Application build/launch and billable live quality checks belong to later stages and are not P00 passes.
