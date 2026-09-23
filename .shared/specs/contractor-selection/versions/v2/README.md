# Contractor selection — public contract v2

Immutable consumer package for catalogue selection with optional reviewed AI
wishes. Backend branch: `codex/ai-upgrade`. Exact backend revision:
`a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91`.

At package creation, merged-source typecheck/build, 62 automated checks and live
desktop/mobile flow passed. Baseline dense/rare live explanations, interpretation,
candidate promotion, hard filters and controlled cancellation failures were
verified. Clean-checkout verification and main publication are recorded separately
in the mutable [task card](../../../../../openspec/changes/contractor-brief-matching/tasks.md).
The package itself makes no future integration claim. No frontend consumer was
delegated; the coordinator implemented the connected screen.

## Sources and files

- [DTOs](contractor-selection.ts) exactly snapshot the [public contract at the backend revision](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91/contracts/contractor-selection.ts).
- [Brief vocabulary and DTOs](brief.ts) contain the public portion of [brief.ts at that revision](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91/contracts/brief.ts); internal index/matching types and validators are intentionally excluded.
- [Options](examples/options.json), [confirmed request](examples/request.json), and [observed responses](examples/real-http.json) came from the real production backend with the supplied synthetic/anonymized catalogue. Baseline/interpreter/rare operations used Luna; confirmed recommendation/date/budget operations were local.
- [Brief examples](examples/brief.json) are authored fixtures, including material errors; they are not observations of a provider outage.
- [B1–B4 scenarios](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91/openspec/changes/contractor-brief-matching/specs/contractor-brief-matching/spec.md), [UI scenarios](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91/openspec/changes/contractor-brief-matching/specs/contractor-frontend-flow/spec.md), and [design](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91/openspec/changes/contractor-brief-matching/design.md).

Use public DTOs only. Browser code must not import server modules or receive keys.
All operations use the same origin, JSON, no authentication, no-store responses,
and string request IDs. There is no booking, persistence, streaming, pagination
or external messaging. IDs are strings; dates are ISO calendar dates, not timestamps.
Required fields are non-null; optional `?` fields are omitted, never JSON undefined.

## Operations

`GET /api/catalog/options` returns `CatalogOptionsResponse` with global options,
inclusive date window and comparison context. Categories stay globally available
even when a particular city has none. No body or credentials.

`POST /api/brief`, with `Content-Type: application/json`, accepts only `{text}`:
nonblank string, at most 1000 Unicode characters after whitespace normalization.
Returns `{requestId, brief}`. This is an interpretation for review, not a submitted
recommendation. `brief` contains `vocabularyVersion: "brief-v1"`, normalized text
and zero to six conditions. Each condition has `trait` from the published vocabulary
or null, `intent: prefer|avoid`, and a literal source `text` span of 1–160 characters.
Known traits cannot repeat, source spans must be unique, and unknown/qualified
wishes stay explicit null-trait conditions. Independent parsing can vary.

`POST /api/recommendations` accepts `RecommendationRequest`:

| Field | Validation |
|---|---|
| city, category, eventFormat | Required nonblank strings; trimmed case-insensitive global-option match, canonical spelling returned |
| date | Required real YYYY-MM-DD, inclusive 2026-09-23 through 2026-12-31 |
| budgetKzt | Required positive safe integer JSON number, in KZT; max 9007199254740991 |
| language | Optional nonblank canonical global option |
| durationHours | Optional positive finite JSON number of hours, fractional allowed |
| brief | Optional reviewed object as above; extra fields, repeated traits/spans and nonliteral spans invalid |

Unknown request keys are rejected; null/blank optional values are not omission.
Submit only the conditions visible after review/removal. Editing raw text invalidates
its interpretation. Empty reviewed conditions can be omitted for ordinary selection.

## Observable result and states

All normal outcomes are HTTP 200: `matched` gives 1–3 cards, `category_absent` means
no city/category candidates, and `no_match` means candidates failed hard conditions.
Empty outcomes have no cards and mode `not_needed`.

