## Why

Price-only selection can omit a contractor whose stated style best fits the customer's wishes. The current AI selects a quotation only after the shortlist has been truncated. The user approved [brief matching with evidence and questions](../../../.brainstorming/2026-09-23-contractor-brief-matching-design.md) to help customers make an informed choice.

## What Changes

- Add optional free-text brief interpretation with visible, editable confirmation of preferences and avoidances.
- Rank all hard-eligible profiles using a fixed evidence index and the confirmed brief, preserving restart-stable ordering and the original no-brief behavior.
- Show supporting/contradicting profile excerpts, unknown conditions and a question; do not infer absence from missing information.
- Add a bounded Luna/Terra comparison and select the measured suitable model without automatic provider fallback; preserve a USD 5 total experiment ceiling.
- Keep the existing stack, single-category flow and catalogue. Exclude booking, plan B, packages, external enrichment and new infrastructure.

## Capabilities

### New Capabilities

- `contractor-brief-matching`: interpretation, confirmation, grounded matching, unknowns, evaluation and failure states.

### Modified Capabilities

- `contractor-selection-domain`: optional evidence-based deterministic order across all eligible profiles.
- `contractor-contract-foundation`: additive brief request/response contracts and safe interpretation errors.
- `contractor-frontend-flow`: reviewable brief controls and evidence presentation while preserving submission/race semantics.

## Impact

Public contract additions, a new brief interpretation endpoint, server AI transport configuration, a source-checked evidence index, domain matching, composition, frontend extensions, focused checks, and run/provenance documentation. No new dependencies or external services. Coordinator owns shared files; independent work is dispatched only from a committed contract base. Concurrent UI/NVIDIA tasks are being coordinated and shared integration remains reserved separately.
