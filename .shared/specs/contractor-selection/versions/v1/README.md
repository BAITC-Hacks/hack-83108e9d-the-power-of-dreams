# Contractor selection — public contract v1

This is the immutable P06 consumer snapshot for the existing same-origin backend. It supports catalogue options, deterministic contractor selection, grounded explanation modes, and comparison of successful date-only requests. There is no authentication, booking, pagination, persistence, streaming or separate frontend API service.

Backend branch: `codex/cs-05-backend`.
Backend revision: `4ade2fa4022d633e9d96b50188be4cee4fb99539`.
Verification: 44 combined checks, typecheck/build and real production HTTP acceptance passed against the candidate; real-data fallback and controlled provider cases are distinguished below. Integration status at package creation: accepted candidate; main publication is recorded separately in the mutable P05 handoff card. The package's own commit is recorded there after creation, not inside this version.

## Files and authoritative sources

- [Public TypeScript DTOs](contractor-selection.ts): exact snapshot of [backend DTOs](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/4ade2fa4022d633e9d96b50188be4cee4fb99539/contracts/contractor-selection.ts). Import only public types; never import `back/` in browser code.
- [Example request](examples/request.json), [real production responses](examples/real-http.json), and [controlled rare UI modes/errors](examples/controlled.json). See [example provenance](examples/README.md).
- [P05 scenarios](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/4ade2fa4022d633e9d96b50188be4cee4fb99539/openspec/changes/backend-composition-and-handoff/specs/backend-acceptance-and-handoff/spec.md), [current slice requirements](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/4ade2fa4022d633e9d96b50188be4cee4fb99539/openspec/specs/contractor-first-working-slice/spec.md), and [date-comparison rules](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/4ade2fa4022d633e9d96b50188be4cee4fb99539/architecture/selection-and-explanations.md#explaining-date-changes).

## Operations and input

`GET /api/catalog/options` returns `CatalogOptionsResponse`: a fresh `requestId`, comparison `context`, and global canonical cities/categories/eventFormats/languages plus inclusive dateWindow. Categories remain globally selectable even when absent in a chosen city. No request body or credentials.

`POST /api/recommendations` accepts JSON `RecommendationRequest`, with `Content-Type: application/json`. Required: `city`, `date`, `eventFormat`, `category`, `budgetKzt`. Optional: `language`, `durationHours`; omit unused optional keys. Null and blank are invalid, not omission. Unknown keys are rejected.

| Field | Format / validation |
| --- | --- |
| city, category, eventFormat | Nonblank strings; surrounding whitespace trimmed, case-insensitive match to global options, response uses canonical spelling |
| date | Real ISO calendar date `YYYY-MM-DD`; inclusive `2026-09-23` through `2026-12-31`; surrounding whitespace trimmed |
| budgetKzt | JSON number; positive safe integer in KZT, maximum 9007199254740991; no numeric strings |
| language | If present, nonblank canonical global option using the same trimming/case matching |
| durationHours | If present, positive finite JSON number in hours; fractional hours accepted |

Identifiers are strings. Public values are required/non-null unless marked `?` in the DTO. JSON contains no undefined values. There are no timestamp fields in this contract; event date is a calendar date. Responses include `Cache-Control: no-store`.

## Success and comparison semantics

All three outcomes are HTTP 200. `matched` contains one to three cards; fewer than three is a valid partial result. `category_absent` means zero city/category candidates; `no_match` means that candidates exist but none satisfy all constraints. Empty outcomes have empty cards and `not_needed` mode.

`normalizedRequest` echoes the actual canonical inputs; compare this, not raw form spelling. `context.catalogVersion` identifies exact catalogue bytes (`sha256:` digest); `selectionPolicyVersion` identifies the deterministic rule set (`selection-v1`). Compare date-only changes only when both contexts and all other normalized inputs are identical. Errors, cancelled or stale responses must not replace the last successful snapshot; reset clears it.

Cards are ordered by starting price ascending, then string ID, with at most three displayed. Each card supplies ID/name, chosen category, city, starting `priceFromKzt`, factual `explanation`, and all three boolean qualityFlags: `synthetic`, `cityImputed`, `priceImputed`. Preserve truthful labels: synthetic/anonymized source profiles are not profiles invented by this implementation; imputed values are not confirmed facts. A missing busy mark is not a confirmed booking. Prices are starting prices, not quotes or package totals. Do not describe price ordering as AI quality ranking.

`summary.candidateCount` covers all city/category profiles. `eligibleCount` covers all satisfying the request, not just cards. Exclusions assign each rejected candidate its first failure in this order: busy, budget, format, language, duration. Their sum plus eligibleCount equals candidateCount. `busyProfileIds` contains every busy city/category candidate in sorted ID order, including candidates outside the displayed cards and candidates with other failing constraints; it is not a complete calendar. The busy count alone cannot identify date-change reasons.

Use prior/current successful cards and complete busy identities to distinguish newly busy, newly available, still available but displaced by price/ID, and already available candidates promoted by others becoming busy. On October 1→6, HK-29829 becomes available; HK-75012 remains available and is displaced. Do not invent a busy reason for it. See the pinned comparison rules for equal-price cases.

| explanationMode | Visible meaning |
| --- | --- |
| openai_evidence | Every displayed card includes an accepted source quote selected with AI |
| mixed | Only some displayed cards have accepted quotes; show a partial-AI/fallback label |
| catalog_fallback | No displayed quote was accepted; factual catalogue explanations still accompany real selection |
| not_needed | No cards and no evidence request |

Mode describes what was actually rendered. A provider request may succeed with no usable quotes and still result in catalogue fallback. Preserve explanation text as plain text. No full descriptions, provider output, complete calendars, secrets or internal paths are exposed.

## Errors and UI states

All errors use `ErrorResponse`: `error.code`, safe human `message`, fresh string `requestId`, and optional `fields` array of `{field,message}`. Present messages and retain requestId for support; do not inspect server internals.

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | INVALID_REQUEST | Malformed JSON, wrong types/unknown fields/options, invalid date or optional values |
| 400 | DATE_OUT_OF_RANGE | Valid calendar date outside the fixed window |
| 503 | CATALOG_UNAVAILABLE | Catalogue missing, unreadable or invalid; retained until backend restart |
| 500 | INTERNAL_ERROR | Safe unexpected failure |

Malformed JSON is checked first. For syntactically valid JSON and unavailable catalogue, 503 precedes catalogue-dependent field validation. AI configuration/provider failures normally preserve selection with fallback; unexpected faults remain 500. The server uses a bounded single evidence request with a six-second deadline and zero retries. Caller cancellation aborts waiting; it does not promise cancellation of provider billing. Do not automatically retry a user submission or let stale responses replace current results.

P06 must handle loading, field validation, service error, all three outcomes, partial results, all explanation modes, quality flags and date-comparison reset/invalidation. Controlled examples supply rare modes for UI checks; real backend checks remain required. P06 owns keyboard/mobile and date narrative. P07 still owns final rendered live quality and three uncached submission-to-visible-result timings, including first use after startup.

## Connect and check

Use Node 24.4.1-compatible Node 24 and the pinned npm lockfile. In an isolated checkout containing the backend revision (or an accepted descendant with unchanged backend), follow the [pinned README](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams/blob/4ade2fa4022d633e9d96b50188be4cee4fb99539/README.md):

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm start -- --port 3105
```

Open `http://127.0.0.1:3105`; browser requests use the same origin. Retain `raw/` and `back/` in the runtime root. No database, GPU, personal browser session, account or hidden file is needed for catalogue selection. npm installation needs network. Optional live quotes require private server `OPENAI_API_KEY`, funded model/network access; `OPENAI_MODEL` defaults to `gpt-4.1-mini-2025-04-14`. Never expose these as NEXT_PUBLIC variables. Missing/blank key or unreadable configuration gives catalogue fallback. Restart after catalogue/configuration repair. No environment variable is required in frontend code.

For a no-cost check, leave private configuration absent or set `OPENAI_API_KEY` to an empty process value before startup. GET options must return 200 and the fixed window. POST the exact [request JSON](examples/request.json) must return matched, ten candidates, five eligible and ordered IDs HK-88430/HK-29829/HK-27222. With no AI configuration, expect catalog_fallback. Budget 1 gives no_match; the real examples include the rare and category-absent requests. Do not substitute controlled fixtures for these interactions.

Backend acceptance can be repeated with `node scripts/backend/production.mjs` after build and with port 3105 free. It starts/stops isolated production processes using copied CSV/config modules and local build/dependency links, disables AI, and writes public observations under ignored `test-results/`. It never changes canonical CSV or credentials.
