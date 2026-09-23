## Purpose

Help customers choose contractors that suit their wishes using traceable profile evidence and explicit unknowns without compromising eligibility or repeatability.

## ADDED Requirements

### Requirement: B1 Reviewable bounded interpretation
The service SHALL interpret 1–1000 characters of free text into at most six source-backed preferences/avoidances from a fixed vocabulary. Unsupported conditions SHALL remain visible as unknown. Every condition MUST retain a literal span of the submitted brief. The user SHALL review and remove conditions before explicit recommendation submission; editing the text invalidates the interpretation. Interpretation MUST NOT change city, date, category, budget, language or duration fields. Failed interpretation MUST return a safe error and MUST NOT silently discard the brief or claim AI success. No automatic retry or provider switch is permitted.

#### Scenario: Discreet host and an unverified avoidance
- **WHEN** the brief asks for a discreet host without compulsory contests
- **THEN** discreet style and the avoidance are displayed for review, and absence of contest evidence remains unknown rather than a promise of no contests

#### Scenario: Unsafe or unsupported output
- **WHEN** provider output invents source spans, unknown feature identifiers, extra fields, duplicate/conflicting traits, or fails/cancels
- **THEN** invalid interpretation is rejected, cancellation wins, and the last successful recommendations remain intact

### Requirement: B2 Grounded catalogue matching
Confirmed briefs SHALL be evaluated against all hard-eligible profiles using a versioned source-checked evidence index. A positive/negative index assertion MUST have a literal excerpt from its own profile and verified semantic polarity. Missing assertions and unknown conditions SHALL be unknown. No description or brief instruction SHALL override hard filters. Cards SHALL retain a concise explanation and expose matches/conflicts with quotes, unknown conditions and a relevant question. Catalogue statements MUST be attributed and not presented as independently verified quality, final prices or booking guarantees.

#### Scenario: Candidate outside the cheap three
- **WHEN** Алматы / Ведущий / корпоратив / 2026-10-10 / 1500000 uses a confirmed discreet-style preference
- **THEN** HK-77838 enters the shortlist on its explicit unobtrusive-style evidence, with the excerpt visible and all structural restrictions still satisfied

#### Scenario: Source and missing evidence
- **WHEN** an index excerpt belongs to another profile, the index data version changes, or a requested condition lacks evidence
- **THEN** invalid index data prevents brief selection with an explicit safe error; missing evidence yields unknown and a question, not an invented match

### Requirement: B3 Repeatable soft ranking
Within hard-eligible profiles, confirmed conditions SHALL rank by fewer confirmed conflicts, more confirmed matches, starting price ascending, then ordinal ID. Soft conditions MUST NOT remove eligible candidates. The same confirmed request, catalogue, evidence index and policy SHALL yield the same IDs/order after process restart, without model calls to decide the order. Empty briefs SHALL preserve the original behavior. Reinterpreting raw text is a new suggestion, not part of this guarantee.

#### Scenario: Stable order across lifetime and constraints
- **WHEN** the same confirmed request is repeated, run concurrently, run after restart, or the catalogue enumeration order changes
- **THEN** IDs/order are identical, and busy/over-budget profiles remain excluded even if they have the strongest style match

### Requirement: B4 Measured model choice and cost ceiling
Live verification SHALL begin with one short structured-output probe per named model. The initial candidate SHALL be gpt-5.6-luna; gpt-5.6-terra SHALL be compared on 30 fixed briefs twice if probes pass. Total experiments MUST remain below USD 5 using pre-call reservations that include bounded output and conservative input/cache-write pricing; failed calls consume their reservation unless measured usage establishes actual cost. Reports MUST distinguish live calls, controlled tests, catalogue derivations and subjective judgments, recording latency, usage, interpretation criteria and selection benefit against the original baseline. Live application checks count against the same ceiling.

#### Scenario: Experiment accounting
- **WHEN** the comparison runs or a provider response fails
- **THEN** no call starts without sufficient remaining reserved budget, and the report lists observed outcomes and limitations instead of counting failures as quality passes
