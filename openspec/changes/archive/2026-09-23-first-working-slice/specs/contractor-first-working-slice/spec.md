## Purpose

Enable an organizer to obtain up to three real catalogue contractor recommendations through one browser request, with deterministic eligibility and grounded explanations.

## ADDED Requirements

### Requirement: Real retained catalogue and deterministic selection
The application SHALL implement public contract v1 and the foundation normalization, failure, eligibility, exclusion and ordering policies using the unchanged supplied CSV. It MUST retain one loading attempt per process, including expected failures, expose global sorted options, and never substitute fixtures.

#### Scenario: Dense real selection
- **WHEN** Алматы / Ведущий / корпоратив / 2026-10-10 / 1500000 KZT is submitted with optional fields absent
- **THEN** there are 10 candidates and 5 eligible, with cards HK-88430, HK-29829, HK-27222 in that order and exclusive rejection counts summing with eligible count to candidate count

#### Scenario: Catalogue unavailable
- **WHEN** catalogue loading fails because the source is missing, unreadable or invalid
- **THEN** syntactically valid requests receive safe CATALOG_UNAVAILABLE HTTP 503 responses with fresh request IDs, no AI call and no reload until process restart

#### Scenario: Validation and empty selection
- **WHEN** an input violates public v1 validation or a valid input yields no candidates or no eligible profiles
- **THEN** invalid input returns the specified 400 error, while empty outcomes return HTTP 200 with zero cards and not_needed mode without AI work

### Requirement: Bounded grounded evidence
The application SHALL send only the normalized request and necessary facts/descriptions for at most three selected profiles through the existing OpenAI transport, once per batch, with a six-second deadline including consumption and zero retries. It MUST validate the complete envelope and exact ID set before checking each quote against its own whitespace-normalized source, at most 180 Unicode code points and one clause/sentence. The local renderer SHALL produce one or two factual sentences and preserve selected IDs/order.

#### Scenario: Live dense evidence
- **WHEN** the dense scenario runs with live OpenAI access
- **THEN** all three source-matched quotes express concrete request-relevant style or specialization and final explanations remain substantively distinct with names hidden; source revision, dataset hash, model, normalized request, duration and per-card verdicts are recorded without secrets, full descriptions or provider payloads

#### Scenario: Batch and per-card fallback
- **WHEN** the provider or batch structure/identity fails, or one quote in a valid batch is unusable
- **THEN** the whole batch or only that card respectively uses local factual text, and actual rendered quotes determine openai_evidence, mixed or catalog_fallback; empty results use not_needed

#### Scenario: Caller cancellation
- **WHEN** the caller aborts
- **THEN** cancellation propagates as AbortError without retrying or rendering fallback for the abandoned caller

### Requirement: Usable first screen
The browser SHALL provide labelled city, event date, event format, contractor category and KZT budget inputs populated from real options, with action Подобрать. It MUST call recommendations only on submission, prevent duplicate pending requests, ignore stale responses and show loading, field errors, safe service errors and normal empty states. Language/duration controls and date-comparison narratives are outside P01.

#### Scenario: Successful cards
- **WHEN** a request succeeds
- **THEN** up to three cards show name, category, city, starting price as от … ₸, prominent explanation, provenance/quality labels, price-order rationale and Нет отметки занятости на [дату] в календаре набора using the successful normalizedRequest.date; no guaranteed booking or AI quality score is implied

#### Scenario: Readability and truthful modes
- **WHEN** the screen is used at desktop/mobile widths and by keyboard
- **THEN** the form is left of results on desktop and above on mobile, focus is visible, controls have explicit labels, modes accurately describe actual output and failed/stale requests are not shown as fresh success

### Requirement: Production slice verification
The delivered P01 SHALL build and start at 127.0.0.1:3101 from documented installation/configuration, connect the real browser through HTTP to all modules, measure submission-to-visible-result time, verify controlled AI failure with unchanged real selection, and keep backend code/secrets out of client output.

#### Scenario: Reproducible accepted revision
- **WHEN** the pinned clean candidate is installed, built and launched following README
- **THEN** the primary browser scenario and controlled fallback pass with recorded evidence; mandatory live failures remain explicit and cannot be replaced by fixture success or publication claims
