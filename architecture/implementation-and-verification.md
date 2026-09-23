# Implementation and verification

Status: OpenAI-first sequencing agreed on 2026-09-23. This is a sequencing and evidence guide for the [architecture](README.md), not an active task board. Use a product change in OpenSpec for the implementation tasks, stages, exact contracts and results.

## Four-hour envelope

The user reported four hours remaining during architecture discussion. The allocation below is the original planning envelope, not a fresh four-hour allowance: reconcile the actual remaining time before implementation and subtract discussion/setup time. It is an estimate for one coordinator with the prepared environment, not a promise. Protect verification and delivery time by keeping optional work out of the critical path.

| Elapsed budget | Work | Exit evidence |
| --- | --- | --- |
| 0–15 min | Use the recorded approved brainstorming outcome; create/validate the minimal OpenSpec change and DTO examples; reconcile existing local harness/configuration work | Agreed policies, one active implementation change, exact allowed files and truthful readiness |
| 15–35 min | Test the riskiest dependency with the dense-category request: real OpenAI call returning evidence for three profiles | Key/model/network access, valid output, relevant Russian excerpts and measured duration; no claims based on credential presence alone |
| 35–95 min | Complete one vertical slice: CSV → filters/order → explanation → HTTP → minimal form/cards | The real October 10 scenario works in a browser, without mocked module connections |
| 95–140 min | Add missing states, optional filters, date-change explanation and explicit AI fallback | Three outcomes, partial result and cancellation behave correctly |
| 140–190 min | Focused acceptance and repairs | Dataset/HTTP cases, real AI quality and timing, repeated order, venue case, mobile/keyboard checks |
| 190–220 min | Reproducible delivery using project-delivery: README, environment/dependency provenance, clean-checkout or isolated-copy verification, built launch | Documented install/configure/build/start/demo; clearly label any unpublished-file dependency or skipped clean-checkout check |
| 220–240 min | Fix demonstrated blockers and rehearse the four demo queries/date change | Working demonstration and accurate evidence report; no late feature additions |

Build sequentially until the first live scenario works. A separate backend service, multi-agent implementation split or immutable frontend handoff is not needed to make this first slice work. If implementation is delegated afterwards, first satisfy the repository's committed-base, contract-package and worktree rules; existing uncommitted preparation does not establish those conditions.

If the first OpenAI probe fails, diagnose key access/model access/network/quota once and repeat only after a concrete correction. After two meaningful failures, report the evidence and continue the local-rule path as explicitly degraded work. Do not silently switch models, claim live AI passed, or consume the whole timebox on provider troubleshooting. A model change needs a recorded reason and a repeat of the affected check.

## Optional NVIDIA checkpoint

The agreed priority is the working OpenAI MVP. A NVIDIA reranking comparison is optional, has no reserved slot in the four-hour baseline, and does not block its acceptance. Start only after required MVP checks pass and sufficient time remains for reproducible delivery and demo preparation; limit the initial comparison to 15 minutes. If those conditions are not met, record it as deferred.

Compare the same eligible candidate sets under baseline price/ID ordering and NVIDIA semantic scores, using existing request fields and catalogue descriptions. Keep city/category/date/budget/format/language/duration filters unchanged. Examine profile-to-event relevance on the dense example and check rare/empty outcomes, repeated ordering and total response time. No embedding index, new user-input feature or generic multi-provider layer is part of this experiment.

Adopt semantic ranking only with observed benefit and passing affected checks, including repeatability across restarts and provider unavailability. Preserve the baseline if evidence is inconclusive or the experiment exceeds its timebox. A live score/fallback combination must not silently change the same request's ordering. Record the chosen policy, model, contracts and evidence in OpenSpec before any adoption; update ranking expectations only then.

Separately, if OpenAI access is blocked, the NVIDIA explanation adapter remains a manual implementation-time contingency. Check its actual model access, output format, Russian evidence quality and deadline before selecting it as the single provider. Record any provider change and update public mode labels; never label NVIDIA output as `openai_evidence`. Neither contingency has been executed by this documentation update.

## Smallest sufficient checks

Use existing Vitest/Playwright capabilities where they directly verify a requirement. Do not create a generic evaluation framework, test every private helper, or add separate test layers that prove the same thing.

