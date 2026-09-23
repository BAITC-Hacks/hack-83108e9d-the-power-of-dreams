## MODIFIED Requirements

### Requirement: F1 Public JSON contracts
The foundation SHALL provide framework-independent readonly request, options, response and error types. Required request fields are city, date, eventFormat, category and budgetKzt; language and durationHours are optional and omitted rather than null. Successful responses SHALL carry requestId, canonical inputs for recommendations, and opaque catalogue/policy comparison tokens. Both operation contexts SHALL include rankingMode (price or semantic) and the same configured selectionPolicyVersion; semantic identity SHALL include snapshot digest and algorithm version. Errors SHALL additionally support RANKING_UNAVAILABLE with HTTP 503, safe message and requestId. Request inputs and explanationMode SHALL remain unchanged. Cards SHALL expose only display fields and quality flags, never descriptions or calendars.

#### Scenario: Consumers compile against the shared surface
- **WHEN** the foundation typecheck runs on its examples
- **THEN** both operation responses, all three outcomes, all four explanation modes and 400/503/500 errors conform to the shared types without framework or provider imports

#### Scenario: Summary and empty-result examples
- **WHEN** the example consistency check examines recommendations
- **THEN** candidateCount equals eligibleCount plus exclusive exclusions, cards number min(eligibleCount, 3), empty outcomes have no cards and not_needed, and busy IDs are complete for the candidate set


#### Scenario: Semantic success and failure contract
- **WHEN** consumers validate semantic options, recommendation and ranking-unavailable examples
- **THEN** success identifies the fixed semantic policy and errors carry RANKING_UNAVAILABLE/503 without provider payloads or private paths
