## Why

Complete P02 catalogue acceptance using the existing accepted P01 loader. The [approved design](../../../.brainstorming/2026-09-23-catalog-module-design.md) identifies missing focused evidence, not a need to rebuild the module.

## What Changes

- Specify and verify source decoding, complete safe failure, global options, deep immutability and byte-based identity.
- Add only missing observable catalogue checks and repair demonstrated defects within the catalogue boundary.
- Reconcile ownership of the existing shared calendar-date predicate before delegation.
- Exclude new endpoints, UI, databases, dependencies, AI calls, selection policy and process lifecycle changes.

## Capabilities

### New Capabilities

- `contractor-catalog`: Detailed catalogue acceptance requirements transferred from the approved P02 outcome, preserving the frozen public contract.

### Modified Capabilities

None. Existing foundation and first-slice requirements remain unchanged.

## Impact

`back/catalog/` and colocated acceptance checks; coordinator-owned architecture references and OpenSpec artifacts. Public contracts, source CSV, dependencies and runtime behavior remain unchanged unless a bounded acceptance defect is demonstrated. No frontend handoff or new contract package is needed: P05 consumes the existing loader port.
