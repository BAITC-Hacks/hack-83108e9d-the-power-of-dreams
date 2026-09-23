# Architecture

P03 selection-domain acceptance and unchanged shared boundaries: [selection-domain](../openspec/changes/archive/2026-09-23-selection-domain/design.md).

Architecture for task #79-lite: explainable event-contractor selection from the supplied catalogue. The user agreed the **OpenAI-first MVP direction** on 2026-09-23, with a reported **four-hour implementation and demo budget** and available **OpenAI and NVIDIA API keys**. Key availability is user-reported; account/model access has not been tested.

**MVP baseline:** one local Next.js application; CSV loaded into memory; deterministic eligibility and price ordering; one bounded OpenAI call to select profile-specific evidence for up to three explanations. No database, vector index, additional backend service, or additional cloud account.

NVIDIA is an available contingency, not a second provider called on every request. A semantic-ranking experiment is optional only after the required MVP works and sufficient time remains for delivery. See [NVIDIA's role](system.md#nvidia-api-key-assessment) and the [experiment checkpoint](implementation-and-verification.md#optional-nvidia-checkpoint).

## Read in order

| Document | Purpose |
| --- | --- |
| [System architecture](system.md) | Alternatives, components, ownership, dependencies, public boundaries and local execution |
| [Selection and explanations](selection-and-explanations.md) | Proposed business decisions, stable ranking, grounded AI use, failure behaviour and date changes |
| [Implementation and verification](implementation-and-verification.md) | Four-hour sequence, first feasibility check, acceptance evidence and deliberate omissions |

## Status and authority

- P04 evidence module boundaries, narrow projection repair and acceptance: [validated-ai-evidence](../openspec/changes/archive/2026-09-23-validated-ai-evidence/design.md). Frozen public ports, prompt, transport and selection remain unchanged.

- Accepted P01 implementation: [first-working-slice](../openspec/changes/archive/2026-09-23-first-working-slice/design.md). On 2026-09-23 the user took control of the schedule and removed agent-enforced deadline reconciliation, four-hour limit and 60-minute reserve; historical estimates below and in linked documents are not implementation gates. Required acceptance checks remain.

- OpenAI transport access was verified on 2026-09-23 with the pinned model. The server adapter and its scope, live evidence and publication hold are recorded in [openai-response-adapter](../openspec/changes/openai-response-adapter/tasks.md). This updates the earlier untested-access statement above; domain/application integration remains separate.

- The accepted direction and provider sequence are preserved in the [approved brainstorming outcome](../.brainstorming/2026-09-23-contractor-selection-architecture-design.md). Architecture agreement is not evidence of a working application, live integration or completed implementation planning.
- Source requirements and data facts remain in [domain/README.md](../domain/README.md). Policy choices that were absent from the brief are explicitly identified in [the proposed selection policy](selection-and-explanations.md#proposed-policy-decisions).
- Before product implementation, create a linked product change in [OpenSpec](../openspec/) using the approved outcome. Its specs, design, contracts and task stages become authoritative for implementation. Detailed policy proposals below must be captured there; do not restart discussion of the agreed provider strategy or maintain competing specifications here.
- The existing [local-secrets change](../openspec/changes/unified-local-secrets/design.md) supplies the configuration boundary. Its [task card](../openspec/changes/unified-local-secrets/tasks.md) records local evidence and a publication hold; this architecture does not change that status.
- This update changes architecture documents and records the approved discussion outcome. It neither implements the application nor commits, publishes, changes the dataset, or inspects credentials.

- P00 implementation and frozen contract decisions: [foundation-and-contracts](../openspec/changes/archive/2026-09-23-foundation-and-contracts/design.md). This is the fresh change requested for the approved P00 basis; downstream application work remains planned.

- P02 catalogue acceptance and shared date-helper ownership: [catalog-module](../openspec/changes/archive/2026-09-23-catalog-module/design.md).
