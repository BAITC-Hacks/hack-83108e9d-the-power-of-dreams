## 1. Feasibility gate

- [ ] 1.1 Verify fixed-model access and dense usefulness within 15 minutes against the pre-output rubric; record exact IDs, source evidence, prices, input limits, latency, costs/unknowns and decision. A failed gate stops dependent work (N1/N2).

## 2. Conditional implementation after positive gate

- [ ] 2.1 Commit public ranking contracts/examples, implement bounded generation and immutable complete validation, and verify deadline/cancellation/invalid data and failure preservation (N2/N3/F1).
- [ ] 2.2 Inject fixed scores into full-population pure selection and retained services; verify unchanged filters, promoted fourth candidate, ties, repeated requests/restart, matching context and explicit 503 (S4/N3).
- [ ] 2.3 Update semantic result/date-comparison text and response validation; verify real date pairs, no unsupported price/score claims, error retention, keyboard/mobile and explanation independence (frontend/N4).

## 3. Acceptance and delivery

- [ ] 3.1 Evaluate both date pairs and predeclared photographer case; verify rare/empty/busy cases, three real browser timings, baseline regressions, typecheck/build and clean committed README installation/start without NVIDIA credentials for search (N1/N4).
- [ ] 3.2 Review exact candidate, commit/push feature, reserve shared integration, accept/publish main, confirm remote ancestry, record evidence, synchronize specifications and archive only after completion.

## Task card and authorization

- Selected change: nvidia-semantic-ranking, schema spec-driven. Coordinator task 01a0ce18-6152-7361-a625-2021b82b1b9f. User requested all stages with scoped role subagents and minimal implementation; document supplied in this task authorizes continuation. Existing active changes are not resumed or modified.
- Worktree: D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-90; branch codex/cs-90-nvidia; base d07a7c286d1816be9e5cf1dcac000dad04fa018b; origin https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git; target main.
- Coordinator allowed paths: this change, approved brainstorming file, scripts/nvidia/, back/ranking/, ranking-data/, back/domain/select.ts and types.ts, back/composition.ts, back/recommend/recommend.ts, back/http/handlers.ts, contracts/, narrowly affected front result/comparison/validation files and checks, README.md/.env.example/THIRD_PARTY.md, architecture/ and docs/tooling.md, relevant main specs only after accepted implementation. Preserve other files and staged work.
- Current scope: 1.1 only until usefulness passes. No changes to deployed ranking, public contracts or UI before the gate. No provisioning, added dependencies, provider substitution or automatic retries. Stop after two meaningful failures. Unknown external demo deadline is not invented; use the bounded checkpoint and report before expanding uncertain scope.
- Current process ports: none for the probe. Future isolated application port 3190 if free; no shared test storage. Probe output belongs in this change's evidence directory, not runtime score data.
- Harness: AGENTS.md, .codex/config.toml and design/apply/review roles, required .agents/skills and openspec/config.yaml present at base d07a7c286d1816be9e5cf1dcac000dad04fa018b. Runtime permits scoped worktree writes; external sibling/Git/network actions need escalation. File presence is not runtime isolation.
- Read-only design owner /root/ranking_rubric: pre-output rubric and source rows only, no writes/provider calls. Completed handoff incorporated in design.md. Earlier /root/ranking_boundary supplied read-only code-boundary findings. No implementation worker has been dispatched yet; a positive gate requires a committed task card/base and a verified separate sibling worktree before dispatch.
- Shared frontend package: not applicable to this initial probe; existing public v1 remains unchanged. Any delegated consumer later requires a newly committed immutable package and exact backend/package SHAs recorded before dispatch.
- Shared reservation: none acquired, no integration/shared package writes permitted until exclusive ownership is obtained and recorded here.
- Checks now: npm ci; openspec validate nvidia-semantic-ranking --strict --no-interactive; node scripts/nvidia/probe.mjs with explicit existing private env-file path. Probe reuses loadCatalog and select (single-profile calls recover all eligible IDs without reimplementing filters), native fetch, one fixed endpoint and no secrets in output.

