# Modern Join City visual refresh

## Status and approved outcome

On 2026-09-23 the user requested an inspection of `.temp/join_city`, a discussion of useful styles and UI components, and a written design outcome. The user selected: “Современный Join City — узнаваемый стиль и компактный рабочий экран”.

**Approved direction:** modern Join City identity, a compact light header, recognizable colored chevrons, the reference's blue accent, readable condition labels, and separate contractor cards led by the reason for selection.

This is a planning-only outcome. It does not authorize implementation or Git publication. The previous [UI upgrade outcome](2026-09-23-contractor-ui-upgrade-design.md) and [OpenSpec change](../openspec/changes/contractor-ui-upgrade/design.md) describe the already delivered baseline. This document records a subsequent visual direction; it does not reopen completed tasks or change current specifications. A future implementation change must link this outcome and transfer the accepted decisions into OpenSpec.

## Product and baseline

The audience is an event organizer in Kazakhstan selecting up to three contractors by city, event date, format, category and budget, with optional language and duration. The principal value is a clear, truthful explanation of each match. See [domain scope](../domain/problem-and-scope.md).

The current screen already has useful foundations: conditions on the left, results on the right, complete explanations, prominent starting prices, visible outcome reasons, explicit submission and mobile navigation. Preserve those strengths.

The visual opportunity is to make the product recognizable as Join City, distinguish individual recommendations more clearly, and make the selected conditions easier to scan. The existing small blue bar mark, heavily wrapped title, continuous bordered result container and paragraph-style conditions provide the main opportunities.

## Inspection evidence

- Rendered the reference's `index.html` in a local browser. Observed the slate navigation strip, three colored chevrons, large pastel header, rounded search controls, category tags and image-led event cards.
- Inspected the reference's SCSS, SVG assets, and alternate index layouts. These are design references, not an application component library.
- Read current `front/ContractorForm.tsx`, `front/RecommendationResults.tsx`, their CSS and public contract v1. Current source already uses the `join city` name and the heading “Подбор подрядчиков для мероприятий”.
- Viewed `test-results/ui-upgrade/width-1280.png` as historical layout evidence. It predates the branding change; it is not a fresh screenshot of current source. No new application acceptance or mobile execution was performed for this planning task.

The reference directory is ignored local material. The extracted decisions below remain understandable without it; implementation must not depend on `.temp` at runtime.

## Approaches considered

| Approach | Benefit | Trade-off | Decision |
| --- | --- | --- | --- |
| Modern Join City | Recognizable identity with the existing compact selection flow | Requires deliberate adaptation of the reference's components | Selected by the user |
| Close reproduction of the event portal | Strong resemblance through a dark strip, pastel hero and media-heavy cards | Adds vertical space; event imagery and portal navigation do not represent the current contractor data or task | Not selected |
| Minimal polish of the current interface | Smallest visual change | Improves details but leaves weak brand recognition and the continuous list appearance | Not selected |

## What to adapt from the reference

| Reference | Useful idea | Adaptation for this product |
| --- | --- | --- |
| [`_header.scss`](../.temp/join_city/css/scss/_header.scss), [`icon-logo.svg`](../.temp/join_city/img/icon-logo.svg), [`content-logo.svg`](../.temp/join_city/img/content-logo.svg) | Three chevrons and restrained brand color | A legible `join city` wordmark with three small colored chevrons; a compact light header |
| [`_variables.scss`](../.temp/join_city/css/scss/_variables.scss) | Blue `#1D79C3`, white surfaces and slate text | Keep the recognizable blue, deepen ordinary text and strengthen control boundaries |
| [`_card.scss`](../.temp/join_city/css/scss/_card.scss) | Separate entries with a clear content hierarchy | Individual horizontal contractor cards; full explanation, visible starting price and compact factual footer |
| [`_header.scss`](../.temp/join_city/css/scss/_header.scss), [`_bootstrap_tags.scss`](../.temp/join_city/css/scss/_bootstrap_tags.scss) | Compact labels make conditions scannable | Passive, wrapping condition labels from the submitted result snapshot; no removal buttons |
| [`_add-event.scss`](../.temp/join_city/css/scss/_add-event.scss), [`_button.scss`](../.temp/join_city/css/scss/_button.scss) | Clear field rhythm and primary/secondary action distinction | Native labeled inputs; one filled blue selection button and a quiet reset action |

Do not import the reference's CSS bundle, legacy build setup, custom dropdown scripts or other plugins. Its global focus-outline removal, tiny metadata and animated header gradient are unsuitable for the working screen. Recreate the selected visual ideas within the current application.

## Visual system

The characteristic element is the three-color Join City mark. Keep surrounding surfaces quiet so the identity is noticeable without turning every card or status into another brand accent.

| Token | Color | Role |
| --- | --- | --- |
| Paper | `#FFFFFF` | Header, form and recommendation surfaces |
| Canvas | `#F3F7F9` | Subtle page background |
| Ink | `#243E50` | Main text, names and prices |
| Join blue | `#1D79C3` | Primary action, focus and useful emphasis |
| Secondary ink | `#566C7B` | Supporting information |
| Divider | `#D9E3E9` | Quiet separators and surface boundaries |

