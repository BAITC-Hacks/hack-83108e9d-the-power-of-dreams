# Project working agreements

## Scope and instruction precedence

- This is the official team repository for The Power of Dreams. Preserve other contributors' staged and uncommitted work.
- Use explicit user decisions, approved OpenSpec artifacts, and current configuration. Take competition constraints from the supplied task brief and organizer instructions. The track is not selected; tooling work does not authorize inventing a product.
- System/developer instructions and runtime permissions remain controlling. Within project workflows, explicit user scope and authorization take precedence over skill defaults. Loading a skill does not revoke permission already given or authorize extra work. Ask about material changes to scope, requirements, compatibility, or acceptance; do not repeat approval requests for agreed work.
- An explicitly planning-only request remains planning-only. When the user has approved the outcome and authorized implementation, proceed through the required OpenSpec stages without demanding a separate message solely because a generated skill says to stop. Apply authorized artifact revisions coherently without seeking approval for each file. Preserve CLI readiness checks and required artifacts.
- Store active requirements, change-specific design, and task state in OpenSpec. Keep project architecture in `architecture/` and update its index; link change artifacts instead of duplicating specifications in `docs/`.
- Read relevant documents only. Distinguish observed execution, historical evidence, fixtures, and unverified claims.
- Use [project-delivery](.agents/skills/project-delivery/SKILL.md) for `README.md`, `.env.example`, `THIRD_PARTY.md`, run documentation, demos, and submission checks; not ordinary module implementation or contract handoff.
- This harness is instructional, not an enforcement service. Role names, allowed paths, and TOML declarations do not prove runtime isolation. Report actual checks and limitations; do not claim a live subagent check from configuration parsing alone.

## Efficiency, boundaries, and contracts

- Choose the simplest solution that meets all agreed criteria. Avoid speculative extensibility, generic frameworks, extra layers, unrelated refactoring, and test infrastructure without a demonstrated need. Keep necessary boundaries proportional to the task.
- First verify one agreed end-to-end scenario. Test the riskiest external dependency before splitting implementation; expand scope for acceptance needs, not to keep workers busy.
- Preserve the current stack and `back/` / `front/` structure. Add dependencies or infrastructure only for an agreed criterion or confirmed constraint. Prefer fewer deployed services, external accounts, and manual setup steps while retaining required functionality.
- Domain rules must not depend on UI, framework, SDK, or storage. Keep module dependencies acyclic and wire external ports/adapters in the shared composition root. HTTP handlers validate input, invoke use cases, and format responses. Browser code uses public contracts, not server implementations or secrets.
- Shared contracts are independent of UI, database, and AI providers. Use string identifiers and ISO 8601 dates in JSON; distinguish missing values from `null`. Errors contain a stable code, clear message, and `requestId`; agree on shapes before implementing consumers.
- In OpenSpec `design.md`, define each module's purpose, public operations, inputs/outputs/errors, owned data, allowed dependencies, file owner, and verification. Describe material side effects, timeout/retry/cancellation behavior for ports where applicable.
- Before dependent parallel implementation, commit contracts, success/material-error examples, and available checks to the shared base. Providers and consumers use those examples. Pause affected work when a breaking contract changes; reconcile artifacts and pinned bases first.
- The coordinator owns shared wiring, routes, common components, dependency installs, lockfiles, configuration, and migration order. If tasks repeatedly need the same internal files, revise boundaries or execute sequentially.
- External services need explicit timeouts and bounded retries for transient failures, accounting for idempotency. Validate responses. Label any `fixture` mode in UI and README; never silently substitute it for `live`.
- Limit logs to `requestId`, operation, duration, mode, error category, and available API usage. Do not log secrets or document contents unless necessary.

## Brainstorming → OpenSpec

- Product work starts with the installed `brainstorming` skill. Save its approved outcome in English at `.brainstorming/YYYY-MM-DD-<topic>-design.md`, even when the chosen path normally produces no file. For bounded harness work, an approved audit and the user's instruction to apply its recommendations supply the outcome; do not restart the same approval discussion.
- This path replaces `docs/superpowers/specs/`. After approval, use OpenSpec stages instead of Superpowers `writing-plans` or direct product implementation. Existing approval and this project's verification policy also replace redundant approval gates and mandatory TDD defaults.
- During brainstorming or requested technical comparisons, assess organizer setup: software/resources, accounts/keys, cost, network access, and manual steps. Explain why added infrastructure is necessary and why a simpler option is insufficient. Carry relevant constraints into delegated briefs.
- For a product change, read and link the approved brainstorming outcome from `proposal.md`; transfer decisions into proposal, specs, design, and tasks. Thereafter OpenSpec is current; `.brainstorming/` preserves the original discussion outcome.
- Record run method, infrastructure, and setup assumptions in `design.md`. Include clean-checkout verification in `tasks.md`: follow README installation, configuration, build, launch, and primary scenario with expected results and no hidden files or personal sessions. Keep run documentation aligned; record actual evidence and limitations through project-delivery before submission.
- Tooling/documentation-only work uses checks relevant to its actual scope. Do not invent product requirements, require a nonexistent application build, or automatically publish unrelated preparation files.

