## Why

The user has provisioned a paid GPU environment and needs working access without
manual installation steps. The approved scope is recorded in
[the discussion outcome](../../../.brainstorming/2026-09-23-brev-gpu-access-design.md).

## What Changes

- Install local WSL Ubuntu and official Brev CLI, and prepare the existing VM.
- Add a repeatable operator command that loads the local Brev key privately.
- Verify real GPU computation and document actual setup and limitations.
- Preserve credentials, existing work, and the publication hold.

## Capabilities

### New Capabilities

None: operator tooling only; no product API or business behavior changes.

### Modified Capabilities

None. Specifications are skipped for this tooling-only change.

## Impact

scripts/brev/, .env.example, README.md, docs/tooling.md, local Ubuntu-22.04,
and the existing dreams-gpu machine. Local .env remains ignored. GPU billing
continues at the rate selected by the user; no new machine or payment is created.
Product adapters, model selection, and end-to-end recommendation behavior remain
outside this infrastructure slice.
