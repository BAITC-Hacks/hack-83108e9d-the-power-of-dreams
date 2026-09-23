## 1. Real backend slice

- [ ] 1.1 Implement real catalogue loading, pure selection and bounded evidence; verify dense IDs/counts, live quote quality and controlled fallback/cancellation.
- [ ] 1.2 Compose retained startup, normalization and thin HTTP operations; verify public v1 success, validation, catalogue failure and empty outcomes.

## 2. Browser and delivery

- [ ] 2.1 Implement five-field first screen and cards; verify production browser, mobile/desktop, keyboard and loading/error/empty/mode states.
- [ ] 2.2 Document and verify clean install/build/start and primary scenario; record source/data/model/timing evidence, publish accepted candidate to main, then sync/archive.

## Stage table

| Task | Stage | Evidence/revision | Remaining checks | Hold/blocker | Next action/owner |
| --- | --- | --- | --- | --- | --- |
| 1.1 | implementing | real 10/5 + correct IDs; dense live passed on working tree | controlled checks | none | coordinator + bounded apply checks |
| 1.2 | implementing | production options and recommendation connected | HTTP/retention negative cases | none | coordinator |
| 2.1 | implementing | production live browser result, 3208 ms | responsive and remaining states | none | coordinator |
| 2.2 | planned | no product execution claimed | clean candidate + publication | depends above | coordinator |

Checkboxes measure final integration/publication, not local implementation. Current CLI 0/4 is expected.

## Coordinator task card

- Task/owner: first-working-slice 1.1–2.2; coordinator Codex 01a0cdbe-5faa-7441-b909-b902328c4d37.
- Scope: D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-01; codex/cs-01-slice; base 8ecba1901a434cb4c0c0f6a710d804bdc6ab825c; origin https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git; target main.
- Allowed: new scoped back/catalog, back/domain implementation, back/ai/evidence, back/recommend implementation, back/http, back/composition.ts, front, src/app, focused scripts/slice checks; necessary package scripts/Next config, README, architecture index, approved P01 timing amendment and this OpenSpec change. Preserve frozen contracts/types/ports, existing secrets/transport and unrelated work.
- Context/harness: committed AGENTS.md, .codex/config.toml, .codex/agents/review.toml and apply.toml, .agents/skills and openspec/config.yaml at base. Local scope edits are authorized input and are preserved in the scoped planning commit. No delegated frontend package; P01 is coordinator-owned, P05 handoff remains later.
- Authorization: user requests new change and all stages, role subagents, simple implementation; normal scoped commit/push/main integration authorized. User explicitly supersedes historical time/deadline/reserve requirements and controls schedule. No schedule questions remain.
- Checks: npm run typecheck; npm test; focused Node checks; npm run build; npm start -- --port 3101; real browser dense submission => 10/5 and HK-88430/HK-29829/HK-27222; record measured submit-to-visible duration; controlled failure preserves IDs/order and shows fallback; clean candidate uses README. Live gate stays unmet on failure.
- Dependencies: accepted P00 ancestor verified; back/contracts unchanged. Existing other changes not selected or modified. Exclusive shared ownership acquired by 01a0cdbe-5faa-7441-b909-b902328c4d37 for the integration worktree and main, through CreateNew at the canonical marker; same owner as this card. Release after shared writes/processes stop.
- Run storage: worktree-local node_modules/.next/temp; supplied read-only CSV; no persistent application storage.

## Read-only scope review

Role review, task /root/scope_review, existing P01 checkout, base above. Allowed read-only approved P01, archived P00 and frozen public/evidence contracts; no edits/install/paid calls/delegation. Returned supported: no material contract conflicts; cancellation, retained loading, batch/per-card evidence and response-date caption align. No critical incidental findings. This is planning consistency only. Its timing suggestion was superseded by the user's subsequent explicit schedule-control instruction.

## Evidence

### Apply assignment: focused acceptance checks

