## Context

See [proposal](proposal.md) and [approved outcome](../../../../.brainstorming/2026-09-23-selection-domain-design.md). Baseline f9ed31fb5b4c99d42c1051d3cd43cc9f5af59766 includes accepted P01 8aaad189393be78a21f1793afd2014c55794f7cd. Direct comparison finds unchanged domain, contracts and slice checks. This newer committed baseline is explicitly selected for P03. Other active changes retain their existing owners/holds; this session selects only selection-domain.

## Goals / Non-Goals

Close the approved P03 evidence gaps with a small pure-domain suite, preserving all existing behavior unless a check demonstrates a failure. Keep P02 validation, P04 evidence rendering and P05 final combined/date-narrative acceptance outside implementation ownership.

## Decisions

### Module and ownership

`select(profiles: readonly Profile[], request: NormalizedRequest): SelectionResult` owns local per-call candidate, eligibility and diagnostic computations. Inputs are canonical validated profiles with unique string IDs and a validated request. Output is outcome, ordered selectedIds and summary; empty outcomes are normal, and unexpected faults propagate. Imports remain type-only public/domain types and pure local functions. No service failure union, retries, timeout or cancellation parameter is appropriate for this synchronous pure port.

The apply owner may change only `back/domain/select.ts` and `back/domain/select.test.mjs`. Frozen `types.ts` and `date.ts` stay untouched. Existing catalogue/HTTP use of the pure date predicate is explicitly preserved; it does not transfer validation ownership. Coordinator owns package script registration, artifacts, architecture index and Git integration. No frontend assignment or new contract package is needed because public v1 and selection-v1 remain unchanged; committed P00/P01 public examples are the pins used here.

### Evidence before repair

Reuse `scripts/slice/contracts.test.mjs` for dense real HTTP, exclusive priority, budget/hour equality, omitted optionals, null hours and empty outcomes. Add only missing S1/S3/S4/S5 observable cases, using plain controlled profiles with Node's existing test facilities. Direct inspection proves descriptions are not read. A generic runner, rules engine or extra service would add complexity without satisfying any additional criterion.

The coordinator verifies the existing real CSV-to-HTTP dense scenario before dispatch, then integrates the focused suite into npm test. Real date-transition/rare florist cases remain P05 obligations; domain fixture evidence does not claim CSV/browser/live-AI acceptance.

### Run and integration

Use README `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm start -- --port 3103` on the frozen combined candidate, with a real HTTP dense/empty scenario. P03 requires no secrets, account, paid call, database or new dependency. Installation may need network. No hidden file or personal session may be required; the existing explicit catalogue fallback is the no-credential mode, not live-AI evidence.

Before shared integration, acquire the primary ownership marker exclusively. Verify current main and exact accepted feature SHA, use a separate clean sibling candidate worktree, and promote normally only after checks pass. Preserve unrelated changes and concurrent owners. An apply worker and focused read-only review role suffice; no design or research delegation is justified by this settled design.

## Risks / Trade-offs

- Historical P01 evidence can be misrepresented as new execution → retain provenance and record current commands/results separately.
- Independent feature changes may advance main → rebase the combined candidate on current agreed main and rerun affected checks under the shared reservation.
- Passing pure checks does not prove final MVP narratives or live AI → preserve P05 and existing live obligations explicitly.

## Migration Plan

No schema/data/API migration. Publish focused acceptance checks and any demonstrated minimal repair; synchronize this additive specification and archive after confirmed main publication. A regression can be reverted through normal Git review without changing contracts.
