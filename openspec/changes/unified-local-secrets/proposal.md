## Why

Developers and organizers need one place to supply API keys and database secrets
without publishing credentials. The user approved the outcome in
[brainstorming](../../../.brainstorming/2026-09-23-unified-local-secrets-design.md).

## What Changes

- Provide a blank root `.env.example` and ignore actual `.env` files.
- Add a server configuration reader and a preflight command that validates
  explicitly required variable names without exposing values.
- Document copying, filling, checking, and privately transferring the file.
- Non-goals: provider integration, database selection, application startup,
  hosted vaults, encryption, and automatic credential distribution.

## Capabilities

### New Capabilities
- `local-secrets`: unified local server settings and organizer setup.

### Modified Capabilities
None.

## Impact

New `back/config/` module, `scripts/secrets/` commands and focused tests,
`.env.example`, ignore rules, and organizer documentation. No new dependencies,
HTTP endpoints, front-end changes, or changes to the pending product track.
