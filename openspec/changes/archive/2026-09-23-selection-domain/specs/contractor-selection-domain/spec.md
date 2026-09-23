## Purpose

Provide deterministic contractor IDs and complete rejection facts from validated catalogue profiles and a canonical request, supporting truthful downstream explanations.

## ADDED Requirements

### Requirement: S1 Exact candidate scope and structured authority
Selection SHALL consider profiles whose city exactly equals the requested city and whose categories contain the requested category, counting each unique-ID profile once. Structured fields SHALL govern eligibility; names, descriptions and provenance flags SHALL NOT override them. Canonicalization and invalid-input handling belong to the upstream validated boundary.

#### Scenario: Multi-category and unrelated profiles
- **WHEN** the catalogue contains a matching multi-category profile and busy profiles in another city or category
- **THEN** the matching profile is counted once and unrelated profiles affect neither candidate counts nor busy IDs

#### Scenario: Conflicting prose
- **WHEN** descriptions claim availability or suitability contrary to structured fields
- **THEN** selection and diagnostics remain determined by structured fields

### Requirement: S2 Exclusive eligibility accounting
Candidates SHALL be rejected by first failure in this order: requested date is busy; starting event price exceeds budget; unsupported format; requested language absent; requested duration exceeds numeric maxHours. Equal price/duration boundaries SHALL pass. Omitted optional filters SHALL not filter or reward; null maxHours SHALL mean duration is inapplicable. Price SHALL not be multiplied by duration. Candidate count SHALL equal eligible count plus all five exclusive rejection counts.

#### Scenario: Overlapping failures and boundaries
- **WHEN** candidates violate overlapping conditions and others equal the budget/hours boundary or have null hours
- **THEN** each rejected candidate contributes only its first failure, boundary/null candidates pass applicable checks, and all candidates are accounted for

### Requirement: S3 Complete busy diagnostics
Busy IDs SHALL include every busy city/category candidate, including people and venues and candidates failing additional conditions, independent of displayed selection. IDs SHALL be unique and sorted by fixed ordinal string order, and their count SHALL equal the busy exclusion count. Full calendars SHALL NOT be returned.

#### Scenario: Busy set exceeds display limit
- **WHEN** more than three candidate profiles are busy, including a venue and a profile also over budget
- **THEN** every busy candidate ID is returned once in ordinal order and no unrelated busy ID appears

### Requirement: S4 Stable limited selection and outcomes
Eligible profiles SHALL be ordered by starting price ascending then fixed ordinal string ID ascending, returning at most three IDs with complete pre-limit counts. Zero candidates SHALL produce category_absent with empty IDs and zero diagnostics; candidates but no eligible profiles SHALL produce no_match; positive eligibility SHALL produce matched.

#### Scenario: Reordered ties and short results
- **WHEN** zero, one, two, three or more profiles qualify, including equal-price string IDs supplied in different orders
- **THEN** outcomes and full counts follow these rules and selected IDs contain the first min(eligibleCount, 3) in the same deterministic order

### Requirement: S5 Pure compatible operation
Selection SHALL preserve the existing public result shape and SHALL perform no I/O, logging, persistence, provider calls or mutation of request, profiles, nested fields or catalogue order. Calls SHALL not retain state across requests. Empty outcomes SHALL be normal values; unexpected programming failures SHALL not be disguised as no_match.

#### Scenario: Frozen inputs and repeated calls
- **WHEN** a deeply frozen request and catalogue are selected repeatedly with an intervening different request
- **THEN** calls succeed, values and array order remain unchanged, and repeating the initial request returns identical results
