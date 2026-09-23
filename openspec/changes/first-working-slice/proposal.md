## Why

P00 froze the public interfaces but does not yet run the organizer's primary scenario. Implement the approved [P01 outcome](../../../.brainstorming/2026-09-23-first-working-slice-design.md) as one retained MVP slice, from the supplied CSV through real evidence extraction to a usable browser screen.

## What Changes

- Load and validate the real catalogue once per process; deterministically select up to three affordable eligible profiles.
- Use the existing OpenAI transport for one bounded evidence batch, validate source quotes and render factual explanations with truthful fallback modes.
- Expose the frozen options/recommendations HTTP contract and five required form fields, result cards and loading/error/empty states.
- Verify the dense real scenario, preliminary live quality, controlled fallback and production browser flow before publication.
- Keep language/duration controls, date-comparison narratives, rare/final live samples and three-request timing verification in later stages. No database, cache, new provider, framework or service.

## Capabilities

### New Capabilities
- `contractor-first-working-slice`: Real catalogue-to-browser primary scenario and bounded evidence-backed explanations.

### Modified Capabilities
None. Public contract v1 and the foundation requirements remain unchanged.

## Impact

New implementation under back/catalog, back/domain, back/ai/evidence, back/recommend, back/http, front and src/app; coordinator-owned composition, focused checks and run documentation. Existing secrets/transport and contracts remain unchanged. Uses accepted P00 base 9327715f06f7729ae58d4f322a8cf044f5a35c7a, verified as ancestor of current HEAD with no back/contracts differences. Paid live calls use the existing server secrets boundary. Run at 127.0.0.1:3101. User authorizes all OpenSpec stages and role-based subagents; the coordinator retains sequential slice ownership and delegates only bounded independent work.
