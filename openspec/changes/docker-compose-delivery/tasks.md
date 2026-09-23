## 1. Container launch

- [ ] 1.1 Package and run the production application with pinned dependencies, explicit runtime assets, optional runtime AI settings and healthcheck; verify image build, existing type/tests, default ready launch and absent-catalogue failure.
- [ ] 1.2 Add a focused real-HTTP smoke command; verify primary IDs/counts, repeat, changed date, rare category, both empty outcomes and invalid input against the container.

## 2. Judge documentation and acceptance

- [ ] 2.1 Update README Docker quick start, environment template and architecture index; verify instructions against a clean committed copy without host node_modules, build output or .env, including alternate port and restart.
- [ ] 2.2 Exercise the container in a browser, including primary results, date/rare/empty outcomes and loading/error recovery; inspect runtime-only configuration and record live-provider evidence or the exact limitation separately.

## 3. Delivery

- [ ] 3.1 Review scoped diff, validate OpenSpec, commit/push accepted feature content, verify the combined candidate under shared ownership, promote/publish main and record exact revisions and acceptance evidence.

## Task card

Task/change: docker-compose-delivery, tasks 1.1-3.1. Owner: coordinator, Codex task 01a0cdfc-2125-7b53-8376-63811a66bc61. No subagent delegation.

Scope: D:\Alem\hack-83108e9d-the-power-of-dreams-wt-deploy-docker; branch codex/deploy-docker; base d2b61e2abf07241318c6e1a1c93438de4496cfae; origin https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git; target main.

Allowed files: Dockerfile, compose.yaml, .dockerignore, scripts/docker/, README.md, .env.example, architecture/README.md, this change directory and .brainstorming/2026-09-23-docker-compose-delivery-design.md. Temporary verification outputs remain ignored under test-results/. Existing package/lockfile and application behavior are preserved.

Context: approved brainstorming outcome, proposal/spec/design in this change; domain/problem-and-scope.md and domain/acceptance-scenarios.md; current architecture. AGENTS.md, .codex/config.toml, required workflow skills and openspec/config.yaml are present at the committed base above. No changed contract package or delegated role is needed.

Authorization: user approved implementation and verification on 2026-09-23. Existing project authorization covers scoped feature commits, branch push and coordinator integration/publication. No new publication hold. Other OpenSpec changes are not selected or modified. Initial exclusive reservation failed while P06 owned integration; no shared writes were made then. P06 owner confirmed all shared writers stopped and released its marker after publishing 878ed7898c34723f77965d78fe0d75c2eef8c13a. This task subsequently acquired and verified its own reservation for integration/main with ownerTaskId 01a0cdfc-2125-7b53-8376-63811a66bc61.

Checks: spec scenarios map directly to tasks above. Baseline mode is real catalogue with OPENAI_API_KEY/OPENAI_MODEL blank; live provider check is separate. Default host port 3101; alternate 3111 if free. Compose projects docker-delivery and docker-delivery-acceptance separate candidate processes; no database/test storage. No source bind mounts. Linux/amd64 on Docker Desktop is the local verification platform.

Dependencies: Engine started successfully; server reports 29.7.2, Compose 5.4.0; initial build/downloads passed. Feature commit afa8ed2a8bf0fe63672910da15713a8a21df4d72 merged published P06 main 878ed7898c34723f77965d78fe0d75c2eef8c13a into candidate 25d5671c88310ec9e0b79fd6d12493b8d941192b. README/index merged cleanly. Clean verification worktree: D:\Alem\hack-83108e9d-the-power-of-dreams-wt-docker-checks, branch codex/docker-checks, initially at 25d5671; expected harness present and no .env, node_modules or .next. Shared integration worktree: codex/docker-integration, same candidate. All subsequent candidate changes require fast-forwarding both and checking affected behavior before publication.

## Stage table

Checkboxes represent final integration/publication, not local implementation.

| Task | Stage | Evidence / revision | Remaining checks | Hold / blocker | Next action / owner |
| --- | --- | --- | --- | --- | --- |
| 1.1 | implementing | Initial image passed; combined candidate 25d5671 exposed missing P06 test example files | Clean committed build with public examples included | Build context repair in progress | Commit and verify / coordinator |
| 1.2 | implemented | Seven real HTTP smoke cases passed, including after restart | Combined committed candidate | None | Verify / coordinator |
| 2.1 | implementing | Docker quick start and environment comments added | Clean-copy instructions, alternate port | None | Verify / coordinator |
| 2.2 | implemented | Real browser primary/date/rare/empty/loading/error/recovery states; one live request returned openai_evidence | Combined P06 candidate browser | None | Verify / coordinator |
| 3.1 | implementing | Own reservation acquired after P06 handoff; candidate contains main 878ed78 | Candidate acceptance, branch push, main | None | Integrate / coordinator |

## Evidence and limitations

2026-09-23, local candidate before commit:

- Node 24.4.1/npm 11.4.2 from official node:24.4.1-bookworm-slim pinned to digest 36ae19f59c91f3303c7a648f07493fe14c4bd91320ac8d898416327bacf1bbfa. Linux/amd64, Docker Desktop Engine 29.7.2, Compose 5.4.0.
- Final candidate image at this stage: sha256:c167e92059c4c3783f9f15a6176c8f0eea69b6778ac9254dc9ac9665013dd9b4. npm ci succeeded; npm run typecheck, all 44 existing tests and npm run build passed inside Docker. Runtime contains the CSV, adapter, secret reader and build ID; UID 1000; no .env, Git, application sources or TypeScript compiler; no host mounts.
- docker compose -p docker-delivery up --build --wait --wait-timeout 120: healthy on 127.0.0.1:3101. Public HTTP smoke: primary, repeat, date change, rare category, no_match, category_absent and invalid date all passed. Baseline modes were catalog_fallback and not_needed.
- Browser on localhost:3101: expected three names/order, date change to four eligible and a changed three-card list, budget 1 no-match message, one florist, category absent in overseas city. Loading text and disabled form were observed. Stopping only this task's service produced the connection-error message with an enabled retry; service restarted successfully and HTTP smoke passed again.
- Controlled failure: a disposable derivative image omitting only /app/raw/dataset.csv made healthcheck.mjs exit 1. Compose up with the documented 120-second deadline exited 1 and reported unhealthy; original catalogue remained intact. An initial shortened 20-second experiment returned 0 while health was still starting: Compose inherited the image's 20-second start grace despite a zero override. That experiment is not counted as a pass; the documented deadline exceeds the normal grace/retry schedule. Temporary broken service/network removed.
- One real provider request from a separate container on port 3112, using existing local project credentials passed only in the child process environment, returned HTTP 200, openai_evidence and the unchanged primary IDs. No secrets were printed or copied into the image; temporary live service/network removed. This verifies container-to-provider integration, not the separate P07 full explanation-quality/timing series.

Pending: clean committed candidate acceptance, alternate-port instructions and final Git publication. macOS, native Linux host and ARM hardware have not been exercised. Existing module-type/deprecated-tool warnings did not fail checks; dependency changes are outside this scope.

Combined-candidate finding: 25d5671 clean Docker build failed because front/comparison.test.mjs needs versioned real-http.json and controlled.json from the committed public contract package. The application code and contracts need no change; .dockerignore now includes exactly those two build/test inputs. This failure is not counted as passing acceptance. Browser recovery on the initial image was subsequently observed: retry restored the original three cards.
