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
- The active decision window starts at the next live Raiders pick, currently No. 102, after made picks at Nos. 1, 38, 67, and 91.
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
- Mendoza, Stukes, Crawford, and Zuhn already being drafted by Las Vegas.
- The live Raiders board starting with upcoming picks No. 102, No. 134, and No. 175.
- Official depth chart absence producing confidence warnings.
- Manual CSV import validation.
- Current-roster-only product mode.

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