## Frontend UI design

- Use the installed `frontend-design` skill from `anthropics/skills` for new screens or substantial visual changes. Here it is `C:/Users/Ramazan/.codex/skills/frontend-design/SKILL.md`; on another machine locate the installed skill. Source/revision are in `docs/tooling.md`.
- Read it before composition, typography, color, or hierarchy work; not for backend work, logic fixes, or small copy edits. Initial direction belongs in brainstorming, approved direction in OpenSpec `design.md`. Implementation follows that direction without a separate approval cycle.
- Preserve stack, existing components, approved references, and backend contracts. Design guidance does not authorize new product scope or dependencies.
- Finish the primary screen and agreed scenario first. Verify mobile/desktop readability, keyboard focus, and relevant UI states in a browser; record checks and limitations in OpenSpec.

## OpenSpec and task stages

- Use the local `openspec/` root and standard `spec-driven` schema; product changes do not belong in an external store. Use `.agents/skills/openspec-*/SKILL.md` for explore, propose, update-change, apply-change, sync-specs, and archive-change. Keep generated skills unchanged; project-specific adaptations live here and in `openspec/config.yaml`.
- Planning artifacts live in `openspec/changes/<change>/`; synchronized current specs in `openspec/specs/`. Write artifact prose in English with required headings and SHALL/MUST syntax.
- Select one active implementation change at a time. The coordinator may switch explicitly after recording its current stage, evidence, outstanding work, and ownership, and pausing affected workers. A session is not permanently bound to its first change.
- Discover with `openspec list --json`; inspect `openspec status --change <name> --json` and the applicable instructions. Read the skill's required context files. Preserve genuine blocked readiness; file existence is not implementation evidence. An empty list before track selection is normal.
- Validate changed specifications with `openspec validate <name> --strict --no-interactive`; structural validation does not replace execution checks.
- Keep a per-task stage table in the existing `tasks.md`: task ID, stage, evidence/revision, remaining checks, hold/blocker, next action/owner. Stages are `planned`, `implementing`, `implemented`, `committed`, `branch-pushed`, `ready-to-merge`, and `integrated`. `implemented` describes local behavior and recorded evidence, not delivery or passage of skipped checks. Record a publication prohibition as a hold alongside the achieved stage.
- For feature tasks, `[x]` means the integration/publication conditions below have passed. CLI checkbox progress therefore measures final delivery, not how many tasks are unstarted. This project meaning governs generic skill wording such as "mark complete as you go".
- Before every apply/resume, reconcile the stage table, evidence, current files/SHAs, and CLI tasks. Continue from the first unmet step; do not reimplement an unchecked task merely awaiting integration or permitted publication. Recheck evidence only when missing, ambiguous, or invalidated. Keep actual CLI counts visible; never fake completion to change them.
- Only the coordinator updates shared stages/checkboxes from worker evidence. Archive status is distinct from acceptance and publication; preserve remaining work and skips if the user explicitly archives incomplete work.

## Backend-to-frontend handoff

