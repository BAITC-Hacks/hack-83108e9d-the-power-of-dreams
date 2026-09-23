## 1. Frontend completion

- [x] 1.1 Implement canonical controls, optional validation/defaults/reset and resilient explicit submission; verify real requests and focused delayed-response browser cases.
- [x] 1.2 Implement truthful result states and pure date comparison; verify real dense/rare/empty/date pairs and controlled comparison boundaries/modes.

## 2. Acceptance and delivery

- [x] 2.1 Verify desktop/mobile keyboard/focus, real live/fallback/validation/catalogue errors, controlled races/malformed responses and existing typecheck/tests/build; review the frozen candidate against scoped criteria.
- [x] 2.2 Verify clean-checkout README install/configure/build/start and primary real fallback, publish accepted feature and main under shared ownership, record P07 handoff, synchronize specs and archive with actual evidence.

## Stage table

Checkboxes measure integrated and published feature delivery, not implementation progress.

| Task | Stage | Evidence / revision | Remaining checks | Hold / blocker | Next action / owner |
| --- | --- | --- | --- | --- | --- |
| 1.1 | integrated | Frontend 47104a3; main candidate 0157721 published | None within P06 | None | P07 handoff |
| 1.2 | integrated | Frontend 47104a3; main candidate 0157721 published | None within P06 | None | P07 handoff |
| 2.1 | integrated | 48 tests/typecheck/build; real/control/live/browser; review supported | None within P06 | None | P07 handoff |
| 2.2 | integrated | Clean candidate 0157721; local main fast-forward and remote push confirmed | None within P06 | None | P07 handoff |

## Assignment and readiness

Task: frontend-selection-flow 1.1/1.2; implement the approved screen. Coordinator owner is current task 01a0cdfa-b577-7d53-ac21-4b039f3b2cfa. Apply worker is /root/frontend_apply. Dispatch base is 180331552006007baabe8fc966791f65f80aea9b. Design advice completed by /root/acceptance_scope (read-only; no edits/calls).

