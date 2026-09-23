## Context

See [proposal](proposal.md) and [approved outcome](../../../.brainstorming/2026-09-23-contractor-ui-upgrade-design.md). Baseline is d07a7c286d1816be9e5cf1dcac000dad04fa018b on codex/ui-upgrade. [Architecture](../../../architecture/README.md) remains one Next.js application. The source matches the previously accepted P07 application; initial audit verified real fallback dense/empty requests and a 390px first-card position near 1480px.

## Goals / Non-Goals

Improve hierarchy and interaction without changing selection, explanations, public v1 types or network lifecycle. Keep request state in ContractorForm, result presentation in RecommendationResults and pure comparison unchanged. No generic component framework, new dependency, provider, fake portrait/rating or booking action.

## Decisions

### Visual system

Use a compact event brief beside a readable shortlist. Palette: paper #FFFFFF, canvas #F4F6FA, ink #182B49, cobalt #2855D9, line #DCE3EE, secondary #52617A. Use Segoe UI/system Cyrillic sans throughout with display 38-44px, section headings 22-26px, card names 22px, complete explanation 17px and supporting text 13-14px. Use tabular numbers for price and budget. Left align content; display typography and disciplined spacing carry the personality. Dark ink on cool light surfaces; only actions and helpful result emphasis use cobalt. No external fonts or ornamental motion.

Desktop: short page header, 316px compact form, flexible result area within approximately 1220px. Results show a short state/conditions summary, visible mode and first card; technical order/exclusion detail follows the cards in disclosure. Cards are distinct list entries with clear name/price, category/city, the explanation as the strongest prose, then calendar and compact provenance. Avoid a dashboard of interchangeable statistical cards. Mobile: compact two-column short fields where labels fit, one-column long choices, explicit result navigation and user-controlled collapse of the completed form. No asynchronous scroll/focus change.

```
Product identity                 Short purpose
Page title
Compact conditions   | Result count + successful conditions
Main action / reset  | Full contractor explanation + price
                     | Full contractor explanation + price
                     | Date changes / required outcome reasons stay visible
                     | Optional technical selection details
```

Compared with a wizard, the single screen keeps all five conditions editable for date comparisons. Compared with a cosmetic color-only change, this arrangement addresses the measured delay before the first card. Compared with a marketing hero, it preserves the working task. Replaced a generic multi-card dashboard concept with one brief and an explanation-led shortlist, because no analytics or promotional content is required.

### Behavior and modules

| Module / owner | Operations, inputs/outputs/errors | Owned data / dependencies | Verification |
| --- | --- | --- | --- |
| front/ContractorForm.tsx / coordinator | Existing GET options and POST recommendations; edit, submit, reset, explicit result navigation and collapse | Existing draft/options/request/snapshot/errors plus presentation state; React/public DTOs/local helpers only | Real requests, pending races, focus/reset, optional filters and mobile actions |
| front/RecommendationResults.tsx / coordinator | Public response/narrative/previous -> truthful visible cards/outcomes and selection disclosure | Presentation only, no I/O; public DTOs and formatting helpers | Dense/rare/both empty/modes/flags/date narratives |
| front/display.ts / coordinator | ISO date and numeric amount -> Russian display strings, canonical optional summary | Pure presentation; no browser/server or selection dependencies | Existing browser output and typecheck |
| src/app/style.css, front/flow.css / coordinator | Tokens, layout and component states | CSS only; no external assets/network | 375/390/1280 widths, keyboard, reduced motion and contrast |
| scripts/frontend/*, README, architecture index, OpenSpec / coordinator | Existing checks adapted to public presentation; focused new UI acceptance; documentation | Browser/public HTTP and relevant artifacts only | Tests/build, actual screenshots and clean README start |

Keep full request identity/cancellation and response guards unchanged. There are no new external ports: existing options GET and recommendation POST, no retries, provider timeout remains server-owned. Ref-based DOM focus/scroll only in explicit user handlers; result completion never steals focus. A form collapse control remains available to reveal inputs; reset/validation must reveal the form before field focus. Native accessible disclosure for optional conditions and selection details. Show selected optional values in its summary.

When a request is pending, compare draft with the pending request to distinguish further edits. The old successful result retains its own conditions. Otherwise compare draft with last success. Keep clear pending and unsent status near the main action. Use readable display dates while preserving ISO request values and date-comparison source facts; budget gets a grouped amount hint while the numeric input preserves exact validation semantics.

For fewer than three, expose eligible count plus catalog candidate count and nonzero first-failure reasons directly. For no_match expose all relevant nonzero reasons and explain each candidate is counted once; for category_absent suggest city/category changes. Only additional technical breakdown/order details may be collapsed. Explanations, provenance, explanation mode and comparison narrative remain accessible without disclosure. Never interpret absent busy marks as guaranteed availability.

### Run method and checks

Existing Node 24/npm lock and supplied CSV; npm ci, npm run build, npm start -- --port 3124 for preview; candidate 3125, live 3126 if free. Keep outputs .next/test-results within each checkout. Fallback starts with explicit empty OPENAI_API_KEY. It needs no account, GPU or database; installation needs network. One rendered live smoke uses existing private loader/funded OpenAI only, no logged secret. Reuse P07 per-card source-quality evidence while server/data remain identical, rather than claiming fallback proves it. Clean candidate follows README and runs the primary scenario without personal sessions or hidden files.

## Risks / Trade-offs

- Collapsed information could hide acceptance facts -> keep explanations, incomplete/empty reasons and date changes visibly outside disclosures.
- Compact native controls may clip on mobile -> inspect 375px/390px and long categories, min-width constraints.
- Collapse or navigation could steal focus -> user actions only; reveal form on reset/field error and reuse async focus checks.
- Display formatting could alter request meaning -> leave numeric/ISO payload and comparison untouched.
- Other tasks can update shared main -> feature stays isolated; acquire exclusive shared reservation before candidate promotion, then reconcile remote main and verify affected combined content.

## Migration Plan

Publish one frontend-only accepted feature revision, validate the combined candidate and fast-forward/push main under the shared ownership protocol. No data migration. Rollback, if requested, is a normal revert of the frontend change; no history rewriting. Save actual stages/evidence in tasks.md. Archive is separate from implementation.
