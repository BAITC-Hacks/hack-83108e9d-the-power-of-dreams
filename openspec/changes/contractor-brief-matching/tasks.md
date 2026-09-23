## 1. Contracts and first scenario

- [ ] 1.1 Commit public brief vocabulary/types and success/error examples; validate OpenSpec, typecheck and both live model access probes (B1/B4).
- [ ] 1.2 Implement and source-check the evidence index and pure matching; verify HK-77838 promotion, unknown avoidances and hard-filter/restart preservation (B2/B3).
- [ ] 1.3 Connect interpretation, safe errors and recommendation composition; verify the real discreet-host scenario plus provider/cancellation/invalid input cases (B1/B2).

## 2. Experience and comparison

- [ ] 2.1 Add reviewable wishes and advice to the existing screen; verify real flow, keyboard/mobile/desktop, reset/edit/stale races and truthful date comparisons.
- [ ] 2.2 Run the fixed 30-brief, two-model, two-repeat comparison under USD 5 total; record quality, unknowns, latency, failures, usage and justified model selection (B4).

## 3. Delivery

- [ ] 3.1 Update run/provenance/architecture documentation, verify focused regressions, build and clean-checkout launch, publish a backend contract package, integrate the accepted candidate and confirm remote main.

## Stage table

Coordinator: Codex task `01a0ce1a-086f-7772-9104-a72718f35156`. Selected implementation change: contractor-brief-matching. Other existing changes are historical/unrelated and are not resumed here.

| Task | Stage | Evidence / revision | Remaining checks | Hold / blocker | Next action / owner |
|---|---|---|---|---|---|
| 1.1 | committed | e81e0cd contracts/examples + strict validation; live probes; typecheck | final integration | none | coordinator |
| 1.2 | implemented | worker 665e458 published, cherry-picked bfd640d; 5/5 checks and independent all-48-assertion review | final combined candidate | coordinator subsequently adds source excerpt to keep explanations distinctive | coordinator |
| 1.3 | implemented | five integrated HTTP/filter/restart cases passed; actual browser used live interpretation and real recommendation | final merged-source check | none | coordinator |
| 2.1 | implemented | live browser + controlled edit/reset/failure races; 375/1280px screenshots inspected | merge published UI d3fb904, repeat affected checks | none | coordinator |
| 2.2 | implemented | 120-call initial comparison + 44-call focused repair, model-comparison.json | preserve measured source/prompt hashes | see initial failures and limited repair scope below | coordinator |
| 3.1 | implementing | 62 checks, typecheck/build; pending delivery | docs/clean launch/package/integration/publication | shared ownership required only before shared writes | coordinator |

## Assignment and authorization

- Coordinator workspace: `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-ai-upgrade`; branch `codex/ai-upgrade`; starting committed base `d07a7c286d1816be9e5cf1dcac000dad04fa018b`.
- Remote: `origin`, `https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git`; target `main`.
- User explicitly approved the proposed feature and implementation on 2026-09-23. Standing scoped feature commit/push/integration authorization applies; no current no-publication hold. Maximum new API experiment spend USD 5, including probes and application acceptance. No new services, model substitution, booking or unrelated preparation.
- Harness source is the starting committed base: AGENTS.md, .codex/config.toml, .codex/agents/apply.toml, required .agents/skills and openspec/config.yaml. Runtime allows read-only design/review tasks; implementation worktrees require separate verified paths and permitted filesystem access. File presence is not proof of isolation.
- Essential context: this change's proposal/design/specs; contracts/brief.ts and examples once committed; domain source constraints and existing source modules. Root owns all shared contracts, routes, wiring, package/config/docs, stage state and integration. Workers cannot ask the user, delegate or modify this task state.
- Worker scope will be pinned here after the contract commit and before dispatch. No frontend consumer is delegated before backend contract publication.
- Shared reservation was acquired by coordinator task `01a0ce1a-086f-7772-9104-a72718f35156` through exclusive creation of the canonical marker for main, the integration worktree and contractor-selection/v2. The previous UI owner published `1a9a023` and released ownership first. NVIDIA task `01a0ce18-6152-7361-a625-2021b82b1b9f` reports its provider probe HTTP 410 and no modifications to shared source; resume requires renewed contract coordination. UI task `01a0ce17-fcfe-7e13-9aa8-238a516ab0a0` owns its broader JSX/style redesign and keeps parent exports/class hooks. Brief controls go after optional conditions, advice after explanation. Neither task's checks establish this feature's acceptance.

## Worker 1.2 — index and pure matching

