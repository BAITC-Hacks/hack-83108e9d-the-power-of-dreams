## MODIFIED Requirements

### Requirement: S4 Stable limited selection and outcomes
Without a confirmed brief, eligible profiles SHALL be ordered by starting price ascending then fixed ordinal string ID ascending. With a confirmed brief and a validated evidence index, all eligible profiles SHALL instead be ordered by confirmed conflicts ascending, confirmed matches descending, starting price ascending then ordinal ID. Both paths SHALL return at most three IDs with complete pre-limit counts. Zero candidates SHALL produce category_absent with empty IDs and zero diagnostics; candidates but no eligible profiles SHALL produce no_match; positive eligibility SHALL produce matched. Soft preferences MUST NOT modify hard eligibility or exclusion accounting.

#### Scenario: Reordered ties and short results
- **WHEN** zero, one, two, three or more profiles qualify, including equal-price string IDs supplied in different orders
- **THEN** outcomes and full counts follow these rules and selected IDs contain the first min(eligibleCount, 3) in the same deterministic order

#### Scenario: Confirmed style preference
- **WHEN** a confirmed brief favors a profile outside the original first three
- **THEN** all eligible profiles participate before truncation and the evidence-based order remains deterministic across restarts
