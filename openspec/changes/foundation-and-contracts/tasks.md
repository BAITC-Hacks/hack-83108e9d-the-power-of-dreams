## 1. P00 contracts and base

- [ ] 1.1 Freeze public/module types and material examples (F1/F2); verify typecheck and focused fixture consistency checks.
- [ ] 1.2 Prepare minimal pinned dependencies and actual commands (F3); verify npm ci, npm ls, typecheck and existing tests from a clean committed candidate following README.
- [ ] 1.3 Record downstream obligations and publish P00 (F4); strict-validate, review allowed diff, confirm feature/main SHAs and preserve evidence. Sync/archive follows completed delivery.

## Assignment and authorization

Owner: coordinator Codex task 01a0cdae-6531-7562-88e0-38462fca5eed, sequential work; no workers dispatched. Active implementation change: foundation-and-contracts. Other changes and draft are not resumed.

Worktree: D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-00. Branch: codex/cs-00-foundation. Initial base: fd432c682d46e2a46cb003ddbeb5d4537d19438c. Reconciled base before Git writes: 7880712621befeb8d7340f0dccde44574a0e0d8c (another task published only the approved brainstorming source; local branch and remote main both include it). Remote origin: https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams.git. Target: main.

Allowlist: this change and its eventual archive/spec; .brainstorming/2026-09-23-foundation-and-contracts-design.md (approved source); contracts/; back/domain/types.ts; back/recommend/ports.ts; scripts/contracts/; package.json; package-lock.json; tsconfig.json; README.md foundation sections; architecture/README.md foundation link; docs/tooling.md scoped evidence. No changes to raw data, existing secrets/transport, old changes or the untracked MVP draft. All-stage implementation and normal publication authorized by current request and AGENTS.md; historical preparation holds were superseded in .proposals/README.md. No new publication prohibition.

Harness revision: fd432c682d46e2a46cb003ddbeb5d4537d19438c (AGENTS.md, .codex/config.toml, .agents/skills/openspec-*, openspec/config.yaml); compare actual content before handoff. Selected role: coordinator, no live subagent check claimed. Existing preparation reused: secrets/transport modules and tests, data, stack, project harness from 7d611a971e48b89c26776e6f10dbb4f5bfba7ee2 and follow-up record at base. No immutable frontend package exists or is required at P00.

Checks: strict OpenSpec validation; npm ci; npm ls --depth=0; npm run typecheck; npm test. Expected: example compatibility/invariants and existing controlled secrets/transport pass without .env or network provider calls. Check installed Next CLI script flags; application build/launch/primary browser scenario and domain live sample are not_run (P01–P07, no application in P00). Own node_modules and outputs per worktree; tests use temporary synthetic data and no listening application port. Shared integration path is exclusively reserved as recorded below.

## Stage table

| Task | Stage | Evidence/revision | Remaining checks | Hold/blocker | Next action/owner |
| --- | --- | --- | --- | --- | --- |
| 1.1 | implemented | typecheck + 3 fixture checks passed | clean candidate/publication | none | coordinator integrate |
| 1.2 | implemented | npm ls, script help and 13 tests pass | clean npm ci/candidate | none | coordinator verify |
| 1.3 | implementing | strict validation and doctor pass; downstream plan preserved | publication/archive | none | coordinator integrate |

Checkboxes measure final delivery. Do not reimplement locally verified work merely because publication remains.

## Handoff and scope limits

P01 owner: next coordinator, not dispatched. Pin the published P00 implementation SHA recorded below and read contracts/examples plus design. No competing writer after handoff. Before P01 reconcile the actual deadline, remaining budget and the protected 60-minute P07 reserve; no old four-hour clock is restarted. Design contains untimed estimates and deadline-minus-reserve rule. P01–P07 remain planned; every required dense/rare live-sample criterion remains not_run, without model/data/source-execution metadata fabricated for an unexecuted check.

## Execution evidence

2026-09-23 local implementation: npm install added only csv-parse 7.0.2; all existing dependency pins retained. npm audit reported zero vulnerabilities. npm ls --depth=0 passed. npm run typecheck passed; npm test passed 13/13 (3 fixture consistency, 4 secrets, 6 controlled transport). Node 24.4.1/npm 11.4.2. Next 16.3.6 dev/build/start --help accepted documented flags; no application process/build claimed. OpenSpec strict validation and doctor passed. Context7 resolved/read Next.js CLI and TypeScript compiler options; indexed docs are not pinned-version execution proof. Native Node emitted a non-failing module-type inference warning for .ts fixtures; package module mode remains unchanged.

Harness diff against fd432c6 is empty; actual required root config and skill files are present. No delegated-runtime readiness claim. Existing draft remains untracked and excluded. Application build/start/browser, catalogue/selection/evidence implementation and live domain AI are not_run by P00 scope. No secrets read and no billable calls.

Shared reservation acquired exclusively by 01a0cdae-6531-7562-88e0-38462fca5eed for sibling integration worktree and main. Marker: D:/Alem/hack-83108e9d-the-power-of-dreams/.shared/integration-owner.json. No shared frontend package reserved or published.
