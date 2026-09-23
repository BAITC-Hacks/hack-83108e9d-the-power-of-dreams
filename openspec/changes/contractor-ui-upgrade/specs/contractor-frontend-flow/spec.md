## ADDED Requirements

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

## MODIFIED Requirements

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
