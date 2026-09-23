## ADDED Requirements

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
