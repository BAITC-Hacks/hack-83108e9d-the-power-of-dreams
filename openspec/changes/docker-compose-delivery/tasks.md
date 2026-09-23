## 1. Container launch

- [x] 1.1 Package and run the production application with pinned dependencies, explicit runtime assets, optional runtime AI settings and healthcheck; verify image build, existing type/tests, default ready launch and absent-catalogue failure.
- [x] 1.2 Add a focused real-HTTP smoke command; verify primary IDs/counts, repeat, changed date, rare category, both empty outcomes and invalid input against the container.

## 2. Judge documentation and acceptance

- [x] 2.1 Update README Docker quick start, environment template and architecture index; verify instructions against a clean committed copy without host node_modules, build output or .env, including alternate port and restart.
- [x] 2.2 Exercise the container in a browser, including primary results, date/rare/empty outcomes and loading/error recovery; inspect runtime-only configuration and record live-provider evidence or the exact limitation separately.

## 3. Delivery

- [x] 3.1 Review scoped diff, validate OpenSpec, commit/push accepted feature content, verify the combined candidate under shared ownership, promote/publish main and record exact revisions and acceptance evidence.

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
| 1.1 | integrated | 16ade3e checks; main published at 4cdc501 | None within scope | None | P07 handoff |
| 1.2 | integrated | Seven real HTTP cases on both ports; main 4cdc501 | None within scope | None | P07 handoff |
| 2.1 | integrated | Clean README reproduction; main 4cdc501 | None within scope | None | P07 handoff |
| 2.2 | integrated | Combined browser acceptance and separate live evidence; main 4cdc501 | P07 quality/timing is separate | None | P07 owner |
| 3.1 | integrated | Local main fast-forward and normal remote push confirmed at 4cdc501 | Publish this report-only update and release reservation | None | Coordinator finalization |

## Evidence and limitations

2026-09-23, local candidate before commit:

- Node 24.4.1/npm 11.4.2 from official node:24.4.1-bookworm-slim pinned to digest 36ae19f59c91f3303c7a648f07493fe14c4bd91320ac8d898416327bacf1bbfa. Linux/amd64, Docker Desktop Engine 29.7.2, Compose 5.4.0.
- Final candidate image at this stage: sha256:c167e92059c4c3783f9f15a6176c8f0eea69b6778ac9254dc9ac9665013dd9b4. npm ci succeeded; npm run typecheck, all 44 existing tests and npm run build passed inside Docker. Runtime contains the CSV, adapter, secret reader and build ID; UID 1000; no .env, Git, application sources or TypeScript compiler; no host mounts.
- docker compose -p docker-delivery up --build --wait --wait-timeout 120: healthy on 127.0.0.1:3101. Public HTTP smoke: primary, repeat, date change, rare category, no_match, category_absent and invalid date all passed. Baseline modes were catalog_fallback and not_needed.
- Browser on localhost:3101: expected three names/order, date change to four eligible and a changed three-card list, budget 1 no-match message, one florist, category absent in overseas city. Loading text and disabled form were observed. Stopping only this task's service produced the connection-error message with an enabled retry; service restarted successfully and HTTP smoke passed again.
- Controlled failure: a disposable derivative image omitting only /app/raw/dataset.csv made healthcheck.mjs exit 1. Compose up with the documented 120-second deadline exited 1 and reported unhealthy; original catalogue remained intact. An initial shortened 20-second experiment returned 0 while health was still starting: Compose inherited the image's 20-second start grace despite a zero override. That experiment is not counted as a pass; the documented deadline exceeds the normal grace/retry schedule. Temporary broken service/network removed.
- One real provider request from a separate container on port 3112, using existing local project credentials passed only in the child process environment, returned HTTP 200, openai_evidence and the unchanged primary IDs. No secrets were printed or copied into the image; temporary live service/network removed. This verifies container-to-provider integration, not the separate P07 full explanation-quality/timing series.

Platform limits: macOS, native Linux host and ARM hardware have not been exercised. Existing module-type/deprecated-tool warnings did not fail checks; dependency changes are outside this scope.