- Owner: apply worker `/root/brief_index`, under coordinator task above. Scope: `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-brief-index`, branch `codex/brief-index`, exact base/contracts `e81e0cdd1f5338355ddc97b3802f14b1f28ac078`; same origin/target main as coordinator.
- Allowed writes only: `back/catalog/brief-index.json`, `back/catalog/brief-index.ts`, `back/brief/match.ts`, `back/brief/match.test.mjs`. No other files, contracts, shared stage state, Git main or coordinator wiring. This assignment is read from the coordinator's absolute task-card path; the worker's committed copy contains the initial stage only.
- Interface pin: contracts/brief.ts and contracts/examples/brief.json at exact base above. `loadBriefIndex(profiles)` validates all descriptions/IDs and returns `BriefIndex` or throws `BriefIndexError`; `matchBrief(eligibleProfiles, confirmedBrief, index): readonly BriefMatch[]` returns ALL supplied profiles in sorted order. Root truncates and applies hard filters. Loader can accept optional raw index for focused invalid-source checks; owned JSON must be statically imported or loaded in a bundle-safe way.
- Context: design sections Canonical wishes and evidence / Modules; B2/B3 and S4. Preserve existing catalogue, do not invent evidence, review semantic polarity. Include every profile ID even with no assertions. Quote limit 240 Unicode code points. `null` trait and absent assertion always unknown; a narrower avoidance such as compulsory contests is unknown rather than equating it with every contest.
- Readiness checked: path/branch/base/remote verified; required harness files are identical to coordinator using SHA256; authoritative Git harness revision e81e0cd (unchanged from d07a7c2). apply role exists and is callable. Runtime sandbox may require scoped escalation for writes in this sibling worktree; report any denied action, not isolation claims. Dependencies installed separately by coordinator; no server ports, inference calls or shared resources.
- Authorization: implement, focused local checks, scoped commit and ordinary push to origin/codex/brief-index; no paid calls, installs, delegation or direct user questions. You are not alone; preserve others' edits. Stop on incompatible contracts or missing authorization. Use actual assigned cwd for every command.
- Checks: Node test of this module using real CSV via existing loader, plus typecheck; HK-77838 has explicit discreet evidence; fewer conflicts/more matches, price/ID ties, source mismatch/hash rejection, unknown avoidances, all supplied profiles retained and input immutability. Use worker-local temp output only. Root covers integrated hard filters/restarts/browser. Return actual stage, criteria/checks/skips, SHA, confirmed branch remote and next owner in Russian, <=250 words.

## Planned verification and resources

### Final read-only review assignment

Owner `/root/brief_final_review`, review role. Inspect this coordinator workspace on codex/ai-upgrade after merging UI source 3be31e0; no edits, paid calls, delegation or Git writes. Harness uses d07a7c2 with the inherited project instructions; current contracts are contracts/brief.ts and contractor-selection.ts. Verify B1/B2 and UI confirmation/retained-results behavior in the merged front/ContractorForm.tsx, BriefEditor.tsx, RecommendationResults.tsx, publicResponses.ts and related handlers. Focus on concrete acceptance failures or missing evidence, not general refactoring. Existing 62 tests/typecheck passed at first UI merge; root owns final build/live browser/clean launch. Return decisive file/line reproduction or no material finding, plus checks/skips. Parallel root work is docs and verification; do not revert others' work.

### Clean-checkout verification assignment

Owner `/root/brief_clean_check`, bounded execution role, no source edits/commits/pushes/paid calls/delegation. Worktree `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-brief-checks`, branch `codex/brief-checks`, pinned candidate/contracts/harness `a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91`, same origin/main target. Coordinator verified clean tree, no .env, matching AGENTS/config/review/project-delivery/OpenSpec files and free port 3128. Runtime escalation may be needed for sibling-local dependencies/build/ignored output; not an isolation claim. Install own pinned dependencies, follow README Node build/start with OPENAI_API_KEY explicitly empty. Run test/typecheck/build, real baseline frontend/browser regression plus races/services, and HTTP confirmed brief with source promotion/unknown question, interpreter unavailable 503, repeat after restart. Use only own processes on 3128 and own ignored test-results; stop processes after checks. Root runs live acceptance separately. Return SHA, exact actual checks/outcomes/skips/clean status; failures to coordinator before repair.

