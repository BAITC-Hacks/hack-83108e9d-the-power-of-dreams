## Purpose

Provide a server-only OpenAI transport using existing private configuration and bounded, observable calls.

## ADDED Requirements

### Requirement: Configured Responses transport
The adapter SHALL read OPENAI_API_KEY through the existing secret loader, default to gpt-4.1-mini-2025-04-14, use Responses with store false and support optional strict JSON-schema formatting.

#### Scenario: Successful text request
- **WHEN** a configured caller submits nonempty input
- **THEN** one request returns normalized text from all output text parts, model, response identifier, request identifier and available usage.

#### Scenario: Missing key
- **WHEN** the key is missing
- **THEN** configuration fails before any network request without exposing credentials.

### Requirement: Bounded safe failures
The adapter SHALL enforce a six-second deadline including body consumption, support caller cancellation, make zero retries and return stable safe errors without provider bodies or credentials.

#### Scenario: Provider or transport failure
- **WHEN** authorization, rate limiting, unavailable service, invalid response, incomplete response or refusal occurs
- **THEN** the call fails with a stable code and requestId without fallback.

#### Scenario: Deadline or cancellation
- **WHEN** the deadline elapses or the caller cancels
- **THEN** the local request is aborted and a timeout or cancellation error is returned.

### Requirement: Reproducible verification
The implementation SHALL include a short live check and focused transport checks runnable from documented setup without personal sessions.

#### Scenario: Operator checks configured access
- **WHEN** the operator runs the live check with a valid private key
- **THEN** it reports safe model, usage and timing metadata and verifies a fixed benign response.
