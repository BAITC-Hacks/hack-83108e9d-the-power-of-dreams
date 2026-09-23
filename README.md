# hack-83108e9d-the-power-of-dreams
Hackathon team repository for «The Power of Dreams»

## Development starting point

The selected task is explainable event-contractor selection from the supplied
catalogue (#79-lite). The agreed MVP is one local Next.js application with
in-memory CSV data, deterministic selection and an OpenAI evidence adapter.
See [architecture](architecture/README.md) and the [module proposal sequence](.proposals/README.md).

Start with [P00: foundation and contracts](.proposals/00-foundation-and-contracts.md)
in its assigned worktree, then P01's first working scenario. Only after its
verified commit should P02/P03/P04 run independently from that same base.
P00 contracts are in `contracts/`, with immutable domain types and evidence ports
under `back/`. See the [foundation change](openspec/changes/archive/2026-09-23-foundation-and-contracts/tasks.md)
for verification and delivery status. P01 now implements the first working browser slice; see the active OpenSpec evidence below.

## Environment setup

Install the prepared web-stack dependencies from the repository root.
The current environment uses Node.js 24.4.1 and npm 11.4.2.
Exact package versions are pinned in `package.json` and `package-lock.json`.

```powershell
npm ci
```

The stack includes Next.js, React, TypeScript, Tailwind CSS with PostCSS, Zod,
ESLint with the Next.js configuration, Vitest, and Playwright.

ESLint is pinned to major version 9 because the plugins bundled with
`eslint-config-next` still require it. npm reports that this version is no
longer supported; moving to ESLint 10 requires compatible plugin versions.

Verify the installed dependencies:

```powershell
npm ls --depth=0
```

Foundation verification after `npm ci`:

```powershell
npm run typecheck
npm test
```

Expected: shared types and labelled synthetic examples compile; three fixture
consistency checks, ten existing secrets/transport checks and eight P01 contract checks pass.
No `.env`, provider account, browser installation or billable calls are needed
for these foundation checks. `csv-parse` loads the real catalogue.

## Run the first working slice

The app reads `raw/dataset.csv` once per process and exposes a five-field Russian
form at `/`. Selection uses city/category, calendar, budget and format, ordered
by starting price then catalogue ID. One bounded OpenAI request selects source
excerpts; local code verifies them and renders the explanation.

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm start -- --port 3101
```

Open http://127.0.0.1:3101. The general dev/start default is port 3000; P01 uses
3101. Run from the repository root and retain `raw/` and `back/`: the unchanged
server transport is loaded at runtime to keep the private `.env` out of bundled
assets. No database, GPU, external font, account session or extra service is needed.
`npx playwright install` is optional browser-test tooling, not an app prerequisite.

Primary scenario: Алматы / Ведущий / корпоратив / 2026-10-10 / 1500000 KZT.
Expected: 10 candidates, 5 eligible, and Куррапика (HK-88430), Аня Форджер
(HK-29829), Сон Гоку (HK-27222), in that order. Budget 1 gives a normal empty
result. Changing form fields does not call AI until Подобрать is pressed.
Prices are starting prices; absence of a busy mark is not a confirmed booking.
The interface labels synthetic/anonymized profiles and imputed city/price values.

For live excerpts, configure `OPENAI_API_KEY` through the existing setup below;
`OPENAI_MODEL` defaults to `gpt-4.1-mini-2025-04-14`. A funded project, model access
and outbound network are needed; each submission can incur a small API charge.
Without configuration, or on AI failure, selection still uses the real CSV and
shows the truthful catalogue-only or mixed explanation label. This is real-data
fallback, not a fixture mode. Restart after changing configuration or correcting
an unavailable catalogue: loading failures are retained until restart.

```powershell
node scripts/slice/live.mjs
```

This optional command makes one billable dense-domain request and prints only
public output and sanitized evidence metadata. Full acceptance additionally
requires manual source/relevance/distinctiveness review. A fallback is not a live
quality pass. Domain checks, browser evidence and delivery status are recorded in
[the P01 task card](openspec/changes/first-working-slice/tasks.md).

Scope limits: no language/duration controls, date-change comparison narrative,
booking, persistence or AI quality ranking. Rare/final live samples and the final
three-request timing series belong to later stages. This is not a final submission
readiness claim.

## Secrets setup for organizers

Requires Node.js 24.4.1 or compatible Node.js 24. These commands need no
additional packages. Run from the repository root:

```powershell
node scripts/secrets/setup.mjs
```

This creates one root `.env` from [.env.example](.env.example). An existing
`.env` is left unchanged. Open the file locally and fill the settings you use:

| Setting | Purpose | Required when |
| --- | --- | --- |
| `OPENAI_API_KEY` | OpenAI API credential | A server operation uses OpenAI |
| `NVIDIA_API_KEY` | NVIDIA API credential | A server operation uses NVIDIA |
| `DATABASE_URL` | Database connection URI, including credentials if needed | A server operation uses a database |

The selected contractor-selection MVP does not use a database. The reserved
`DATABASE_URL` setting is only for a future explicitly scoped integration.
Quote values containing `#` or
whitespace. Values are literal; references such as `${OTHER_VARIABLE}` are
not expanded. Add future secrets to the same file and document their empty
entries in the template.

Check the settings needed for your scenario. For example, to check all three:

```powershell
node scripts/secrets/check.mjs OPENAI_API_KEY NVIDIA_API_KEY DATABASE_URL
```

For OpenAI alone, pass only `OPENAI_API_KEY`. A successful check exits with
code 0 and says required settings are present. Missing or blank values exit
with code 1 and name the missing settings without printing their values.
Running without names shows usage and fails. This checks presence only;
it does not validate credentials, contact providers, or connect to a database.

Existing process environment variables take precedence over the file, including
blank values (which fail validation). This also supports deployments supplying
all settings through their environment without a file. The scripts locate the
root file relative to their own location, independently of the working directory.

Keep the filled `.env` out of Git, public archives, screenshots, logs, and
browser code. Git ignores `.env` and its variants but cannot prevent a forced
add. The file is plaintext: restrict local access. Organizers can use their own
credentials. If team credentials are provided, transfer the file separately
through an agreed private channel; never put them in a repository or public link.
Only the empty template belongs in the repository.

### Server integration

The server composition calls
the reader before external operations and passes only the required values to
the corresponding adapters:

```javascript
import { loadSecrets } from './back/config/secrets.mjs';

const { OPENAI_API_KEY } = loadSecrets({ required: ['OPENAI_API_KEY'] });
// Pass the value to the server adapter; never log or return it to a client.
```

The import above is relative to a server entry point in the repository root.
The reader returns a frozen object containing only the requested names; it
does not mutate `process.env`. Errors have a stable `code`, a safe `message`,
and a `requestId`. Browser modules must not import `back/config/`; names
starting with `NEXT_PUBLIC_` are rejected. The P01 task card records application integration separately from the original secrets checks.

Run the focused checks with synthetic temporary credentials:

```powershell
node --test scripts/secrets/secrets.test.mjs
```

Current requirements and verification status:
[OpenSpec tasks](openspec/changes/unified-local-secrets/tasks.md).

## OpenAI server adapter

Requires Node.js 24 and a funded OpenAI API project with model access. No SDK,
GPU or additional npm installation is required for this module. Run the secrets
setup above and fill `OPENAI_API_KEY` privately. `OPENAI_MODEL` is optional;
absent or blank selects `gpt-4.1-mini-2025-04-14`.

```powershell
node scripts/openai/check.mjs
node --test scripts/openai/contract.test.mjs
```

The first command makes one billable live request with a fixed benign prompt.
Expected: JSON with `ok: true`, `mode: live`, the model, token usage and duration.
It prints neither the key nor provider response contents. The second command
uses synthetic credentials and a local test server; it incurs no provider cost.

From a server module at the repository root:

```javascript
import { createOpenAIFromEnv } from './back/ai/openai.mjs';

const openai = createOpenAIFromEnv();
const result = await openai.generate({
  input: 'Summarize the supplied text.',
  instructions: 'Use only facts from the input.',
  maxOutputTokens: 450,
  // signal: callerAbortSignal,
});
// Use result.text; do not log private inputs or secrets.
```

`generate` also accepts developer-controlled `format: { name, schema }` for
strict JSON-schema output. The caller must parse and validate domain data.
Results include `text`, `provider`, `mode`, `model`, `responseId`, `requestId`
and optional `usage` with input/output/total token counts. Errors have a safe
`message`, stable `code` and `requestId`. Codes distinguish configuration/input,
authorization, rate/quota limits, rejected requests, provider unavailability,
invalid/incomplete/refused responses, network failures, timeout and cancellation.
The live check exits nonzero and prints the code on failure.

Calls use Responses with `store: false`, a six-second deadline including body
consumption, caller cancellation, zero retries and no fallback. Local cancellation
does not guarantee cancellation of provider billing. Never import this Node-only
module into browser components. This verifies transport access; application
routes, contractor selection and UI integration are recorded separately in the P01 task card.
See [adapter requirements and evidence](openspec/changes/openai-response-adapter/tasks.md).

## Brev GPU access

The existing `dreams-gpu` environment is infrastructure for a future specialized
GPU workload. These commands verify access and CUDA computation; they do not
provide a product inference API or an OpenAI adapter.

On Windows, install Ubuntu if absent:

```powershell
wsl --install -d Ubuntu-22.04 --no-launch
```

Install the official Brev CLI in that distribution (observed version v0.6.335):

```powershell
wsl -d Ubuntu-22.04 -u root -- bash -lc 'curl -fsSL https://raw.githubusercontent.com/brevdev/brev-cli/main/bin/install-latest.sh -o /tmp/brev-install.sh && BREV_INSTALL_DIR=/usr/local/bin bash /tmp/brev-install.sh'
```

Create the local `.env` with the secrets setup command above and privately add
`BREV_API_KEY`. This is a Brev organization key, distinct from NVIDIA hosted-model
and NGC credentials. The operator wrapper passes it via process environment;
it does not require putting the key in command history. In this Windows setup,
Brev configuration belongs to root inside Ubuntu-22.04. On Linux, install Brev
for the current user; the wrapper invokes it directly (Linux route not verified).

From the repository root:

```powershell
node scripts/brev/run.mjs status
node scripts/brev/run.mjs refresh
node scripts/brev/run.mjs gpu
node scripts/brev/run.mjs setup
node scripts/brev/run.mjs smoke
```

Expected: the environment is `RUNNING`/`HEALTHY`, the GPU command reports L40S,
and smoke returns JSON with `status: passed`, `mode: live`, and `result_value: 256`.
Setup explicitly installs PyTorch 2.13.0 with CUDA 12.6 and NumPy 2.2.6 in
`/data/dreams-gpu/.venv`; it records resolved packages in
`/data/dreams-gpu/installed-requirements.txt`. It requires an Ubuntu GPU VM,
noninteractive sudo and an existing `/data` disk. The active VM is already set up.
Both SSH and outbound access to official package sources must be available.

Use another existing environment with `--instance NAME` before the operation.
Trusted operator commands can be run with
`node scripts/brev/run.mjs exec "python3 --version"`.
The wrapper exits nonzero on failures and times out after 120 seconds (setup:
600 seconds); timeout does not guarantee cancellation on the remote machine.
Never expose this operator command through the application or run commands that
print credentials. First-time SSH access can require `brev login` if the account
does not support the API-key/certificate flow verified here.

The selected portal rate was $1.77/hour: $1.74 compute plus $0.03 storage.
Use Stop in the Brev portal after use; storage continues billing while stopped.
No instance is created, stopped, deleted, or publicly exposed by these scripts.
See [verification and outstanding product work](openspec/changes/brev-gpu-access/tasks.md).
