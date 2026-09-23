## Why

Judges currently need to install the correct Node.js version and perform dependency installation and production build manually. A verified Docker Compose path makes the existing application reproducible from a clean repository with fewer setup steps, supporting the task brief's README and reproducibility criterion.

Approved scope: [brainstorming outcome](../../../.brainstorming/2026-09-23-docker-compose-delivery-design.md).

## What Changes

- Add a production Docker image and one-service Compose launch with bounded readiness checking.
- Package all runtime dependencies, the supplied catalogue and dynamically loaded server modules.
- Support catalogue-only startup without credentials and optional OpenAI configuration supplied at runtime.
- Exclude secrets and personal build outputs from the build context.
- Lead README with Docker prerequisites, launch/stop/logs/port instructions and expected verification results; preserve the current Node.js route.
- Verify the documented path from clean committed content with real HTTP and browser scenarios, recording live-provider results separately.

## Capabilities

### New Capabilities

- `docker-compose-delivery`: Reproducible local container launch, runtime configuration, readiness and judge-facing verification.

### Modified Capabilities

None. Selection rules, public API contracts and explanation behavior remain unchanged.

## Impact

New Dockerfile, compose.yaml, .dockerignore and focused container verification under scripts/docker/; updates to README.md, .env.example and architecture/README.md. No new npm dependencies or application services. Docker Engine with Compose and internet for initial image/package downloads are required for this optional route. Live OpenAI requests retain existing cost and account requirements. Cloud hosting, published images and final P07 product acceptance are outside scope.
