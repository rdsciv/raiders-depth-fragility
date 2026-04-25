# Raiders Depth Fragility

Current Raiders draft-room tool for ranking roster fragility and mapping available prospects to the fragility they reduce.

## What It Does

- Ranks QB, RB, WR, TE, OT, IOL/C, EDGE, IDL, LB, CB, S, and ST by scheme fragility.
- Treats Fernando Mendoza as already drafted at No. 1 overall.
- Focuses Day 2 recommendations on Raiders picks No. 36 and No. 67.
- Shows source confidence warnings because the official Raiders depth chart is unavailable until Fall 2026.
- Uses deterministic scoring only. No runtime LLM ranking.

## Commands

```bash
npm run dev
npm test
npm run lint
npm run build
```

## Data Notes

Seed data is source-stamped in `src/data/seed/`. NFL IQ is used as the primary conceptual source, but the public site does not expose a stable API here, so the app includes a CSV import preview for manual NFL IQ prospect rows.