Without brief, cards retain ascending starting-price/ID order and the v1 shape.
With confirmed brief, all hard-eligible profiles are considered and ordered by
fewer source-supported conflicts, more matches, then price and ID. Unknown does
not mean unsuitable. Hard date/budget/format/language/duration constraints always
apply. `normalizedRequest` records the actual conditions. Context includes exact
catalogue identity and policy identity; brief policy is `brief-v1:catalog-brief-v1`.
Identical confirmed requests/catalogue/policy give identical order after restart.

Each card has string ID/name/category/city, starting `priceFromKzt`, plain-text
`explanation`, and boolean synthetic/cityImputed/priceImputed quality flags.
Brief cards additionally contain `briefAdvice`: `evidence` with literal quotes
and match/conflict relations, `unknownConditions`, and a useful question. Every
confirmed condition appears once across evidence and unknowns for each card.
Quotes are contractor claims, not independent verification; no busy mark is not
a booking guarantee. Preserve source and imputation labels.

| explanationMode | Meaning |
|---|---|
| openai_evidence | Every baseline card has a validated quote selected by AI |
| mixed | Some baseline cards use catalogue fallback |
| catalog_fallback | Baseline explanations use catalogue fields without accepted AI quotes |
| brief_evidence | Reviewed wishes matched with validated source evidence; no provider call during selection |
| not_needed | No cards or evidence request |

Summary counts cover every candidate, not only cards. Each excluded candidate has
one first failure: busy, budget, format, language, duration. Sorted busyProfileIds
cover all busy city/category candidates, including those not shown. Compare date
changes only with equal context and other normalized inputs, including brief.
Use actual busy identities; brief-order displacement must not be called cheaper
price displacement. Changed wishes invalidate the prior date narrative.

Keep successful results with their original conditions during edits/pending/error.
Reset clears wishes/results and cancels requests. Identity guards must ignore late
success/error even if cancellation is ignored. Interpretation alone must not
replace cards; explicit submission confirms reviewed conditions.

## Errors and external timing

Errors have `{error:{code,message,requestId,fields?}}`; fields entries contain
field/message. Messages are safe, with no provider payload or secret.

| Status | Code | Meaning |
|---|---|---|
| 400 | INVALID_REQUEST | Malformed JSON, unknown fields/types/options or invalid brief |
| 400 | DATE_OUT_OF_RANGE | Real date outside supported window |
| 503 | CATALOG_UNAVAILABLE | Catalogue unavailable/invalid; restart after repair |
| 503 | BRIEF_UNAVAILABLE | Interpretation unavailable/rejected, including no configured key |
| 503 | BRIEF_INDEX_UNAVAILABLE | Brief-to-catalogue evidence unavailable; ordinary selection still works |
| 500 | INTERNAL_ERROR | Unexpected safe failure |

AI operations have a six-second request/body deadline, zero retries and caller
cancellation. Cancellation cannot guarantee avoided provider billing. Baseline
provider failures retain labelled fallback; interpretation failure retains text
and offers explicit retry/clear. Do not silently retry or switch selection policy.

## Connect and verify

Follow the [pinned README](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/a4c82b68f7b1d82bae8d51b3e26406ef70cb4d91/README.md): Node 24.4.1-compatible 24.x,
`npm ci`, `npm run build`, `npm start -- --port 3128`. Retain raw/ and back/.
No database/GPU/new account or browser session is required. Optional parsing/live
quotes require funded private server OPENAI_API_KEY and network; OPENAI_MODEL
defaults to gpt-5.6-luna. Never use NEXT_PUBLIC variables for keys.

No-cost check: start without a key. GET options returns 200. POST the version-local
request gives HK-77838/HK-88430/HK-29829, `brief_evidence`, source evidence for
discreet style and a question about compulsory contests. Repeating after restart
keeps the order. Omit brief for baseline HK-88430/HK-29829/HK-27222 and
catalog_fallback; budget 1 gives no_match. POST text to /api/brief without a key
returns 503 BRIEF_UNAVAILABLE. For a live check, configure a key and follow the
README AI wishes scenario; interpretation incurs one provider request.
