# Docker Compose delivery

Approved by the user on 2026-09-23 after repository exploration. Authorization includes OpenSpec planning, implementation, README updates and real verification.

## Outcome

A judge with Docker and Compose can build and run the existing application from a clean repository copy, without installing Node.js or configuring credentials. The primary URL is http://localhost:3101. OpenAI explanations remain optional and require a funded account, model access and network connectivity.

## Agreed design

- One application service packages Node.js 24, pinned npm dependencies, the production Next.js build, the supplied CSV and runtime-loaded server modules.
- Build inside Docker. Do not mount the author's checkout or reuse local node_modules or .next output.
- Bind the server to 0.0.0.0 inside the container and publish the host port on loopback only.
- A healthcheck verifies the existing catalogue API without a provider call. The documented launch waits for readiness with a bounded timeout.
- Start without a required .env; optionally supply only OpenAI settings at runtime. Exclude credentials and local build outputs from the build context.
- Put the Docker quick start first in README; retain the Node.js path and explain stopping, logs and changing the host port.
- Check clean build/start, the expected three-card scenario, date change, rare category, both empty outcomes, browser interactions and restart. Record live-provider verification separately from catalogue fallback.

## Alternatives and boundaries

The existing Node.js route remains a useful alternative for developers but requires local runtime setup. A published prebuilt image could reduce first-run time but adds registry/release maintenance, so it is outside this change. Database, Redis, GPU, reverse proxy, cloud deployment and changes to selection or public contracts are unnecessary for the approved outcome.

## Initial observations

Base revision: d2b61e2abf07241318c6e1a1c93438de4496cfae. Docker CLI 29.7.2 and Compose 5.4.0 were installed; Docker Engine was initially unavailable. The current npm start script binds to 127.0.0.1. back/composition.ts loads raw/dataset.csv and back/ai/openai.mjs from the runtime working directory. These observations are inputs to implementation, not acceptance evidence.

Current decisions and evidence continue in [OpenSpec](../openspec/changes/docker-compose-delivery/proposal.md).
