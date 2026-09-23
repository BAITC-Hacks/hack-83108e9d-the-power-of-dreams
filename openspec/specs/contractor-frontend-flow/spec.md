# Contractor frontend flow Specification

## Purpose

Let organizers explicitly submit event conditions, retain understandable prior results and see evidence-based explanations of date-only recommendation changes.

## Requirements

### Requirement: Canonical conditions and reset
The screen SHALL load real global options and inclusive date bounds, show loading/error with explicit Загрузить снова, and never invent fallback options. It MUST keep globally valid categories selectable for every city. Required city/date/format/category/budget controls SHALL use supported demonstration defaults (Алматы, 2026-10-10, корпоратив, Ведущий, 1500000); missing preferred options use the first choice and an out-of-window preferred date uses the minimum. A collapsed keyboard-operable Дополнительные условия disclosure SHALL contain optional unfiltered language and duration. Empty optional keys MUST be omitted, supplied hours positive/finite including fractions, and budget a positive safe integer. Field errors SHALL be associated, reveal hidden invalid fields and focus the first invalid control, using dynamic date bounds and authoritative backend validation.

#### Scenario: Optional conditions and supported defaults
- **WHEN** options arrive, optional values are blank, or supported language and fractional hours are submitted
- **THEN** defaults are supported, blank keys are absent and supplied values reach the real backend with no request from editing/opening/closing the disclosure

#### Scenario: Invalid fields
- **WHEN** budget or hours are invalid, date is outside returned bounds, or real HTTP validation returns field errors
- **THEN** invalid local values are not submitted, field errors use associated controls and the first invalid field receives focus after revealing the disclosure if necessary

#### Scenario: Reset during pending work
- **WHEN** Сбросить is activated with edited conditions or a pending request
- **THEN** supported initial defaults return, optional fields clear and collapse, results/comparison/errors clear, city receives focus, and cancelled or late responses cannot restore content; no recommendation is sent

### Requirement: Explicit resilient submission
The browser SHALL keep draft, options, active submitted conditions and last successful response separate. Only explicit Подобрать SHALL send recommendations. Equivalent pending submissions MUST be ignored, different valid submissions MUST supersede/abort old work, and reset/unmount MUST abort pending operations. All completion paths SHALL guard identity and cancellation, with no automatic retries. Editing during pending SHALL remain possible without superseding that request. Successful data SHALL replace snapshot and derived narrative atomically; safe error/cancellation/malformed responses SHALL never replace it. HTTP 200 empty outcomes SHALL count as success. Pending feedback SHALL be available beside the submit action and SHALL distinguish the submitted request from further unsent draft changes.

#### Scenario: Retained conditions through editing and error
- **WHEN** a success exists and the user edits, submits or receives an error
- **THEN** previous cards or empty outcome retain their successful conditions; without a pending request differing draft shows Условия изменены — выполните подбор, pending shows submitted conditions, and errors provide retry guidance and safe request ID when available

#### Scenario: Equivalent draft and in-flight edits
- **WHEN** the draft returns to equivalent successful conditions or an in-flight request succeeds after further unsent edits
- **THEN** the changed notice disappears only for equivalent conditions and the response remains labelled with its actual successful normalized inputs without stealing focus

#### Scenario: Pending request matches the draft
- **WHEN** a request is pending and the draft equals its submitted conditions
- **THEN** the interface shows pending feedback without simultaneously instructing the user to submit those same conditions again
- **AND** further edits are identified as unsent changes while the pending response still uses its own conditions

#### Scenario: Duplicate and stale races
- **WHEN** duplicate pending, different submissions, stale success/error/finalizer or reset/unmount races occur
- **THEN** only the current request can alter results/error/pending state, duplicates produce at most one current equivalent request and deliberate retries after completion/failure remain allowed