Combined-candidate finding: 25d5671 clean Docker build failed because front/comparison.test.mjs needs versioned real-http.json and controlled.json from the committed public contract package. The application code and contracts need no change; .dockerignore now includes exactly those two build/test inputs. This failure is not counted as passing acceptance. Browser recovery on the initial image was subsequently observed: retry restored the original three cards.

## Combined candidate acceptance and delivery

- Tested/committed candidate: 16ade3e67f326af1ecc75ae4dd1fd2e0fe1f7b61, including published P06 main 878ed7898c34723f77965d78fe0d75c2eef8c13a. Feature branch codex/deploy-docker pushed normally; git ls-remote confirmed the exact candidate SHA. Shared integration branch codex/docker-integration was fast-forwarded to that same SHA under this task's reservation.
- Clean reproduction used sibling worktree D:\Alem\hack-83108e9d-the-power-of-dreams-wt-docker-checks, branch codex/docker-checks at the exact candidate. Git status was clean; .env, node_modules and .next were absent before and after the default Docker build/start. Harness inputs were present from the committed revision. No host npm installation or private file was used.
- README command docker compose up --build --wait --wait-timeout 120 passed with only COMPOSE_PROJECT_NAME=docker-delivery-acceptance set for isolation. Repaired build passed typecheck, all 48 existing tests and Next.js production build. Image: sha256:0fec867e9b8b4e7657bf8cbe83087518119249990ce3761f28bde1036713bd1d. Final runtime settings/assets are unchanged from the initial accepted image; .shared examples exist only in the build stage.
- Seven-case smoke passed against real HTTP on default port 3101 and again after recreating the service with APP_PORT=3111 in a copy of the empty template. docker compose ps showed healthy and the expected loopback mapping. Logs showed normal production startup. docker compose down removed the service/network; the synthetic verification .env was removed afterwards. No verification containers remain.
- In-app browser on the combined candidate: primary three cards; changed date with P06 busy/displacement explanation; rare single florist; distinct no-match/category-absent messages; reset and resubmit; loading text; network error when the old port stopped serving retained previous cards; successful primary submission at the new port. API responses were real, with no browser mocks. This is separate from P06's broader browser race/keyboard evidence.
- Live OpenAI evidence above belongs to the initial image/feature content, before the P06 merge. The provider adapter, secret reader, backend and lockfile did not change in the merge, so that unaffected integration check was not repeated. P07 retains final rendered explanation-quality and timing-series work.
- OpenSpec strict validation and git diff --check passed. All accepted runtime content is frozen; report-only updates do not invalidate these checks.

Publication: acceptance report commit 4cdc501c2c0b22cf313f5c125d976a38b1c78dc1 differs from tested 16ade3e only in this task card. Feature branch remote head was verified at 4cdc501. Under the verified reservation, the clean integration checkout and the primary main checkout fast-forwarded to 4cdc501; a normal push published main and git ls-remote confirmed 4cdc501 exactly. Therefore all five delivery tasks are integrated. This final report is a separate documentation-only update. No product executable changes occurred after acceptance. All task-owned Compose containers/networks and verification ports were stopped/removed before handoff; Docker Desktop itself remains running.

| Feature | Criteria met | Checks | Branch / SHA | main status | Blocker / next step |
| --- | --- | --- | --- | --- | --- |
| Docker Compose delivery | Self-contained launch, optional runtime AI, data readiness, judge instructions and clean reproduction | 48 tests, typecheck/build, seven HTTP cases, real browser, alternate port/restart, controlled unhealthy catalogue, separate live OpenAI | codex/deploy-docker; tested 16ade3e; acceptance report 4cdc501 | MERGED AND PUBLISHED at 4cdc501 | No Docker-scope blocker; P07 owns final quality/timing and demo |

## Deployment and README recheck — 2026-09-23

Owner: Codex task `01a0ce48-bd40-7e22-9a13-8852a652730c`. Scope: requested
README/deployment audit and documentation corrections; no product changes,
subagents, Git publication or shared integration writes. Historical task stages
and publication evidence above remain unchanged.

