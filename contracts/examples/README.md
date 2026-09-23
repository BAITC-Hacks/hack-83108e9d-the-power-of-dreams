# Development contract examples

`fixtures.ts` contains complete, typed examples of both HTTP responses, all three
outcomes, four explanation modes, four public error codes and internal module
results. `boundaries.ts` specifies normalization/omission, catalogue failures,
evidence identity/quote/cancellation and date-comparison cases for later consumers.

These are handcrafted synthetic fixtures, not application or live model results.
FX profiles never replace `raw/dataset.csv`; the zero catalogue digest is not a
measured hash. Internal module examples must not be returned to the browser.
The comparison cases are minimal snapshots of relevant IDs, not full HTTP results.
The source-derived October 10/11 and October 1/6 expectations remain in
[architecture verification](../../architecture/implementation-and-verification.md#data-derived-rehearsal-cases).

Run `npm run typecheck` and `npm test` from the repository root. The focused checks
verify example compatibility and consistency, not future adapter behavior.
The verified immutable frontend package is a later P05 deliverable.