### Requirement: Truthful complete result presentation
Successful results SHALL identify all normalized conditions, name/category/city, prominent plain-text explanation, starting price and absence of a busy mark on the successful date. Matched results SHALL show eligible/displayed counts and price ascending/ID tie order. category_absent SHALL suggest city/category changes; no_match SHALL present actual first-failure exclusion counts without implying independent overlapping totals or guaranteed remedies. Modes SHALL distinguish AI-selected excerpts, mixed (Часть объяснений сформирована без ИИ), real catalog fallback (Объяснения сформированы по полям каталога без ИИ), and empty not_needed. Source synthetic/anonymized and imputed flags SHALL retain their meanings without implying team authorship, booking or final quotes.

#### Scenario: Real dense rare and empty results
- **WHEN** real dense, rare florist, budget 1 and Зарубежье/Флорист requests succeed
- **THEN** dense has five eligible and HK-88430/HK-29829/HK-27222; rare has HK-39372; no_match and category_absent replace old cards with correct empty outcomes

#### Scenario: Modes and safe errors
- **WHEN** live/fallback real interactions and controlled mixed/rare error/malformed cases execute
- **THEN** visible modes agree with public responses, errors expose no internal paths/provider payloads and the last valid result survives unusable responses

### Requirement: Evidence-based date comparison
The screen SHALL compare only successive successful normalized requests whose date differs while every other input and catalogVersion/selectionPolicyVersion agrees. It MUST use full busy ID sets and known cards/prices, distinguish newly busy, newly available, still-available displaced and already-available promoted cards, and never recreate filtering or invent replacement pairs. It SHALL compare known prices before cheaper claims, explain ties by catalogue ID without quality implications, and show unchanged-list copy for identical IDs/order. Narrative SHALL state both dates beside the summary. Non-comparable success replaces baseline without narrative; errors preserve it; reset removes it. Empty transitions SHALL produce only provable facts.

#### Scenario: Real October 10 to 11
- **WHEN** dense date-only requests change October 10 to 11
- **THEN** HK-88430/HK-29829/HK-27222 becomes HK-44923/HK-27222/HK-44733 and narratives follow complete busy IDs without retaining old cards as current recommendations

#### Scenario: Real available displacement
- **WHEN** dense date-only requests change October 1 to 6
- **THEN** HK-88430/HK-44923/HK-75012 becomes HK-88430/HK-44923/HK-29829; HK-29829 loses its busy mark and HK-75012 remains available but is displaced by starting-price order

#### Scenario: Comparison boundaries and ties
- **WHEN** first/same-date/context-changed/other-input-changed/unchanged-list/error-retry/reset/empty transitions or controlled promotion/equal-price examples occur
- **THEN** only comparable successes produce justified narratives, unchanged lists have no replacement story and equal prices never imply a cheaper or better contractor

### Requirement: Accessible verified integration
The primary screen SHALL preserve desktop form-left/results-right and mobile form-above layout, explicit labels, visible keyboard focus, polite progress/result announcements and stable asynchronous focus. It MUST remain readable without horizontal overflow at 375px and 1280px. Acceptance SHALL distinguish actual backend/live interactions from controlled examples and verify clean-checkout installation/build/start/primary fallback without hidden files or personal sessions.

#### Scenario: Browser and clean candidate acceptance
- **WHEN** keyboard disclosure/submit/retry/reset and desktop/mobile checks run, followed by combined typecheck/tests/build and README clean launch
- **THEN** the connected real primary scenario passes, required live/fallback and isolated real catalogue-error evidence is recorded, and unavailable checks remain explicitly unmet rather than inferred from fixtures

### Requirement: Explanation-first compact presentation
The screen SHALL use a compact conditions area and prominent full contractor explanations with readable name, category, city and starting price. Successful conditions SHALL remain identifiable with readable dates and grouped money. All explanation modes, provenance flags and evidence-based date changes MUST remain visible without opening technical details. The screen SHALL NOT fabricate ratings, best-match order, portraits or confirmed availability.

