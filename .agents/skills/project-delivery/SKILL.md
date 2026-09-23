---
name: project-delivery
description: Prepare README, environment, and material-provenance documentation; verify reproducibility; and prepare The Power of Dreams for submission. Use for run documentation, demos, or final submission, not for ordinary module implementation or backend-to-frontend contract handoff.
---

# Submission preparation and verification

Work in the current repository. Read the applicable rules in the root `AGENTS.md`, the current task brief, and the relevant OpenSpec change. Check competition constraints and format against the task brief and organizer instructions supplied by the user. Do not invent an unselected track or its criteria.

## Documents

Write explanations in English; preserve commands, variable names, and identifiers exactly. Describe only actual capabilities. If the task concerns one document, update that document and the necessary related links rather than generating the entire set automatically.

| File | Required content |
| --- | --- |
| `README.md` | Purpose and primary scenario; concise architecture and stack; system requirements; installation of pinned dependencies; environment setup; actual build and run commands; verification steps with expected results; known limitations. |
| `.env.example` | Parameter names and purpose, whether each is required, and safe examples. Never include working secrets. |
| `THIRD_PARTY.md` | Used libraries, models, datasets, templates, AI tools, and starter materials: source, license or terms of use, role in the project, and provenance of pre-existing elements. Do not guess an unknown license. |

Take commands from the actual configuration and versions from manifests and lockfiles. Do not present planned commands as working. Requirements, design, and task status remain in OpenSpec; the README briefly describes the implemented system and links to the relevant materials.

## Reproducibility verification

1. Map the selected task brief's mandatory criteria to evidence already stored in OpenSpec. Do not expand the agreed checks into a general audit.
2. For final submission, verify a clean checkout of the pinned revision: installation, build, launch, and the primary scenario exactly as documented in the README. Use an isolated environment under `AGENTS.md`; do not erase the working copy. If a clean run is impossible, state the exact skipped check and reason.
3. Confirm that a judge can use key functions without the author's personal session or hidden local files. Transfer required access through the agreed method; never publish secrets to Git.
4. Report real results and fixtures separately for external operations. Label demo mode explicitly in the UI and README; it does not prove service availability. The demo must match the submitted revision.
5. Verify the agreed UI states: loading, empty, error, and result. Primary actions must connect to the implemented scenario. If persistence is promised, verify that data survives a restart.

Tie results and skips to the exact SHA in the existing OpenSpec `tasks.md`, using the `AGENTS.md` format. Documenting an earlier result does not mean the check was rerun. For text-only edits, run checks only when needed to validate a changed instruction; do not repeat product cases without reason.

## Materials and submission status

- Preserve hourly evidence only when the supplied task brief or organizer instructions require that cadence; use their required format. Otherwise retain the agreed task evidence without inventing periodic reporting. If needed, `docs/progress.md` links to OpenSpec and does not become a second task board.
- Determine the deliverable set from the supplied task brief and official instructions. Video, presentation, and public deployment are not inherently required. Do not create them without a corresponding requirement or assignment.
- Perform Git integration and publication under the existing `AGENTS.md` protocol. Pushing to the repository is not the same as submitting the project to the organizer: report the published SHA, submission status, and the captain's remaining action separately when submission is unconfirmed.
- The final report must connect completed criteria to evidence and honestly list limitations. Do not claim submission readiness while a mandatory criterion is unmet or a required check is missing.
