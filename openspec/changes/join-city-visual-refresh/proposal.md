## Why

The approved [Modern Join City outcome](../../../.brainstorming/2026-09-23-join-city-visual-refresh-design.md) makes the existing selection screen recognizable and easier to scan. The user requested implementation on 2026-09-23, superseding that document's historical planning-only authorization.

## What Changes

- Introduce the compact light Join City header, three colored chevrons and approved typography/palette.
- Separate explanation-led contractor cards with category icons, visible starting prices and readable factual footers.
- Render normalized result conditions as passive wrapping labels, preserving pending/draft distinctions.
- Align initial, empty, pending, error and mobile states while preserving all selection and request behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `contractor-frontend-flow`: recognizable compact identity, distinct cards and complete snapshot labels across desktop/mobile states.

## Impact

Presentation changes in front/ContractorForm.tsx, front/RecommendationResults.tsx, front/flow.css and src/app/style.css; focused existing browser checks, OpenSpec and architecture index. No backend, API, data, storage, ranking, booking, provider, dependency or infrastructure changes. No remote fonts or photos; local original vectors only. Verify real catalogue scenarios, request-state behavior, keyboard and 375/390/1280 px layouts; preserve other contributors' changes.