| Criterion | Check and expected evidence |
| --- | --- |
| Catalogue interpretation | Actual CSV loads once; 66 unique IDs on this snapshot, exact pipe-list membership, booleans and 9 null `max_hours` values; invalid data fails explicitly |
| Dense category and rank | October 10 request below returns exactly the predicted ordered IDs; card values come from those CSV records |
| Repeatability | Three repeated HTTP requests and one process restart preserve ordered IDs; explanations need not be byte-identical |
| Date change | October 10 → 11 explains previous cards becoming busy; October 1 → 6 explains a newly available cheaper profile displacing a still-available card. Retain old/new busy sets; also check promotion of an already available candidate and correct wording for equal-price ID ties, without claiming availability changed when it did not |
| Busy venue | Select an actual venue record and one date in its `busy_dates`, with sufficient budget and a supported format; assert its absence and calendar reason. Record the chosen ID/date in the task evidence |
| Rare/empty states | The florist request yields one card with a reason; budget 1 produces `no_match`; overseas florist produces `category_absent`; both empty outcomes use HTTP 200 |
| Boundaries | Equal budget and equal hours pass; lower budget/too many hours fail; requested missing language fails; null hours are inapplicable; impossible/out-of-window dates and null optional inputs are validation errors |
| Grounded AI quality | Live dense and rare requests: one or two sentences per card; exact source quote, accurate numbers, no invented preference/quality claim; hide names and assess whether explanations remain distinguishable |
| AI batch versus quote failure | Controlled invalid JSON/shape/type, duplicate/unknown/missing ID, refusal and truncated output yield local text for every selected card. A valid batch with one null/blank/overlong/multi-sentence/non-source quote falls back only for that card; valid neighbours remain intact and selection/order never changes |
| Explanation mode | All quotes accepted → `openai_evidence`; two accepted and one source mismatch → `mixed` with “Часть объяснений сформирована без ИИ”; all null/invalid quotes → `catalog_fallback`; empty result → `not_needed`. Check the label against rendered content, not merely whether a call was attempted |
| Optional AI configuration | With a valid catalogue, missing/blank key or loader `CONFIG_FILE_UNREADABLE` keeps options and recommendations operational, sends no provider request and labels nonempty results `catalog_fallback`. Verify unreadable-file behaviour even with a populated process variable; missing file with a valid process variable can construct the live adapter. Use isolated synthetic configuration or controlled loader failures, never alter real credentials. `CONFIG_INVALID_REQUEST`/unexpected errors propagate; bad CSV still fails separately |
| Timing and honest failure | Measure complete request-to-visible-result time for three uncached live requests, including first use after application start. Separately check controlled timeout/refusal/incomplete output yields all-card catalogue fallback with unchanged IDs. Controlled cases do not prove live provider behaviour |
| Frontend correctness | Show field errors, loading, all three outcomes, partial result and local/mixed explanation labels; rapid resubmit cannot replace new results or their comparison snapshot with stale ones; readable at mobile/desktop widths and operable by keyboard |
| Reproducibility | Follow the final README from an isolated source snapshot: install, private configuration, build, start, primary scenario. Record source revision/hashes and whether it was a committed checkout or only a local copy |

Log compact durations/modes/token usage; record observed results and skips in OpenSpec. A few successful requests demonstrate the tested cases, not a production latency percentile or a semantic-quality guarantee for all 66 profiles.

## Data-derived rehearsal cases

The following are **computed expectations from CSV**, not service test results. No user language or duration is set. Starting-price ascending and ID tie-breaking are the proposed policy, not a rule from the original brief.

| Request | Expected result under proposed rules |
| --- | --- |
| Алматы / Ведущий / корпоратив / 2026-10-10 / 1,500,000 KZT | 10 city/category candidates, 5 eligible; cards `HK-88430`, `HK-29829`, `HK-27222` |
| Same request, 2026-10-11 | 4 eligible; cards `HK-44923`, `HK-27222`, `HK-44733`; the price tie is resolved by ID |
| Алматы / Ведущий / корпоратив / 2026-10-01 / 1,500,000 KZT | 3 eligible; cards `HK-88430`, `HK-44923`, `HK-75012`; `HK-29829` is busy |
| Same request, 2026-10-06 | 7 eligible; cards `HK-88430`, `HK-44923`, `HK-29829`; `HK-75012` remains available but its 1,300,000 KZT starting price ranks behind the newly available `HK-29829` at 700,000 KZT |
| Алматы / Флорист / свадьба / 2026-10-10 / 500,000 KZT | One eligible card, `HK-39372`; explain the busy second florist |
| Алматы / Ведущий / корпоратив / 2026-10-10 / 1 KZT | Category exists, no eligible candidates; explain applicable exclusions |
| Зарубежье / Флорист / свадьба / 2026-10-10 / 500,000 KZT | Category absent in this catalogue location |

The October 10/11 queries both have four busy candidates, but different busy identities. The October 1/6 pair additionally demonstrates price displacement without the departing card becoming busy. Busy-count changes or checks of newly busy previous cards alone cannot explain both cases. These expectations were recomputed from the CSV; they are not observed application behaviour.

Source snapshot: `raw/dataset.csv`, SHA-256 `A197E65AE503F807E9592313B0DD47D56C038B4E2D0497AF9A201E3C501DC856`, inspected on 2026-09-23. Recompute these expectations if the dataset or proposed ranking changes. See [the domain acceptance scenarios](../domain/acceptance-scenarios.md) for the source acceptance cases and their assumptions.

## Keep out of the four-hour MVP

No bookings, accounts, notifications, payments, new synthetic profiles, free-text brief, semantic search, trained model, agent tools, administration, durable history, database, queue, vector index or cloud deployment. No custom design system or animations. The initial screen is a straightforward form and readable cards; apply the installed frontend-design guidance when implementing it without adding a separate design cycle or new product scope.

If time becomes tight, remove decorative polish and optional operational optimizations. Preserve eligibility, stable order, both empty outcomes, clear prices/calendar limits, the AI disclosure and required demonstration checks. Incomplete live quality or clean-checkout checks stay reported as incomplete.

## Evidence at architecture delivery

Observed: domain/brief review; current package/configuration declarations; existing secret-reader boundary; official OpenAI/NVIDIA/framework documentation; selective profile inspection; data-derived ordering for the October 10/11 and October 1/6 pairs. The optional research role performed documentation research only. The user agreed the OpenAI-first direction and conditional NVIDIA experiment, then requested four review clarifications covering date changes, AI validation scope, optional configuration and mixed labels. Documentation now records those boundaries and corresponding future checks; link/consistency checks do not establish runtime behaviour.

Not performed: credential inspection, live OpenAI or NVIDIA requests, product implementation, application build/launch, browser acceptance, clean-checkout application reproduction, contract publication, commit or deployment. Existing secret-loader tests are historical evidence in their own task card and were not rerun for this documentation task.
