## Why

The working selection screen hides its main value behind a tall form and dense introductory metadata. The user approved an explanation-first visual and UX redesign after reviewing its fit to the task brief; see the [approved outcome](../../../.brainstorming/2026-09-23-contractor-ui-upgrade-design.md).

## What Changes

- Compact the form, improve visual hierarchy, readable dates/money and optional-filter summaries.
- Make complete contractor explanations prominent; preserve visible reasons for fewer cards, both empty outcomes, modes and date changes while disclosing only technical selection details.
- Provide explicit mobile results navigation and optional condition collapse without asynchronous focus jumps.
- Distinguish submitted pending conditions from further unsent edits and preserve existing request safety.
- Verify real scenarios, responsive/keyboard behavior, unchanged contracts and reproducible launch.

No booking, accounts, ranking changes, backend changes, dependency additions, new external services or fabricated contractor attributes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `contractor-frontend-flow`: explanation-first presentation, concise truthful outcomes, responsive results access and precise pending/draft feedback.

## Impact

Frontend components/local display helpers and styles, application shell styles, focused browser acceptance, usage documentation, architecture index and OpenSpec. Public contract v1 and all server/domain/provider code remain unchanged. One local Next.js application; no additional infrastructure or account cost.
