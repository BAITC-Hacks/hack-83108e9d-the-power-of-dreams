## Context

See [proposal](proposal.md) and the [approved outcome](../../../.brainstorming/2026-09-23-nvidia-ranking-design.md). Base is d07a7c286d1816be9e5cf1dcac000dad04fa018b; historical P07 is complete. Current domain selection mixes eligibility and price sorting but remains a small pure operation. [Selection architecture](../../../architecture/selection-and-explanations.md) and [system index](../../../architecture/README.md) describe the accepted baseline. No other change is selected for implementation by this task.

## Goals / Non-Goals

**Goals:** a measured, deterministic semantic policy without provider calls during search, retaining one eligibility implementation and accurate public explanations.

**Non-Goals:** new input controls, styling overhaul, GPU/services/databases, generic provider infrastructure, replacing OpenAI or expanding the fixed catalogue.

## Decisions

### Adoption gate before dependent code

First execute one dense live scoring call against the fixed model and existing loader. The feasibility clock starts at the first probe and lasts at most 15 minutes, with no more than two meaningful failures and no automatic retry. This bounded reserve avoids consuming unspecified demo time; no external deadline was supplied. A negative/inconclusive result blocks subsequent product work. Record all outcomes; do not tune prompts after seeing the scores.

Before output, declare the rubric: C=1 for explicitly named category/service, F=1 for explicitly named requested format or unambiguous synonym; relevance is C+F. Company names alone do not imply corporate-event experience. Style, fame, age, humor and language earn no extra credit. Lack of evidence is not ineligibility. Compare sum of top-three relevance and ordering inversions; improvement requires a larger sum without demoting the most supported candidate, or removal of an inversion with unchanged membership. Equal-rubric reordering is not improvement; prices are reported separately.

Dense case: Алматы / Ведущий / корпоратив / 2026-10-10 / 1500000, optional fields omitted. Pre-output grades: HK-88430=2, HK-29829=0, HK-27222=1, HK-77838=1, HK-75012=1. Baseline is HK-88430/HK-29829/HK-27222. Before adoption extend to hosting dates October 11, 1 and 6, plus Алматы / Фотограф / свадьба / 2026-10-10 / 1500000 (HK-53108=1, HK-30583=2, HK-16628=2), rare florist, budget=1 and absent category. No invented stylistic preferences or selective retries.

### Bounded generation and snapshot

Use native fetch, model `nvidia/llama-nemotron-rerank-1b-v2` and fixed `https://ai.api.nvidia.com/v1/retrieval/nvidia/llama-nemotron-rerank-1b-v2/reranking`. The user explicitly authorized selecting a current hosted model after the original endpoint returned HTTP 410; this is a deliberate 2026-09-23 revision, not automatic provider fallback. Preserve the original failure record and unchanged pre-output rubric. Query v1 is `Подрядчик категории «{category}» для мероприятия формата «{eventFormat}».`; passages contain complete descriptions only, in ordinal ID order. POST body uses model, query.text, passages[].text and truncate=NONE; Bearer key comes from loadSecrets. Ten-second deadline covers fetch and body, zero retries, caller cancellation aborts. Validate rankings as an exact permutation of input indices with finite logits; expose safe errors only.

