# Scouting Process

How prospect grades and role fits are derived, where the prospect pool comes from, and how to add a row at draft time.

## The prospect schema

Every entry in `src/data/seed/prospects.ts` conforms to `prospectSchema` (`src/types/domain.ts:84-102`):

| Field | Range / Type | Meaning |
|---|---|---|
| `name`, `school`, `position` | string | Self-explanatory. |
| `positionGroup` | enum (12 groups) | Must match a scheme role. Drives which fragility score the prospect is evaluated against. |
| `projectedRange` | `{min, max}` overall picks | Where the prospect is expected to come off the board. Drives `availabilityAtPick`. |
| `consensusRank` | int or `null` | Public board ranking; powers `opportunityCost` and `findAvoidDespiteBoard`. `null` means "no consensus." |
| `nflIqOverall` | 0–100 | NFL IQ-style composite (Next Gen Stats Draft Score anchor). |
| `athleticism` | 0–100 | Combine/pro-day adjusted. Currently informational only — not in the fit formula. |
| `production` | 0–100 | College output adjusted for level of competition. Currently informational only. |
| `readiness` | 0–1 | Probability the prospect can take meaningful 2026 snaps in the role. Multiplier in fit score. |
| `roleFits` | partial map of `positionGroup → 0–1` | How well the player fits each position group's role. Missing key defaults to 0.18. |
| `traits` | string[] | Short trait tags shown in the UI table. |
| `sourceRefs` | `SourceRef[]` | Provenance — see [data-sources.md](./data-sources.md). |
| `status` | `"available"` \| `"drafted"` | Drafted prospects are excluded from rankings (`bestScore` and `availabilityAtPick` short-circuit to 0). |
| `draftedOverall`, `draftedTeam` | optional | Set when `status === "drafted"`. Populated for Raiders picks and tracked off-the-board names. |

## Where prospect grades come from

The tool does not have an NFL IQ feed. Each prospect's numbers are author-graded against publicly visible signals:

1. **`nflIqOverall`** — anchored to NFL IQ-style framing where 90+ = Day 1 lock, 80–89 = mid-Day-1 to early-Day-2, 70–79 = Day-2 starter path, 60–69 = late-Day-2/early-Day-3, 50–59 = developmental.
2. **`athleticism`** — combine numbers when available; otherwise scout consensus. Defaults conservative.
3. **`production`** — translated college output. SEC/Big Ten productive seniors trend higher than small-school equivalents.
4. **`readiness`** — derived qualitatively from snap count, scheme transferability, and any known injury context.
5. **`roleFits`** — the most important and the most subjective. Set per *position group*, not per *position*. A safety with nickel-corner experience gets `{S: 0.86, CB: 0.24}`; a center who can swing to guard gets `{"IOL/C": 0.94}` (single key because guard is the same group); an edge with inside rush utility gets `{EDGE: 0.82, IDL: 0.34}`.

When data is sparse — for late-round/undraftable players — the rubric defaults conservative and `readiness` drops.

## Prospect pool composition

The seed pool covers two layers:

1. **Drafted prospects** — Mendoza (#1), Stukes (#38), Crawford (#67), Zuhn III (#91) for the Raiders. Plus other early-Day-2 names already off the board (D'Angelo Ponds, Anthony Hill Jr., Jake Slaughter, etc.) so they don't appear in available recommendations.
2. **Available prospects** — Day-2 holdovers (Pregnon, Dennis-Sutton, Haulcy, Ramsey, Bell, Lance) and undrafted Day-3 names (Daniels, Law, Barrett, Koziol, Dixon, Campbell, Bell, Loop). These are the actual recommendation surface.

The pool is **deliberately small** — under 20 entries on purpose. The tool's value is the scoring engine on top of curated data, not a comprehensive scouting database. Use the CSV workbench when you need more depth.

## CSV import workbench

When draft day moves faster than the seed file can be edited, paste rows into the Data Workbench panel in the UI. The CSV is parsed by `parseProspectCsv` (`src/lib/import/prospect-csv.ts`) and merged live into the ranking — see `src/components/dashboard/draft-room-dashboard.tsx`.

### CSV format

Header row (exact, in this order):

```
name,school,position,positionGroup,projectedMin,projectedMax,consensusRank,nflIqOverall,athleticism,production,readiness,traits,sourceUrl
```

| Column | Format | Notes |
|---|---|---|
| `name`, `school`, `position` | string | Required. |
| `positionGroup` | one of `QB,RB,WR,TE,OT,IOL/C,EDGE,IDL,LB,CB,S,ST` | Must match exactly — the Zod enum will reject anything else. |
| `projectedMin`, `projectedMax` | positive int | Overall pick range. |
| `consensusRank` | int or empty | Empty = no consensus rank. |
| `nflIqOverall`, `athleticism`, `production` | 0–100 | Number coercion is applied. |
| `readiness` | 0–1 | Decimal. |
| `traits` | pipe-separated string | e.g. `"box safety|teams floor|dime utility"`. Quote if it contains commas. |
| `sourceUrl` | valid URL | Used as the source label "Manual NFL IQ import". |

### Error handling

Bad rows are reported with line number AND field name. Examples:

- `Line 2: nflIqOverall — Too big: expected number to be <=100.`
- `Line 3: sourceUrl — Invalid URL.`
- `Line 4: positionGroup — Invalid option: expected one of "QB"|"RB"|...`

A bad row never breaks the ranker — it's reported in the validation panel, valid rows still merge.

### CSV → ranker invariant

A test in `src/__tests__/scoring.test.ts` locks in the composition:

```ts
parseProspectCsv → [...seedProspects, ...imported.prospects] → rankProspectsForPicks
```

A merged CSV prospect appears in the ranked output the same way a seed prospect does. There is no second code path.

## Adding a prospect to the seed (vs. CSV)

CSV is for fast in-room additions. For permanent additions to the repo, edit `src/data/seed/prospects.ts` directly and follow the existing pattern:

1. Add the entry with all required fields plus `roleFits` for any position group the player projects to.
2. Reference an appropriate source from `src/data/seed/sources.ts`.
3. Set `status: "available"` (or `"drafted"` with `draftedOverall` if pre-tracking off-the-board names).
4. Run `npm test` — the Zod gate will throw on import if anything is malformed.
