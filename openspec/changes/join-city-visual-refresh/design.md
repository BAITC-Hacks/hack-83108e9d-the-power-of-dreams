## Context

See [proposal](proposal.md) and the [approved outcome](../../../.brainstorming/2026-09-23-join-city-visual-refresh-design.md). Baseline 1a9a023 contains the delivered UI upgrade and branding. [Architecture](../../../architecture/README.md) and public contract v1 remain authoritative. This design coordinates the two presentation modules and shared styles; no state-machine redesign is needed.

## Goals / Non-Goals

**Goals:** implement the approved visual direction within the existing component boundaries, preserving every request and truthful-result behavior.

**Non-Goals:** new components framework, backend changes, imported legacy portal CSS/plugins, new services or dependencies.

## Decisions

Palette: paper #FFFFFF, canvas #F3F7F9, ink #243E50, Join blue #1D79C3, secondary ink #566C7B, divider #D9E3E9. Lime #CBE198, rose #EF8BA6 and sky #86D4F2 belong only to the mark. Input boundaries use a stronger slate for 3:1 contrast; primary button blue is darkened only if needed for text contrast. System Segoe UI supports Cyrillic without network fonts. Headings 36–40/28–32 px, 600 weight, desktop width about 26ch; card names 22px, explanations 16–17px/1.6, metadata 13–14px; tabular prices.

Layout: left-aligned compact header, 316px form plus flexible single list in a 1280px shell with 24–32px gap. White header surface, quiet canvas, 12–16px card gaps/radii, 8px field radii. On mobile one column, price below identity as needed, wrapping labels and existing explicit bottom navigation. Keep first full explanation inside the desktop viewport. Unlike the legacy event portal, no tall hero or media grid; unlike the baseline, cards have distinct boundaries. The three-color mark is the only expressive brand motif. No ornamental labels, card hover movement or background animation.

| Module / owner | Purpose and public contract | Data / allowed dependencies | Verification |
| --- | --- | --- | --- |
| ContractorForm.tsx / coordinator | Existing page component; catalog loading, draft/request/error/focus state and explicit actions remain unchanged; update header and initial motif only | Existing public contracts, display helpers, response guards, result renderer; no server imports | Real scenarios and controlled races/focus |
| RecommendationResults.tsx / coordinator | Existing result/narrative/previous props and exported conditions string remain compatible; derive passive labels from normalizedRequest and decorative local category SVGs | Own no persisted data; public types and display helpers only; unknown category uses neutral shape | Compare text to real responses; optional labels, unknown/long category and prices |
| flow.css and app/style.css / coordinator | Shared presentation, responsive layout, focus and reduced-motion rules | No new runtime dependency or asset network requests | Screenshots at 375/390/1280, contrast and focus/content bounds |

Category paths and chevrons are original inline vector geometry authored for this screen. Color and three-chevron direction derive from the user-supplied local Join City reference; no reference file or external library is copied. Record provenance with the delivered source. The initial motif reuses simple local selection geometry.

No new side effects or ports. Preserve cancellation, duplicate suppression, stale guards and no automatic browser retry; existing provider timeout/retry stays unchanged. Keep conditions() for pending copy and external consumers; successful labels are a separate presentation of the same normalized contract.

Run: existing README npm ci, typecheck/test/build, npm start -- --port 3134; real CSV, explicit empty OPENAI_API_KEY for no-cost catalogue acceptance. No account, key, paid service, GPU or hidden session is required. Optional live renderer smoke uses existing authorized loader only; prior live selection-quality evidence remains historical for unchanged backend. Use a fresh browser context and isolated build/output directories in the assigned worktree. Clean candidate installation/launch checks follow project-delivery.

## Risks / Trade-offs

- Larger metadata/labels may push cards down → check first full explanation at 1280×900 and keep header compact.
- Partial optionals can become ambiguous → render language and duration independently with explicit missing restrictions.
- Fixed mobile navigation can cover keyboard focus → preserve bottom clearance and set scroll padding; exercise explicit focus navigation.
- Another task may advance main → reconcile contract and integration candidate before publication; do not overwrite shared files.

## Migration Plan

No data migration. Verify local scenarios, commit only scoped files, then integrate with current main under exclusive ownership and verify clean candidate. Publish normally. Reverting these presentation files restores baseline without schema changes.
