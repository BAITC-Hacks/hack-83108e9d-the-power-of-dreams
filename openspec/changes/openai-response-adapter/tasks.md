## Preparation baseline publication

Current authorization on 2026-09-23: the user explicitly requested committing
and pushing all current project files so development can start in worktrees.
This supersedes the historical no-commit/no-push/no-merge hold below for this
preparation snapshot. It does not assert product implementation or acceptance.

- Publication owner: Codex task `01a0cd80-4273-7ac2-8a94-9d61316b7aaf`.
- Workspace/branch: `D:/Alem/hack-83108e9d-the-power-of-dreams`, `main`.
- Checked base and remote main: `f2aea352a3c7f92804cab1a353aa787498ff0e56`.
- Remote: `origin`, `https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git`.
- Scope: all existing project preparation files shown in Git status, including
  proposals, architecture, domain/source data, stack manifests, existing modules,
  operator scripts and their planning/evidence; necessary status clarification.
  Exclude filled environment files, dependencies, caches and local coordination.
- Shared reservation owner: the same task ID; resources are the primary Git
  index, main preparation publication and related task-card publication records.
  Reserved through exclusive creation of `.shared/integration-owner.json`.
- Checks: inspect the explicit staged file set and secret exclusions, validate
  affected OpenSpec artifacts, verify focused local checks from the committed
  source snapshot, then confirm the remote main SHA. No paid/live probe or GPU
  operation is needed for this publication; existing live evidence is retained.
- Current publication step: preparing the snapshot; record the resulting SHA
  and actual checks after that commit exists. Product P00 remains the next task.

The implementation history below records the original verification session.
Its former publication hold is superseded by the authorization above; unchecked
tasks must not be treated as instructions to rebuild the already verified adapter.

## 1. Adapter

- [ ] 1.1 Implement server transport and environment factory; verify a benign live request with scripts/openai/check.mjs.
- [ ] 1.2 Verify request shaping, response validation, safe failures and cancellation with node --test scripts/openai/contract.test.mjs.

## 2. Delivery

- [ ] 2.1 Document configuration/run method and verify a disposable clean copy of affected files without a personal session.
- [ ] 2.2 Verify accepted candidate and publish only after the current no-publication hold is lifted; confirm remote main before completion.

## Stage table

Owner: current coordinator; sequential local work, no delegates. Workspace: D:/Alem/hack-83108e9d-the-power-of-dreams, main, baseline c4bb55fa71967c00e0ecfc147ad166de9d20cc2c. Existing uncommitted preparation is preserved. Allowed files: back/ai/openai.mjs, scripts/openai/, this change and brainstorming outcome, README OpenAI section, .env.example optional model, docs/tooling.md evidence. No public server or build is introduced.

| Task | Stage | Evidence/revision | Remaining checks | Hold/blocker | Next action/owner |
|---|---|---|---|---|---|
| 1.1 | implemented | Live probe passed, 4114ms, 17 input / 4 output tokens | publication only | no commit/push/merge | retain verified local files |
| 1.2 | implemented | 6/6 Node contract checks passed, including native fetch stalled body and cancellation | publication only | no commit/push/merge | reuse evidence unless executable changes |
| 2.1 | implemented | README/environment docs; disposable copy 6/6 and live probe 2496ms, 21 tokens | committed clean checkout unavailable | no commit/push/merge | retain evidence |
| 2.2 | planned | none | candidate/publication | explicit no commit/push/merge | retain hold |

## Verification evidence (2026-09-23)

- `node scripts/openai/check.mjs`: successful real Responses call using private .env; requestId e41369b1-b4f3-4ada-9125-d2997ec6e60d. Pinned model returned expected fixed text. No credentials/provider body printed.
- `node --test scripts/openai/contract.test.mjs`: 6/6 passed. Transport shaping/schema forwarding, multipart output, required key/default/override, 401/403/429/500/400 without retries, safe network errors, malformed/incomplete/refused/empty responses, invalid input, pre-cancellation, deadline during native body consumption and in-flight cancellation.
- Disposable copy at C:/Users/Ramazan/AppData/Local/Temp/dreams-openai-42349000f25a4ee097f4e82dd4990b48 contains only affected modules/scripts, no node_modules or .env. Same 6/6 checks and a real probe passed; credential supplied through child process environment. RequestId 65021a15-8273-4053-889c-28520ab8a77a. Total live verification usage: 42 tokens across two calls.
- `openspec validate openai-response-adapter --strict --no-interactive`: passed. Structural validation is not runtime evidence.
- SHA256 back/ai/openai.mjs: C9F07FD119911CE2D3BE542AD4C40C9911142689DFF45780A3A2BBC173ABF47F.
- SHA256 scripts/openai/check.mjs: 143A5B6759A1606FA46CFA93769E20D4662311AF474DC990EC533802840DEA25.
- SHA256 scripts/openai/contract.test.mjs: E083BDEDBD861B6AA489971A6BB73EAA10B2779793BCA8A9F2B8ECB59AF577E2.
- Limits: no domain/application integration, UI or public route exists in this slice; no app build/launch claim. JSON-schema forwarding checked with controlled transport, live probe is plain text. No clean committed checkout, candidate integration or remote publication under the explicit hold. CLI remains 0/4 by project publication semantics; tasks 1.1–2.1 are locally implemented, not unstarted.