Retain the reference mark's lime `#CBE198`, rose `#EF8BA6` and sky `#86D4F2` only for identity details. They do not encode availability, quality, ranking or status. Keep distinct error and pending semantics from the existing interface. Decorative divider color is not automatically sufficient for input boundaries; check control contrast separately.

Use the existing Segoe UI/system stack with Cyrillic support and no remote font request. Target heading sizes of 36–40 px on desktop and 28–32 px on mobile, weight 600. Give the main heading roughly 24–28 characters of available line width instead of forcing a narrow column. Keep the current heading copy. Card names use 21–23 px; full explanations 16–17 px with a line height around 1.6; meaningful supporting text 13–14 px. Prices use tabular numbers. Align prose left and limit its line length to about 65–75 characters.

Use a small spacing scale of 8, 12, 16, 24 and 32 px. Cards and the form have approximately 12–16 px corners; fields 8 px; condition labels may be pills. Borders and spacing establish hierarchy. Avoid repeated heavy shadows, decorative card hover movement and automatic background animation.

## Screen and component decisions

### Header and layout

Keep the short product header. Place the wordmark and chevrons together, followed by the current task heading and one concise explanation. Use a light surface; do not add a tall hero, menu, login button or unsupported navigation. Keep the working area near the top of the page.

Desktop retains a roughly 304–320 px condition panel beside flexible results, with a 24–32 px gap inside a 1200–1280 px content area. Recommendations remain a single vertical list: long explanations are easier to compare at this width than in three narrow columns.

```text
join city  [three colored chevrons]
Подбор подрядчиков для мероприятий
До трёх вариантов с объяснением каждого результата.

Your event                  Suitable options · count
City / date                 [City] [Date] [Format] [Budget] ...
Format / category           Visible explanation mode / outcome reasons
Budget
Optional conditions         [category icon] Contractor name       from … ₸
Select / Reset              Complete explanation
                            Calendar information and provenance

                            Next separate recommendation card
```

### Contractor card

Separate cards with 12–16 px gaps, replacing the shared continuous container. Keep the name and starting price easy to find; place category and city nearby. Add a small consistent outline category icon in a quiet tile where it helps identify the service. Keep its text label and use a neutral fallback for unknown categories.

The explanation remains the largest prose block and stays fully visible. A restrained blue rule or light inset may distinguish it without introducing a large banner. Calendar information and data provenance form a readable footer. The card is not clickable because the current flow has no contractor detail destination.

Contract v1 has no photo field. Do not attach event photos, stock portraits, generated faces, star ratings, popularity counts or “best choice” badges to contractors. Do not add booking or contact actions. Preserve `от` and `₸` around the starting price; do not imply a final quote.

### Conditions and form

Replace the long result-condition paragraph with wrapping passive labels for the actual normalized result request. Keep every condition available, including optional selections or the absence of optional restrictions. Preserve the distinction between the submitted snapshot, a pending request and unsent form edits.

Do not make passive labels look removable or give them a pointer cursor. They are a summary, not a second filter editor. Keep required and optional fields in the existing form, with native date/select behavior, visible labels, budget formatting help, validation and explicit submission.

### Empty, pending and mobile states

Replace the initial placeholder's chart-like bars with a small category/selection motif and direct guidance about filling in the event conditions. Keep decoration compact. Pending and changed-condition messages stay close to the action and result context; errors retain actionable text.

On mobile retain the single-column flow, user-controlled condition collapse and explicit results navigation. Allow labels to wrap; place price below the name when necessary. The bottom action area must not cover content or keyboard focus. Completing a request must not move focus or scroll automatically.

## Preserved behavior and boundaries

The refresh changes presentation only. Preserve public contracts, selection order, explanation text and modes, both empty outcomes, reasons for fewer than three cards, date comparisons, provenance flags and the wording that an absent busy mark is not confirmed availability. Keep cancellation, duplicate suppression, stale-response guards, editable pending inputs and reset/focus behavior.

Expected implementation scope is `front/ContractorForm.tsx`, `front/RecommendationResults.tsx`, `front/flow.css` and `src/app/style.css`, plus minimal local vector assets if needed. No backend, data, API, storage, account, provider or dependency changes are needed. Do not introduce a general component framework for this single screen.

The existing local run method and API remain sufficient. No new paid service, key, GPU, external font, account or manual setup is required. Any selected asset must be stored in the application with its source recorded; the old portal remains reference material.

## Implementation order and acceptance for a future change

1. Establish the compact header, brand mark, typography and palette on the primary screen.
2. Finish separate explanation-led cards and snapshot-condition labels using the real primary scenario.
3. Apply the same system to empty, pending, error and mobile states without changing their behavior.
4. Reuse the existing relevant frontend and application checks; add only checks needed for changed observable behavior.

Verify the actual browser at 375, 390 and 1280 px. At desktop width, the first recommendation and its explanation should remain visible in the first viewport after a successful primary request; the header must not push it down. On mobile, preserve the explicit route to results, readable full explanations and no horizontal overflow. Check long Russian category names and prices, keyboard focus, visible labels, usable touch targets, text/control contrast and reduced motion.

Run the real primary, rare, both empty and date-change scenarios; retain required request-state and focus checks. Reconcile the current branch and any newer contracts before implementation because other tasks may advance the application. Planning inspection is not evidence that these future checks have passed.
