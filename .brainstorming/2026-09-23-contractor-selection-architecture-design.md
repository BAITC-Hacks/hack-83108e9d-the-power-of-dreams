# Contractor-selection architecture

## Approved outcome

On 2026-09-23, after reviewing the architecture direction and the additional NVIDIA API option, the user agreed to proceed with the OpenAI-first MVP and asked to update the documentation. The user reported four hours for implementation/demo and possession of both OpenAI and NVIDIA API keys. These are resource statements, not verified provider access or a reset of the remaining time budget.

The accepted sequence is:

1. Complete the required contractor-selection scenario with one local application and OpenAI as the initial explanation provider.
2. Keep eligibility and repeatable ordering in local rules; use the supplied CSV, without a database or vector index. The initial architecture proposes price/ID ordering and explicitly bounded evidence selection for explanations.
3. Keep honest local catalogue explanations when the AI call fails. Do not call a second provider automatically on every failure or create a multi-provider routing framework.
4. Consider NVIDIA semantic reranking only after the required MVP works and sufficient time remains for delivery and demonstration. It is an optional improvement, not an acceptance dependency. Retain it only if the actual comparison demonstrates benefit without losing hard-filter correctness, repeatability or the response-time target.
5. Retain NVIDIA as a possible alternative explanation provider if OpenAI access is blocked; verify the selected adapter/model and record the change rather than silently switching providers or labels.

## Architecture and source context

- [Architecture index](../architecture/README.md)
- [Components, boundaries and NVIDIA assessment](../architecture/system.md)
- [Baseline policy and explanations](../architecture/selection-and-explanations.md)
- [Implementation sequence, evidence and optional checkpoint](../architecture/implementation-and-verification.md)
- [Domain requirements and supplied-data facts](../domain/README.md)

This record preserves the discussion outcome. Detailed policy proposals and exact API contracts must be formalized in the product OpenSpec change before implementation. Thereafter OpenSpec owns active requirements, design decisions and task state; this file is not a second task board.

## Review clarifications

The user subsequently requested four corrections before OpenSpec transfer, accepted in the architecture: explain both calendar directions and price displacement using previous/current busy sets; distinguish whole-batch AI failures from individual quote failures; isolate expected AI configuration errors in composition, including an unreadable environment file; and use an explicit `mixed` result label when only some explanations use AI-selected evidence. The linked architecture documents own the precise rules and verification cases; this clarification does not expand implementation scope.

## Current scope and verification

The current request updates documentation. It does not itself execute application implementation, live provider experiments, credential access or publication. Existing local-secrets task state and its publication hold remain unchanged.

For this documentation update, check local file/section links and consistency of the selected baseline, optional NVIDIA scope, secret requirements and evidence labels. Existing research and CSV calculations remain the recorded sources; no new application test or provider result is claimed.
