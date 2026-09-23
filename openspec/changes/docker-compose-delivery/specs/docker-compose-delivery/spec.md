## Purpose

Let judges reproduce the existing contractor-selection application from a clean repository using Docker Compose, with observable readiness and no mandatory personal credentials.

## ADDED Requirements

### Requirement: Self-contained local launch
The repository SHALL provide a documented Compose command that builds and starts the production application with its runtime dependencies and supplied catalogue. It MUST NOT require host Node.js, local dependency/build directories, source bind mounts or a configuration file for catalogue-only operation. The default published address SHALL be localhost port 3101, with a documented host-port override.

#### Scenario: Judge starts a clean copy
- **WHEN** a judge with a running Linux-container Docker Engine, supported Compose and internet access follows the Docker quick start from a clean repository
- **THEN** the production page and catalogue API are available at the documented local address without host npm installation or provider credentials

#### Scenario: Judge changes the port and restarts
- **WHEN** the judge selects another host port, stops the service and starts it again
- **THEN** the application serves the same supplied catalogue and primary result at the selected address

### Requirement: Readiness checks application data
The documented launch SHALL wait for a bounded readiness check of the catalogue API. Readiness MUST NOT call the AI provider. An unavailable catalogue MUST NOT be reported as healthy.

#### Scenario: Catalogue is available
- **WHEN** the production application successfully serves catalogue options
- **THEN** Compose reports the application healthy and the launch command succeeds

#### Scenario: Catalogue is unavailable
- **WHEN** the runtime catalogue cannot be loaded
- **THEN** the healthcheck fails and the documented wait command terminates unsuccessfully within its configured readiness deadline

### Requirement: Optional runtime-only AI configuration
The container SHALL support the application's existing catalogue fallback without a key and optional OpenAI explanations using runtime configuration. Credentials and local environment files MUST NOT be copied into image layers or used as build arguments. Only relevant application settings SHALL be forwarded to the application container.

#### Scenario: No credentials supplied
- **WHEN** a fresh checkout is launched without OpenAI configuration and the primary selection is submitted
- **THEN** the expected catalogue results appear with the existing visible catalogue-only explanation label

#### Scenario: Provider configuration supplied
- **WHEN** the operator provides OPENAI_API_KEY and optionally OPENAI_MODEL through the documented runtime route
- **THEN** the existing provider adapter receives those settings without rebuilding the image, preserving existing live, mixed and fallback behavior

### Requirement: Reproducible verification and honest evidence
The Docker documentation SHALL give prerequisites, build/start, optional configuration, stop/logs, port override and primary scenario instructions. Acceptance SHALL exercise the container through its real HTTP interface and browser, and distinguish observed catalogue fallback, controlled failures and live-provider results.

#### Scenario: Main and boundary scenarios
- **WHEN** the documented container is checked from clean committed content
- **THEN** the primary request returns HK-88430, HK-29829 and HK-27222 in order; a changed date changes the result; the rare category returns one card; both no-match and category-absent outcomes remain distinguishable; restart preserves behavior

#### Scenario: Provider verification is unavailable
- **WHEN** a valid provider credential or external service is unavailable during acceptance
- **THEN** the evidence explicitly records that limitation and does not count fallback as successful live verification
