## Why

The accepted application chooses the cheapest eligible contractors even when their descriptions differ in event-format relevance. Implement the [approved NVIDIA ranking outcome](../../../.brainstorming/2026-09-23-nvidia-ranking-design.md), subject to its real-provider usefulness checkpoint before changing the working product.

## What Changes

- First measure the declared dense case against a source-evidence rubric. Failed access, inconclusive benefit or the 15-minute feasibility limit stops adoption and preserves the accepted baseline.
- Following the user's explicit approval after the original HTTP 410, use the current hosted `nvidia/llama-nemotron-rerank-1b-v2`; retain the original failure evidence and the same rubric and implementation scope.
- If that gate passes, generate a complete immutable NVIDIA score snapshot for category/format groups; select the top three from all eligible candidates by score, price and ID.
- Preserve strict filters, diagnostics, request inputs and the independent OpenAI explanation adapter.
- **BREAKING**: add explicit price/semantic ranking context and safe RANKING_UNAVAILABLE 503 behavior; semantic results and date comparisons must explain the actual policy.
- Validate real usefulness on both date pairs and another populated category, stability, failure behavior, browser timing and clean-checkout operation before enabling semantic mode.
- No GPU deployment, database, vector search, new service, provider registry, free-text brief or user mode selector.

## Capabilities

### New Capabilities
- `nvidia-ranking`: measured adoption, bounded generation, immutable complete snapshots and explicit ranking lifecycle.

### Modified Capabilities
- `contractor-selection-domain`: optional injected semantic ordering across all eligible candidates with unchanged filtering and purity.
- `contractor-contract-foundation`: explicit ranking mode and unavailable error in the shared public contract.
- `contractor-frontend-flow`: truthful semantic labels and policy-aware date comparison while retaining baseline behavior.
- `backend-acceptance-and-handoff`: consistent policy identity and explicit unavailable ranking initialization.

## Impact

Coordinator owns shared contracts, composition, configuration, UI copy, OpenSpec, documentation and integration. A bounded apply worker may own ranking preparation after committed readiness; a read-only review worker checks the adoption evidence and affected acceptance. Existing Node/TypeScript stack and CSV remain. Hosted generation uses the existing secret boundary and HTTPS; search needs only accepted score data, with no NVIDIA calls. Costs/entitlement remain unknown until observed. Historical P07 acceptance is a starting point, not NVIDIA acceptance. Other active changes remain owned by their existing tasks.
