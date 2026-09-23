## ADDED Requirements

### Requirement: Review and submit optional wishes
The screen SHALL provide an optional brief, explicit interpretation action and removable interpreted conditions. Nonempty edited/uninterpreted text MUST prevent submission with stale conditions. Explicit recommendation submission SHALL confirm the visible conditions. Reset/unmount/edits SHALL cancel or invalidate obsolete interpretation; late success/error MUST NOT restore stale state. Existing recommendation snapshots, duplicate guards and retry semantics SHALL remain intact. AI failure SHALL offer retry or clearing the optional brief without silently doing either.

#### Scenario: Edit and reset races
- **WHEN** the user edits or resets while interpretation is pending, or edits after an interpretation
- **THEN** stale results are ignored, confirmation is invalidated and the existing recommendation result is retained until an explicit successful new submission

### Requirement: Explain personalized results honestly
Brief results SHALL identify submitted wishes, visible source-attributed matches/conflicts and unknowns with a question. Ranking copy SHALL describe fewer conflicts/more matches with price/ID tie-breaking. No-brief results SHALL retain baseline copy. Date-only comparison SHALL compare confirmed brief/index policy identity and MUST NOT attribute style displacement to cheaper prices. All new controls SHALL have labels, visible keyboard focus and readable layouts at 375px and 1280px.

#### Scenario: Evidence and changed context
- **WHEN** brief results render, conditions change, or only the date changes
- **THEN** evidence and unknowns are visible, changed wishes prevent an unrelated date narrative, and date narratives state only justified availability/ranking facts
