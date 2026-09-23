## 1. Real backend slice

- [ ] 1.1 Implement real catalogue loading, pure selection and bounded evidence; verify dense IDs/counts, live quote quality and controlled fallback/cancellation.
- [ ] 1.2 Compose retained startup, normalization and thin HTTP operations; verify public v1 success, validation, catalogue failure and empty outcomes.

## 2. Browser and delivery

- [ ] 2.1 Implement five-field first screen and cards; verify production browser, mobile/desktop, keyboard and loading/error/empty/mode states.
- [ ] 2.2 Document and verify clean install/build/start and primary scenario; record source/data/model/timing evidence, publish accepted candidate to main, then sync/archive.

## Stage table

| Task | Stage | Evidence/revision | Remaining checks | Hold/blocker | Next action/owner |
| --- | --- | --- | --- | --- | --- |
| 1.1 | planned | P00 accepted; scope review supported | dense live + controlled checks | none | coordinator implement |
| 1.2 | planned | public v1 frozen | HTTP/retention | depends 1.1 | coordinator |
| 2.1 | planned | approved visual direction | browser states | depends 1.2 | coordinator |
| 2.2 | planned | no product execution claimed | clean candidate + publication | depends above | coordinator |

Checkboxes measure final integration/publication, not local implementation. Current CLI 0/4 is expected.

## Coordinator task card

- Task/owner: first-working-slice 1.1–2.2; coordinator Codex 01a0cdbe-5faa-7441-b909-b902328c4d37.
- Scope: D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-01; codex/cs-01-slice; base 8ecba1901a434cb4c0c0f6a710d804bdc6ab825c; origin https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git; target main.
- Allowed: new scoped back/catalog, back/domain implementation, back/ai/evidence, back/recommend implementation, back/http, back/composition.ts, front, src/app, focused scripts/slice checks; necessary package scripts/Next config, README, architecture index, approved P01 timing amendment and this OpenSpec change. Preserve frozen contracts/types/ports, existing secrets/transport and unrelated work.
- Context/harness: committed AGENTS.md, .codex/config.toml, .codex/agents/review.toml and apply.toml, .agents/skills and openspec/config.yaml at base. Local scope edits are authorized input and are preserved in the scoped planning commit. No delegated frontend package; P01 is coordinator-owned, P05 handoff remains later.
- Authorization: user requests new change and all stages, role subagents, simple implementation; normal scoped commit/push/main integration authorized. User explicitly supersedes historical time/deadline/reserve requirements and controls schedule. No schedule questions remain.
- Checks: npm run typecheck; npm test; focused Node checks; npm run build; npm start -- --port 3101; real browser dense submission => 10/5 and HK-88430/HK-29829/HK-27222; record measured submit-to-visible duration; controlled failure preserves IDs/order and shows fallback; clean candidate uses README. Live gate stays unmet on failure.
- Dependencies: accepted P00 ancestor verified; back/contracts unchanged. No active worker writes. Existing other changes not selected or modified. Shared ownership not yet acquired; acquire before integration/main/package writes.
- Run storage: worktree-local node_modules/.next/temp; supplied read-only CSV; no persistent application storage.

## Read-only scope review

Role review, task /root/scope_review, existing P01 checkout, base above. Allowed read-only approved P01, archived P00 and frozen public/evidence contracts; no edits/install/paid calls/delegation. Returned supported: no material contract conflicts; cancellation, retained loading, batch/per-card evidence and response-date caption align. No critical incidental findings. This is planning consistency only. Its timing suggestion was superseded by the user's subsequent explicit schedule-control instruction.

## Evidence

Pending execution. Dense/rare/final checks are not implied by planning validation. Later P04/P07 rare/final live quality and three uncached timing requests remain outside P01.
