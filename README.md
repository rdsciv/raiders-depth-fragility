# Raiders Depth Fragility

Current-state draft-room decision support for the Las Vegas Raiders.

Raiders Depth Fragility ranks each Raiders position group by how much the current scheme would break if a starter or primary role player were unavailable, then overlays the 2026 draft class to identify prospects who reduce that fragility at the team's active picks.

Live app: https://raiders-depth-fragility.vercel.app

The central question is:

> Who should the Raiders consider next because he most reduces current Super Bowl-limiting fragility?

## What this is

- A Next.js dashboard for current Raiders draft decisions.
- A deterministic scoring model for position fragility and prospect fit.
- A source-stamped public data workbench.
- A second board to use beside scouting grades and a consensus big board.
- A Mintlify documentation site for operators, maintainers, and future contributors.

## What this is not

- Not a generic big board.
- Not a season-by-season historical model.
- Not a runtime LLM ranking system.
- Not an official Raiders or NFL product.
- Not a replacement for scouting, medical, character, or contract evaluation.

## Product constraints

- Fernando Mendoza is treated as already drafted by Las Vegas at No. 1 overall.
- The 2026 Raiders draft class is complete: 10 made picks, no remaining live pick window.
- The 17-player UDFA class announced by the Raiders on April 30, 2026 is included as roster depth.
- The official Raiders depth chart is unavailable until Fall 2026, so depth order is inferred and clearly marked with confidence warnings.
- NFL IQ is used as the primary conceptual source, but the app does not depend on an unsupported NFL IQ API.
- `NO_SEASON_MODE` is an explicit code and test invariant.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zod
- Vitest
- Mintlify docs

## Project structure

```text
.
├── docs.json                         # Mintlify docs configuration
├── index.mdx                         # Mintlify docs home page
├── guides/                           # Product usage docs
├── model/                            # Scoring and data-confidence docs
├── engineering/                      # Architecture and development docs
├── reference/                        # Domain type and source reference docs
├── src/app/page.tsx                  # Dashboard route
├── src/components/dashboard/         # Interactive draft-room UI
├── src/data/seed/                    # Source-stamped roster, pick, and prospect data
├── src/lib/scoring/                  # Pure scoring functions
├── src/lib/import/                   # CSV import parser
├── src/types/domain.ts               # Zod schemas and TypeScript types
└── src/__tests__/                    # Domain and invariant tests
```

## Quickstart

Use Node 20 through 24. The Mintlify CLI currently rejects Node 25+, so this repo includes `.nvmrc` and `.node-version` set to Node 24.14.0.

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev -- --port 3003
```

Open:

```text
http://localhost:3003
```

If that port is occupied, choose another port:

```bash
npm run dev -- --port 3004
```

## Verification

Run these before considering a change complete:

```bash
npm test
npm run lint
npm run build
```

The current test suite covers:

- High-dependency starter fragility.
- Center fragility reduction from C/G swing coverage.
- Lower-board prospects outranking higher-board prospects when they reduce higher Raiders fragility.
- Complete Raiders draft class and closed post-draft pick window.
- Official 17-player UDFA class being included in roster depth.
- Official depth chart absence producing confidence warnings.
- Manual CSV import validation.
- Current-roster-only product mode.

## Football research and assumptions

Every dependency score, role fit, depth dropoff, and confidence rating in the seed data comes from a specific football read. The `docs/` folder makes that reasoning visible without having to launch Mintlify or trace the code:

| File | What it covers |
|---|---|
| [`docs/football-research.md`](./docs/football-research.md) | **Start here.** Synthesizes the Raiders football knowledge that justifies every number in the seed: Kubiak coaching ground truth, scheme identity, why each scheme role gets its specific dependency score, roster strengths/weaknesses, why Mendoza is locked at #1, undervalued archetypes that drive prospect role fits, and the trade-value snapshot. |
| [`docs/raiders-research-brief.md`](./docs/raiders-research-brief.md) | The full **Raiders Analytics Advantage Brief** (April 20, 2026, 673 lines). The deeper research artifact behind `football-research.md`, including BDB landscape, NFL analytics state of the art, Raiders org chart, scheme identity, cap context, undervalued archetypes, and a 90-day plan. Cited throughout the in-tool source trail as `sources.autumnwindBrief`. |
| [`docs/scheme-assumptions.md`](./docs/scheme-assumptions.md) | The 12 scheme roles with their per-role dependency/leverage/scarcity numbers, failure modes, cross-training cushions, and the conditions under which the assumptions break (e.g. staff change, Crosby trade, Bowers trade). |
| [`docs/data-sources.md`](./docs/data-sources.md) | Every source in `src/data/seed/sources.ts` with confidence level. The Raiders depth-chart gap (not live until Fall 2026) and how the model compensates. |
| [`docs/methodology.md`](./docs/methodology.md) | Scoring math: fragility weights, fit-score formula, availability buckets, opportunity cost, where to adjust each constant. |
| [`docs/scouting-process.md`](./docs/scouting-process.md) | How prospect grades are derived, the prospect schema, and the CSV import workbench format. |
| [`docs/draft-state.md`](./docs/draft-state.md) | Picks made, picks upcoming, focus-window mechanics, and the procedure for updating after each Raiders selection. |
| [`docs/glossary.md`](./docs/glossary.md) | Plain-English definitions of every score and term, with score-range cheat sheets. |

If a number in the UI looks wrong, [`docs/football-research.md`](./docs/football-research.md) → [`docs/scheme-assumptions.md`](./docs/scheme-assumptions.md) → the cited section of [`docs/raiders-research-brief.md`](./docs/raiders-research-brief.md) is the trace path.

## Mintlify docs

Preview the docs:

```bash
npx mint@latest dev
```

Validate the docs:

```bash
npx mint@latest validate
```

Docs entry points:

- `index.mdx`
- `quickstart.mdx`
- `guides/dashboard.mdx`
- `model/fragility-scoring.mdx`
- `engineering/architecture.mdx`
- `reference/domain-types.mdx`

## Scoring model

Position fragility:

```text
FragilityScore.total =
  0.35 * schemeDependency
+ 0.30 * depthDropoff
+ 0.20 * starterLeverage
+ 0.15 * replacementScarcity
- crossTrainingCushion
```

Prospect fit:

```text
ProspectFitScore.total =
  fragilityScore
* roleFit
* readiness
* availabilityAtPick
* nflIqSignal
- opportunityCost
```

The UI displays score components and source trails so users can inspect the recommendation rather than trust a black box.

## Data updates

Seed data lives in `src/data/seed/`.

When updating source facts:

1. Re-verify the live source.
2. Update `DATA_AS_OF` in `src/data/seed/sources.ts`.
3. Update affected seed rows.
4. Run `npm test`, `npm run lint`, and `npm run build`.

Manual NFL IQ-style prospect rows can be previewed through the CSV workbench using:

```csv
name,school,position,positionGroup,projectedMin,projectedMax,consensusRank,nflIqOverall,athleticism,production,readiness,traits,sourceUrl
Makai Lemon,USC,WR,WR,42,72,58,83,80,82,0.72,"separator|return value",https://www.nfl.com/draft/
```

## Repository status

Remote:

```text
https://github.com/rdsciv/raiders-depth-fragility
```

Default branch:

```text
main
```

## License

This repository is private unless published otherwise by the owner. It is not affiliated with the Las Vegas Raiders, the NFL, or NFL IQ.