- After backend implementation and verification, the coordinator publishes a frontend contract package before frontend handoff. A published package or backend branch is not proof of integration into `main`.
- Canonical shared root: `D:\Alem\hack-83108e9d-the-power-of-dreams\.shared\specs`. All worktrees use this absolute root. One active author per package; the coordinator may assign an author limited to its package paths.
- `<feature>/README.md` is the English index. Publish immutable packages at `<feature>/versions/<contract-version>/`, each with its own English `README.md`. The index may point to the current version; an in-progress consumer reads only its pinned version. Do not edit an already published version; publish a new version for any package-content change.
- Each version states purpose, supported scenarios, contract version, backend branch and exact commit, verification/integration status, OpenSpec scenario links, and required artifacts. Link version-local artifacts relatively and implementation/spec sources at exact Git revisions. After archive, update current links in the mutable index; preserve published version contents and historical revision links.
- Include only consumer needs: operations/addresses, auth/permissions, request/response schemas, required/nullable fields, formats/units, validation, errors, and visible states. Add pagination, filtering, sorting, retries, events, or transitions only when they exist and affect the frontend.
- Supply one suitable contract format (public OpenAPI/JSON Schema or DTO types), minimal success/material-error examples, and necessary fixtures. Describe connection/run setup, environment-variable names without secrets, and a short integration check with expected result.
- Exclude internals, storage schemas, migrations, algorithms, and detailed logs unless they affect observable behavior. Separate actual operations from plans/mocks; state unverified cases. Browser consumers must not import internal `back/` modules for types.
- Reconcile OpenSpec and the actual interface before publishing. Commit the package before handoff; record its Git commit, versioned path, contract version, and backend SHA in the consumer's task card after that commit exists. Do not place a package's own not-yet-known commit inside itself.
- Before each frontend assignment/resume, compare the shared version directory with its pinned package commit. If absent or different, stop dependent work and have the coordinator restore the exact snapshot without overwriting another writer. Never follow an updated index silently. Verify integration against the pinned backend; mocks do not replace required real interactions. Notify dependent owners of new versions/breaking changes through the coordinator.

## Documentation and code navigation

- For the contractor-selection task, start with `domain/README.md` and load only the relevant linked documents. Treat `raw/` as a source archive: do not load it wholesale into routine context; access CSV records selectively for data work or revisit originals for source reconciliation. Keep active implementation decisions and task state in OpenSpec.
- Use Context7 for library/framework/SDK/API/CLI/cloud syntax, setup, configuration, migration, or technology-specific behavior. Ordinary refactoring, business logic, and review need no lookup unless such uncertainty arises.
- Normal CLI route: `npx ctx7@latest library "Official Library Name" "specific question"`, select the official ID, then `npx ctx7@latest docs /org/project "specific question"`. Resolve first unless given an exact ID; reuse it and use indexed versions when needed. Keep queries focused; at most three documentation CLI commands per question; send no private data or secrets.
- Read-only roles use the configured Context7 MCP (`resolve-library-id`, then `query-docs`) or an already installed CLI that works under their permissions without installation. They do not bootstrap or update tools through `npx`. If neither route works, report the gap to the coordinator. This scoped exception supersedes the normal CLI preference.
- Do not duplicate successful CLI/MCP lookups without a reason. On quota failure, report it and suggest `npx ctx7@latest login` or `CONTEXT7_API_KEY`; never silently substitute memory. Respect runtime network/approval policy and report concrete limitations when escalation is unavailable.
- CodeGraph is **`@colbymchenry/codegraph`**, not similarly named projects. Use `codegraph_explore` for symbol relationships, call paths, and change impact; use `rg` for text/files and direct reads when graph evidence is stale or incomplete.
- CLI fallback: `codegraph explore "symbol or question"`, `codegraph query <symbol> --json`. Check `codegraph status --json`; initialize a new checkout with `codegraph init --yes` and refresh with `codegraph sync`. The coordinator serializes index creation/rebuilds. `.codegraph/` database/transient files remain ignored.
- MCP starts with `codegraph serve --mcp`. For a worker worktree, pass its absolute `projectPath` to `codegraph_explore` or run the CLI there. Never treat the parent's index as evidence for another checkout. Graph navigation does not establish correctness.

## Parallel work and harness readiness

- Each independent implementation task uses a separate branch/worktree. Create worktrees directly under `D:\Alem`, as siblings of the primary checkout: `hack-83108e9d-the-power-of-dreams-wt-<task-id>` and `hack-83108e9d-the-power-of-dreams-wt-integration`. Check paths and registered worktrees first; never overwrite occupied directories or use nested/automatic tool-managed locations.
- Before implementation dispatch, verify absolute path, branch, committed base, remote, allowed paths, pinned contracts, and separate build/temp outputs, ports, and test storage. Uncommitted/ignored preparation is not part of the base. Read-only assignments may inspect an existing checkout; standalone research need not create a worktree or task card.
- Also verify the worktree contains the expected `AGENTS.md`, `.codex/config.toml`, selected role, required `.agents/skills/`, and `openspec/config.yaml`. Record their authoritative Git revision (or explicit local hashes for authorized local-only work) in the task card. Compare actual files; check required role/tool availability and runtime constraints. Changing directories does not refresh an already loaded role's instructions.
- Missing/stale harness input blocks affected delegation. The coordinator reconciles the committed base when authorized; under a no-commit instruction, continue permitted local work or report the unavailable handoff. Do not silently copy arbitrary uncommitted preparation into workers or claim reproducibility from inheritance alone.
- Delegate only independent bounded work with an explicit owner and checks, within `.codex/config.toml` concurrency. Roles `design`, `apply`, `review`, `decision`, and `research` are optional choices, not mandatory stages. Research runs only on an explicit user research request or role invocation and may have no OpenSpec change.
- One active writer per file. Workers do not import another module's internals or access its storage. Coordinator ownership of shared wiring and Git integration is defined below; repeatedly overlapping tasks run sequentially.
- After two meaningful failed attempts or roughly ten minutes without verifiable progress, return diagnosis, evidence, and options. Resume from the task card and SHAs after context loss; workers request further delegation from the coordinator.

