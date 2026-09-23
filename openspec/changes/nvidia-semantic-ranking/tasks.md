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
| 1.1 | implementing | Rubric recorded before any NVIDIA inference; existing private key presence confirmed; npm ci passed | real endpoint and usefulness | none | coordinator bounded probe |
| 2.1 | planned | design/specs only | all implementation checks | requires positive 1.1 | coordinator contracts then bounded apply worker |
| 2.2 | planned | accepted baseline remains unchanged | semantic checks | requires 1.1 and 2.1 | coordinator |
| 2.3 | planned | existing price UI unchanged | browser/comparison checks | requires backend contract | coordinator |
| 3.1 | planned | historical P07 not reused as NVIDIA evidence | all new acceptance | requires implementation | coordinator + review role |
| 3.2 | planned | no new publication | exact candidate and remote main | requires acceptance/reservation | coordinator |

Feature checkboxes measure integrated delivery, not local progress. On a failed checkpoint, preserve this incomplete change and report deferred; do not sync unimplemented requirements or imply archive/completion.
