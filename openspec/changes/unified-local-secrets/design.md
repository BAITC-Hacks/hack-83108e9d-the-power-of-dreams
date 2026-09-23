## Context

See proposal.md. Node.js 24.4.1 is available but there is no application entry
point. The primary checkout contains unrelated uncommitted setup work.

## Goals / Non-Goals

**Goals:** one server file, deterministic precedence, safe failure messages,
organizer setup without extra packages, and extensible required names.

**Non-Goals:** no product services, browser configuration, secret encryption,
network calls, or claims about application startup integration.

## Decisions

- Use built-in `node:util` parseEnv, verified against Node.js 24 documentation,
  instead of an additional dotenv dependency. Normal dotenv quoting applies;
  no variable expansion. Environment values (including blank ones) override
  file values. The root comes from the module location, never process.cwd().
- `back/config/secrets.mjs` owns `loadSecrets({required, env?, envFile?})`.
  Inputs: array of valid uppercase variable names and optional test/deployment
  overrides. Output: frozen object of requested nonblank string values only.
  Missing values are not converted to null. No process mutation or logging.
  Dependencies: Node filesystem, URL, util, crypto only; no UI/provider/storage.
  Side effect: one synchronous local file read, no retries or network activity.
  Errors: CONFIG_REQUIRED, CONFIG_FILE_UNREADABLE, CONFIG_INVALID_REQUEST,
  with message and generated string requestId; no original cause or values.
- `scripts/secrets/setup.mjs` exclusively creates root `.env` from the template
  without overwrite. `check.mjs NAME...` calls the loader; no arguments prints
  usage and exits unsuccessfully rather than implying all providers were checked.
  Both print safe messages only. Consumers must call the loader before starting
  external operations. Browser modules must never import `back/config/`.
- `.env.example` contains empty OPENAI_API_KEY, NVIDIA_API_KEY, DATABASE_URL;
  each required only when requested by its consuming service. New integrations
  add a documented name to the same template and request it from the loader.
- Primary agent owns all change files. No parallel writers or new dependencies.
  Focused Node tests use disposable files and child processes, not real secrets.

## Risks / Trade-offs

- Plaintext local file → use local access controls and private transfer;
  exclude it from public archives. Git ignores do not prevent forced adds.
- No application exists → report configuration-only evidence; later application
  startup must invoke this module and verify real service interactions.
- Dirty main checkout → preserve all work; publish the feature branch and do
  not promote main until the checkout is ready under repository agreements.

## Migration Plan

Run setup, fill `.env`, run preflight for required names. Existing process
environment remains supported. No database migration or existing entry point
changes. Rollback removes these new helpers without modifying local secrets.
