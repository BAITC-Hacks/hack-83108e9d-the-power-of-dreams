# Approved contractor UI upgrade

## Approval and outcome

On 2026-09-23 the user requested a frontend audit and a more attractive, useful UI using frontend-design. After reviewing the audit and its mapping to raw/proposal.md, the user approved implementation: "ок согласен давай сделай". This approval includes the acceptance refinements below. OpenSpec contractor-ui-upgrade becomes authoritative for implementation.

## Agreed direction

A light, expressive working interface for event organizers in Kazakhstan. Compact conditions on the left, prominent contractor recommendations on the right; a short header rather than a marketing page. White and cool light surfaces, ink text, one strong blue accent, clear Cyrillic typography. Keep the current stack without new libraries, accounts, services or downloaded fonts.

The reason each contractor fits is the primary card content, with a readable name and starting price. Keep explanations fully visible. Shorten the result introduction and place technical selection detail in an accessible disclosure. Never hide the reason for fewer than three cards, either empty outcome, explanation mode or evidence-based date changes. Do not invent ratings, booking availability or a best-match ranking when the backend orders by starting price.

Make selected optional conditions visible when collapsed, distinguish pending submitted conditions from unsent edits, and put useful feedback near the main action. On mobile provide explicit access to results and an optional way to collapse completed conditions, without moving focus automatically when requests finish. Format displayed dates and budget amounts legibly; preserve request values.

## Preserved behavior and exclusions

Keep explicit submission, editable pending fields, duplicate suppression, abort/request identity guards, reset/focus, retained successful snapshots, real empty successes, errors and safe public response validation. Keep contract v1, deterministic selection, source explanations, provenance and pure date comparison. No backend changes, new providers, booking, accounts, favorites or persistent history.

## Acceptance and setup

Use the real same-origin primary, rare, both empty and date-change scenarios; retain focused existing race/error checks. Verify desktop and mobile layout, visible required explanations, keyboard/focus, collapsed optional selections and user-triggered mobile navigation. Reuse source-matched historical live explanation-quality evidence; perform one live rendered check if private configuration is available. Final combined candidate must pass typecheck, tests, build and README clean installation/launch/primary scenario. Record actual results and publication stages in OpenSpec.

The prior audit observed the first card near 1480px on a 390px-wide initial page. The redesign should materially shorten the path and expose a direct user action to results. All checks use isolated worktree outputs and ports; paid AI is optional for normal local launch and never substituted by unlabeled fixtures.
