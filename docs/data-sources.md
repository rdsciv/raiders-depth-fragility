# Data Sources

Every fact in the seed traces to a `SourceRef` in `src/data/seed/sources.ts`. Each row in `roster.ts`, `prospects.ts`, and `draft.ts` carries a `sourceRefs[]` array so the UI can render a source trail per recommendation.

`DATA_AS_OF` is the single timestamp stamped on every source at ingest. Bump it whenever you refresh.

## Live primary sources

| Source key | Provides | Live URL |
|---|---|---|
| `nflRaidersDraftTracker` | Authoritative pick-by-pick log of who Las Vegas has selected. Supersedes `nflDraftOrder` once picks are made. | https://www.nfl.com/draft/tracker/2026/teams/las-vegas-raiders |
| `nflDraftOrder` | Initial seven-round draft order before any selections. | https://www.nfl.com/news/2026-nfl-draft-order-for-all-seven-rounds |
| `nflDraftInfo` | Day-by-day event timing (Day 2 = Friday, April 24, 2026). | https://www.nfl.com/draft/event-info/ |
| `raidersMendoza` | First-overall selection writeup confirming Mendoza to Las Vegas on April 23, 2026. | https://www.raiders.com/news/fernando-mendoza-no-1-overall-pick-raiders-quarterback-2026-nfl-draft-indiana-football |
| `raidersRoster` | Official Raiders player listings. **Position is official; depth order is model-derived** (see Gap below). | https://www.raiders.com/team/players-roster/ |
| `raidersCoaches` | Anchors Klint Kubiak as head coach plus the 2026 staff. Used to justify scheme assumptions. | https://www.raiders.com/team/coaches-roster/ |
| `nflIqLaunch` | Background reference: NFL IQ surfaces team needs, cap, draft capital, projected depth, and scheme summaries. | https://www.nfl.com/news/nfl-iq-launches-on-nfl-com-bringing-fans-inside-the-front-office-from-free-agency-through-the-draft/ |
| `nflIqProspects` | Background reference: NFL IQ uses Next Gen Stats Draft Scores for prospect grading. | https://www.nfl.com/news/nfl-iq-ten-under-the-radar-prospects-who-boosted-their-draft-scores-at-combine/ |
| `nflDayTwoProspects` | Public fallback prospect pool covering Day 2 and Day 3. | https://www.nfl.com/news/2026-nfl-draft-day-2-day-3-prospects-to-watch |
| `nflUndraftedProspects` | Live filter of prospects still on the board after Rounds 1–3. Used for late-round options. | https://www.nfl.com/draft/tracker/2026/prospects/all_all?collegeClass=all&page=1&status=undrafted |

## Background-only sources

| Source key | What it is |
|---|---|
| `autumnwindBrief` | Local research brief at `/Users/chilly/Documents/Projects/autumnwind/raiders_bdb_2026_research_brief.md` covering the Raiders football R&D org chart, BDB landscape, scheme observations, and analytics roadmap. **Local-only**, used to anchor scheme assumptions; the tool does not depend on it for live facts. |

## The Raiders depth-chart gap

The official Raiders depth chart (`raidersDepthChart`, https://www.raiders.com/team/depth-chart) reads:

> "Depth chart will be available in Fall 2026."

This is the single biggest data limitation. The tool compensates by:

1. **Inferring depth from roster + scheme + staff context** — every `depthAssessment` in `src/data/seed/roster.ts:492-625` is model-derived, not lifted from an official chart.
2. **Stamping `confidence` 0.48–0.64** on each assessment so the UI can render confidence chips ("low conf", "medium conf", "high conf"). Six of the twelve groups currently sit below 0.6 (low/medium).
3. **Surfacing the gap explicitly** in the UI's "Confidence Warnings" panel and in the `whatBreaks` text per position.

When the official depth chart goes live in Fall 2026:
- Replace the inferred `starter`/`backups` arrays in `depthAssessments[]` with the official lines.
- Raise `confidence` to ≥ 0.8 for any assessment that matches the official chart.
- Update `raidersDepthChart.note` to remove the "Fall 2026" placeholder.

## NFL IQ has no public API

NFL IQ is the most relevant public framework for prospect grading (Next Gen Stats Draft Scores), but it does not expose a stable API in this build. The tool's workaround:

- The `nflIqOverall`, `athleticism`, `production`, `readiness` fields on each `Prospect` are author-graded against NFL IQ-style anchors and Day 2/3 watchlists.
- A CSV import workbench in the UI (`src/lib/import/prospect-csv.ts`) accepts manual NFL IQ rows; parsed prospects merge live into the rankings (see `src/components/dashboard/draft-room-dashboard.tsx`).
- See [scouting-process.md](./scouting-process.md) for the per-field rubric.

## Adding a new source

1. Add a new key to `sources` in `src/data/seed/sources.ts` with a stable URL and a one-sentence `note`.
2. Re-export — it'll automatically land in `sourceList` and the UI source trail.
3. Reference it from any seed row's `sourceRefs[]`.
4. Bump `DATA_AS_OF` so every existing row's `retrievedAt` stamp shifts to the refresh moment.

The Zod gate in `src/data/seed/index.ts` will throw at module import time if a `sourceRefs[]` is empty, malformed, or the URL doesn't parse. There is no silent failure mode for missing provenance.