## Shared integration ownership

- Independent Codex tasks must coordinate shared writes too. Before using the integration worktree, promoting `main`, or publishing a shared contract package, acquire the primary checkout's `D:\Alem\hack-83108e9d-the-power-of-dreams\.shared\integration-owner.json` through exclusive file creation that fails if it exists. Do not use a check-then-overwrite sequence.
- The marker contains only the owning Codex task/thread ID, change name, absolute task-card path, reserved resources, and acquisition time in UTC. It is an ignored local ownership pointer, not a second task board or proof of acceptance. Record the same owner ID in the OpenSpec task card.
- If occupied, contact/inspect the recorded owner and wait or work elsewhere; never assume that being another "primary agent" grants ownership. An assigned package author acts under that owner's reservation. Independent feature worktrees may continue.
- Release only your own reservation after shared writes/processes stop. Transfer by the current owner releasing and the successor acquiring, then updating its card. A missing response or elapsed time is not a lease expiry: recover a stale marker only after confirming the old task and its writers have stopped. Report uncertainty instead of taking over.
- This protocol coordinates cooperating agents; it is not an OS security boundary. Do not create a marker merely for read-only inspection or unrelated documentation edits.

## Subagent context and handoff

- The coordinator owns the selected change, full OpenSpec workflow, shared task state, and integration. Workers receive bounded assignments, not the entire remaining workflow.
- Start new workers with `fork_turns="none"` and a self-contained assignment. This excludes conversation history, not runtime/project instructions. If unsupported, use a documented equivalent or report the limitation. Reuse a worker only for a compatible workstream/pinned context; follow-ups carry changed criteria, revisions, and results only.
- Keep assignments in the existing task card; dispatch its absolute path/section, objective, scope, essential decisions, and expected evidence. Include effective authorization and prohibitions, especially any no-commit/no-push instruction, rather than relying on omitted conversation history.
- The coordinator reads required skill context and supplies readiness, relevant artifact sections, checks, and pinned contracts. Workers do not rediscover changes, run the whole apply workflow, edit shared task state, ask the user independently, or spawn more workers. Material missing/conflicting input goes to the coordinator before dependent edits.
- Workers read only assigned context and necessary surrounding code/tests. If contracts/artifacts change, pause affected work and reconcile the assignment first. Use the assigned worktree explicitly for reads, writes, commands, and graph queries; a spawn prompt does not change tool working directories.
- Return the fields below in the user's language, normally within 250 words excluding necessary paths, SHAs, commands, and links. Omit inapplicable fields, group supported criteria, and retain all failures/skips/material uncertainty. No activity diary, reasoning transcript, full diff, raw logs, or optional improvement list; a short blocker excerpt is fine.
- Intermediate messages report blockers, conflicts, checkpoints, or results that unblock others, subject to runtime progress-update requirements. The coordinator persists evidence and forwards only what dependent workers need.

Assignment fields:

```text
Task: change + criterion/task IDs; objective; owner role and Codex task ID
Scope: absolute worktree; allowed paths; branch/base/remote/target main
Context: artifact sections; harness revision/hashes; package version/path/commit and backend SHA
Authorization: permitted actions; current user prohibitions and holds
Checks: commands/manual steps + expected results; run mode/ports/data
Dependencies: readiness; shared reservation owner when needed; checkpoint/stop conditions
Return: applicable handoff fields
```

Handoff fields:

```text
Status: task ID + actual stage or role verdict; hold/blocker if any
Result: met / remaining criteria; artifacts or decisive finding
Evidence: criterion -> check/source -> observed result; mode; skips
Revision: worktree/branch; tested and committed SHA; confirmed remote SHA; uncommitted work
Next: integration needs; required action and owner
```

## Automatic feature completion and reporting

