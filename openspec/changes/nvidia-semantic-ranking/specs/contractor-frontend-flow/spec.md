## MODIFIED Requirements

### Requirement: Truthful complete result presentation
Successful results SHALL identify all normalized conditions, name/category/city, prominent plain-text explanation, starting price and absence of a busy mark on the successful date. Matched results SHALL show eligible/displayed counts and actual ranking mode: price ascending/ID ties for price, or precomputed NVIDIA description relevance for the requested format with price/ID ties for semantic. Raw scores SHALL NOT be presented as confidence or contractor quality. category_absent SHALL suggest city/category changes; no_match SHALL present actual first-failure exclusion counts without implying independent overlapping totals or guaranteed remedies. Modes SHALL distinguish AI-selected excerpts, mixed (Часть объяснений сформирована без ИИ), real catalog fallback (Объяснения сформированы по полям каталога без ИИ), and empty not_needed. Source synthetic/anonymized and imputed flags SHALL retain their meanings without implying team authorship, booking or final quotes.

#### Scenario: Real dense rare and empty results
- **WHEN** price-policy real dense, rare florist, budget 1 and Зарубежье/Флорист requests succeed
- **THEN** dense has five eligible and HK-88430/HK-29829/HK-27222; rare has HK-39372; no_match and category_absent replace old cards with correct empty outcomes

#### Scenario: Modes and safe errors
- **WHEN** live/fallback real interactions and controlled mixed/rare error/malformed cases execute
- **THEN** visible modes agree with public responses, errors expose no internal paths/provider payloads and the last valid result survives unusable responses


### Requirement: Evidence-based date comparison
The screen SHALL compare only successive successful normalized requests whose date differs while every other input and catalogVersion/selectionPolicyVersion agrees. It MUST use full busy ID sets and known cards/prices, distinguish newly busy, newly available, still-available displaced and already-available promoted cards, and never recreate filtering or invent replacement pairs. Under price mode it SHALL compare known prices before cheaper claims and explain ties by catalogue ID without quality implications; under semantic mode it SHALL explain available displacement/promotion using fixed policy order without unsupported cheaper or strictly-higher-score claims, and show unchanged-list copy for identical IDs/order. Narrative SHALL state both dates beside the summary. Non-comparable success replaces baseline without narrative; errors preserve it; reset removes it. Empty transitions SHALL produce only provable facts.

#### Scenario: Real October 10 to 11
- **WHEN** price-policy dense date-only requests change October 10 to 11
- **THEN** HK-88430/HK-29829/HK-27222 becomes HK-44923/HK-27222/HK-44733 and narratives follow complete busy IDs without retaining old cards as current recommendations

#### Scenario: Real available displacement
- **WHEN** price-policy dense date-only requests change October 1 to 6
- **THEN** HK-88430/HK-44923/HK-75012 becomes HK-88430/HK-44923/HK-29829; HK-29829 loses its busy mark and HK-75012 remains available but is displaced by starting-price order

#### Scenario: Comparison boundaries and ties
- **WHEN** first/same-date/context-changed/other-input-changed/unchanged-list/error-retry/reset/empty transitions or controlled promotion/equal-price examples occur
- **THEN** only comparable successes produce justified narratives, unchanged lists have no replacement story and equal prices never imply a cheaper or better contractor


#### Scenario: Semantic date comparison and policy change
- **WHEN** semantic date-only results change under one catalogue/policy, or a later success changes ranking policy
- **THEN** the first comparison distinguishes calendar changes and fixed-policy displacement/promotion truthfully, while the policy change resets comparisons and the label identifies precomputed NVIDIA scoring
