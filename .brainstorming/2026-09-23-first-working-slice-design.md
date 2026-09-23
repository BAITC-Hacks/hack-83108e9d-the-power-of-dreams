# P01 — First working slice

## Approved outcome and scope

On 2026-09-23 the user requested brainstorming for [P01](../.proposals/01-first-working-slice.md), supplied the existing [P00 foundation design](2026-09-23-foundation-and-contracts-design.md), and approved the recommended first-screen scope and visual direction below. Reuse the [approved architecture](2026-09-23-contractor-selection-architecture-design.md); do not restart foundation or provider design.

The result is one real browser request through CSV, deterministic selection, OpenAI evidence extraction, local explanation rendering and HTTP. Its implementation remains part of the MVP, not a disposable prototype. This document records the approved planning outcome; it does not claim implementation, live checks or publication. Active requirements and task state subsequently belong in OpenSpec.

On 2026-09-23, during implementation, the user superseded the earlier timing constraint: the user controls the schedule. Do not ask for a deadline, reconcile remaining time, or enforce a four-hour limit or 60-minute reserve. Preserve the agreed scope and required verification independently of timing.

## Foundation dependency and OpenSpec transfer

The P00 design supplies normalization, JSON fields, comparison context, module boundaries, failure policies and live-evidence criteria. P00 is now completed and archived. Its accepted implementation base is `9327715f06f7729ae58d4f322a8cf044f5a35c7a`, with public contract v1. Read the [archived P00 design](../openspec/changes/archive/2026-09-23-foundation-and-contracts/design.md), [materialized public types](../contracts/contractor-selection.ts) and [contract examples](../contracts/examples/README.md); reuse these interfaces rather than redesigning them. At this reconciliation, P01 HEAD `8ecba1901a434cb4c0c0f6a710d804bdc6ab825c` contains that base, with unchanged P00 contracts and backend code.

Historical inspection during the original discussion found untracked `foundation-and-contracts` and `contractor-selection-mvp` drafts in `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-00`. The foundation proposal records a subsequent user decision to make P00 a separate change and preserve the older MVP draft as reference. This supersedes the earlier proposed single-change placement for P00. Neither draft was edited by that discussion; the completed P00 status above supersedes this historical readiness observation.

Before the next OpenSpec write, verify that the accepted foundation base and frozen interfaces remain unchanged, and reconcile ownership of any reference draft being consulted. Link this approved outcome from the product proposal and carry its decisions into specs, design and P01 tasks. Preserve the reference draft and avoid a duplicate foundation change. Do not infer permission to overwrite another task's files. Later stages retain their existing acceptance obligations; deferring a UI feature here does not remove it from the MVP.

## Approach

Use the existing boundary-first architecture: accepted P00 contracts, then one sequential real slice, then incremental completion of modules. A standalone monolithic prototype would require replacing working code and would not satisfy the agreed handoff. Expanding immediately to every UI feature would consume the time reserved for external-dependency and end-to-end verification.

One coordinator owns P01 sequentially. The existing branch/worktree are `codex/cs-01-slice` and `D:/Alem/hack-83108e9d-the-power-of-dreams-wt-cs-01`; verify the current branch and accepted P00 ancestry, then continue in this worktree. The P01 application binds to `127.0.0.1:3101`. This stage-specific port does not change the general documented default of 3000. Keep build/temp output in the assigned worktree.

Reuse the pinned stack, existing secrets boundary and OpenAI transport. One local application and the supplied CSV are sufficient. No database, extra service, GPU, provider router, cache, additional cloud account or automatic NVIDIA failover is introduced. Setup requires compatible Node.js/npm, installed locked dependencies, repository data and, for live evidence, network access and a funded OpenAI key with model access. Key availability and historical transport probes do not prove domain extraction quality. Read secrets and make paid calls only during authorized implementation through the existing boundary.

## Approved first-screen scope

P01 exposes five editable required fields: city, event date, event format, contractor category and budget in KZT. Populate catalogue choices from the real options endpoint. Submit with the Russian action label `Подобрать`; do not call AI on each field edit.

Display up to three result cards with name, category, city, starting price, explanation, calendar information and catalogue quality/provenance labels. Explain eligibility and price ordering without presenting an AI quality score or implying booking confirmation. Show price as `от … ₸` and describe absence of a busy mark in the supplied calendar rather than guaranteed availability.

Calendar information is the caption `Нет отметки занятости на [дату] в календаре набора`, using `normalizedRequest.date` from the successful response displayed with those cards. It does not require a calendar widget, full calendar data or a new public card field; preserve public contract v1.

Include loading, field validation, service errors, normal empty results and truthful aggregate explanation modes. Prevent duplicate submissions while pending; do not present failed or stale requests as fresh successful results. Preserve the established cancellation contract. No diagnostic filesystem paths, provider payloads or implementation vocabulary belongs in the user-facing errors.

Language and duration controls, and explanations comparing replacements after a date change, are deferred to P06. Existing request/response contracts continue to support those later features. P01 does not send absent optional values as `null`. The date field still submits a fresh request normally; P01 does not promise a comparison narrative.

## Approved visual direction

