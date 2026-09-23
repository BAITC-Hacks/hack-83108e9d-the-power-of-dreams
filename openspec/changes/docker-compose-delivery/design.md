## Context

See [proposal](proposal.md) and [existing architecture](../../../architecture/README.md). Next.js serves UI and HTTP routes in one process. back/composition.ts loads raw/dataset.csv and dynamically imports back/ai/openai.mjs from process.cwd(); the latter reads back/config/secrets.mjs. Current host scripts bind to 127.0.0.1. No persistent application state or database exists.

## Goals / Non-Goals

**Goals:** A self-contained production image, runtime-only optional AI settings, meaningful readiness and repeatable judge instructions. Preserve host development commands and public contracts.

**Non-Goals:** Application behavior changes, new infrastructure services, host source mounts, public hosting, registry publishing, UI redesign or a claim that this completes all P07 acceptance.

## Decisions

### Image and network

Use a pinned official Node.js 24 Debian slim image with separate dependency/build/runtime stages. Install by npm ci using the committed lockfile. The build stage runs existing type and test checks plus the production build; the final stage carries production dependencies, .next, package metadata, CSV and the two dynamically loaded .mjs files. Avoid Next.js standalone tracing changes because this application deliberately loads files dynamically. Run as the image's non-root node user. Do not install Docker, curl or browser packages in the app image.

Start Next.js directly with hostname 0.0.0.0 and internal port 3000, leaving host scripts unchanged. Compose publishes 127.0.0.1:${APP_PORT:-3101}:3000 and uses no fixed container name, bind mount, database or persistent volume. One service is enough for the existing architecture; a separate web proxy adds no accepted capability.

### Runtime configuration and build context

Compose forwards only OPENAI_API_KEY and OPENAI_MODEL with empty defaults. Root .env or process environment can supply them; no env_file is required. The key is passed only at container creation. README documents Compose interpolation/precedence and literal-value quoting for values with dollar signs. .dockerignore uses a small allowlist of application build inputs, explicitly excluding .env variants, node_modules, .next, Git and test output. Existing secret-loader semantics are unchanged. APP_PORT is an optional non-secret Compose host setting documented in .env.example.

### Readiness and verification

A small Node script fetches http://127.0.0.1:3000/api/catalog/options with a three-second deadline, checks a successful catalogue response and exits nonzero otherwise. Compose schedules it with a start grace period and bounded retries; README uses docker compose up --build --wait --wait-timeout 120. Readiness calls no provider operation. Missing-catalogue validation uses a disposable image/container derived from the candidate, never edits the canonical CSV.

A focused scripts/docker/smoke.mjs uses Node's built-in fetch/assert against a running application and verifies exact IDs/counts for the README primary request, date change, rare category, both empty outcomes, repeat and invalid input. Run it through docker compose exec so judges need no host Node.js. It uses real HTTP and fails on any unexpected response. It does not provision infrastructure, start servers or replace existing domain tests. Browser verification exercises the real container's form and outcomes; controlled browser-only delays/failures are labelled separately. Provider integration is separately verified if credentials are available, with at most a few bounded billable requests and no secret output.

### Ownership and contracts

| Area / owner | Operations and input | Output/errors | Data and dependencies | Verification |
| --- | --- | --- | --- | --- |
| Image / coordinator | Build committed source and lockfile | Runnable image or nonzero build | Build artifacts; current npm stack and official Node base | Clean image build, existing checks, inspect runtime assets/user |
| Compose / coordinator | up, down, logs, APP_PORT, optional AI settings | Local service, health status or CLI failure | No persistent state; Docker Engine, image | Ready startup, alternate port, restart, unhealthy catalogue |
| Health/smoke scripts / coordinator | Existing public HTTP APIs | Exit 0 or nonzero; concise safe result | Public contracts only; Node built-ins | Actual candidate HTTP checks |
| README/environment template / coordinator | Judge follows documented steps | Reproducible local run | No secrets; links to task evidence | Clean-copy follow-through and browser |

No shared contract changes or delegated parallel writers are needed. Existing AI transport retains its six-second deadline, zero retries, cancellation behavior and validation. Health requests use a shorter deadline; smoke requests use a bounded timeout. Build pulls and npm downloads require network access; Compose's readiness timeout applies after build, not to image downloads. Ctrl+C can cancel the operator command; use down to remove this project's containers and network.

## Risks / Trade-offs

- [Docker Engine unavailable] -> Start the installed Desktop engine; report a concrete blocker if it cannot run. Do not substitute host checks for container evidence.
- [First build time and registry access] -> Cache dependency layers and document first-build network/download requirements; do not promise a fixed total build duration.
- [Dynamic runtime modules omitted] -> Explicitly copy the CSV and adapter/config files and check real catalogue/recommendation requests.
- [Credentials accidentally included] -> Allowlisted build context, runtime environment only, inspect file names/configuration without printing values.
- [Host .env unexpectedly enables live requests] -> Document it clearly; acceptance baseline explicitly supplies blank OpenAI values and live verification is separate.
- [Different CPU/OS] -> Use standard official Linux base without forcing a CPU architecture; record the architecture actually tested without claiming untested platforms.

## Migration Plan

Add the optional Docker route and keep the existing Node route. No data migration is needed. Stop with docker compose down. Rollback removes the optional container configuration or checks out the previous revision; catalogue and selection contracts are unchanged. Publish accepted feature content and integrate under the repository's ownership protocol. Save exact tested/published revisions and remaining limitations in tasks.md.
