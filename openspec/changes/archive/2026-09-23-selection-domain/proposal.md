## Why

P03 needs explicit acceptance of the pure selector and its factual diagnostics so downstream explanations can trust complete, deterministic results. The user authorized all stages on 2026-09-23 using the [approved selection design](../../../../.brainstorming/2026-09-23-selection-domain-design.md).

## What Changes

- Materialize the detailed P03 acceptance scenarios in a dedicated domain specification, preserving P00 contracts and P01 behavior.
- Add focused checks for the evidence gaps: candidate/busy scope, stable top-three selection, frozen inputs and repeated calls.
- Reuse existing boundary/priority checks and repair production code only for a demonstrated failure.
- Verify, publish, synchronize specifications and archive this change.
- Non-goals: new ranking policy, semantic scoring, request/catalogue validation, UI, explanations, provider calls, infrastructure or P05 final MVP acceptance.

## Capabilities

### New Capabilities
- `contractor-selection-domain`: explicit pure selection acceptance, complete exclusive diagnostics and deterministic ordering, refining the existing foundation and first-slice contracts without changing them.

### Modified Capabilities
None.

## Impact

The implementation owner is limited to `back/domain/select.ts` and a colocated focused check file. `types.ts` and the shared `date.ts` helper remain unchanged. The coordinator owns test-script registration, OpenSpec, architecture links and integration. No new dependency or API version is needed; P05 retains combined real-data/date narrative obligations.
