# Contractor brief matching

## Approved outcome

On 2026-09-23 the user approved the explored recommendation and explicitly asked to implement it. The feature accepts customer preferences and avoidances, considers all hard-eligible profiles, and shows profile-specific supporting excerpts, unknown conditions, and a useful question before choosing a contractor. Start with OpenAI GPT-5.6 Luna and compare GPT-5.6 Terra within a total USD 5 live experiment ceiling; the reported remaining USD 48 is user-provided, not independently verified billing information.

Preserve the existing single-category scope, hard constraints, at most three cards, reproducible ordering, existing empty outcomes, cancellation, and honest failure behavior. Alternative dates/budgets, multi-category packages, booking, external web enrichment, GPU infrastructure and new accounts are not included.

## Implementation direction

A visible interpretation step converts free text to preferences that the user can review and remove before submitting. A fixed, source-checked vocabulary/index records explicit statements in catalogue descriptions. Confirmed preferences rank every eligible profile deterministically: fewer conflicts, more matches, starting price, ordinal ID. Missing evidence means unknown, including the absence of an unwanted behavior; it never proves a guarantee. Conditions outside the vocabulary remain visible questions and do not influence ordering. The repeatability guarantee applies to the same confirmed request, catalogue, index and policy, including after restart. Independently parsing raw text again may produce a different suggestion.

The current price-only behavior remains for requests without a brief. No database or vector service is necessary for 66 profiles. New controls and evidence use the existing visual system; a concurrent UI task owns its broader redesign. A concurrent NVIDIA task is independent and must be reconciled before shared integration.

## Verification

Verify the example of a discreet host entering the shortlist from outside the price-only top three; preserve all hard filters; validate source attribution and unknown conditions; check restart repeatability, stale requests and cancellation, desktop/mobile keyboard flow, existing regression checks, and a documented clean launch. Compare 30 briefs on two models with two repetitions if the initial compatibility probe passes, measuring interpretation correctness, groundedness, unknown handling, latency and token cost. Record failures and unavailable provider access rather than silently changing model.

Active decisions and task evidence belong to [the OpenSpec change](../openspec/changes/contractor-brief-matching/proposal.md).
