# Agent development tools

Configured and verified on 2026-09-23 using Windows, Node.js 24.4.1, and npm 11.4.2.

## Installed tools

| Tool | Version | Configuration |
| --- | --- | --- |
| OpenSpec | 1.11.0 | Reused the existing global installation and initialized the project for Codex |
| Context7 CLI | 0.5.10 | Kept the existing global installation; documented queries were also verified with `npx ctx7@latest` (0.5.12) |
| Context7 MCP | Server reported 4.1.1 | Added the official HTTP endpoint to `.codex/config.toml` |
| CodeGraph | `@colbymchenry/codegraph` 1.6.0 | Kept the existing installation and MCP configuration; created the project index |

If needed, reinstall these versions on another machine with:

```powershell
npm install -g @fission-ai/openspec@1.11.0 ctx7@0.5.10 @colbymchenry/codegraph@1.6.0
```

These are development tools and are not product runtime dependencies. After cloning the repository, create the CodeGraph index locally. The commands must be available on the Codex process PATH.

## Frontend design skill

The custom `frontend-design` skill for Codex was installed on 2026-09-23:

- Source: [anthropics/skills — frontend-design](https://github.com/anthropics/skills/tree/34040c9c568585f6929bedeaad110ad08f079624/skills/frontend-design).
- Pinned revision: `34040c9c568585f6929bedeaad110ad08f079624`.
- Installation path: `C:/Users/Ramazan/.codex/skills/frontend-design/` (also available to the user outside this project).
- The standard `skill-installer` installed it from GitHub at the specified revision. The installation and `SKILL.md` contents were checked, and `LICENSE.txt` was installed. The upstream instructions were not modified.
- These skill-format instructions work in Codex with OpenAI models; they do not require Claude, an Anthropic subscription, or an Anthropic API key. Installation does not automatically attach the skill to arbitrary OpenAI API applications.
- To reinstall it, ask `skill-installer` to install `skills/frontend-design` from `anthropics/skills` at the pinned revision. Do not create a second copy if the skill is already installed.
- The skill is available from the next message and can be invoked explicitly as `$frontend-design`. If the skill catalog does not refresh, open a new Codex session.
- Its usage conditions and integration with brainstorming → OpenSpec are defined in the `Frontend UI design` section of `AGENTS.md`.

Installation and workflow compatibility were checked. Actual UI generation, design quality, and speed improvements have not yet been verified in this project; application dependencies were unchanged.

## OpenSpec

Commands run:

```powershell
openspec init --tools codex --profile core --language English --no-animation
openspec doctor --json
openspec list --json
openspec schemas --json
```

Result: a valid local root, the `spec-driven` schema, and an empty product-change list. The schema includes proposal, specs, design, and tasks. No product change was created because the challenge track has not been selected yet.

The standard generator created six skills in `.agents/skills/`: `openspec-explore`, `openspec-propose`, `openspec-update-change`, `openspec-apply-change`, `openspec-sync-specs`, and `openspec-archive-change`. They use the installed OpenSpec version; no additional custom skill is needed for the same operations.

Once the task brief is available, start with `brainstorming` and record its approved outcome, then use `$openspec-propose` and `$openspec-apply-change` under AGENTS.md's authorization rules. An already approved implementation request does not require another message solely to enter apply. Validate a specific change with `openspec validate <name> --strict --no-interactive`; an empty specification repository does not prove that product requirements pass.

### Project configuration alignment (2026-09-23)

`openspec/config.yaml` supplies repository structure and coordinator ownership through `context`, artifact requirements through `rules`, and apply/archive advice through `operations.*.guidance`. Detailed delegation, task-card, and publication rules remain authoritative in AGENTS.md. At this initial verification the shared context was 1,380 UTF-8 bytes; later configuration edits are recorded below. Role prompts and full project policies are not duplicated into it.

Verification used the installed OpenSpec 1.11.0 parser and strict `ProjectConfigSchema`: all fields were accepted without being dropped. Read-only `openspec instructions <id> --change unified-local-secrets --json` calls were checked for `proposal`, `specs`, `design`, `tasks`, `apply`, and `archive`. All six returned the configured context; artifact rules and operation guidance appeared only on their respective instruction surfaces. The comparison accounts for the artifact loader's documented-in-source trimming of surrounding whitespace. Non-configuration output, including built-in instructions and apply state/progress, matched the baseline. SHA-256 checks confirmed that the existing change files were unchanged. `openspec doctor --json` reported a healthy root.

These checks establish instruction delivery, not live subagent behavior or acceptance of the existing change. Configuration does not rewrite existing artifacts automatically, run subagents, or enforce Git publication; agents apply the project agreements. No change was implemented, archived, or marked complete by this verification. Generated skills and the standard schema were not modified.

Reference: [OpenSpec project configuration](https://github.com/Fission-AI/OpenSpec/blob/main/docs-lab/reference/configuration/config-yaml.md).

## Context7

The CLI successfully resolved the OpenSpec and CodeGraph libraries and returned documentation. MCP was verified with a separate client: initialization, tool listing, `resolve-library-id` for Next.js, and `query-docs` all returned valid results without a personal API key.

Recheck MCP with:

```powershell
node scripts/tooling/check-context7.mjs
```

The CLI remains the normal route under `AGENTS.md`. Read-only roles instead use the configured MCP or an already installed CLI without installation; they do not bootstrap or update tools with `npx`. Neither route is a reason to duplicate successful requests. Public limits may change; use Context7 authentication if the quota is exhausted. No secrets were added to the project.

## CodeGraph

The already installed `colbymchenry/codegraph` was selected. The initial strategy discussed a different project with the same name; instructions for that project do not apply here.

`codegraph init --yes` was run. Verification on a temporary TypeScript project confirmed:

1. Initial indexing and function lookup.
2. Index refresh and lookup of an added function after `sync`.
3. MCP initialization, `tools/list`, and `tools/call` for `codegraph_explore`, including returned source code.

Recheck with:

```powershell
node scripts/tooling/check-codegraph.mjs
codegraph status --json
codegraph sync
```

The verification script uses its own temporary directory and disables the daemon only for test processes. It does not modify product code. The first run found that a background process retained the temporary directory; the rerun with the test daemon disabled passed completely, including cleanup of its directory.

## Codex integration

### Subagent context and handoff verification (2026-09-23)

The communication contract is defined in [AGENTS.md](../AGENTS.md#subagent-context-and-handoff) and referenced by all five project roles. It covers explicit history-free dispatch, scoped artifact reads, coordinator-owned OpenSpec workflow, compact evidence-backed results, and delta-only follow-ups.

Python `tomllib` parsed `.codex/config.toml` and all five `.codex/agents/*.toml` files successfully. Focused checks confirmed required role fields, shared-contract references, unchanged models and concurrency, retained read-only declarations, and coordinator ownership of task checkboxes. The generated OpenSpec skills were inspected for workflow compatibility and left unchanged; the coordinator still reads their required context, while delegated workers execute scoped assignments.

These are configuration and instruction checks. No live subagent exchange or product scenario was run, and reduced context size or reliable brevity has not been measured. The role names were available in the current session before editing; that does not prove already loaded roles have refreshed their instructions. Fresh dispatch must explicitly use the shared contract; verify loading in the next session if behavior remains stale. These tooling edits were not committed or published with the unrelated repository preparation files.

### Harness consistency update (2026-09-23)

The user approved applying the harness audit recommendations. The original outcome
is recorded in [the brainstorming artifact](../.brainstorming/2026-09-23-harness-consistency-design.md).
Current rules live in [AGENTS.md](../AGENTS.md), with corresponding OpenSpec and role
instructions; generated OpenSpec skills remain unchanged.

The update clarifies retained authorization, intermediate task stages and resumption,
harness readiness before delegation, immutable versioned handoff packages, and
shared integration ownership by a concrete Codex task ID. It also permits narrowly
evidenced critical incidental review findings, clarifies explicit change switching,
and makes hourly delivery reporting conditional on organizer requirements.
The shared ownership marker is local/ignored; no marker was created during this edit.

Verification for this documentation/configuration update:

- Python `tomllib` parsed project configuration and all five role files; their
  required fields remain present. Models, reasoning levels, concurrency, and sandbox
  settings were preserved.
- The skill-creator `quick_validate.py` accepted the updated project-delivery skill.
- `openspec doctor --json` reported a healthy local root and
  `openspec validate unified-local-secrets --strict --no-interactive` passed.
- `openspec instructions` for `proposal`, `tasks`, `apply`, and `archive` returned
  the updated context. Task-stage rules and apply/archive guidance were delivered;
  apply remained `ready` with the actual delivery count of 0/4.
- Generated-skill SHA-256 hashes match the snapshot taken before this update.
- `git check-ignore --no-index` confirms that the local ownership marker is
  ignored while versioned contract packages remain trackable.
- The existing feature's stage table records earlier local evidence explicitly;
  its four delivery checkboxes remain unchecked and its publication hold remains.

AGENTS.md was reduced from 31,641 to 27,451 UTF-8 bytes while adding these rules.
This leaves more space below the default instruction limit without increasing it.
The root still requires maintenance to avoid accumulating repeated policies.

Limitations: no live worker dispatch, sandbox-isolation test, concurrent ownership
exercise, or contract-version handoff was run. The earlier audit's successful
CodeGraph CLI/sync/MCP fixture check and Context7 CLI documentation lookup were not
rerun for prose changes. These results do not establish product behavior.

The existing `unified-local-secrets` worktree still lacks the project harness;
adding a readiness rule does not populate it. The no-commit/no-push/no-merge hold
was preserved. No branch, committed base, global skill, or installed tool was
changed. Fresh role dispatch must receive the updated instructions; an already
loaded role is not proven refreshed by editing its TOML file.

### MCP integration

Both MCP servers are defined in `.codex/config.toml`; the existing roles, permissions, and agent limit were preserved. Use `codex mcp get codegraph --json` and `codex mcp get context7 --json` to confirm that the client reads these entries.

MCP checks were run with separate clients. They confirm that the servers work, but do not mean an already open conversation automatically refreshes its tool catalog. If the new tools or skills do not appear, start a new Codex session in this project. Project-scoped settings apply only in a trusted project.

Sources: [OpenSpec](https://github.com/Fission-AI/OpenSpec), [Context7](https://github.com/upstash/context7), [CodeGraph](https://github.com/colbymchenry/codegraph), [Codex MCP](https://developers.openai.com/codex/mcp).

## Brev GPU access verified 2026-09-23

Installed local WSL Ubuntu 22.04.5 and official Brev CLI v0.6.335. The portal's
`login --api-key` syntax is not advertised by this binary; BREV_API_KEY environment
authentication was verified instead. The project wrapper loads the local secret
without putting it in argv and forwards it into WSL. Brev-generated SSH certificate
access to the existing dreams-gpu VM succeeded without a separate Jupyter login.

Observed L40S: 46068 MiB, driver 565.57.01. Docker 27.3.1 and Compose v2.29.7
were already installed. Added pip/venv and isolated PyTorch 2.13.0+cu126 with
NumPy 2.2.6 under /data/dreams-gpu/.venv. The 256 GiB disk is mounted at /data;
the root disk is separate. Actual CUDA matrix multiplication passed and pip check
reported no broken requirements. No model/inference endpoint has been deployed.

The six disposable-copy checks covered CLI usage, missing credentials, live status,
GPU identification, real CUDA computation, and propagation of a remote exit code.
They passed with no secret in output. Repeatable commands are in README; detailed
evidence and remaining product work are in
[the task card](../openspec/changes/brev-gpu-access/tasks.md).
The clean committed checkout and Linux-native route were not tested. No Git
publication was performed. Existing VM remains running; no extra VM or public
endpoint was created. Jupyter browser automation reached login but was not needed
after CLI access succeeded.

Sources: [Brev installation](https://docs.nvidia.com/brev/cli/getting-started),
[API keys](https://docs.nvidia.com/brev/guides/api-keys),
[PyTorch CUDA wheels](https://pytorch.org/get-started/previous-versions/).

## OpenAI adapter verification — 2026-09-23

Added dependency-free server Responses transport using the existing secret reader.
Two real fixed-text probes passed with gpt-4.1-mini-2025-04-14 (4114ms and
2496ms; 42 total tokens). Six focused contract checks passed locally and in a
disposable copy without node_modules, .env or a personal browser session; the
copy received the key via process environment. Native fetch body timeout and
caller cancellation were exercised against a local HTTP server.

README contains repeatable setup/run commands. No application integration or
clean committed checkout is claimed; no Git publication occurred. Exact file
hashes, checks and publication hold are recorded in the
[OpenAI task card](../openspec/changes/openai-response-adapter/tasks.md).
Sources: [Responses text generation](https://developers.openai.com/api/docs/guides/text),
[GPT-4.1 mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini).

## P00 foundation checks (2026-09-23)

P01 uses the same locked stack. Context7 documentation was retrieved for Next.js
Node route handlers and runtime-only imports (`webpackIgnore`), and csv-parse's
sync/header/BOM parsing. Runtime-only import keeps the existing secrets reader's
relative `.env` URL out of bundled assets without changing the reader/transport.
Next's generated TypeScript settings are retained; `next-env.d.ts` is generated
and ignored. P01 product execution and clean-candidate evidence are in
[first-working-slice](../openspec/changes/archive/2026-09-23-first-working-slice/tasks.md).

Foundation setup retains Node 24.4.1/npm 11.4.2 and the existing pins, adding only
csv-parse 7.0.2. Context7 official Next.js CLI and TypeScript configuration docs
were consulted; installed Next 16.3.6 accepted dev/build/start help commands.
`npm ls --depth=0`, `npm run typecheck`, `npm test` (13/13 controlled checks),
OpenSpec strict validation and doctor passed in the P00 workspace. Node reports a
non-failing module-type inference warning for the typed fixtures. No product
build, launch or live provider check is claimed. Exact clean-candidate and
publication evidence belongs in the [P00 task card](../openspec/changes/archive/2026-09-23-foundation-and-contracts/tasks.md).
