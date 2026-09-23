## MODIFIED Requirements

### Requirement: Connected real-data acceptance
The backend SHALL preserve public outcomes, normalization, validation precedence, deterministic selection and complete comparison context from the pinned catalogue. Options and recommendations SHALL share explicit ranking mode and policy identity. Configured semantic mode SHALL retain a startup snapshot failure as RANKING_UNAVAILABLE 503 until restart, without a silent price fallback. Evidence SHALL distinguish real CSV, controlled provider responses and historical live observations.

#### Scenario: Dense and date-change rehearsals
- **WHEN** price-policy Алматы / Ведущий / корпоратив / 1500000 KZT is submitted without optional fields on October 10, 11, 1 and 6 of 2026
- **THEN** each response has ten candidates, eligible counts 5, 4, 3 and 7 respectively, ordered IDs from the approved P05 table, complete busy identities and consistent exclusion counts
- **AND** three identical requests and one actual process restart preserve ordered IDs and comparison context for unchanged catalogue bytes

#### Scenario: Rare, absent, empty and busy venue
- **WHEN** the approved florist, absent-category, budget-1 and a recorded real busy-venue request are submitted
- **THEN** the florist returns only HK-39372, absent and budget-1 produce their distinct normal empty outcomes, and the venue is excluded on its busy date


#### Scenario: Semantic stable identity and failure
- **WHEN** semantic options/results are served with valid data, or startup data is invalid and repaired without restart
- **THEN** valid operations share snapshot-derived identity; invalid startup keeps both operations unavailable with fresh request IDs until restart, while malformed JSON remains 400
