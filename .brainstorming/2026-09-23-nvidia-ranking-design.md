# NVIDIA semantic selection: brainstorming outcome

Date: 2026-09-23.

Status: the user approved designing application integration in which NVIDIA selects the top three from **all eligible candidates**, with price and ID resolving equal semantic scores. The technical design below is the recommended implementation approach discussed in this session. This document records planning; it does not authorize or claim implementation, live evaluation, or publication.

## Context and scope

Source proposal: [P90 optional NVIDIA experiment](../.proposals/90-optional-nvidia-experiment.md). Existing constraints: [optional checkpoint](../architecture/implementation-and-verification.md#optional-nvidia-checkpoint), [selection specification](../openspec/specs/contractor-selection-domain/spec.md), and [public contract](../contracts/contractor-selection.ts).

Inspected checkout: `codex/cs-90-nvidia`, revision `d07a7c286d1816be9e5cf1dcac000dad04fa018b`. The [archived P07 task card](../openspec/changes/archive/2026-09-23-integration-and-delivery/tasks.md) records completed acceptance and publication, including tested source `f8473dae814d7a1e904f08795ad76fb40338c5da` and published evidence revision `44f447c1406a6f604604d934d8c73c8891208b6f`. These are historical records, not checks rerun for this discussion.

The user selected application integration rather than an experiment report alone. Retain P90's measured adoption gate: comparison precedes enabling semantic selection. A negative or inconclusive experiment leaves the accepted price/ID application in place. The initial 15-minute checkpoint covers feasibility and a small comparison, not the complete implementation. Reconcile the actual demo deadline and protected delivery time before execution.

## Approved product direction

- Apply all existing strict filters first: city, category, date, budget, format, requested language and duration. Preserve structured-field authority, rejection precedence, counts, busy IDs and the three existing outcomes.
- Rank the entire eligible set by semantic score descending, then starting price ascending, then fixed ordinal ID ascending. Return at most three. Never take the baseline top three before semantic ranking.
- A more expensive eligible profile may replace a cheaper one. Describe the result as matching descriptions to the event format, not as the cheapest options or a verified assessment of contractor quality.
- Retain existing form inputs. No free-text brief, preference inference, sorting selector, GPU deployment, embeddings, vector database or extra service.
- OpenAI continues selecting source quotes for the chosen cards. NVIDIA ranking and explanation provenance are separate facts; NVIDIA does not replace the explanation provider.

The current request contains little semantic preference information. Format/category relevance is the measurable hypothesis. The model must not invent a preference for humor, luxury, traditions or a particular performance style. Different ordering alone is not evidence of improvement.

## Alternatives and recommendation

| Approach | Benefit | Cost or limitation |
| --- | --- | --- |
| **Generate and ship an immutable NVIDIA score snapshot** | Stable selection across requests, restarts and provider outages; no NVIDIA latency during search | Scores must be regenerated and reviewed for a new catalogue or ranking policy |
| Call NVIDIA during every search | Scores are obtained on demand | Adds latency and a provider dependency; model variability and availability can change ordering |
| Persist the first result for every complete request | Reuses previous results | Requires durable writes and concurrency rules; unseen requests still depend on NVIDIA; materially more machinery |

Recommend the immutable snapshot for this small fixed catalogue. It is an application input produced by a real model, not a fabricated fixture. UI and documentation must disclose that NVIDIA scores were calculated in advance. Live-per-search ranking would require a separate decision about durability and availability; it is not silently substituted for this design.

## Score generation and deterministic selection

Use a fixed Russian query template built only from canonical category and event format, for example: `Подрядчик категории «{category}» для мероприятия формата «{eventFormat}».` Submit each matching profile's description as its passage. Keep the mapping from passage index to profile ID locally. Do not include names, calendars, credentials, price or provenance flags as relevance signals.

Budget, city, date, language and duration remain strict filters, not semantic preferences. This deliberately keeps each profile's score stable when only eligibility changes. Enumerate every category/format pair represented by the catalogue and score all profiles whose structured fields support that pair. Runtime filtering then selects a subset of that same scored population. For a multi-category profile, keep a separate score in each relevant group. Do not compare scores across groups.

The generation process SHALL:

1. Read the accepted catalogue and load `NVIDIA_API_KEY` through the existing server-only secrets loader.
2. Fix model identifier, endpoint, query template version, passage construction and catalogue hash before generation.
3. Send groups in deterministic ID order. Require exactly one finite score per submitted index, with no missing, duplicate or out-of-range index. An invalid batch cannot become a snapshot.
4. Verify the actual model's input limits and longest query/passage before full generation. Do not silently truncate descriptions or treat character length as token length. If full input cannot be preserved, stop and revise the preparation rule explicitly.
5. Use a proposed 10-second total deadline per outbound call, cancellation and zero automatic retries. Stop the feasibility probe after two meaningful failures; do not loop through models or providers.
6. Write a new immutable snapshot only after all groups validate. Include catalogue hash, model, endpoint, template version, generation time, profile IDs, scores, coverage and a content digest. Preserve the previous accepted artifact on any failure.

The number of groups, requests and any known account cost must be assessed before full generation. The first probe uses only the agreed dense case. A paid retry or full-catalogue generation is not part of this planning session.

At application initialization, load and validate the complete snapshot against the catalogue and configured policy. Inject its read-only scores into pure selection. An empty eligible set returns the existing empty outcome; a singleton remains that same singleton. No search request calls NVIDIA or writes ranking state.

Freeze the snapshot for the process lifetime and deployment. A replacement requires a reviewed version and restart. The policy identifier includes the snapshot digest and algorithm version; scores are not refreshed on a timer or expiry. Repeating the same request with the same catalogue and policy therefore has the same order, even if later model calls would return different scores.

## Boundaries and affected code

These are proposed ownership boundaries for a future OpenSpec design, not current operations or created files. One coordinator can implement them sequentially.

| Component / proposed paths | Responsibility and dependencies | Observable checks |
| --- | --- | --- |
| `scripts/nvidia/` | Generate and compare scores using catalogue loading, server secrets and a bounded hosted adapter; own experiment evidence | Actual access, response validation, cancellation, failure preserves previous artifact |
| `back/ranking/` and versioned ranking data | Load and validate immutable score data; own preparation metadata and coverage validation | Wrong catalogue, incomplete coverage, invalid score, stable content identity |
| `back/domain/select.ts`, `back/domain/types.ts` | Reuse one eligibility implementation; pure ordering with an injected policy and scores; no provider/storage dependency | Every eligible candidate considered, unchanged diagnostics, ties and repeatability |
| `back/composition.ts`, `back/recommend/recommend.ts`, `back/http/handlers.ts` | Select one configured policy, load data once, expose consistent context, invoke existing explanation flow after selection | Same policy on options/results; failure is explicit; explanation fallback preserves IDs |
| `contracts/contractor-selection.ts`, `front/publicResponses.ts` | Agree and validate public ranking metadata and an unavailable error before consumer edits | Real HTTP success/error examples and consumer validation |
| `front/RecommendationResults.tsx`, `front/compareRecommendations.ts` | Explain semantic order and date changes from public facts | Correct method label, displacement, promotion and comparison reset |

Avoid a generic provider registry or duplicating eligibility in an evaluation script. If selection needs to expose eligible profiles internally, extract the existing logic once and retain baseline regression cases. Keep product modules independent of generation scripts.

## Public behavior and failure policy

Proposed public context adds `rankingMode: 'price' | 'semantic'` beside `catalogVersion` and `selectionPolicyVersion`. Both options and recommendation responses use the same configured policy. The existing request shape stays unchanged; there is no user mode switch. Final field names and examples must be committed in the future contract before dependent implementation.

Semantic result copy explains that descriptions were ranked for the requested event format using precomputed NVIDIA scores, with price/ID tie-breaking. Do not display raw logits as percentages, confidence, reviews or quality ratings. Existing `explanationMode` continues to describe only the source-quote content actually rendered.

For a date-only change under identical catalogue/policy versions:

- Preserve exact calendar-based explanations for newly busy and newly available profiles.
- Explain displacement of an available profile by newly available candidates ahead under the fixed semantic policy. Do not assert a lower price or strictly higher semantic score without supporting public facts; ties may have decided the order.
- Explain promotion of an already available profile after candidates ahead became busy.
- Reset comparisons when catalogue or policy changes. Retain current cancellation and stale-response protections.

Missing, corrupt, incompatible or incomplete ranking data under configured semantic mode yields an explicit service-unavailable response, proposed code `RANKING_UNAVAILABLE`, HTTP 503, with message and `requestId`. It must never produce a successful price-sorted result labelled semantic. Validate the complete snapshot before serving that policy, rather than discovering missing scores after selecting some requests.

NVIDIA network failure during generation leaves the deployed snapshot untouched. During search, NVIDIA can be entirely unreachable without affecting order. OpenAI unavailability continues to use the existing visible catalogue explanation fallback without changing selected IDs.

Rollback is an explicit deployment/configuration decision to use the accepted price policy. It changes the reported policy identity and UI label. Never alternate semantic and price selection silently within the same policy.

## Hosted model candidate and setup

Initial candidate: `nvidia/llama-3.2-nv-rerankqa-1b-v2`. The [official model card](https://docs.api.nvidia.com/nim/reference/nvidia-llama-3_2-nv-rerankqa-1b-v2) lists Russian among evaluated languages and an 8192-token context. The [hosted inference reference](https://docs.api.nvidia.com/nim/reference/nvidia-llama-3_2-nv-rerankqa-1b-v2-infer) documents a model-specific reranking endpoint accepting query and passages. Documentation was checked through Context7 and the official pages on 2026-09-23. Examples from other model versions are not substitutes for this endpoint's validated response contract.

This is a candidate, not a claim of account access, acceptable Russian event relevance, deterministic live output, available credits or a known price. A real request must establish access before implementation depends on it. If unavailable, record the result and deliberately revisit model choice; no automatic substitution.

Generation needs an NVIDIA account/key, actual model entitlement and outbound HTTPS. Application runtime needs only the accepted score file for NVIDIA ranking; existing OpenAI setup remains separate. No Brev account, local GPU, NIM container, new backend service or persistent database is necessary for this design. Use existing runtime capabilities and direct HTTP unless a demonstrated requirement justifies a dependency.

Delivery documentation must eventually describe score provenance, supported catalogue/policy, regeneration, rollback, configuration names and limitations through the project-delivery workflow. Never include credentials in artifacts or browser bundles. Unknown price or usage data remains unknown, not zero.

## Adoption and verification

Before examining model output, record a small relevance rubric based on explicit source evidence about the requested category/format. Review baseline and semantic selections without algorithm labels where practical. A larger model score alone is not the rubric; record the price tradeoff separately.

The initial checkpoint compares the same eligible population for the October 10 dense hosting request, then checks the florist singleton and both empty outcomes. The dense case must show a concrete, source-supported improvement in selection or ordering to justify further work. If the case is a tie, depends on invented preferences, fails input/access validation or exceeds the timebox, record rejected/deferred and keep baseline enabled. A positive checkpoint justifies integration work, not a general quality claim.

Before adoption, extend the small comparison to both documented date pairs and at least one other populated category/format selected before scoring. Record every selected case, including failures; do not cherry-pick retries. No clear benefit or a material unexplained regression blocks activation.

| Criterion | Required evidence |
| --- | --- |
| Filter preservation | Existing boundary, busy venue, diagnostic and empty-outcome checks pass; every displayed ID is eligible |
| Full-population ranking | Controlled case with more than three eligible candidates promotes a candidate outside the cheapest three; ties use price/ID |
| Real semantic usefulness | Recorded baseline/semantic IDs, own-description evidence, rubric decisions and price tradeoffs for the declared cases |
| Stable policy | Three repeated real requests and an application restart preserve IDs; unrelated requests do not affect scores |
| Provider/storage failures | NVIDIA unavailable with valid snapshot preserves selection; failed generation does not replace data; bad snapshot gives explicit 503 |
| Explanation independence | Existing valid/mixed/fallback OpenAI cases operate on the newly selected cards and never change their order |
| Date change and UI | Real comparisons explain busy/displaced/promoted cards truthfully; semantic label, errors, mobile readability and keyboard flow verified |
| Cost and timing | Generation duration/request count and available cost/usage evidence recorded separately from three full browser request-to-result measurements, including first use; existing under-10-second target retained |
| Reproduction | Clean committed checkout follows documented installation, configuration, build and launch with shipped ranking data; no NVIDIA key required for search |

Real-provider quality, controlled failures and historical baseline checks must remain distinguishable. Existing tests whose expected order is price-based must remain baseline checks or be deliberately updated for the new policy; do not replace expected IDs merely to make failures pass.

## Next stage and evidence limitations

This session read product code, current specifications, P07 evidence and provider documentation. It did not inspect credentials, call NVIDIA/OpenAI inference, generate scores, run application tests or alter product behavior.

When implementation is explicitly requested, create one local OpenSpec change through the CLI, link this outcome, and reconcile the current base/deadline. Transfer the policy, snapshot format, modules, errors, contract examples and checks into proposal/specs/design/tasks before code changes. Record exact allowed paths and ownership; do not silently switch another active change.

Revise selection, frontend comparison, contract and delivery requirements coherently before activating semantic ranking. Publish a new immutable frontend contract version if a handoff is needed; never edit the existing v1 package. Implementation, acceptance and publication follow the repository's normal stages. The existing P90 proposal remains the historical experiment entry point; this document captures the user's selected integration direction without claiming it has passed that checkpoint.
