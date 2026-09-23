# Selection and explanations

Status: OpenAI-first MVP direction agreed on 2026-09-23. Source rules: [domain model](../domain/model-and-rules.md), [data contract](../domain/data-contract.md). The detailed policy below is the baseline proposal to formalize in OpenSpec before implementation; provider sequencing is already agreed in the [brainstorming outcome](../.brainstorming/2026-09-23-contractor-selection-architecture-design.md).

## Proposed policy decisions

| Topic | Proposed behaviour and reason |
| --- | --- |
| Input normalization | Trim strings and map case-insensitively to catalogue option values; no city aliases, inferred travel or fuzzy category expansion. Reject unknown options and unknown request fields. |
| Budget | A positive safe integer in KZT; eligibility is `price_from_kzt <= budgetKzt`. Budget 1 is valid and can produce a normal empty result. Never multiply the starting price by hours. |
| Date | A real ISO calendar date, `YYYY-MM-DD`, within 2026-09-23 through 2026-12-31 inclusive. Outside the window is a clear validation error because the supplied calendar says nothing about it. Do not add a moving “today” rule to this fixed dataset. |
| City/category/format | Exact canonical city, membership in `categories`, then membership in `event_formats`. `Зарубежье` is one literal catalogue location. |
| Busy date | Always excludes the profile, including a venue; no partial-day or timezone inference. |
| Optional language | When supplied, require membership in `languages`; when omitted, do not filter or reward multilingual profiles. |
| Optional duration | A positive finite number of hours; require `durationHours <= max_hours` when the latter is a number. `max_hours: null` means presence duration is inapplicable and does not exclude the profile. Do not describe this as unlimited working hours. |
| Structured fields vs prose | Structured city, prices, languages, formats and hours govern eligibility. Descriptions cannot override them or introduce ratings, capacity or guaranteed travel. |
| Ranking | Sort eligible profiles by starting price ascending, then ID ascending using a fixed string comparison. Take at most three. Label it as affordable suitable options, not an AI quality rating. |
| Data origin | Use the supplied catalogue unchanged. Keep `synthetic`, `city_imputed`, `price_imputed` flags and explain their meaning with unobtrusive catalogue labels. No new team profiles are planned. If added later, record team provenance separately; `synthetic` alone cannot distinguish authorship. |

There is no weighted relevance formula, hidden random tie breaker or model score. The same normalized request against the same catalogue and policy yields the same IDs in the same order, across process restarts. Explanation wording is not part of this ordering guarantee.

## Selection and truthful empty results

1. Validate the request before any provider call.
2. Form the candidate set using city and category. An empty set produces `category_absent`.
3. Check each candidate in fixed order: busy date, budget, format, requested language, requested duration. Assign the first failed reason to its exclusive rejection bucket. Each excluded profile is counted once; these counts plus eligible count equal candidate count. A bucket describes the first decisive reason, not every possible defect.
4. Sort the eligible set and take the first three. Zero eligible profiles produce `no_match`; otherwise return `matched`. These are normal results, not service failures.
5. Explain short results with the actual eligible count and rejection buckets. If the category originally has only one suitable profile and none are excluded, say that the city catalogue has only one, rather than inventing rejected candidates.
6. Do not call OpenAI for empty results. Construct their explanations locally from these facts.

Show prices as “от … ₸” and availability as “нет отметки занятости на … в календаре набора”. Neither is a booking or final-price confirmation.

### Explaining date changes

Retain the previous successful normalized request, cards (including IDs, names and prices), and `summary.busyProfileIds`. Compare them with the next successful result only when the date is the only changed input and both results use the same catalogue snapshot and ranking policy. Clear comparison history when that context resets; errors and superseded responses do not replace the stored successful snapshot.

For the baseline price/ID order, distinguish these cases:

