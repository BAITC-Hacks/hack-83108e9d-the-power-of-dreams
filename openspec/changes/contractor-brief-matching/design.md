## Context

See [proposal](proposal.md), [approved outcome](../../../.brainstorming/2026-09-23-contractor-brief-matching-design.md), [architecture](../../../architecture/README.md) and [selection](../../../architecture/selection-and-explanations.md). Base d07a7c286d1816be9e5cf1dcac000dad04fa018b already delivers the original scenario. Separate UI and NVIDIA tasks exist; their changes are not part of this base. Runtime permissions control actual access, regardless of configuration declarations.

## Goals / Non-Goals

Preserve one local Next application and public browser-only contracts. Add useful personalized choice with reproducible ranking. No database/cache service, arbitrary model ranking, provider routing, external enrichment, booking, infrastructure or packages.

## Decisions

### Canonical wishes and evidence

`contracts/brief.ts` defines the versioned vocabulary and public types: `BriefCondition { trait: TraitId|null, intent: prefer|avoid, text }`, `ConfirmedBrief { vocabularyVersion, text, conditions }`, interpreter response `{requestId, brief}`, and card advice `{evidence:[{condition,relation,quote}], unknownConditions, question}`. Text is 1–1000 characters; each condition is a 1–160 character literal span, maximum six. Distinct conditions and traits prevent count gaming; contradictory intents on one trait reject interpretation. Unknown traits use null and remain explicit questions. Final submission is the confirmation; the UI allows removal of conditions. The raw text is context, never a source of executable instructions. Hard fields are separate and cannot be changed by interpretation.

Use a fixed catalogue evidence index with all source profile IDs, description hashes and positive/negative trait assertions with literal quotes. Curate only explicit statements; missing is unknown. Validate IDs, hashes, trait IDs, quote boundaries and polarity consistency before use. Semantic review accompanies automated substring checks. Unlike model rankings or cached first answers, the versioned index reproduces ordering after restart and in a clean checkout.

### Modules, ownership and checks

| Module / owner | Public operations, inputs/outputs/errors | Owned data / dependencies / verification |
|---|---|---|
| Contracts / coordinator | public types, vocabulary, bounded runtime brief/advice validation | No framework/provider dependencies; fixtures and typecheck |
| Catalogue brief index / assigned worker | `loadBriefIndex(profiles)` returns validated index or throws `BriefIndexError`; version changes are explicit | `back/catalog/brief-index.json` and loader; native hash/files plus domain types/contracts; full source checks and semantic review |
| Pure matching / assigned worker | `matchBrief(profiles, brief, index)` returns sorted IDs/advice for the supplied eligible set | `back/brief/match.ts`; plain data/contracts only; no provider, storage, clocks or I/O; promotion/unknown/hard-filter integration/restart cases |
| Interpretation / coordinator | `createInterpretBrief(transport)(text, signal)` returns validated ConfirmedBrief; bounded `BriefError` or AbortError | `back/ai/brief/`; transport port and public vocabulary only; JSON/source validation, provider/cancellation checks and live comparison |
| AI transport / coordinator | preserve `generate`; add optional explicit reasoning effort for named 5.6 models, default Luna after live checks | `back/ai/openai.mjs`; current native fetch/secrets only; six-second deadline, no retries, store:false, bounded outputs; usage returned without contents |
| Composition, routes, selection / coordinator | add POST `/api/brief`, optional request.brief and card.briefAdvice; baseline selection unchanged, brief path reranks every eligible profile | `back/composition.ts`, HTTP, recommendation, domain selection extension, `src/app/api/brief/route.ts`; public success/material error checks |
| UI / coordinator | isolated BriefEditor and BriefAdvice components with minimal parent hooks | browser public contracts only; existing styles, labelled inputs, keyboard focus; real browser/race checks |
| Evaluation / coordinator | fixed 30-case corpus, two models/two repeats, fail-closed budget reservation and concise report | `scripts/brief/`, no raw provider logs or keys; USD 5 ceiling including probes/application checks |

Domain selection exposes an all-eligible helper that reuses the original eligibility accounting; optional brief policy consumes this output before top-three truncation. Price-only `select` retains its shape and tests. Brief advice is generated locally from confirmed conditions and fixed source assertions: conflict first, then match; unknowns remain distinct. Ranking keys are conflict count ascending, match count descending, price, ID. A positive assertion matches prefer and conflicts with avoid; a negative assertion reverses this. Lack of an assertion is unknown for either intent. The question asks the first unknown avoidance, then preference; otherwise the first conflict; otherwise reminds the customer to confirm final service terms. No free-form unsupported claims are generated.

The brief path uses its fixed source evidence for explanations and does not make another provider call after confirmation. The no-brief path keeps current live-quote/fallback behavior. Add `brief_evidence` explanation mode and a policy token containing index/vocabulary versions. Dates/budgets remain hard filters. Comparison treats a brief as part of request identity and describes brief-order displacement without price-only claims.

### Provider and evaluation

Official live model pages and Context7 confirm Responses strict `text.format`, and `reasoning:{effort:'none'}` for Luna/Terra. Existing transport omitted reasoning for GPT-4.1; explicitly preserve its nonreasoning role for these two targets. Keep six-second request/body timeout, zero retry and cancellation precedence. Interpretation uses max 1800 output tokens; the literal-evidence path retains 450. Models are explicitly selectable for evaluation; no automatic fallback. Key access uses the existing loader and a private environment file, never browser/config Git contents.

Use 30 fixed synthetic wishes, two models, two repeats. Reserve conservative full request UTF-8 bytes as an input-token upper estimate plus the maximum output at published cache-write/output prices before each call; stop before USD 5. Record actual usage and conservative cost when cache breakdown is unavailable; retain reservations for unmeasured failures. Initial two successful compatibility probes used 35 input/12 output tokens each, no reasoning: Luna 2890ms and Terra 967ms. Estimated uncached total USD 0.0002354; reserve USD 0.01 to cover both. This is connectivity evidence only, not feature quality.

### UI and setup

Reuse the current palette/type/layout; place optional wishes after additional conditions and evidence after the explanation. Clear text describes the confirmation and unsupported wishes. No new fonts or layout overhaul; broader styling belongs to the concurrent UI change. Existing Node 24/npm or Docker run methods apply. A funded OpenAI API project and internet are needed to interpret text; recommendations from a confirmed brief use bundled evidence and work without an API call. No-key users retain original catalogue selection; the editor does not provide manual trait authoring. Edits retain previous recommendations; reset clears wishes and recommendations under the existing reset contract.

## Risks / Trade-offs

- Fixed vocabulary misses novel needs → retain them as unknown questions, never misrepresent semantic coverage.
- Literal quote can be semantically wrong → review the curated index against full descriptions, especially negation/advertising.
- Provider interpretation can differ → show/remove conditions before confirmation; deterministic guarantee covers confirmed requests.
- Changed catalogue invalidates evidence → fail brief matching explicitly; no silent stale or price-only substitute.
- Parallel UI/NVIDIA work → coordinate exact contracts and integration order; do not take another owner's shared reservation.

## Migration Plan

Complete/validate artifacts, commit contracts/examples, implement and verify one real discreet-host scenario, then finish cases and model comparison. Publish immutable backend package before any delegated frontend consumer (coordinator implements the UI locally). Run focused regressions, build, browser checks and documented clean launch; review scoped commits, reserve shared integration, reconcile current main and publish the verified candidate. Rollback removes the optional brief surface and retains baseline contracts/selection; no user storage migration is required.
