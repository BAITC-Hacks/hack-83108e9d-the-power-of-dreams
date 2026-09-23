## MODIFIED Requirements

### Requirement: F1 Public JSON contracts
The foundation SHALL provide framework-independent readonly request, options, response and error types. Required request fields are city, date, eventFormat, category and budgetKzt; language, durationHours and confirmed brief are optional and omitted rather than null. Successful responses SHALL carry requestId, canonical inputs for recommendations, and opaque catalogue/policy comparison tokens. Cards SHALL expose only display fields, quality flags and optional brief advice with bounded source excerpts, never complete descriptions or calendars. Interpretation SHALL have a separate public request/response contract and safe 400/503/500 errors with requestId. Unsupported brief/index versions SHALL fail explicitly.

#### Scenario: Consumers compile against the shared surface
- **WHEN** the foundation typecheck runs on its examples
- **THEN** existing operations/outcomes/modes remain valid and additive brief operations, advice and errors compile without framework or provider imports

#### Scenario: Summary and empty-result examples
- **WHEN** the example consistency check examines recommendations
- **THEN** candidateCount equals eligibleCount plus exclusive exclusions, cards number min(eligibleCount, 3), empty outcomes have no cards and not_needed, and busy IDs are complete for the candidate set
