# hack-83108e9d-the-power-of-dreams
Hackathon team repository for «The Power of Dreams»

## Environment setup

Install the prepared web-stack dependencies from the repository root.
The current environment uses Node.js 24.4.1 and npm 11.4.2.
Exact package versions are pinned in `package.json` and `package-lock.json`.

```powershell
npm ci
npx playwright install
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

The application, application check configurations, and build/run commands have not been
created yet. Python libraries, data storage, and an external AI SDK will be
added after the challenge is selected.

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

No database engine or product scenario is selected yet. Use the URI format
required by the eventual database driver. Quote values containing `#` or
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

The application does not exist yet. Its future server entry point must call
the reader before external operations and pass only the required values to
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
starting with `NEXT_PUBLIC_` are rejected. No application startup or live
service integration is claimed by this change.

Run the focused checks with synthetic temporary credentials:

```powershell
node --test scripts/secrets/secrets.test.mjs
```

Current requirements and verification status:
[OpenSpec tasks](openspec/changes/unified-local-secrets/tasks.md).