## Stage table

| Task | Stage | Evidence/revision | Remaining checks | Hold/blocker | Next action/owner |
|---|---|---|---|---|---|
| 1.1 | branch-pushed | Revised probe c26ca91ed8c3a3232b8d46a1353d828b8366c03d also returned HTTP 410 in 629ms; original failure preserved | successful hosted access and real usefulness absent | two inference failures; adoption deferred | working hosted endpoint/access resolution required before coordinator resumes |
| 2.1 | planned | design/specs only | all implementation checks | requires positive 1.1 | coordinator contracts then bounded apply worker |
| 2.2 | planned | accepted baseline remains unchanged | semantic checks | requires 1.1 and 2.1 | coordinator |
| 2.3 | planned | existing price UI unchanged | browser/comparison checks | requires backend contract | coordinator |
| 3.1 | planned | historical P07 not reused as NVIDIA evidence | all new acceptance | requires implementation | coordinator + review role |
| 3.2 | planned | Planning/probe/evidence branch published; no product integration | accepted product candidate and remote main | requires positive gate, acceptance/reservation | coordinator |

Feature checkboxes measure integrated delivery, not local progress. On a failed checkpoint, preserve this incomplete change and report deferred; do not sync unimplemented requirements or imply archive/completion.

## Feasibility evidence — 2026-09-23

- Tested source/probe commit: cb0edb44de66b40b9824a1050201975476493c32. Initial base and runtime modules remain unchanged from d07a7c286d1816be9e5cf1dcac000dad04fa018b.
- [Immutable probe record](evidence/probe-2026-09-23T11-57-49-808Z.json): one real POST at 11:57:49 UTC to the fixed documented model endpoint; HTTP 410, 606ms total. No scores, usage or cost returned. This demonstrates endpoint failure, not a general NVIDIA account/key failure or a quality verdict.
- The dense input was exactly five eligible IDs obtained through existing selection rules; baseline HK-88430/HK-29829/HK-27222. Complete untruncated descriptions were sent with truncate=NONE. Recorded UTF-8 sizes are not token counts; exact input fit remains unverified.
- Full-generation estimate from the accepted catalogue: 82 category/format requests, 272 scored profile/group pairs; cost unknown. No full-generation request, snapshot, provider/model substitution or automatic retry occurred.
- npm ci installed 497 pinned packages successfully. node --check scripts/nvidia/probe.mjs, Git whitespace check and strict OpenSpec validation passed. Application code, shared DTOs, frontend and main specifications are unchanged.
- Existing node --test back/domain/select.test.mjs passed 4/4 checks on the same executable revision (exact scope, complete busy IDs, stable limited outcomes/ties and frozen-input repeatability); this is baseline evidence, not semantic acceptance.
- Gate result: DEFERRED — real access/usefulness was not established. Do not execute tasks 2.1–3.2 as if the checkpoint passed. No implementation worker/worktree or shared integration reservation was created.
- Required but skipped due to gate: extended case evaluation, score generation, semantic implementation, semantic tests, new browser timing/quality, application restart and clean application build/launch. No main merge, spec synchronization or archive is justified by the available evidence.
- A user question is pending about deliberately selecting a current hosted NVIDIA model and revising the decision. That is a material model change, not an automatic fallback. Existing authorization to implement all stages remains, subject to resolving this external dependency.
- Read-only review /root/ranking_gate_review returned supported for DEFERRED against cb0edb44de66b40b9824a1050201975476493c32 plus the recorded evidence: all five eligible profiles included, one request, safe failure, no snapshot replacement, no semantic acceptance claim and no critical finding. No provider call was repeated for review.
- Publication: ordinary push to origin refs/heads/codex/cs-90-nvidia succeeded; ls-remote confirmed 06a3f554b3dbe02594d69332e5b748e8652e3562. This is planning/probe/evidence publication only. Main remains unchanged by this task; no shared reservation was acquired. This subsequent report-only update does not claim its own commit SHA.

