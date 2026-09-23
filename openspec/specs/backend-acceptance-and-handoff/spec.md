# Backend acceptance and handoff Specification

## Purpose

Provide a repeatable connected backend and an immutable public contract that frontend work can consume against an exact accepted revision.

## Requirements

### Requirement: Connected real-data acceptance
The backend SHALL preserve public v1 outcomes, normalization, validation precedence, deterministic selection and complete comparison context from the pinned catalogue. Evidence SHALL distinguish real CSV, controlled provider responses and historical live observations.

#### Scenario: Dense and date-change rehearsals
- **WHEN** Алматы / Ведущий / корпоратив / 1500000 KZT is submitted without optional fields on October 10, 11, 1 and 6 of 2026
- **THEN** each response has ten candidates, eligible counts 5, 4, 3 and 7 respectively, ordered IDs from the approved P05 table, complete busy identities and consistent exclusion counts
- **AND** three identical requests and one actual process restart preserve ordered IDs and comparison context for unchanged catalogue bytes

#### Scenario: Rare, absent, empty and busy venue
- **WHEN** the approved florist, absent-category, budget-1 and a recorded real busy-venue request are submitted
- **THEN** the florist returns only HK-39372, absent and budget-1 produce their distinct normal empty outcomes, and the venue is excluded on its busy date

### Requirement: Retained process catalogue lifecycle
The backend SHALL serve safe catalogue-unavailable responses after missing or damaged catalogue startup and retain that failure until process restart.

#### Scenario: Repair without restart
- **WHEN** an isolated production process starts with missing or damaged CSV and that file is repaired while it runs
- **THEN** options and syntactically valid recommendation requests remain 503 with fresh request IDs, malformed JSON remains 400, and a real restart recovers normal responses

### Requirement: Narrow optional AI configuration
The connected backend SHALL use catalogue fallback for missing/blank keys and CONFIG_FILE_UNREADABLE, including unreadable files with populated environment variables. It SHALL accept a usable process variable when the configuration file is absent. CONFIG_INVALID_REQUEST and unexpected faults MUST remain failures, not ordinary fallback.

#### Scenario: Isolated configuration matrix
- **WHEN** the real configuration loader and composition run against synthetic missing, blank, unreadable and environment-only configurations
- **THEN** expected configuration failures make no provider request, environment-only configuration reaches a controlled provider, and invalid/unexpected faults return safe INTERNAL_ERROR 500 responses with distinct request IDs and no private details

### Requirement: Preserve bounded evidence behavior
Evidence SHALL preserve selected IDs, order and cardinality; use rendered quotes to determine openai_evidence, mixed, catalog_fallback or not_needed; skip empty selections; retain the six-second overall deadline, zero retries and caller cancellation behavior.

#### Scenario: Accepted existing evidence
- **WHEN** the unchanged P01/P04 execution records are compared with the accepted candidate
- **THEN** sufficient controlled and live evidence is retained with exact source revisions and explicit limits; only missing or invalidated relevant evidence is repeated
- **AND** P07 final rendered quality and uncached timing obligations remain outstanding

### Requirement: Immutable frontend handoff
P06 SHALL receive a committed versioned TypeScript DTO snapshot, minimal labelled examples and English consumer instructions tied to an exact accepted backend revision. The package MUST document operations, no-auth behavior, fields and units, normalization/date window, outcomes, errors/status/requestId, explanation modes, quality flags, comparison context and required visible states without exposing backend internals or secrets.

#### Scenario: Published package and pin
- **WHEN** v1 is published under the canonical shared root after acceptance
- **THEN** its full path set and bytes match its package commit, a materialization manifest records ownership and checksums, and the P06 handoff card records absolute version path, package commit, backend SHA and candidate base
- **AND** any missing/mismatched pin blocks frontend work; published versions remain immutable

#### Scenario: Delivery and downstream boundaries
- **WHEN** backend and package are integrated and normally pushed to main
- **THEN** remote ancestry is verified separately from materialization, current specs are synchronized, and archived evidence retains checks, limitations and P06/P07 obligations
