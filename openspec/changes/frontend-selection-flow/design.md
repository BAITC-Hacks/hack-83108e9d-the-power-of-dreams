## Context

See [proposal](proposal.md) and the [approved P06 outcome](../../../.brainstorming/2026-09-23-frontend-flow-design.md). Base is d2b61e2abf07241318c6e1a1c93438de4496cfae on codex/cs-06-front. Backend 4ade2fa4022d633e9d96b50188be4cee4fb99539 and contract package commit e424a13fec851d7f9f0f4e076f70649e716336f7 are ancestors. Canonical package is D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/specs/contractor-selection/versions/v1; all six paths/blobs verified against that commit before implementation. Read version-local examples, distinguishing real historical responses from controlled examples. Existing runtime/backend stays unchanged.

## Goals / Non-Goals

Use a small set of local React state and pure helpers. Preserve the public screen export and public contract v1. No global store, schema framework, new dependencies, client selection rules, persistent history or new external ports.

## Decisions

Explicit submit is the sole recommendation trigger. Draft, options state, active request and last success are separate. A synchronous request identity/ref blocks equivalent pending submissions; a different valid submission aborts and supersedes it. Guard success, failure and final cleanup by identity and abort status. Editing does not supersede a pending request. Reset invalidates identity, aborts, clears snapshots/narrative/errors, restores supported defaults and focuses city. Unmount aborts options and recommendation operations. No automatic retry; manual retry remains possible, and cancellation does not promise provider billing cancellation.

Use controlled form values and canonical options, with native accessible disclosure and explicit field validation/focus. Blank optional keys are omitted; positive finite fractional hours are accepted. Budget is a positive safe integer. Date copy uses returned inclusive bounds. A compact public-boundary shape guard rejects unusable JSON without importing server validation or adding a general schema system.

Store the complete successful response. Compare canonical inputs (including absent optional values) and catalog/policy versions, excluding only date. Pure comparison uses complete busy ID sets and old/new cards; it never reimplements selection. Return no narrative when incomparable, unchanged-list copy when IDs/order match, otherwise only proven new-busy/new-available/displaced/promoted facts. Compare known prices before saying cheaper; explain equal prices by catalogue ID. No invented one-to-one replacements. Errors preserve baseline; successful empty outcomes replace it.

### Modules and ownership

| Module / owner | Operations, inputs/outputs/errors | Owned data / allowed dependencies | Verification |
| --- | --- | --- | --- |
| front/ContractorForm.tsx / apply | Default screen; GET options and POST recommendations; safe local error messages and support ID | Draft, options, active identity, successful snapshot, comparison; React, public DTOs, local helpers only | Real browser, delayed requests/reset/unmount |
| front/EventConditionsForm.tsx / apply | Optional form presentation extraction; typed value/options/error/action props | Disclosure presentation only; React and frontend/public types | Keyboard, validation, omissions/defaults |
| front/RecommendationResults.tsx / apply | Successful response and derived narrative to labelled cards/empty state | No network or selection; public DTOs/local presentation | Modes, exclusions, flags, retained conditions |
| front/compareRecommendations.ts / apply | Two successful public responses to justified narrative | No I/O; public DTOs only | Real date pairs, promotion/equal-price controlled cases |
| front/ local helpers/styles/focused pure checks / apply | Only helpers needed by those operations | Acyclic browser-safe imports; no back/ or dataset | Typecheck and focused checks |
| scripts/frontend/, package test registration, src/app shell if needed / coordinator | Focused browser acceptance runner and existing test registration | Public HTTP/browser only; ignored test-results output | Real fallback/live and controlled rare states separately |
| README.md, architecture index and OpenSpec / coordinator | Accurate usage, evidence, stage state and handoff | Links to canonical artifacts | project-delivery and strict validation |

One frontend owner works sequentially in the dedicated existing cs-06 worktree. Root writes disjoint verification/docs only. A design role advises on acceptance setup; a review role later reads the frozen candidate. Shared contracts/examples already committed before dispatch. Shared integration worktree/main writes require exclusive ownership marker; no immutable package change is planned.

### Visual direction

Preserve the approved working screen: left-aligned form 340px/results fluid on desktop, form above results on mobile. System Cyrillic stack; white #FFFFFF page, #F3F5F7 form, #202936 text, #2457C5 focus/accent, #D9DFE7 borders and existing readable red errors. Explanations and starting prices carry hierarchy; conditions/status sit beside results. No marketing hero, new fonts, illustrations, animations or component framework. Frontend-local styles add only disclosure/actions/status wrapping. Keep stable focus during asynchronous completion and polite announcements.

### Run and organizer setup

Follow README with Node 24-compatible runtime and npm ci; build/start one Next.js process on free 127.0.0.1:3106. Separate live/error runs use free 3107/3108, integration acceptance 3116. Keep .next/temp/test-results inside the assigned checkout. Installation needs network; fallback needs no key, personal session, database or GPU. Live UI check uses existing private server OpenAI configuration and one bounded paid request; the user's implementation authorization covers required acceptance. Read only the needed credential through the existing server loader, never print it. Missing access remains an unmet live check. No new infrastructure is necessary.

## Risks / Trade-offs

- Stale async completion can overwrite reset or newer state → identity and abort checks on every completion path plus delayed-response checks.
- Counts alone cannot justify replacement reasons → compare full public busy IDs and versions, test both real date pairs.
- Browser fixtures cannot prove real selection/live integration → separate real same-origin scenarios and label controlled evidence.
- More than one agent touching shared files causes ambiguity → one frontend writer; coordinator owns shared registration/wiring/stages.

## Migration Plan

No data migration or API change. Verify existing real dense scenario first; implement frontend; run targeted/combined acceptance; commit/push feature; verify frozen integration candidate and promote main under shared reservation; synchronize specs and archive only with truthful acceptance/publication status. Rollback is a normal revert of frontend changes, preserving v1 backend. P07 receives exact accepted SHA, pins and observed browser evidence; final live text quality and three uncached timing samples remain P07.