The current [model card](https://docs.api.nvidia.com/nim/reference/nvidia-llama-nemotron-rerank-1b-v2) and [endpoint](https://docs.api.nvidia.com/nim/reference/nvidia-llama-nemotron-rerank-1b-v2-infer) were checked on 2026-09-23 after Context7 returned only generic material. Maximum batch is 1000 passages and model context 8192 tokens. Explicit truncate=NONE overrides the endpoint's default END. Before a full run establish full-input acceptance for the longest pair; do not equate characters with tokens. The API prose warns of automatic truncation despite a NONE field: unresolved truncation evidence blocks full generation. A model tokenizer or documented conservative byte-token bound with overhead can prove fit; no silent truncation/chunking.

Snapshot JSON v1: schemaVersion, catalogVersion (existing CSV SHA-256), model, endpoint, templateVersion, generatedAt (ISO UTC), groups [{category,eventFormat,scores:[{id,score}]}], coverage {groups,profiles,scoredPairs}, digest. Digest is SHA-256 of deterministic JSON excluding digest. Groups and scores sorted by ordinal keys. Validate exact represented category/format coverage, per-group exact IDs, uniqueness, finite scores and every metadata field. Build completely in memory; create a new digest-named file with exclusive creation only after validation; never replace an accepted file.

### Module boundaries and ownership

| Module / owner | Operation and input/output/errors | Owned data / dependencies | Verification |
|---|---|---|---|
| scripts/nvidia, coordinator until gate then apply worker | probe/generate/compare; catalogue + server key -> safe evidence/new snapshot or explicit failure | generation records; catalogue loader, native HTTP, secrets; no runtime imports from scripts | real gate, invalid index/score, cancellation/deadline, failed write preserves prior artifact |
| back/ranking, apply worker after committed assignment | validate/load snapshot for catalogue -> frozen policy or unavailable | snapshot metadata/scores; filesystem at adapter boundary, crypto, domain types | exact coverage/catalogue/digest, immutable repeatability |
| back/domain types/select, coordinator | select(profiles,request,optional scoring policy) -> existing SelectionResult | no owned state; domain/public types only, no I/O | current filters plus >3 candidates, ties, frozen inputs |
| composition/recommend/http, coordinator | configured services -> consistent options/recommendation or RANKING_UNAVAILABLE | retained process policy and catalogue, loader and injected selector/evidence | same context, 503 retention/restart, OpenAI independence |
| contracts and front response validator, coordinator | public v2 context/errors and validation | readonly JSON types/examples, no server imports | success/error examples, validation |
| front result/comparison, coordinator | response -> truthful text and date narrative | public facts only; existing components | semantic/price labels, busy/displaced/promoted, reset and browser checks |

Avoid an eligibility clone: expose eligible profiles from the one domain filtering pass if the checkpoint needs them; preserve default Select compatibility and existing baseline cases. Score lookup is injected into pure selection. Runtime reads the snapshot once and never imports generation code.

### Public contract and configuration

Context adds required rankingMode: price | semantic. selectionPolicyVersion is selection-v1 for price and semantic-v1:<snapshot digest> for semantic; options and recommendations agree. Add RANKING_UNAVAILABLE with HTTP 503 and the existing safe error/message/requestId envelope. Request shape and explanationMode are unchanged. Commit DTOs and minimal price/semantic success and unavailable examples before any dependent consumer assignment. Coordinator handles the small consumer edits sequentially; no separate frontend handoff is required unless delegated, in which case publish a new immutable shared package first.

RANKING_MODE defaults to price until adoption passes; semantic requires RANKING_SNAPSHOT. Missing/corrupt/incompatible/incomplete snapshot retains an unavailable service until restart, never silently falls back. Explicit rollback switches mode to price and restarts. No raw scores enter UI. Semantic copy discloses precomputed NVIDIA description relevance and price/ID ties. Comparisons use fixed-policy rank language, exact busy facts, and never infer cheaper/higher-score claims from absence.

### Run and setup

Use existing npm ci, typecheck, test, build and start commands. No new dependency or infrastructure. Generation alone requires existing NVIDIA account/key, entitlement and outbound HTTPS; unknown credits/cost remain unknown. First probe sends only the five eligible dense descriptions. Count all groups and scored pairs before full generation. Preserve complete recorded inputs and model identity without credentials. Search requires shipped snapshot, not NVIDIA credentials; OpenAI setup remains independent. All billable calls are bounded to agreed verification/generation, no paid retries or provisioning. Use a separate test port and temporary output per worktree.

## Risks / Trade-offs

- Sparse semantic intent -> require explicit relevance benefit; retain baseline on tie/regression.
- Provider latency/access/input limits -> bounded probe first; do not implement dependent modules on assumed access.
- Stale snapshots -> exact catalogue/policy coverage check and explicit 503.
- Concurrent UI work -> coordinator reconciles shared files and main under the integration reservation; preserve other work.
- Missing real acceptance -> retain unmet tasks; structural validation or fixtures never substitute for live checks.

## Migration Plan

Commit planning and probe evidence first. Only after a positive gate, commit public contracts/examples and dispatch one bounded apply assignment in a separate sibling worktree. Integrate sequentially, run baseline and semantic checks, real browser date pairs/timing, repeated requests/restart and clean committed README launch. Enable semantic only after accepted evidence; publish main under exclusive shared ownership, synchronize specs and archive after actual completion. A failed gate is recorded as deferred, leaving this change incomplete and main specs/product unchanged; do not archive incomplete work without explicit direction.
