## MODIFIED Requirements

### Requirement: S4 Stable limited selection and outcomes
Under the price policy, eligible profiles SHALL be ordered by starting price ascending then fixed ordinal string ID ascending. Under an accepted semantic policy, ALL eligible profiles SHALL be ordered by their fixed category/format score descending, starting price ascending and fixed ordinal ID ascending. Both policies SHALL return at most three IDs with complete pre-limit counts; no price-based preselection is permitted in semantic mode. Zero candidates SHALL produce category_absent with empty IDs and zero diagnostics; candidates but no eligible profiles SHALL produce no_match; positive eligibility SHALL produce matched.

#### Scenario: Reordered ties and short results
- **WHEN** zero, one, two, three or more profiles qualify, including equal-price string IDs supplied in different orders
- **THEN** outcomes and full counts follow these rules and selected IDs contain the first min(eligibleCount, 3) in the same deterministic order


#### Scenario: Candidate outside cheapest three
- **WHEN** more than three profiles qualify and an eligible profile outside the cheapest three has a higher fixed semantic score
- **THEN** semantic selection can promote it while preserving every strict filter, exclusion count and busy ID, and equal scores use price then ordinal ID