| Task | Stage | Evidence / revision | Remaining checks | Hold / blocker | Next action / owner |
| --- | --- | --- | --- | --- | --- |
| Audit: README and Docker | implemented | Source `96a8caa242d273a7b9384a2b5953e78762c57b33`; image `sha256:a6440e7181282fd10e8992861b2e13957240a7cb0e8b8f4dda0e5ce71906b7dc`; documentation-only local diff | Optional live provider recheck | Paid external requests rejected by automatic approval review pending explicit user authorization | Coordinator reports local results; user decides on two paid API calls |

- Docker Desktop was initially stopped. Started the installed per-user Desktop;
  Docker Engine 29.7.2, Compose 5.4.0, Linux/x86_64 became available.
- Used a clean `git archive` snapshot under ignored
  `test-results/deploy-audit-1608dcba`, with no host `.env`, `node_modules` or
  `.next`. This is an exported committed source snapshot, not a Git worktree.
  Project name `join-city-audit-1608dcba` isolated all containers/network.
- Initial source `1608dcba22856ce810464c86851881f4f47e5bac` passed
  `docker compose build --no-cache`: `npm ci` installed 497 packages, typecheck,
  all 62 tests and production build passed. No secret or personal runtime files
  entered this build. The base-image digest remained the committed pin.
- Main advanced concurrently with a visual refresh. An initial browser attempt
  accidentally used the newer root test against the older container and failed
  on `.selection-motif`; this was not a product failure or a passing check.
  Refreshed the source snapshot to the exact `96a8caa` revision and ran the test
  from that snapshot against its rebuilt image. Dependencies/lockfile did not
  change, so the already verified dependency layers were reused; application
  typecheck, all 62 tests and production build ran again and passed.
- README launch `docker compose up --build --wait --wait-timeout 120` passed on
  `127.0.0.1:3101`, with the isolated project name and blank provider settings.
  Service became healthy. All seven `scripts/docker/smoke.mjs` cases passed;
  modes were `catalog_fallback` and `not_needed`.
- `npm ls --omit=dev --depth=0` inside the runtime reported the five expected
  direct dependencies at their pinned versions, with exit 0. Runtime user is
  `node`; there are zero host mounts. No database or other dependency service is
  defined or needed.
- The snapshot's full `scripts/frontend/browser.mjs` passed against real
  container HTTP in Edge: primary results, date changes, optional filters,
  rare/empty outcomes, validation, retained results, keyboard interactions and
  375/390/1280-pixel layouts without overflow. Its altered-request HTTP 400 check
  is controlled input, not an external provider failure. Evidence/screenshots:
  ignored `test-results/deploy-audit-1608dcba/browser-current/`.
- Additional public HTTP checks submitted the existing confirmed-brief fixture:
  HK-77838 moved first, mode was `brief_evidence`, unknown wording was retained,
  and budget 900000 excluded that contractor. Missing-key interpretation
  returned 503 `BRIEF_UNAVAILABLE`; empty text returned 400 `INVALID_REQUEST`.
  This verifies the bundled index and runtime routes, not live interpretation.
- Stopped and removed the test project; created a non-secret test `.env` with
  `APP_PORT=3111` and relaunched without rebuilding. Healthy startup, all seven
  smoke cases and all additional wishes checks passed again at the new port.
  Final cleanup removes only this task's containers/network; Docker Desktop
  and cached images remain available.
- README now explains installed/runtime components, local-only networking,
  rebuild requirements and wishes architecture; removes stale Brev/extra-key
  instructions; clarifies Compose versus direct-loader variable expansion.

Limitations: runtime checks used catalogue fallback and public confirmed-input
fixtures. A local provider key was confirmed present without displaying it, but
automatic approval review rejected the proposed two paid OpenAI calls because
the current request did not explicitly authorize paid external transfer. No
live requests were made. Earlier live evidence above is historical only.
macOS/native Linux hosts/ARM and a separate host Node installation were not
retested. Non-failing npm ESLint 9 deprecation and Node module-type warnings
remain; no dependency upgrade or security audit was part of this request.
