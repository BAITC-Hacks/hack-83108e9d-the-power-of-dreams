# Third-party materials and provenance

This inventory is grounded in the committed manifests, source and supplied task materials. Package versions and declared licenses below come from [package-lock.json](package-lock.json); it also records resolved sources, integrity hashes and transitive packages. License identifiers are package metadata, not a replacement for upstream license notices.

## Application and development packages

| Material / source | Pinned version | Declared license | Role |
| --- | --- | --- | --- |
| [Next.js](https://www.npmjs.com/package/next) | 16.3.6 | MIT | Application server, routes, build and React shell |
| [React](https://www.npmjs.com/package/react), [React DOM](https://www.npmjs.com/package/react-dom) | 19.3.0 each | MIT | Interactive form and rendered results |
| [csv-parse](https://www.npmjs.com/package/csv-parse) | 7.0.2 | MIT | Parses the supplied catalogue |
| [TypeScript](https://www.npmjs.com/package/typescript) | 6.0.3 | Apache-2.0 | Typechecking and build tooling |
| [@types/node](https://www.npmjs.com/package/@types/node) | 24.13.6 | MIT | Node.js type declarations |
| [@types/react](https://www.npmjs.com/package/@types/react), [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) | 19.3.0 each | MIT | React type declarations |
| [@playwright/test](https://www.npmjs.com/package/@playwright/test) | 1.63.0 | Apache-2.0 | Browser acceptance scripts in `scripts/frontend/` |

The manifest also retains the following packages. Their presence does not establish use in the application: current source has no direct Zod, Tailwind or Vitest imports, styling uses plain CSS, and `npm test` uses Node's built-in test runner.

| Declared package / registry source | Version | Lockfile license |
| --- | --- | --- |
| [zod](https://www.npmjs.com/package/zod) | 4.6.5 | MIT |
| [tailwindcss](https://www.npmjs.com/package/tailwindcss), [@tailwindcss/postcss](https://www.npmjs.com/package/@tailwindcss/postcss) | 4.3.3 each | MIT |
| [postcss](https://www.npmjs.com/package/postcss) | 8.5.28 | MIT |
| [eslint](https://www.npmjs.com/package/eslint) | 9.39.5 | MIT |
| [eslint-config-next](https://www.npmjs.com/package/eslint-config-next) | 16.3.6 | MIT |
| [vitest](https://www.npmjs.com/package/vitest) | 5.0.1 | MIT |

The execution environment uses Node.js (`^24.4.1`) and npm (`11.4.2`), as declared in [package.json](package.json). Their full distribution notices are not included in this repository; bundled-component terms were not audited here.

The optional [Dockerfile](Dockerfile) uses the official [Node image](https://hub.docker.com/_/node), `node:24.4.1-bookworm-slim`, pinned to digest `sha256:36ae19f59c91f3303c7a648f07493fe14c4bd91320ac8d898416327bacf1bbfa`. It includes Debian Bookworm components and installs Git for build-time checks. These components have their own distribution licenses; a complete image-component license inventory was not audited here. Docker Engine/Compose or Docker Desktop is operator-installed tooling, not bundled project code; its applicable distribution/account terms remain the operator's responsibility.

## Supplied data and starter materials

| Material | Source / provenance | Terms and role |
| --- | --- | --- |
| [Catalogue CSV](raw/dataset.csv) | Supplied with hackathon task #79-lite; 66 anonymized profiles, including 13 marked synthetic. The provider's upstream collection sources are not identified in the supplied materials. | No explicit dataset license or redistribution terms were supplied; terms are **unknown**. Used for deterministic eligibility, price ordering and source-grounded explanation quotes. |
| [Task brief](raw/proposal.md) and [catalogue preview](raw/metadata.md) | Supplied task requirements and archived preview of the same catalogue | No explicit license supplied; terms are **unknown**. Requirements/provenance references; the runtime reads the CSV, not the preview. |
| Existing repository baseline | Team repository [BAITC-Hacks/hack-83108e9d-the-power-of-dreams](https://github.com/BAITC-Hacks/hack-83108e9d-the-power-of-dreams); inherited source, configuration and workflow files precede this delivery work | A separately named starter template and its license are not documented; **unknown**. No project-wide license file was found in the inspected checkout. Do not infer a project license from dependency licenses. |

Dataset SHA-256: `A197E65AE503F807E9592313B0DD47D56C038B4E2D0497AF9A201E3C501DC856`. See [data provenance and limitations](domain/data-contract.md): names are fictional, some cities/prices were imputed, and advertising claims are not independently verified.

The current UI uses project CSS and system fonts. No bundled third-party photographs, illustrations, icon packs or font files were found in the application source. System fonts are supplied by the user's operating system and are not redistributed here.

The Join City visual refresh follows the user-supplied local `.temp/join_city` reference for the three-chevron identity and palette. Its upstream source and license were not supplied and remain unknown. No legacy CSS, script, SVG file, font or image is bundled from that directory. The small chevrons, category outlines and selection motif in the frontend are original inline vector geometry created with Codex for the [approved design](.brainstorming/2026-09-23-join-city-visual-refresh-design.md); the runtime has no dependency on the reference directory.

## Models and AI-assisted development

| Material / source | Role and provenance | License / terms status |
| --- | --- | --- |
| OpenAI Responses API; default model `gpt-4.1-mini-2025-04-14` | [Server adapter](back/ai/openai.mjs) uses native `fetch`; `OPENAI_MODEL` can override the default. Selects short evidence quotes from up to three already-selected profiles; local code validates quotes and renders explanations. Model weights and an OpenAI SDK are not bundled. | Hosted proprietary service under the API account's applicable OpenAI agreement; exact account-specific terms are not recorded here. No open-source model license is asserted. |
| OpenAI Codex | AI-assisted planning, implementation, review, checks and documentation in this repository; workflow recorded in [AGENTS.md](AGENTS.md) and [tooling notes](docs/tooling.md) | Hosted/development service; exact account-specific terms and a complete per-edit development-model history are not recorded here. |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) 1.11.0 | Specification workflow and generated local `.agents/skills/openspec-*` instructions | License text is not recorded in the inspected project materials; **unknown here**. |
| [Context7](https://github.com/upstash/context7) and [CodeGraph](https://github.com/colbymchenry/codegraph) | Documentation retrieval and code navigation; installed versions and actual verification are in [tooling notes](docs/tooling.md) | Tool/service terms are not recorded in the inspected project materials; **unknown here**. Not product runtime dependencies. |
| [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/34040c9c568585f6929bedeaad110ad08f079624/skills/frontend-design) | External design instructions pinned to revision `34040c9c568585f6929bedeaad110ad08f079624`; local installation provenance is recorded in [tooling notes](docs/tooling.md). No template assets are bundled by that record. | The installation record notes an upstream `LICENSE.txt`; its contents are not reproduced in this repository, so terms are **unknown here**. This does not establish use of Claude or an Anthropic API. |

The application uses OpenAI as its only AI provider and the supplied CSV as its catalogue. This inventory does not claim training on the catalogue or ownership of supplied profile text.
