## Current preparation publication authorization

On 2026-09-23 the user explicitly requested committing and pushing all current
project preparation files for worktree development. This supersedes the former
Git-publication prohibition recorded in the historical session below for this
snapshot. Publication owner: `01a0cd80-4273-7ac2-8a94-9d61316b7aaf`; see the
[shared publication record](../openai-response-adapter/tasks.md#preparation-baseline-publication).
No GPU command, resource change, new live verification or product acceptance is
part of this publication. The earlier local tooling evidence remains historical.

## Task card

- Owner: primary Codex task 01a0cd47-bfde-7521-87c1-ce10dcf91d34; sequential.
- Path: D:/Alem/hack-83108e9d-the-power-of-dreams; current main base
  c4bb55fa71967c00e0ecfc147ad166de9d20cc2c. No Git writes are authorized.
- Scope: scripts/brev/, .env.example, README.md Brev section, docs/tooling.md,
  this change, approved brainstorming outcome, local ignored .env.
- External scope: local Ubuntu-22.04/Brev installation; existing dreams-gpu VM,
  Python tooling and isolated /data/dreams-gpu environment. No new instance.
- Effective authorization: perform setup and verification, install needed tools;
  keep prior no-commit/no-push/no-merge hold. No shared integration resources.
- Evidence: local working files and live remote state; no published revision.
- Acceptance: successful finite CLI diagnostics and actual CUDA computation;
  documented operator setup and limitations. No product completion claim.

## 1. Access and verification

- [x] 1.1 Install local tools and verify Brev status plus remote nvidia-smi.
- [x] 1.2 Prepare isolated PyTorch and verify a real CUDA matrix multiplication.

## 2. Repeatable tooling

- [x] 2.1 Add private-key-loading operator wrapper and verify status, gpu,
  smoke, usage errors, and remote failure propagation.
- [x] 2.2 Document setup and evidence; verify tooling from a disposable copy,
  missing-key behavior, and strict OpenSpec validation. Record publication skips.

## Stages

| Task | Stage | Evidence/revision | Remaining checks | Hold/blocker | Next action/owner |
|---|---|---|---|---|---|
| 1.1 | implemented | Ubuntu 22.04.5; Brev v0.6.335; live RUNNING/HEALTHY; L40S detected | none | publication prohibited | retain evidence / coordinator |
| 1.2 | implemented | Live smoke passed; torch 2.13.0+cu126; NumPy 2.2.6; pip check clean | none | publication prohibited | retain environment / coordinator |
| 2.1 | implemented | status, refresh, gpu, setup, smoke pass; error exits checked | none | publication prohibited | available for operators |
| 2.2 | implemented | Disposable copy checks passed; strict validation passed; README updated | fresh machine/committed checkout not checked | publication prohibited | report limitations / coordinator |

Tooling checkboxes will describe local acceptance, not feature publication.
Product integration, application build, OpenAI requests, and inference service
deployment are not claimed by this tooling change.

## Evidence (2026-09-23)

- Brev v0.6.335 installed in /usr/local/bin under local WSL Ubuntu-22.04.
  Status for dreams-gpu: RUNNING, COMPLETED, READY, HEALTHY.
- Remote NVIDIA L40S: 46068 MiB, driver 565.57.01; nvidia-smi reports supported
  CUDA 12.7; installed PyTorch runtime is CUDA 12.6. These are distinct values.
- Docker 27.3.1 and Compose v2.29.7 were already present. Installed pip/venv
  prerequisites and isolated Python 3.10.12 environment on /data, a 256 GiB disk.
- `node scripts/brev/run.mjs setup`: passed on the prepared machine; existing
  packages reused, NumPy added; resolved package list written remotely.
- `node scripts/brev/run.mjs refresh`: passed; SSH configuration refreshed.
- `node scripts/brev/run.mjs smoke`: real CUDA 256x256 matrix multiplication
  passed, every cell equals 256. No model or dataset used; not an inference test.
- `pip check`: no broken requirements. After smoke, GPU idle with 1 MiB used.
- Disposable copy C:/Users/Ramazan/AppData/Local/Temp/dreams-brev-check-qWId6Z:
  invoked outside repository with no copied .env; supplied Brev key via environment
  only. Usage exit 1, missing-key exit 1, status/gpu/smoke exit 0, remote `exit 7`
  propagated as 7. All six checks passed; output did not contain the credential.
- `node --check scripts/brev/run.mjs` and strict OpenSpec validation passed.
- Local .env holds the supplied key; `git check-ignore .env` confirms exclusion.
  No new firewall ports, sharing permissions, cloud instances or payment changes.
- No commits/pushes/merges. No committed clean checkout or fresh-machine install
  verification. Linux-native wrapper route not executed. Existing VM remains running
  at the user-selected rate; no scheduled shutdown was requested or created.

## Outstanding parent request

Coordinator switch: OpenAI adapter work continues in `openai-response-adapter`
under the same owner. Brev tooling remains locally accepted at 4/4; no workers
are active and publication remains prohibited. The user subsequently added the
OpenAI credential; the earlier absence below is historical evidence.

The original product integration remains separate: select the specialized GPU
workload/model and its service contract, implement the product adapters, and
verify the combined flow. OPENAI_API_KEY was absent from the project's secrets
reader on inspection; no OpenAI request was made. Do not represent infrastructure
readiness or these four tooling checkboxes as completion of that parent request.