- Checks: existing `npm test`, `npm run typecheck`, `npm run build`; focused Node checks for interpretation/public contracts/matching; real browser on a dedicated local port 3127 (check free before launch), plus restart and API requests. Worker checks use their own temp/build directories and no server/paid calls unless explicitly assigned.
- Primary scenario: default dense request plus `Нужен ненавязчивый ведущий, без принудительных конкурсов`; interpretation presents source spans, confirmation produces HK-77838 within top three, literal style evidence and an unknown/question for contests. Busy and budget exclusions still hold.
- Baseline/empty/rare/date scenarios remain required; confirm old shape/behavior without brief. New semantic order must not reuse price-only displacement claims.
- Clean checkout: follow README Node installation/configuration/build/start, with no private files for catalogue-only mode; use private environment injection only for explicitly labelled live acceptance. Record exact SHA, observed results and all skips.
- Budget: two short probes succeeded (35 input/12 output each), conservatively reserve USD 0.01. Subsequent calls need pre-call reservation, max output and total ledger below USD 5. Never log secrets or free customer text; fixed synthetic eval corpus is versioned source, reports contain case IDs and metrics.

## Observed implementation evidence

- Worker index `665e4584fe9cbd792fcbbbec465d7ab57673464b` was confirmed on origin/codex/brief-index; root cherry-pick `bfd640dff03f17b91eece0c46531950ada9cd425`. All 66 description hashes/IDs and 48 source assertions validate. Independent read-only reviewer `/root/evidence_review` checked semantic meaning of every assertion and found no material failure. Coordinator's later profileExcerpt projection reuses these same validated excerpts; affected matcher/integration cases passed again.
- Real default scenario with confirmed discreet style yields HK-77838/HK-88430/HK-29829 versus baseline HK-88430/HK-29829/HK-27222. Literal evidence, unknown compulsory contests and question are visible. Budget 900000 and the profile's busy date exclude HK-77838. Parallel requests and a fresh Node process return identical IDs. Changed source descriptions give BRIEF_INDEX_UNAVAILABLE only for brief selection; baseline remains available.
- First model comparison: Luna 54/60 correct, p50 1173ms/p95 1546ms; Terra 58/60, p50 1398ms/p95 2058ms. Failures included inverted negation, overly broad avoidance, dropped unknown, and safely rejected contradictory traits. The prompt was repaired; 11 affected/new cases x2 repeats x2 models passed 44/44. Repair p50/p95: Luna 1210/1655ms, Terra 1535/2898ms. Keep Luna for the measured extraction role. This is not a blind customer preference evaluation and does not establish perfect arbitrary-text interpretation.
- Model experiment conservative total including USD 0.01 reserved for initial probes: USD 0.19786235. An additional USD 1 was reserved before browser/application acceptance, with at most 40 Luna calls, each bounded to <=15000 conservative input and <=1800 output tokens (no tools). Current ledger envelope USD 1.19786235 is below USD 5. Browser run made two provider calls; all confirmed recommendation/date/budget calls are local. No account balance was queried.
- Browser `scripts/brief/browser.mjs` passed real live baseline/interpreter/promotion, explicit keyboard confirmation, source/unknown/question rendering, 375px/1280px no overflow, date/budget changes, edit invalidation/reset. Controlled ignored-abort late success/failure and provider-unavailable cases passed separately. No page errors. Screenshots under ignored test-results/brief-browser were visually inspected. These first screenshots precede the separate UI redesign merge; final merged check remains required.
- Actual OpenAI docs/Context7 lookup verified strict Responses JSON and reasoning none; no new dependency or service. CodeGraph reported this worktree unindexed, so direct file navigation was used; no graph validity claim.

## Final combined candidate evidence

- Executable candidate `a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91` includes main `1a9a023` and preserves join city branding/UI. Final merged build passed; live `scripts/brief/browser.mjs` passed all five groups with no page errors. Both 375px/1280px screenshots were inspected. Distinct explanations reuse validated source excerpts, including when wishes remain unknown.
- Independent read-only reviewer `/root/brief_final_review` found no material implementation defect in B1/B2/merged UI. It identified ambiguous reset wording in the new scenario; coordinator split edit/reset cases to preserve the existing approved reset behavior. No acceptance requirement was added or removed. Strict OpenSpec validation passed.
- Luna live baseline dense and rare cases returned openai_evidence with literal distinct source quotes. Rare HK-39372 source quote describes event floristry in Almaty. Final runtime was restarted after an instrument session ended; no source change was needed. Two browser passes made four known application calls plus one observed rare call; one interrupted tool invocation has uncertain execution, conservatively covered by the retained USD 1 application reservation (at most six potential calls so far, below 40).
- Immutable v2 package is authored under the reservation, pinned to backend a4c82b6; package commit and canonical publication will be recorded after creation. Clean-checkout evidence remains pending.
