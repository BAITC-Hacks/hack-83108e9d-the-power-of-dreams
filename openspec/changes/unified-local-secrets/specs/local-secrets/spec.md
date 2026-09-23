## Purpose

Allow developers and organizers to configure server credentials in one local
file without publishing secrets or relying on the author's machine.

## ADDED Requirements

### Requirement: Single local source with deployment overrides
The system SHALL read the repository-root `.env` regardless of the working
directory, allow process environment overrides, and expose only requested
server settings. It SHALL NOT modify the process environment or emit values.

#### Scenario: Read selected settings
- **WHEN** a consumer requests OpenAI, NVIDIA, database, or another named secret
- **THEN** it receives the requested file values, overridden by defined process
  values, and no unrelated settings

#### Scenario: Missing file on a deployment
- **WHEN** `.env` is absent but all requested settings exist in the environment
- **THEN** configuration succeeds

### Requirement: Safe required-setting validation
The system SHALL reject missing or blank required settings before the consumer
performs external operations, and errors SHALL contain a stable code, safe
message, and requestId. Optional unselected providers SHALL NOT be required.

#### Scenario: Blank selected credentials
- **WHEN** selected settings are absent or blank
- **THEN** the preflight exits unsuccessfully and names missing settings without
  printing any supplied values

#### Scenario: File cannot be read
- **WHEN** a settings file exists but cannot be read
- **THEN** a safe configuration error is returned without raw filesystem details

### Requirement: Reproducible organizer setup
The repository SHALL include an empty template, instructions, a non-overwriting
setup command, and a preflight command. Actual `.env` variants SHALL be ignored
by Git, with `.env.example` allowed. Credentials SHALL stay outside browser code.

#### Scenario: Fresh setup and repeated setup
- **WHEN** the organizer runs setup in a clean checkout and repeats it
- **THEN** the first run creates root `.env` from the template and the second
  preserves the existing file unchanged

#### Scenario: Configuration-only verification
- **WHEN** the organizer fills the template and checks selected variable names
- **THEN** preflight reports configuration readiness without claiming successful
  live API or database connectivity