## Authorized model revision — 2026-09-23

The user answered yes to selecting a current hosted NVIDIA model, updating the decision and continuing. This resolves the previous pending question and model-selection hold only; usefulness and input-fit gates remain. Current choice: nvidia/llama-nemotron-rerank-1b-v2 at its documented model-specific reranking endpoint. Request shape and 10s/zero-retry policy are unchanged; maximum batch is 1000 and truncate=NONE is explicit. No other product scope changed, and generic specifications remain coherent. A fresh bounded checkpoint follows this explicit revision; old HTTP 410 evidence is immutable.

Read-only design assignment /root/nemotron_input_fit investigates full-input fit and public tokenizer evidence; no writes or inference. Coordinator owns artifact/probe revision and the one dense live request. Dependent apply work still waits for a positive gate. Return to the first unmet step, not the already completed baseline checks.

### Revised checkpoint result

- Tested source: c26ca91ed8c3a3232b8d46a1353d828b8366c03d; [new immutable record](evidence/probe-2026-09-23T12-01-57-040Z.json). The explicitly approved replacement endpoint returned HTTP 410 in 629ms at 12:01:57 UTC. Same five profiles, same rubric and query, no scores, no usage/cost information. An unauthenticated GET later returned 405 with an empty body; that diagnostic is not inference or an availability success.
- Two meaningful inference failures now exist across the original and revised candidates. Stop inference under the agreed failure limit; no further model switching, retry, bulk generation or dependent product implementation. DEFERRED remains the acceptance decision. Documentation listing the model does not prove hosted access. Do not diagnose the key/account or universal NVIDIA unavailability from these statuses alone.
- Model revision itself is complete and explicitly authorized. The former pending permission question is resolved; the remaining external prerequisite is a functioning hosted ranking endpoint. A GPU deployment, alternative provider or different ranking mechanism would materially change the agreed scope and is not introduced here.
- Strict OpenSpec validation, probe syntax and whitespace checks passed after revision. Existing four baseline domain checks remain valid because no runtime/domain code changed. Browser/build/semantic checks remain skipped for the same gate; no semantic activation, main integration, spec sync or archive occurred.
- Delta-only review /root/ranking_gate_review confirmed DEFERRED for c26ca91ed8c3a3232b8d46a1353d828b8366c03d and the new record; no further tests/provider calls were needed. Normal feature push and ls-remote confirmed this source SHA on origin/codex/cs-90-nvidia. This later evidence/report commit records the tested source, not its own as-yet-unknown SHA. No shared reservation or main writes occurred.

### Input-fit evidence from design role

Read-only /root/nemotron_input_fit inspected NVIDIA's published [input template](https://huggingface.co/nvidia/llama-nemotron-rerank-1b-v2#usage) and [tokenizer.json at 828765652b05bd439c9789d2a6d093db1caa1443](https://huggingface.co/nvidia/llama-nemotron-rerank-1b-v2/blob/828765652b05bd439c9789d2a6d093db1caa1443/tokenizer.json): no normalizer, ByteLevel without added prefix space, all 256 byte symbols, BPE merges and at most two BOS tokens. The conservative bound is UTF-8 bytes of `question:` + query + ` \n \n passage:` + description, plus two tokens; BPE merges cannot increase this byte-symbol count. This is an upper bound, not a character-based token estimate.

The agent used existing loadCatalog on the same CSV hash and checked all 66 profiles / 272 category-format pairs. Maximum templated input is 2327 bytes, hence at most 2329 tokens, for HK-58385 / Ведущий / день рождения: below 8192. No inference, writes or installs were performed. This supports input fit for the published tokenizer/template only; the inaccessible hosted NIM configuration was not independently verified. A future generator must retain truncate=NONE and check every pair. No full snapshot has been generated.
