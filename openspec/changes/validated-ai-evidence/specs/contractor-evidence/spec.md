## Purpose

Supply trustworthy profile-specific evidence for already selected contractors while preserving deterministic selection and explicit fallback behavior.

## ADDED Requirements

### Requirement: Selected-only bounded extraction
The evidence module SHALL accept a canonical normalized request, readonly selected profiles and caller cancellation. It MUST make at most one non-streaming provider call with only the request and selected profile id, description, event formats, starting price, languages and maximum hours, plus literal choices derived from those descriptions. Descriptions MUST remain untrusted data. The existing six-second deadline including body consumption, zero retries, store:false and initial 450-token limit SHALL remain unchanged. Inputs MUST remain unchanged.

#### Scenario: Valid selected batch
- **WHEN** one to three distinct selected profiles are supplied, including records with additional runtime properties
- **THEN** exactly one request includes only the allowed fields and derived choices, never full calendars, names, paths or credentials; embedded description instructions remain data

#### Scenario: Defensive inputs
- **WHEN** the active caller supplies no profiles, duplicate IDs or more than three profiles
- **THEN** no provider call occurs; empty input yields a validated empty mapping and invalid input yields unavailable/invalid_batch

### Requirement: Whole-batch structural trust
The module SHALL parse the entire response and validate exact envelope/item fields, types, count and equality with the selected ID set before accepting any quote. Invalid JSON SHALL yield unavailable/invalid_response; invalid structure or identity SHALL yield unavailable/invalid_batch. Provider ordering MUST NOT change selected order, and arbitrary string IDs MUST map safely.

#### Scenario: Invalid batch
- **WHEN** JSON is malformed, fields are extra/missing, types/count are wrong, or IDs are duplicate/unknown/missing
- **THEN** the whole batch is unavailable with its specified reason, without salvaging valid neighbors

#### Scenario: Reordered response
- **WHEN** the provider returns every selected ID exactly once in a different order
- **THEN** evidence is mapped to its own ID and the consumer retains local selected order

### Requirement: Per-card source validation
The module SHALL collapse whitespace and trim source and quote identically, preserve case and punctuation, and accept only a contiguous substring of that profile's description. A normalized quote MUST contain at most 180 Unicode code points and one clause/sentence under the existing conservative punctuation heuristic. Null, blank, overlong, multiple-sentence and non-source quotes SHALL produce no_quote, blank, too_long, multiple_sentences and source_mismatch respectively for only their own card.

#### Scenario: Neighbor preservation and limits
- **WHEN** one quote is unusable and neighboring quotes pass, or a quote crosses the 180/181-code-point boundary
- **THEN** valid neighbors remain accepted, 180 passes source validation and 181 falls back; another profile's source and fuzzy/case-insensitive matches are rejected

### Requirement: Cancellation and failure separation
The module SHALL reject caller cancellation as AbortError before work and after awaiting either success or failure, with cancellation taking precedence. An active transport timeout SHALL yield unavailable/timeout, other expected transport failures unavailable/provider, and unavailable configuration SHALL retain composition's configuration result. Unexpected programming faults MUST remain errors. No outcome SHALL trigger a retry or repair call.

#### Scenario: Cancellation race
- **WHEN** the caller is already aborted or aborts while provider success or failure resolves
- **THEN** AbortError propagates without fallback processing or further calls

#### Scenario: Expected and unexpected failures
- **WHEN** a timeout, provider failure or unexpected programming fault occurs for an active caller
- **THEN** only expected transport failures become batch unavailability and unexpected faults remain rejected errors

### Requirement: Live evidence quality
The delivered module SHALL provide accepted literal excerpts expressing concrete request-relevant style or specialization for the agreed dense and rare samples. Evidence MUST record source revision, dataset hash, model, normalized request, date/reviewer and per-card source/relevance verdicts without full descriptions, prompts, provider payloads or secrets. Controlled responses and fallback MUST NOT count as live quality passes. Matching historical evidence SHALL be reusable when executable extraction, prompt, input, model and data remain equivalent.

#### Scenario: Dense distinctiveness
- **WHEN** Алматы / Ведущий / корпоратив / 2026-10-10 / 1500000 KZT is verified with language and duration omitted
- **THEN** HK-88430, HK-29829 and HK-27222 each pass literal source and relevance checks and remain substantively distinct with names hidden

#### Scenario: Rare specialization
- **WHEN** Алматы / Флорист / свадьба / 2026-10-10 / 500000 KZT is verified with language and duration omitted
- **THEN** HK-39372 supplies an accepted source-valid excerpt conveying concrete relevant specialization; no pairwise distinction is required
