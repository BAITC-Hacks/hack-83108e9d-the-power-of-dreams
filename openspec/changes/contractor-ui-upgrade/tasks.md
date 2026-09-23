## 1. Frontend implementation

- [ ] 1.1 Implement the compact visual system, full explanation cards and visible outcome/date reasons; verify real primary, rare, both empty and date-change scenarios.
- [ ] 1.2 Implement optional-condition summaries, accurate pending/draft feedback and explicit mobile navigation/collapse; verify keyboard/focus, no edit-triggered calls and existing request-race/error cases.

## 2. Acceptance and delivery

- [ ] 2.1 Verify the combined frontend with typecheck/tests/build, 375/390/1280 screenshots, live rendered smoke or recorded limitation, and README clean-checkout installation/start/primary; align usage documentation.
- [ ] 2.2 Review accepted scope, publish the feature branch, verify the integrated candidate under exclusive ownership, publish remote main and record exact revisions and remaining limitations.

## Stage table

| Task | Stage | Evidence / revision | Remaining checks | Hold / blocker | Next action / owner |
| --- | --- | --- | --- | --- | --- |
| 1.1 | implemented | Real browser primary/rare/both empty/date pairs, live UI, screenshots passed | Review and integration | None | Coordinator |
| 1.2 | implemented | Controlled races/pending changes/focus/scroll and mobile navigation passed | Review and integration | None | Coordinator |
| 2.1 | implementing | 48 tests/typecheck/build; real live/503 and browser checks passed | Clean committed candidate | None | Coordinator |
| 2.2 | planned | Isolated feature worktree verified | Accepted SHA, reservation, candidate and publication | None | Coordinator |

## Assignment and readiness

Task: contractor-ui-upgrade, 1.1-2.2. Coordinator task 01a0ce17-fcfe-7e13-9aa8-238a516ab0a0 owns all writes and integration. Only this implementation change is active here; existing unrelated changes are untouched. User approved the redesign and acceptance refinements and explicitly requested implementation. Standing feature commit/push/main publication authorization applies; no user publication hold.

Scope: D:/Alem/hack-83108e9d-the-power-of-dreams-wt-ui-upgrade; branch codex/ui-upgrade; base d07a7c286d1816be9e5cf1dcac000dad04fa018b; origin https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git; target main. Allowed writes: front/ContractorForm.tsx, front/RecommendationResults.tsx, front/display.ts, front/flow.css, src/app/style.css, focused scripts/frontend verification, README, architecture/README.md, this change, its synchronized frontend spec, approved brainstorming outcome. No backend/contracts/data/dependency edits.

Context: proposal/design/delta spec here, approved outcome, raw/proposal.md and main frontend spec. Harness AGENTS.md, .codex/config.toml, required skills, OpenSpec config all at base d07a7c2. Existing codegraph contains no usable index; direct reads used. Runtime provides explorer/review tools; configuration alone is not isolation evidence. Workers are read-only; no implementation delegation or copied uncommitted base.

Contract: v1 at D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/specs/contractor-selection/versions/v1; package commit e424a13fec851d7f9f0f4e076f70649e716336f7; backend4ade2fa4022d633e9d96b50188be4cee4fb99539. All six package files match raw Git blob identity and backend ancestry checked before apply. Public contract and examples already committed.

Checks: npm run typecheck, npm test, npm run build; existing frontend browser/races/services checks adjusted only for approved display changes; focused new UI observations. Preview3124, candidate3125, live3126 only after port checks; isolated .next/test-results in assigned checkout; real supplied CSV. Fallback explicitly empty OPENAI_API_KEY. Historical baseline audit: real primary yielded 5 eligible and IDs HK-88430/HK-29829/HK-27222; budget1 yielded no_match. 390px first-card top about1480px, no horizontal overflow. No prior live call in this task.

Dependencies: no new contracts. Neighbor task01a0ce1a-086f-7772-9104-a72718f35156 owns independent brief-matching feature in wt-ai-upgrade; communicated preserved exports/lifecycle and JSX extension points. Its future contract is not an input to this redesign. Reconcile actual main if it advances. Shared reservation not acquired yet; acquire before integration/main writes only. Stop dependent edits on a breaking contract change, missing pinned package, conflicting writer, two failed approaches or about ten minutes without verifiable progress.

Read-only explorer assignment: inspect existing browser/races/services checks and proposed UI spec; advise minimal assertion changes and missing acceptance cases. No edits, installs, paid calls, shared stage updates, user questions or subdelegation. Root implements and verifies. Later scoped reviewer reads frozen candidate/evidence; no broader optional audit.

## Evidence

Planning: user approval recorded; OpenSpec stages followed. Official React /reactjs/react.dev via Context7 confirms DOM refs for explicit event-handler focus/scroll. No external font, asset, dependency or service added. Acceptance/publication checkboxes intentionally remain unchecked until remote main contains the verified candidate.

Local implementation: existing npm test 48/48 passed, no skips; typecheck passed. Real browser runner passed primary/rare/both empty/optional/date pairs/400 and 375/390/1280 layout. Controlled runner passed duplicate/supersession/reset/malformed/500/mixed/options cases, plus pending/draft distinction and stable focus/scroll. Evidence test-results/ui-upgrade. Manual desktop/mobile inspection confirmed complete first card in the desktop viewport; mobile explicit result action focused the heading, collapsed the form and placed the first card near231px in the viewport. No horizontal overflow. A reproduced displayDate RangeError for year10000 was repaired by a display-only invalid-date guard; public/local date validation remains authoritative and the browser case now covers it. Final production/clean/live evidence remains pending.

Production checks completed after the date repair: typecheck/build passed; real browser suite including year10000 validation passed. Isolated real catalogue503/retained results/options error passed at port3127 (test-results/p06-service-UGOxhB). Exactly one real live production submission at port3126 returned openai_evidence and expected IDs; all three full rendered explanations matched the response, screenshot inspected (test-results/p06-live-1kq23N). Secret read only by existing loader from authorized private primary .env; no secret or provider payload logged. P07 historical source-quality/three-sample timing evidence remains source-matched for unchanged backend/data; this UI smoke is not a new timing series. No mandatory local acceptance skip. All service processes stopped.

Main reconciliation: origin/main advanced to0ace55088e47e2b95376df17d821e06d08b4dc44 (remove nvidia). Primary and old integration tracked status are clean. Preserve that accepted change when forming the candidate; it changes documentation/env template/secrets readiness script, not the frontend/backend v1 implementation. Main frontend specification synchronized with two added requirements and updated pending-state scenario; all eight current specs and this delta pass strict validation.