- Task/owner: 1.1/1.2 controlled checks, apply role /root/slice_checks under coordinator 01a0cdbe-5faa-7441-b909-b902328c4d37. Worker reads this absolute P01 card; coordinator alone updates it.
- Scope: D:/Alem/hack-83108e9d-the-power-of-dreams-wt-p01-checks; branch codex/p01-checks; base 37553c2a96189305281f9975974b45b8add70546; origin/target as coordinator card. Only scripts/slice/contracts.test.mjs is writable. Product defect reports return to coordinator without product edits.
- Readiness: separate registered sibling worktree; exact harness files compared equal (AGENTS.md, config, apply role, apply skill, OpenSpec config), required skills tracked at base. Dependencies installed by coordinator; separate temporary test directories, no server/ports/provider calls. Public v1 examples pinned at base; no frontend package dependency for server checks.
- Authorization: simplest Node built-in acceptance tests; commit/push only assigned file after passing; no package/config edits, main/shared writes, paid calls, spawn or user questions. Other writers are active elsewhere; preserve their work. User controls timing.
- Checks: real CSV dense 10/5/IDs and no-match; missing/invalid catalogue and retained load with fresh 503 IDs; malformed/unknown/null/optional/date input policies; batch identity/type versus per-card quote failures; all/mixed/empty modes; cancellation before/during evidence means AbortError, no fallback. Reuse transport deadline tests. node --test scripts/slice/contracts.test.mjs and npm run typecheck; return exact SHAs/outcomes/failures.
- Dependencies: coordinator observed real production browser live slice (3208 ms), strict dense live passed after narrow prompt repair. No extra feature scope/infrastructure. Return defects before out-of-scope repairs. Main integration remains coordinator-owned.

### Preliminary observations

Apply worker published only scripts/slice/contracts.test.mjs at 196b901bc7bf72e87a42e2b3090cf200633621a7, remote exact match, clean worktree. Coordinator inspected and cherry-picked as bae573b. Eight controlled checks pass and typecheck passes; actual provider requests were not made by worker. npm test now includes these checks alongside existing 13. Clean combined-candidate checks and final publication remain below.

Product snapshot 37553c2a96189305281f9975974b45b8add70546 includes the tested implementation and a syntax-only InputError constructor change for native Node TypeScript execution. Read-only review at that revision supported cancellation, retained load, public projection, stale/error state and server/client separation; no critical incidental finding. Apply checks report 8/8 plus typecheck (publication revision to follow). Browser observed desktop two-column layout; 390x844 mobile stacked form/cards with no horizontal overflow, visible blue keyboard focus; budget 1 no-match, budget 0 native validation; server stopped produced safe connection error and removed old results. Restart without an API key preserved real dense IDs and displayed catalogue-only label. Client bundle scan found no OPENAI_API_KEY, provider URL, node:fs, loadSecrets, literalSentenceChoices or busy_dates markers.

2026-09-23 preliminary working-tree evidence (product files not yet committed at observation): npm ci succeeded, typecheck/build succeeded after runtime-only import of unchanged transport, existing 13 checks passed. Real catalogue hash sha256:a197e65ae503f807e9592313b0dd47d56c038b4e2d0497af9a201e3c501dc856; 10 candidates, 5 eligible, exclusions busy=4/budget=1, IDs HK-88430/HK-29829/HK-27222. Transport tracked content unchanged from P00; current CRLF file hash differs from historical LF hash, so existing controlled checks were rerun.

Initial three live probes were mixed due to nonliteral or multiple-sentence output; no failed quote was accepted. Narrow prompt repair supplies literal sentence choices derived from the same descriptions without changing validation or provider schema. Fourth live probe passed in 2206 ms, pinned gpt-4.1-mini-2025-04-14, 1236 input/103 output tokens. Per-card source/relevance/1–2-sentence verdicts: HK-88430 pass (intelligent humour and organization); HK-29829 pass (entertainment and dancing); HK-27222 pass (European presentation and respect for traditions). Names-hidden texts substantively distinct. No access/model/network/quota failures; no retry within requests. These observations precede the committed candidate and do not establish final acceptance by themselves.

Production browser on 127.0.0.1:3101 passed real form→HTTP→CSV→selection→OpenAI→cards in 3208 ms measured by browser automation including observation overhead. All three accepted explanations visible in openai_evidence; pending disabled controls observed. Later P04/P07 rare/final live quality and three uncached timing requests remain outside P01.
