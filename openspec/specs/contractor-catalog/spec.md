# contractor-catalog Specification

## Purpose

Provide a complete immutable contractor catalogue and global form options from the supplied CSV while preserving source meanings and safe failure boundaries.

## Requirements

### Requirement: Complete source interpretation
The catalogue SHALL decode UTF-8 CSV with headers and quoted fields, string identifiers, pipe-separated memberships, positive integer event starting prices, numeric duration or null for an empty duration, date-only busy dates, complete descriptions and explicit TRUE/FALSE quality flags. Invalid records SHALL invalidate the whole catalogue rather than being omitted or repaired.

#### Scenario: Supplied catalogue
- **WHEN** the supplied dataset is loaded
- **THEN** it contains 66 unique profiles and nine null durations, with source descriptions, lists and flags retained

#### Scenario: Quoted and nullable fields
- **WHEN** valid controlled CSV includes a quoted comma, pipe lists, both boolean values and an empty duration
- **THEN** fields retain their intended meanings and empty duration becomes null rather than zero

### Requirement: Safe complete failure
The catalogue SHALL return only the expected missing, unreadable or invalid category for corresponding source failures, without a partial snapshot, path, source text or raw exception. Unexpected programming faults SHALL reject.

#### Scenario: Invalid record or duplicate identifier
- **WHEN** a record has a malformed required value, damaged CSV structure or duplicate identifier
- **THEN** the result is unavailable with category invalid and no snapshot

#### Scenario: Unavailable file
- **WHEN** the file is absent or a controlled unreadable filesystem input is supplied
- **THEN** the result is respectively missing or unreadable without sensitive details

### Requirement: Global options and fixed window
The catalogue SHALL derive unique cities, categories, event formats and languages from every valid profile, sorted by fixed string order, and return the inclusive date window 2026-09-23 through 2026-12-31 independently of filters or busy-date extrema.

#### Scenario: Options cover the whole catalogue
- **WHEN** the complete catalogue contains categories across different cities and busy dates
- **THEN** options equal all unique sorted source memberships and the fixed window remains unchanged

### Requirement: Immutable consumer snapshot
The catalogue SHALL protect profile collections, profile fields, nested lists, quality flags, global option lists and the date window from consumer mutation.

#### Scenario: Attempted mutation
- **WHEN** a consumer attempts to change representative snapshot or nested values
- **THEN** another consumer observes the original snapshot values

### Requirement: Exact source identity
The catalogue SHALL use sha256: followed by the lowercase SHA-256 digest of the exact bytes loaded in the same single read. Each invocation SHALL make one file-read attempt with no retries, writes, network access or hidden reload.

#### Scenario: Stable and changed bytes
- **WHEN** unchanged valid source bytes are loaded twice and then a valid byte change is loaded
- **THEN** unchanged loads have the same independently verifiable digest and the changed source has a different correct digest
