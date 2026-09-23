## Why

The existing contractor screen loses prior results and does not expose optional conditions or explain date-only changes. Complete the approved [P06 frontend flow](../../../../.brainstorming/2026-09-23-frontend-flow-design.md) so organizers can edit deliberately and understand truthful results.

## What Changes

- Add optional language/duration disclosure, supported defaults, dynamic date bounds, associated validation and reset.
- Retain successful conditions/results across edits, pending submissions and failures; guard duplicate, superseded and reset requests.
- Render public outcomes, explanation modes, exclusion facts and evidence-based date comparisons accessibly.
- Verify real backend browser interactions, focused controlled race cases and clean production launch.
- Exclude booking, persistence, providers, ranking changes, new infrastructure and dependencies. P07 final live-quality review and three-request timing remain separate.

## Capabilities

### New Capabilities
- `contractor-frontend-flow`: Complete explicit-submission interaction, retained snapshots and truthful date comparisons.

### Modified Capabilities
None. This extends the P01 screen; its statement that optional controls are outside P01 remains historical scope.

## Impact

Frontend modules and frontend-local styles; coordinator-owned focused browser checks, test registration, necessary README/architecture updates and OpenSpec artifacts. Public v1 HTTP contracts and backend implementations remain unchanged. Use the existing one-process Next.js app and supplied CSV with no new accounts, packages or services.
