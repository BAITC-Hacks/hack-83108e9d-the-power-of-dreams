# Contractor contract foundation Specification

## Purpose

Give downstream contractor-selection modules stable, independently consumable contracts and a reproducible foundation without claiming a working application.

## Requirements

### Requirement: F1 Public JSON contracts
The foundation SHALL provide framework-independent readonly request, options, response and error types. Required request fields are city, date, eventFormat, category and budgetKzt; language and durationHours are optional and omitted rather than null. Successful responses SHALL carry requestId, canonical inputs for recommendations, and opaque catalogue/policy comparison tokens. Cards SHALL expose only display fields and quality flags, never descriptions or calendars.

#### Scenario: Consumers compile against the shared surface
- **WHEN** the foundation typecheck runs on its examples
- **THEN** both operation responses, all three outcomes, all four explanation modes and 400/503/500 errors conform to the shared types without framework or provider imports

#### Scenario: Summary and empty-result examples
- **WHEN** the example consistency check examines recommendations
- **THEN** candidateCount equals eligibleCount plus exclusive exclusions, cards number min(eligibleCount, 3), empty outcomes have no cards and not_needed, and busy IDs are complete for the candidate set

### Requirement: F2 Module boundaries and failure semantics
The foundation SHALL provide immutable catalogue/profile and selection types, typed safe catalogue failures, and evidence/recommendation function ports. It SHALL document one retained catalogue loading attempt per process, fresh request IDs on unavailable responses, exact evidence ID validation, per-card quote fallback, six-second provider deadline, zero retry and cancellation without abandoned-caller fallback.

#### Scenario: Module examples are usable without adapters
- **WHEN** downstream consumers import shared module types and read development examples
- **THEN** ready/unavailable catalogue results, pure selection results, accepted/per-card-fallback evidence and whole-batch unavailability are represented without importing concrete adapters

#### Scenario: Material evidence boundaries are frozen
- **WHEN** a consumer reads the fixture cases
- **THEN** reversed, duplicate, missing and unknown IDs, null/blank/overlong/multiple-sentence/source-mismatched quotes and AbortError cancellation have explicit expected outcomes labelled as fixtures rather than executed adapter behavior

### Requirement: F3 Reproducible minimal base
The foundation SHALL retain the pinned stack, add only the necessary CSV parser, provide typecheck/test and future application run scripts, and publish a verified committed base with setup instructions. It MUST distinguish working foundation checks from unimplemented product build/launch/live acceptance.

#### Scenario: Clean foundation verification
- **WHEN** a clean checkout installs the lockfile and follows the foundation README commands without a private environment file
- **THEN** typechecking, fixture consistency and existing secrets/transport checks pass, and the record identifies the exact revision and explicitly excludes application/live execution claims

### Requirement: F4 Downstream acceptance remains visible
The foundation SHALL preserve P01–P07 dependencies, required dense and rare live samples, and a protected final verification reserve as planning obligations. P00 completion MUST NOT mark downstream implementation or live checks passed.

#### Scenario: Honest handoff
- **WHEN** the foundation is handed to P01
- **THEN** the record identifies the base, owner, contracts, preparation provenance and unresolved scheduling inputs, while live sample criteria remain not_run until actually verified
