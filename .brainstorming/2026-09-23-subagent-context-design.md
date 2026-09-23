# Subagent context and handoff

Bounded tooling change approved by the user on 2026-09-23 after the configuration review. For one OpenSpec change per session, the coordinator owns the full workflow and dispatches self-contained tasks with no inherited conversation history. Workers read the assigned context and return a common compact, evidence-backed handoff; follow-ups contain deltas. Existing role responsibilities, models, concurrency, acceptance checks, worktree isolation, and publication rules remain in force.

The implementation lives in AGENTS.md and the five project agent definitions. Verification covers TOML parsing and consistency with the existing OpenSpec workflow; this is a tooling instruction change, not a product change. This file records the approved discussion outcome only.
