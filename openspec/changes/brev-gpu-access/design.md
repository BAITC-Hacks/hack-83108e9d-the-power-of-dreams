## Context

See proposal.md. Windows has Node.js and WSL; Ubuntu and Brev were absent.
The user supplied a Brev key for the existing dreams-gpu environment. Actual
CLI v0.6.335 supports BREV_API_KEY in its environment, even though login help
does not expose the portal's --api-key option. Live listing and SSH succeeded.
The former unified-local-secrets change remains implemented with publication held.

## Goals / Non-Goals

**Goals:** repeatable private access, real GPU verification, reproducible setup.
**Non-Goals:** product inference endpoints, model selection, OpenAI adapter,
provisioning new resources, authentication/sharing changes, or publication.

## Decisions

- Owner: primary task 01a0cd47-bfde-7521-87c1-ce10dcf91d34, sequential tooling
  edits in the primary checkout; no workers or independent feature branches.
- scripts/brev/run.mjs is an operator wrapper, not a browser or server API.
  It accepts `status`, `refresh`, `gpu`, `smoke`, `setup`, or `exec <remote-command>` plus optional
  `--instance <name>`. It reads only BREV_API_KEY through back/config/secrets.mjs.
  It passes the key via WSLENV to Ubuntu-22.04 (root owns this local CLI setup),
  then Brev or SSH with agent forwarding disabled. Never put the key in argv.
  Linux callers invoke installed tools directly. Output is operator tool output
  with exact key redaction; exit status propagates; failures use stable codes,
  safe messages and requestId. No dependencies beyond Node and the secrets reader.
- Finite operations have a 120-second child timeout (setup: 600 seconds), no wrapper retries; Brev
  may retry connection setup internally. Exec is explicitly operator supplied and
  may mutate the VM; a local timeout does not guarantee remote cancellation.
- scripts/brev/gpu-smoke.py verifies CUDA plus a fixed matrix multiplication
  with an exact expected result. It contains no dataset and downloads no model.
- scripts/brev/setup.sh installs pip/venv if needed, then creates an isolated
  environment in /data/dreams-gpu and installs a pinned CUDA 12.6 PyTorch wheel
  with NumPy for tensor conversion. `refresh` prepares the Brev SSH configuration.
  It runs only when explicitly invoked on the VM; no automatic startup service.
- Use the existing L40S and /data disk. Internet to NVIDIA, GitHub, Ubuntu and
  PyTorch registries plus SSH connectivity is required. Operator needs a Brev
  account/key scoped to the environment. GPU cost shown by user: $1.74/hour,
  storage $0.03/hour even when stopped. No additional account or paid service.
- Store commands in README and actual evidence in tasks.md and docs/tooling.md.
  Product architecture is unchanged; architecture/README.md remains its index.

## Risks / Trade-offs

- Provider/CLI behavior changes -> pin observed version and record actual checks.
- Running VM bills during idle -> explicitly report running state at handoff.
- User-command output may contain its own secrets -> use this operator tool only
  for trusted diagnostics; do not expose it through a product endpoint.
- Clean public checkout lacks uncommitted preparation -> verify a disposable
  file copy and report Git reproducibility as unverified under publication hold.

## Migration Plan

Install Ubuntu-22.04 and official Brev CLI; fill local BREV_API_KEY; run status,
GPU check, explicit remote setup and smoke check. Rollback removes these tooling
files only. Do not delete the VM, credentials, or remote data automatically.