#### Scenario: Dense recommendation hierarchy
- **WHEN** the primary request succeeds on desktop
- **THEN** the first contractor's name, price and complete explanation are visible in the initial 1280 by 900 viewport and detailed selection mechanics do not precede all cards as a long text block

#### Scenario: Required outcome reasons
- **WHEN** fewer than three contractors match, no contractor passes conditions, or the city has no requested category
- **THEN** the corresponding outcome and reason are readable without opening a disclosure, nonzero exclusion reasons are counted as first failures, and the two empty outcomes remain distinct

### Requirement: Explicit responsive result access
The screen SHALL provide explicit mobile access to the results and user-controlled collapse/reveal of completed event conditions while preserving all values. User-triggered result navigation SHALL move focus to a labelled result heading. Asynchronous completion SHALL NOT scroll or move focus. Reset and invalid-field handling MUST reveal the required form controls before focus. Controls, cards and complete explanations SHALL be readable without horizontal page overflow at 375px, 390px and 1280px widths, with visible keyboard focus and reduced-motion support.

#### Scenario: Mobile result navigation and condition editing
- **WHEN** a mobile user completes a request, activates result navigation, collapses or reopens the form and edits conditions
- **THEN** the result heading can be reached directly, values and last successful conditions remain correct, and reopening/editing does not trigger a recommendation

#### Scenario: Visible active optional conditions
- **WHEN** language or duration is set and additional conditions are closed
- **THEN** their selected values remain visible in the disclosure summary without submitting a request

### Requirement: Recognizable compact Join City identity
The screen SHALL show a legible join city wordmark with three lime, rose and sky chevrons, a compact light header, the existing task heading and a concise introduction. It SHALL use the approved blue/slate visual system without introducing navigation, remote fonts or a tall hero. The primary result's first name, starting price and complete explanation MUST remain visible at 1280 by 900 px.

#### Scenario: Primary screen identity and density
- **WHEN** the screen loads and the real primary request succeeds
- **THEN** Join City identity is recognizable, the working area stays near the top and the first recommendation's complete explanation remains in the desktop viewport

### Requirement: Separate explanation-led cards
Recommendations SHALL be separate non-clickable cards with full explanation, readable name/category/city, an outline category icon with a neutral unknown-category fallback, starting price with от and ₸, and readable calendar/provenance footer. They MUST preserve actual order, text, flags, modes, date comparisons and all outcome reasons; icons MUST NOT replace text or imply ranking. No photos, ratings, booking or contact actions SHALL be invented.

#### Scenario: Real and controlled card presentation
- **WHEN** real primary/rare requests or controlled long-category/large-price/unknown-category responses render
- **THEN** cards remain distinct, explanations are complete, price and provenance are readable, and unknown categories retain their text with a neutral icon

### Requirement: Passive complete snapshot labels
Successful normalized conditions SHALL appear as wrapping passive labels for city, date, format, category, budget, language and duration. Missing optional restrictions MUST remain explicit. Labels SHALL describe the successful response rather than unsent edits or a pending request and SHALL NOT act as editable/removable filters.

#### Scenario: Snapshot survives draft and pending changes
- **WHEN** a successful response is followed by edits, a pending submission or an error
- **THEN** labels retain that response's actual normalized values while existing pending and unsent-change messages remain distinct

### Requirement: Consistent responsive visual states
The initial state SHALL use a compact category/selection motif with direct form guidance. Empty, pending and error states SHALL use the same visual system while retaining actionable text. At 375, 390 and 1280 px, full explanations and labels MUST wrap without horizontal overflow; controls and keyboard focus SHALL remain visible, and the mobile action bar SHALL NOT obscure content or focused fields. User-controlled collapse/result navigation and stable asynchronous focus/scroll MUST remain intact, with reduced motion respected.

#### Scenario: Responsive state and keyboard acceptance
- **WHEN** real primary, rare, both empty, date-change and controlled request-error/race checks run across the required widths
- **THEN** existing semantics and explicit navigation remain intact, controls/text are readable, focus is visible and no asynchronous completion moves focus or scroll