Scope: D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-06; branch codex/cs-06-front; original base d2b61e2abf07241318c6e1a1c93438de4496cfae; origin https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git; target main. Worker owns front/** only, including focused pure checks. Coordinator owns scripts/frontend/**, package registration, src/app wiring if needed, README/architecture/OpenSpec and Git integration. One frontend writer; preserve disjoint coordinator edits, never stage them.

Context: proposal/design/specs in this change and approved P06 document; public DTOs and canonical package v1 D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/specs/contractor-selection/versions/v1 at package commit e424a13fec851d7f9f0f4e076f70649e716336f7, backend 4ade2fa4022d633e9d96b50188be4cee4fb99539. All six package paths and raw Git hashes match; both pins are ancestors of base. AGENTS.md, .codex/config.toml, .codex/agents/apply.toml and review/design roles, .agents/skills/openspec-* and openspec/config.yaml exist in the committed base; no local harness edits. Runtime exposes apply/design/review; this is observed availability, not isolation proof. Concurrency limit is 3 including root. No graph index exists; direct reads are used.

Authorization: user explicitly requested a new change through all stages with role subagents, simple/fast implementation. Implement within approved behavior; accepted feature commit/push and coordinator main publication authorized under project rules. No force/reset/destructive overwrite, new dependencies/infrastructure/backend/API change. Worker commits/pushes only front/** after its focused checks. No user publication hold. Root keeps shared stage/checkbox ownership. No independent subdelegation or user questions.

Checks: reuse npm run typecheck and focused Node tests of actual comparison helper; report exact commands/results. Root browser checks use the real same-origin backend at 3106, live 3107 and isolated error 3108; all output inside worktree test-results, .next and node_modules local. Use existing system Edge through Playwright without adding a browser package. Root owns server lifecycle. Frontend worker must not run paid calls or alter credentials. Root verifies required live UI once through existing private server config. No secrets enter browser or logs.

Dependencies/checkpoint: OpenSpec required artifacts must be ready and validated; shared contract/examples and this planning base committed before assignment. First real dense browser scenario must pass before implementation dispatch. Report material missing/conflicting input, two failed approaches or approximately ten minutes without verifiable progress. Return stage, met/remaining criteria, checks/mode/skips, exact tested/committed/remote SHA, outstanding edits and next action within 250 words. Do not touch other changes (unified-local-secrets/openai-response-adapter/brev-gpu-access); none is selected for implementation in this task.

## Acceptance procedure

- Real fallback browser: dense default has five eligible and ordered HK-88430/HK-29829/HK-27222; capture actual POST optional omission and supported language/fractional hours. Budget 1/no_match, rare florist HK-39372, foreign florist/category_absent. October 10→11 and October 1→6 yield pinned sets and truthful narrative. Edit sends no request; retained success keeps original conditions during pending/error; reset clears and focuses city.
- Controlled browser: deferred fetch ignores abort to settle stale success/error/finally, duplicate suppression, supersession, edits during pending, error then retry, reset and unmount abortion; label evidence controlled. Use public examples for mixed/malformed/network/500. Options error/retry, dynamic bounds/default fallback and hidden-field validation focus checked explicitly.
- Real HTTP errors: forward a browser POST with invalid field to actual route, preserving real 400 response. For catalogue 503, start isolated copied runtime with valid CSV, obtain success, restart same port with missing CSV without reloading browser, submit and retain prior success. Never edit canonical data.
- Browser live: actual server-only configuration, actual response and rendered mode/text; no fixture may satisfy live. P07 retains final rendered quality/timing, not P06 basic live connectivity.
- Layout/accessibility: 375px and 1280px screenshots, no horizontal overflow, keyboard disclosure/submit/reset/retry, associated error focus, stable editing focus when response completes and polite status region.
- Combined and clean: npm ci, npm run typecheck, npm test, npm run build; README start in clean integration checkout, no .env/personal session for primary fallback. Review frozen content once; repair only findings and rerun affected checks. Then push exact accepted branch SHA, reserve shared integration, promote/push main and verify ancestry, save P07 handoff and archive/sync.

## Evidence

2026-09-23: npm ci completed (497 packages, zero reported vulnerabilities; nonfatal Windows optional cleanup warning). Node v24.4.1. Canonical six-file package identity and backend/package ancestry verified; origin/main equals d2b61e2. Context7 official React /reactjs/react.dev documents controlled value updates and cleanup stale-response guards; no new fetching dependency adopted. Design-role advice: existing production runner provides safe isolated missing-CSV setup; use small test-only deferred fetch for races, pure comparison checks, and real browser scenarios.

Baseline before dispatch: headless system Edge through installed Playwright, real browser http://127.0.0.1:3106 -> POST actual same-origin backend, explicit empty OPENAI_API_KEY. Observed catalog_fallback, eligibleCount 5, ordered HK-88430/HK-29829/HK-27222 and three rendered cards. Strict OpenSpec validation passed and apply reported ready 0/4 delivery tasks. Next dev generated an AGENTS appendix; its source was inspected, relevant local Next.js client/CSS guides read, and only that generated appendix removed to restore the exact committed harness before dispatch.

### Accepted frontend evidence (47104a35c54096412d712664948361a19274166f)

- Apply worker committed/pushed only front/**; remote head matched. Four focused Node tests and typecheck passed. One concrete defect found in browser: number input sanitized non-finite 1e309 to optional omission. Repaired by preserving raw duration text with decimal input mode, including comma decimal support; affected case rerun passed.
- `node scripts/frontend/browser.mjs`: actual same-origin real catalogue fallback passes dense eligible count/IDs and omitted optionals; valid language/2.5h round-trip; zero/negative/non-finite duration, fractional budget and dynamic date validation; hidden duration reveal/focus; reset/city focus; explicit editing/no request and equivalent-draft notice removal; real rare/no_match/category_absent; both real date transitions; actual backend 400 through test-altered request with retained result and date focus. Public response evidence in ignored test-results/p06/browser.json. Rendered 375px and 1280px screenshots inspected: readable prices/explanations, correct column/stack layout, no horizontal overflow.
- `node scripts/frontend/races.mjs`: controlled deferred public responses deliberately ignore abort. Duplicate blocking, supersession/aborted signal, old success/finalizer while newer pending, stale rejection after newer success, editable pending/stable focus, reset/late success, malformed/null/card shapes and 500 retained success/support ID, error→date retry baseline, controlled mixed/quality flags, options failure/keyboard retry and changed options/default bounds pass. Dev StrictMode made a one-shot options stub inadequate; harness corrected to persist until explicit retry, without product changes. Evidence test-results/p06/controlled.json.
- `node scripts/frontend/unmount.mjs`: temporary development-only route mounted the actual screen then explicitly unmounted it during deferred fetch; signal aborted, late success did not remount. Route removed in finally and absent from production source/build. No persistent demo route or generic mocking infrastructure added.
- Combined local `npm run typecheck` and `npm test`: 48 passed, zero failed/skipped. Production build produced BUILD_ID and served successful production checks below; full clean build exit will be recorded on integration candidate.
- `node scripts/frontend/services.mjs`: production isolated copied runtime, real initial success then restart on same port with missing CSV, without reloading tab. Actual 503 CATALOG_UNAVAILABLE preserved three cards and October 10 conditions; support request ID visible. Reload showed real options error/retry. No canonical CSV mutation. Evidence test-results/p06-service-fWxOCV/evidence.json.
- `P06_ENV_FILE=<primary private .env> node scripts/frontend/services.mjs --live`: one real production browser submission, actual openai_evidence and pinned IDs; every displayed explanation equals server response. Credential read only via existing server loader and passed privately in process environment. Evidence test-results/p06-live-X8oupQ/evidence.json and live.png. This proves P06 live UI connection/mode, not P07 final comparative quality or three-sample timing.

### Review assignment

Read-only review role receives fixed candidate after coordinator evidence/scripts/docs commit. Review only this change's required observable behavior and supplied evidence; no broad audit, style requests or added layers. Root performs clean candidate and publication separately. Reviewer must not edit, run paid requests, delegate or update stages. Report concrete failures/missing required evidence with location and smallest remedy; after repair recheck affected findings only.

Review assigned to /root/frontend_review at fixed candidate 015772144f5a8761d6569e9220ecfb699f1bbed2. Feature remote head confirmed at this SHA. Shared integration reservation acquired with exclusive CreateNew at D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/integration-owner.json by owner 01a0cdfa-b577-7d53-ac21-4b039f3b2cfa for integration worktree and main publication. Both primary main and existing integration worktrees were clean. Created codex/p06-integration in the existing sibling integration checkout from current origin/main d2b61e2 and fast-forwarded exact candidate 0157721. No other task marker was present or replaced.

Review verdict: supported at 015772144f5a8761d6569e9220ecfb699f1bbed2, no reproducible acceptance failures or critical incidental findings. Reviewer inspected affected frontend/guards/comparison/focus styles and reused recorded real/control/live/service evidence; no redundant suites or paid calls. Only coordinator clean-candidate/final keyboard/publication remained.

Clean combined candidate 0157721 at D:/Alem/hack-83108e9d-the-power-of-dreams-wt-integration: tracked tree clean and .env absent; npm ci succeeded (497 packages), npm run typecheck succeeded, npm test 48/48 with no skips, npm run build exited 0. Production routes are only /, /_not-found and the two original API routes; no temporary test route. Build ID dVGhqsMIHjLyXsTOdHNue. README npm start -- --port 3116 started successfully with explicit empty OpenAI key and no personal session. Same stack/lockfile and supplied CSV, no backend/API changes.

Production candidate final browser: `P06_URL=http://127.0.0.1:3116 node scripts/frontend/browser.mjs` and `node scripts/frontend/races.mjs` passed all real and controlled cases. Submit and reset use focused Enter key activation in this committed runner; disclosure and retry are keyboard-tested. Evidence under integration checkout test-results/p06. No P06 acceptance skips. Server stopped before shared publication. Primary main and origin/main were both d2b61e2 with clean tracked tree immediately before fast-forward. Local main merged exact verified 015772144f5a8761d6569e9220ecfb699f1bbed2; normal push succeeded and ls-remote confirmed the same SHA. Status: MERGED AND PUBLISHED. Subsequent sync/archive/report commits change documentation only; product checks are not rerun for them.

## P07 handoff

Accepted frontend implementation: 47104a35c54096412d712664948361a19274166f on codex/cs-06-front. Reviewed, clean-built and integrated/published application candidate: 015772144f5a8761d6569e9220ecfb699f1bbed2. Backend pin remains 4ade2fa4022d633e9d96b50188be4cee4fb99539 and immutable v1 package remains e424a13fec851d7f9f0f4e076f70649e716336f7 at D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/specs/contractor-selection/versions/v1. Public API, supplied CSV, selection/order and provider configuration are unchanged.

P06 browser evidence above includes real live openai_evidence, real fallback/400/503, optional controls, retained conditions, date changes, controlled mixed/races/malformed boundaries and keyboard/mobile/desktop. Reproduce using committed scripts/frontend runners and documented npm start; services.mjs requires production build, isolates CSV and consumes one live request only with --live. unmount.mjs requires a development server and creates/removes a narrowly scoped temporary route. Browser tooling uses installed system Edge; organizer application use only requires a modern browser. Artifacts are ignored local evidence, not runtime dependencies.

Remaining P07 scope: final rendered live relevance/distinctiveness review, three uncached submission-to-visible-result timing measurements including first use, and final submission checks. These were not claimed complete by P06. No booking, saved searches, persistence, new ranking rules, providers or dependencies were added.

Archive finalization: synchronized five frontend-flow requirements and all scenarios into openspec/specs/contractor-frontend-flow/spec.md; all seven main specs pass strict validation. Apply reported all_done with 4/4 tasks before archive. Change moved to openspec/changes/archive/2026-09-23-frontend-selection-flow after spec equivalence check; relative approved-design and README/architecture links repaired. Immutable package contents/index pins remain unchanged.