Use a calm working tool for an event organizer. On desktop, place the form on the left and results on the right. On mobile, place the form above the results. Keep content left aligned and omit a separate promotional hero screen. Make the reason a contractor fits the request the strongest content within each result, alongside a readily visible name and starting price. Secondary calendar and provenance information follows it.

| Token | Value | Role |
| --- | --- | --- |
| Page | `#FFFFFF` | Main background |
| Form surface | `#F3F5F7` | Quiet form grouping |
| Text | `#202936` | Primary copy |
| Accent | `#2457C5` | Main action and focus treatment |
| Border | `#D9DFE7` | Structural separators and control edges |

Use a system font stack supporting Cyrillic, with no externally fetched font requirement. Establish hierarchy through size, weight and spacing; avoid decorative badges, invented ratings and animation that delays results. Ensure readable mobile/desktop layouts, visible keyboard focus, explicit input labels and understandable error placement. The installed frontend-design skill informed this direction; preserve it during implementation without a new approval round.

## Components and data flow

| Boundary | P01 responsibility | Dependencies |
| --- | --- | --- |
| `back/catalog/` | Load real CSV into a validated immutable snapshot and expose global options | Filesystem/parser and P00 domain types |
| `back/domain/` excluding frozen types | Pure filtering, exclusive rejection counts and stable price/ID ordering | Plain shared data only |
| `back/ai/evidence/` | Select and validate evidence for at most three selected profiles | Frozen evidence port and existing OpenAI transport |
| `back/recommend/` excluding frozen ports | Orchestrate selection/evidence and render public factual explanations | Injected catalogue/evidence ports and pure domain operations |
| `back/composition.ts`, `back/http/`, `src/app/` | Wire adapters; expose thin same-origin operations and page shell | Server adapters, public contracts and frontend composition |
| `front/` | Required form, result cards and basic visible states | Public JSON contracts and same-origin HTTP only |

All these implementations have one P01 owner. Shared contracts/configuration remain coordinator-owned; reconcile a necessary change before consumers proceed. Browser code never imports backend implementation or receives full descriptions, calendars or secrets. The composition root alone connects concrete adapters. Do not duplicate the existing transport.

Preserve P00 behavior: one retained catalogue loading attempt per process; safe typed expected failure; fresh request IDs; no hidden reload/retry. A missing or invalid catalogue yields the specified 503 response rather than invented data. Expected AI-configuration failures disable evidence only, leaving catalogue selection operational.

For evidence, make at most one provider call for the selected batch, with a six-second deadline including response consumption and zero automatic retries. Validate the envelope and exact ID set before per-card quotes. Batch failures cause all-card fallback; an unusable quote in a valid batch affects only its card. Cancellation propagates without rendering fallback for an abandoned caller. AI never changes selected IDs or order. Render one or two factual sentences per card and derive `openai_evidence`, `mixed`, `catalog_fallback` or `not_needed` from the actual output.

## Verification and acceptance

First reconcile historical transport checks with current file hashes and context; reuse sufficient evidence. Then test the riskiest dependency using the three real dense profiles and strict evidence output. A successful plain-text probe does not replace this domain check. After two meaningful access/model/network/quota failures, record the cause and stop repeating that probe. Permitted local fallback work can continue, but does not pass the live gate. A provider replacement requires explicit OpenSpec reconciliation and accurate public labels.

| Check | Required observation |
| --- | --- |
| Dense real scenario | Алматы / Ведущий / корпоратив / `2026-10-10` / `1500000` KZT; omit language and duration |
| Selection | 10 candidates, 5 eligible; cards ordered `HK-88430`, `HK-29829`, `HK-27222` from the actual CSV |
| Live explanations | Each quote matches its own source, expresses a concrete request-relevant style/specialization, and yields a factual 1–2 sentence explanation; the three explanations remain substantively distinct with names hidden |
| Controlled AI failure | Same real selection and order, local factual text and accurate visible fallback label; a mock failure is not live success |
| Browser integration | Production build/start on the assigned port; real form -> HTTP -> modules -> visible cards; measure time from submission to visible result |
| UI and boundary checks | Desktop/mobile readability, keyboard focus, loading/error/empty states, and no server-only code or secrets in client output |

Record tested source SHA, dataset revision/hash, model, normalized request, per-card pass/fail/not_run and brief reasons, measured duration and limitations. Do not store keys, full prompts, provider payloads or full descriptions as evidence. The dense sample is preliminary: rare-case quality, the complete final live set and three uncached timing requests remain obligations of later stages. P01 does not claim their passage.

## Handoff and completion boundary

P01 depends on an accepted, pinned P00 base. After the real slice passes its required checks, record the exact P01 revision, contract revision, mode, duration and remaining live/check limitations in OpenSpec. Stop writing transferred module paths before handoff. P02/P03/P04 start from the same accepted P01 SHA and extend existing behavior rather than recreating it. No workers are dispatched by this design.

Use the project stage table and publication rules; a local working scenario or published feature branch is not integrated main. A failed end-to-end or live gate remains explicit and is not hidden by parallel work. Implementation stages, Git authorization, exact revisions and ownership must be reconciled at implementation time.

## Document verification

This planning artifact was checked against the P00 basis, P01 proposal and linked architecture for scope, UI deferrals, failure behavior and acceptance consistency. Local Markdown file targets were checked. Application build, browser execution, paid provider calls, P00 readiness and publication are not claimed by this document.
