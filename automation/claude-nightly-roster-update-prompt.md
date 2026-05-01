# Claude Scheduled Task Prompt: Nightly Raiders Roster Refresh

Run this task nightly for `/Users/chilly/Documents/Projects/raiders-depth-fragility`.

You are maintaining the Raiders Depth Fragility tool. The product is current-roster only: no season selector, no historical mode, no generic big board. Your job is to re-verify current Raiders roster facts, update seed data, rerun deterministic fragility scoring, verify the app, and report exactly what changed.

## Required Sources

Check these sources in this order:

1. Raiders official roster: `https://www.raiders.com/team/players-roster/`
2. Raiders transactions/news: `https://www.raiders.com/news/transactions`
3. Raiders depth chart: `https://www.raiders.com/team/depth-chart`
4. Raiders coaches: `https://www.raiders.com/team/coaches-roster/`
5. NFL Raiders draft tracker: `https://www.nfl.com/draft/tracker/2026/teams/las-vegas-raiders`
6. Raiders UDFA announcement: `https://www.raiders.com/news/raiders-sign-17-undrafted-free-agents-2026-nfl-transactions`
7. NFL IQ/public NFL sources already referenced in `src/data/seed/sources.ts`

If a source is unavailable, keep the previous data, lower confidence only where the stale source affects the model, and document the failure in the final report.

## Data Update Rules

1. Update `DATA_AS_OF` in `src/data/seed/sources.ts` with the current local timestamp.
2. Update `src/data/seed/roster.ts` for new signings, releases, position changes, and depth-relevant flex.
3. Keep every player source-stamped. Use `acquisition: "draft"` for 2026 drafted rookies, `acquisition: "udfa"` for 2026 undrafted free agents, and omit acquisition for normal veterans unless the schema changes.
4. Update `src/data/seed/draft.ts` only if the official NFL tracker changes or a correction is needed.
5. Update `DepthAssessment` values only when roster changes materially alter scheme fragility. Do not massage numbers without a football reason.
6. Never invent NFL IQ values. If NFL IQ data is not publicly available, leave existing values and mention that the manual CSV path remains the supported import path.
7. Preserve `NO_SEASON_MODE`.

## Scoring Expectations

Rerun the deterministic model after every data change. Confirm:

- `rankPositions` still returns all 12 position groups.
- Draft-complete state returns an empty prospect overlay when no focus picks remain.
- Roster additions reduce fragility only when they add credible role-matched depth.
- The official depth chart absence remains a visible confidence warning until the Raiders publish it.

## Verification

Run:

```bash
npm test
npm run lint
npm run build
npm run docs:validate
npx mint@latest broken-links
```

If UI or layout changed, also run browser screenshots:

```bash
npm run dev -- --port 3003
npx playwright screenshot --full-page --viewport-size=1440,1100 http://localhost:3003 /tmp/raiders-depth-nightly-desktop.png
npx playwright screenshot --full-page --viewport-size=390,1200 http://localhost:3003 /tmp/raiders-depth-nightly-mobile.png
```

## Git Discipline

If changes are needed:

1. Commit with message: `Nightly roster refresh YYYY-MM-DD`
2. Push to `origin main`
3. Deploy to Vercel production only if the build passes and the changed data affects the live app:

```bash
vercel deploy --prod --yes
```

## Final Report Format

Return:

- Sources checked, with timestamp.
- Roster changes applied.
- Fragility ranking before and after, top five only.
- Any confidence changes and why.
- Verification results.
- Commit SHA and deployment URL if changed.

Do not finish with unverified claims. If any check fails, stop, explain root cause, and do not deploy.