- Assigned feature tasks have standing authorization: workers commit/push their own accepted changes; the coordinator verifies integration and publishes `main`. Explicit user restrictions override this default and travel in task cards. Research, planning, and unrelated preparation are not automatically included in feature commits.
- Before Git writes, compare actual worktree, branch, base, allowed files, and remote with the card. Workers never operate on `main` or detached HEAD. The coordinator owns other Git operations, worktree creation, and integration.
- After assigned acceptance checks pass, review the entire staged diff and commit only allowed files. Never use unscoped `git add .` / `git add -A` or include others' staged content, secrets, outputs, or temporary files. If unrelated edits could affect results, verify an isolated committed revision. Tie evidence to exact content/SHA; rerun affected checks after executable changes. No empty/duplicate commits.
- Push normally with an explicit remote/destination to the assigned feature branch; confirm the remote head equals the commit. On failure preserve the commit and report the stage/blocker. Never force-push, change remotes, bypass protection, reset away data, or independently merge/push `main` as a worker.
- Under the shared reservation, the coordinator builds one candidate sequentially from current agreed `main` and exact accepted feature SHAs. Include only accepted work; resolve conflicts without altering requirements. Return semantic ambiguity to the owner. Freeze candidate writes during acceptance, verify affected contracts, build, README launch, and the agreed end-to-end scenario with real module connections; run mandatory live cases separately.
- A passing candidate is `ready-to-merge`; proceed to promotion without an extra approval queue. Compare local/remote `main`; fast-forward from the checkout that owns the branch. If that checkout has unrelated changes, do not erase, stash, or commit them: preserve the candidate and report the blocker. If `main` advances or a push races, incorporate the new base and repeat affected acceptance checks. Follow required PR/check workflows without bypassing protection; report the PR and waiting condition.
- Push remote `main` normally and confirm its history contains the verified candidate. Only then mark `integrated` and check feature tasks. A local merge with failed push stays unpublished. Resume by reconciling current Git state and saved evidence, not repeating commits/merges.
- In the existing `tasks.md`, record stages, met/remaining criteria, checks/skips, feature/published SHA, integration SHA, local merge/remote push, holds/blockers, and next owner. Publish report-only updates separately from product code when authorized; they do not require rerunning unchanged product cases. Never record a commit's own not-yet-known SHA inside itself.
- Feature completion reports use `Feature | Criteria met | Checks | Branch / SHA | main status | Blocker / next step`. Allowed delivery statuses: `MERGED AND PUBLISHED`, `BRANCH PUBLISHED, INTEGRATION INCOMPLETE`, `READY TO MERGE, BLOCKER: ...`, `MERGED LOCALLY, PUSH FAILED`, `NOT READY: ...`. Do not apply this product-release format to a read-only audit or documentation-only request.
- Keep feature branches/worktrees until publication is confirmed, the report is saved, and required uncommitted files are absent. Report skipped checks and live-service limitations; fixtures or isolated worker passes do not prove the integrated application works.

## Verification and tool maintenance

- Before implementation choose the smallest sufficient checks for explicit acceptance criteria, reusing existing ones. New tests must verify observable requirements or reproduced defects, not mirror implementation. Record manual/live steps and expected results first. Test count and coverage are not goals.
- Dedicated unit tests/TDD are not mandatory for each function. Use inspection plus sufficient existing/reproducible checks for simple behavior; confidence alone is not evidence. Prioritize public contract/module interaction checks and the combined candidate. Do not duplicate layers without distinct evidence needs or build generic runners/mock systems solely for testing.
- Review reports concrete acceptance failures or missing required evidence with reproduction/location. Style, naming, cleanliness, optional refactoring, and speculative cases are not blockers. A separate reviewer/decision agent is optional.
- Exception: report a concrete incidentally discovered critical security, secret-exposure, or data-loss defect even without a matching criterion. Give location, evidence, impact, and minimal next action; label it separately. Do not expose secrets, perform a harmful reproduction, or broaden the review into an unsolicited audit. The coordinator assesses impact before promotion; do not silently waive the finding.
- After success, stop. Repeat/extend checks only for changed criteria, changed executable content, missing/invalid evidence, or a reproduced relevant defect (including the critical exception). After a repair recheck the failure and affected cases, not a fresh broad review. Never count unavailable/skipped checks as passed.
- Store tooling setup and actual verification in `docs/tooling.md`. `node scripts/tooling/check-codegraph.mjs` checks disposable indexing/sync/MCP; `node scripts/tooling/check-context7.mjs` checks the public MCP endpoint and consumes documentation requests. `openspec doctor --json` checks the root. Read application commands from current `package.json`; do not claim planned scripts exist.
- Keep this always-loaded file concise; put task-specific detail in the existing task card and workflow-specific detail in its skill. Check UTF-8 size when extending it; leave room below Codex's default instruction limit rather than treating that limit as a target.