| Observed transition | Evidence and message |
| --- | --- |
| A previous card is now busy | Its ID is in the new busy set. Name it in the date-change message as unavailable on the new date; never keep it among recommendation cards. |
| A newly displayed card became available | Its ID is in the previous busy set and absent from the new busy set. Explain that the catalogue now has no busy mark for it and it entered the top three by the fixed price/ID order. |
| A previous card disappears but remains available | Its ID is absent from both the new cards and new busy set. With every other condition unchanged, it still qualifies but was displaced by newly available candidates ranked ahead of it. Name the displaced card and explain the lower starting price, or the ID tie-break if prices are equal; do not call it busy. |
| An already available candidate enters the cards | Its ID was absent from the previous cards and busy set. Explain its promotion after higher-ranked previous cards became busy, without claiming that this candidate itself became available. |

Messages may combine causes when several transitions occur together. Compare actual prices before saying “cheaper”; the ID tie-break is not a quality assessment. If the cards do not change, report no replacement and keep the ordinary calendar summary. Without comparable snapshots, show only the current summary rather than guessing why the selection changed. Ignore stale responses after another submit and abort superseded requests.

The CSV-derived regression case is Алматы / Ведущий / корпоратив / 1,500,000 KZT, October 1 → October 6: `HK-29829` becomes available at 700,000 KZT and enters the top three, displacing `HK-75012` at 1,300,000 KZT although the latter is available on both dates. This requires the previous busy set, not just the previous cards or a count of busy profiles. Expected IDs are recorded in [verification](implementation-and-verification.md#data-derived-rehearsal-cases).

## OpenAI's bounded role

Use one server-side Responses API call for all selected profiles, with the pinned initial candidate model `gpt-4.1-mini-2025-04-14`. The model selects a useful, concrete excerpt from each profile's description in the context of the request. Local code writes the factual first sentence and renders the excerpt as a quoted, attributed second sentence.

NVIDIA is outside this baseline request path. OpenAI failures use the catalogue fallback below, without a second provider call. A later NVIDIA comparison follows the [optional checkpoint](implementation-and-verification.md#optional-nvidia-checkpoint); it does not silently change the ranking policy or the meaning of `openai_evidence`.

This extraction approach keeps the AI contribution semantic while avoiding free-form claims about price, availability or quality. It does not require embeddings, tools, agent loops, training or uploading the whole catalogue.

Proposed provider output per selected ID: `{id, evidenceQuote}`, with `evidenceQuote` either one short verbatim clause/sentence or `null` if no suitable evidence exists. Use strict Structured Outputs for the envelope, required fields and types: `id` is a string and `evidenceQuote` is string-or-null. Length, sentence count and source matching are separate per-item checks, not constraints that invalidate the entire structural schema. JSON shape alone does not establish relevance or truth.

### AI response validation boundary

Validate the complete batch and its ID set before using any quote, then validate each quote separately:

| Failure class | Examples | Scope of fallback |
| --- | --- | --- |
| Transport/provider or incomplete response | Timeout, unavailable adapter, provider error, refusal, non-completed/truncated response, missing message content | All selected cards; do not salvage a valid-looking prefix |
| Batch structure or identity | Invalid JSON/envelope, missing required field, wrong field type (including a non-string/non-null quote), duplicate/unknown/missing ID, item count differing from selected-card count | All selected cards; no partial trust when identity or structure is broken |
| One unusable quote in a structurally valid batch | `null`, blank text, more than 180 characters after whitespace normalization, multiple sentences, or text absent from that ID's normalized description | Only the corresponding card; preserve the other validated quotes |

The returned ID set must exactly equal the selected ID set. Returned array order is immaterial: map items back to the local order. For quote checks, normalize whitespace consistently in quote and source; do not use fuzzy matching to accept invented or paraphrased text. In particular, a well-typed string absent from its source is a **per-card** failure, not a batch failure. Neither failure class changes selection/order or causes another provider call.

The prompt asks for evidence that distinguishes profiles, preferably a working style or specialization relevant to the event. It excludes generic praise, client lists, unverified superlatives, and prose about price/location/languages/hours that competes with structured fields. Treat descriptions as quoted source data, never instructions. The model has no tools and cannot alter the candidate set.

A rendered example, grounded in the inspected `HK-29829` record and the October 10 request, is:

> Берёт корпоративы; стартовая цена 700 000 ₸ укладывается в бюджет 1 500 000 ₸. В описании акцент на программе: «Только развлечения и танцы».

This is a hand-authored illustration of the proposed renderer, **not observed model output**. Availability appears next to the explanation. When supplied, language/duration checks can replace a less useful factual detail in the first sentence. Keep the total explanation at one or two sentences and do not claim personal preferences that the user never supplied.

Quote matching prevents invented source text but does not guarantee a sensible excerpt or verify catalogue advertising. Review actual Russian explanations with names hidden in the live acceptance sample. If the model returns a poor but literal quote, fix the narrow selection prompt within the timebox; do not add a second evaluator model.

## Timeout, cancellation and fallback

- Send only the current request, necessary structured facts and full descriptions of up to three selected profiles. No entire CSV, complete busy calendars, filesystem paths or credentials in the prompt.
- Use non-streaming Responses with `store: false`, strict JSON schema and a small output limit, initially 450 tokens. Parse actual response message content; handle non-completed status, refusals, missing content and invalid JSON. A truncated batch is unusable, not partially trusted text.
- Bound the entire outbound operation, including body consumption, to **6 seconds**, subject also to the incoming cancellation signal. Use **zero automatic retries** in the interactive path. Retrying can duplicate billable work after uncertain completion and consume the response budget. The user may submit again.
- Reserve roughly 2 seconds for the local work and UI transfer, aiming at a normal response below 10 seconds. This is a design budget, not a measured guarantee; cold start and real network latency need measurement.
- Apply the [validation boundary](#ai-response-validation-boundary) to choose all-card or per-card fallback. Preserve the actual selected cards and never manufacture a semantic detail to fill a blank. Expected AI configuration failures are converted to an unavailable adapter by [server composition](system.md#ai-configuration-failure-boundary).
- Local fallback uses price, supported format and requested language/duration facts. It may be less distinctive than a successful AI explanation; this limitation is visible and the live quality check remains outstanding if only fallback was demonstrated.
- Cancellation stops waiting and attempts to abort upstream work; it cannot promise that a provider already processing the request will not bill it. Do not retry after cancellation.

### Explanation mode and visible label

Derive the response's `explanationMode` from the explanations actually rendered, after all validation and fallback decisions:

| Mode | Exact condition | UI meaning |
| --- | --- | --- |
| `openai_evidence` | At least one card; every card includes a validated AI-selected quote | AI selected description excerpts; the factual sentences still come from local rules |
| `mixed` | At least one card includes a validated AI-selected quote and at least one uses only local text | Show “Часть объяснений сформирована без ИИ” |
| `catalog_fallback` | At least one card; no card includes a validated AI-selected quote | Show “Объяснения сформированы по полям каталога без ИИ” |
| `not_needed` | No cards | Show the normal empty-result explanation without an AI-generation label |

For example, two validated quotes plus one source mismatch produce `mixed`; three null quotes produce `catalog_fallback`. The aggregate label is sufficient for this MVP and must not describe a mixed result as entirely local. These modes describe actual catalogue processing, not fixture data or proof that all provider calls succeeded.

Start without persistent cache, background jobs or request history. Deterministic rules provide stable ordering without a cache. Duplicate submits are prevented in the UI; add caching only if measured latency or cost makes it necessary after acceptance.

## Model choice and cost evidence

The [official GPT-4.1 mini page](https://developers.openai.com/api/docs/models/gpt-4.1-mini) lists the snapshot above, Responses and Structured Outputs support, and describes low latency without a reasoning step. This establishes documented capability, not access through this user's key or Russian-language quality.

At the [standard published price](https://developers.openai.com/api/docs/pricing) checked on 2026-09-23, input is $0.40 and output $1.60 per million tokens. An illustrative 2,000-input/400-output request costs `2000 × 0.40 / 1,000,000 + 400 × 1.60 / 1,000,000 = $0.00144`, or $1.44 for 1,000 such calls. Actual descriptions/token usage vary; unsuccessful or repeated calls may still cost money. This is an example, not a spending cap or latency benchmark.

Provider references: [Structured Outputs and refusal handling](https://developers.openai.com/api/docs/guides/structured-outputs), [API data controls](https://developers.openai.com/api/docs/guides/your-data). `store: false` disables response application-state storage; it is not a promise of zero provider retention. No special retention setting is assumed.
