## Context

See [proposal](proposal.md) and [architecture](../../../architecture/README.md). Base 878ed7898c34723f77965d78fe0d75c2eef8c13a includes accepted P06 015772144f5a8761d6569e9220ecfb699f1bbed2. The differences are documentation only. P05 backend pin is 4ade2fa4022d633e9d96b50188be4cee4fb99539; v1 package commit e424a13fec851d7f9f0f4e076f70649e716336f7 remains immutable. Another task currently owns the integration checkout for Docker delivery.

## Goals / Non-Goals

**Goals:** finish observable delivery acceptance with minimal new code, one final source revision and exact evidence.

**Non-Goals:** change selection, renderer, provider prompt, API, dataset, credentials or UI; recreate existing tests; introduce infrastructure or submit to organizers.

## Decisions

| Boundary / owner | Purpose and operations | Inputs / outputs / errors | Data / dependencies / verification |
| --- | --- | --- | --- |
| Coordinator: scripts/delivery/live.mjs | Run one dense/rare/dense production browser series | Private server configuration path and free port; public responses, rendered timings, screenshot; explicit failure on unavailable/live fallback/mismatch | Ignored test-results only; existing loader, Playwright, Node and Next; three paid requests, no automatic retries beyond unchanged adapter policy; own process stopped in finally |
| Apply role: THIRD_PARTY.md | Document used libraries/data/models/tools and provenance | Manifests, supplied source metadata; English provenance table; unknown licenses explicitly unknown | No runtime imports, external accounts or app changes; coordinator verifies factual claims and links |
| Coordinator: README/.env.example/architecture index | Reconcile final install/run/demo and limitations | Actual scripts and acceptance; no secret values | Preserve concurrent Docker instructions, no spec duplication; clean committed checkout and primary scenario |
| Review role | Evaluate evidence coverage and final card quality | Frozen revision, public explanations and selectively read source descriptions | Read-only, no paid calls or edits; criterion-based verdict |

Use existing real/controlled checks instead of adding a general E2E framework. The live runner uses existing installed system Edge and Playwright, launches one local Next production process, records all three responses, and stops on failed validation. Polls/assertions have bounded timeouts; preserve existing server cancellation and timeout behavior. Do not change runtime retry policy or secrets for negative tests.

Run method: Node 24/npm 11 pinned install, npm build, npm start bound to localhost. Integration checks use 3107; documented final demo uses 3000 after verifying port availability. Separate sibling clean-checkout worktree owns its node_modules/.next/test-results and private .env copied through the agreed local loader/setup method. No database, GPU or cloud deployment required. The independently authorized Docker launch remains optional. Dependency installation and live AI require network; live requests require paid OpenAI project/model access. No new service is justified.

Reconcile exact accepted frontend and latest main before final freeze. Because no executable product edits are planned, P04/P05/P06 evidence remains valid when Git diff verifies its inputs are unchanged. Repeat only affected checks if the Docker or another accepted update changes a relevant input.

## Risks / Trade-offs

- Live quotes vary → record every response and concrete per-card quality; no cherry-picking retries. A failed criterion requires a scoped repair/ownership decision.
- Shared checkout occupied → prepare independently, wait for explicit release, acquire marker with exclusive creation before writes.
- Documentation conflicts → coordinator merges current main first and preserves both approved delivery paths.
- Historical evidence can be stale → compare executable/data/model/prompt content and record exact supporting revisions.

## Migration Plan

Commit scoped planning, dispatch provenance in a separate sibling worktree, add small live verification and documentation. Merge accepted commits and latest main sequentially. Verify clean committed README install/config/build/start and primary/live series. Under reservation fast-forward main and normal explicit push; confirm remote ancestry. Save report, sync specs and archive; publish report-only updates separately. Do not remove worktrees or others' files. Any promotion failure leaves the candidate and exact blocker intact.
