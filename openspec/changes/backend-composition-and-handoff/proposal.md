## Why

P02–P04 already provide the backend; P06 still needs verified process/configuration behavior and a committed, pinned consumer contract. Execute the [approved P05 outcome](../../../.brainstorming/2026-09-23-backend-composition-and-handoff-design.md) by closing only demonstrated evidence gaps.

## What Changes

- Verify the connected real-data HTTP scenarios, catalogue process lifecycle, repeatability, isolated AI configuration and safe unexpected errors.
- Add minimal focused checks and, only where needed, a narrow internal configuration seam or demonstrated repair.
- Publish an immutable v1 TypeScript consumer package, examples, run/check instructions and an exact P06 pin.
- Reuse sufficient unchanged P01/P04 live evidence. Preserve P06 UI and P07 final browser/timing/submission obligations.
- Complete acceptance, normal Git publication, spec synchronization and archive. Use bounded apply/review roles; the coordinator retains shared wiring and integration.

## Capabilities

### New Capabilities
- `backend-acceptance-and-handoff`: connected backend acceptance and immutable frontend contract delivery.

### Modified Capabilities
None. Existing public v1 behavior and module contracts remain unchanged.

## Impact

Allowed: `back/composition.ts`, demonstrated repairs in `back/recommend/` excluding ports, `back/http/`, thin API routes; focused `scripts/backend/` checks; test registration in `package.json`; `.shared/specs/contractor-selection/`; this OpenSpec change, synchronized spec, architecture index and P06 handoff card. No UI, dataset, dependencies, provider strategy, service, account, database, generated client or generic framework changes. README changes, if necessary, use project-delivery. Baseline is main `e5cffc7683885764eaa1648ba9fac2f77d4efc6d` and already contains accepted P02–P04.
