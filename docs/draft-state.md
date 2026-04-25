# Draft State

Snapshot of Las Vegas Raiders 2026 draft picks and how the tool tracks the live window.

## Picks made (Day 1 + early Day 2)

| Overall | Round | Pick in round | Selection | Source |
|---|---|---|---|---|
| **1** | 1 | 1 | Fernando Mendoza, QB, Indiana | `raidersMendoza`, `nflRaidersDraftTracker` |
| **38** | 2 | 6 | Treydan Stukes, S, Arizona | `nflRaidersDraftTracker` |
| **67** | 3 | 3 | Keyron Crawford, EDGE, Auburn | `nflRaidersDraftTracker` |
| **91** | 3 | 27 | Trey Zuhn III, C, Texas A&M | `nflRaidersDraftTracker` |

Defined in `src/data/seed/draft.ts:4-40` with `status: "made"`.

Each pick has a corresponding entry in `src/data/seed/prospects.ts` with `status: "drafted"` and `draftedOverall` set, so the ranking engine excludes them. A test (`src/__tests__/scoring.test.ts`) locks this in:

```ts
expect(stukes?.draftedOverall).toBe(38);
expect(crawford?.draftedOverall).toBe(67);
expect(zuhn?.draftedOverall).toBe(91);
expect(made).toEqual([1, 38, 67, 91]);
```

## Picks upcoming

| Overall | Round | Pick in round | In focus window? |
|---|---|---|---|
| **102** | 4 | 2 | ✅ |
| **134** | 4 | 34 | ✅ |
| **175** | 5 | 35 | ✅ |
| 185 | 6 | 4 | — |
| 208 | 6 | 27 | — |
| 219 | 7 | 3 | — |

Defined in `src/data/seed/draft.ts:41-89` with `status: "upcoming"`.

## How the focus window works

```ts
export const focusPicks = raidersDraftPicks
  .filter((pick) => pick.status === "upcoming")
  .slice(0, 3);
```

`focusPicks` is **always the next three upcoming picks**, computed from the `status` field. The dashboard renders pick-specific fit scores only for these three. As you flip a pick's `status` from `"upcoming"` to `"made"`, the window shifts forward automatically.

## Updating after a Raiders pick

When the Raiders make pick #102:

1. **Update `src/data/seed/draft.ts`** — change pick #102's `status` from `"upcoming"` to `"made"` and add a `selection: "Player Name, POS, School"` field.
2. **Update `src/data/seed/prospects.ts`** — find or add the player with `status: "drafted"`, `draftedOverall: 102`, `draftedTeam: "Las Vegas Raiders"`.
3. **Update the relevant `depthAssessment` in `src/data/seed/roster.ts`** — add the player to `backups` or `crossTrainedPlayers`, recompute `crossTrainingCoverage` and `confidence` if the pick meaningfully changes the position's depth picture.
4. **Add the player to `rosterPlayers[]` in `src/data/seed/roster.ts`** — mark `experience: "R"`, `age: null`, source `draftRefs`.
5. **Bump `DATA_AS_OF`** in `src/data/seed/sources.ts`.
6. **Run `npm test`** — the Zod gate and the draft-invariant test catch most mistakes.

The focus window will automatically slide to #134, #175, #185.

## Updating after another team picks (off-the-board names)

When a player you were tracking goes to a different team:

1. **Find the player in `src/data/seed/prospects.ts`**.
2. **Set `status: "drafted"`** and `draftedOverall: <pick>`. Leave `draftedTeam` unset (or set it to the picking team) since this isn't a Raiders pick.
3. **No draft.ts change needed** — that file tracks Raiders picks only.

The ranker drops the prospect on the next render via the `status === "available"` filter in `rankProspectsForPicks`.

## Why `focusPicks.slice(0, 3)`

Three picks is the practical Day-2-into-Day-3 decision window — enough to compare adjacency tradeoffs without the UI getting noisy. To widen it, change the slice in `src/data/seed/draft.ts:91-93`. To narrow to the immediate pick only, set `slice(0, 1)`.

## "Avoid despite board" recommendation

Surfaces a prospect who is **top-50 consensus** but scores **under 30** in the fit model — i.e. a name people will tell you to take that does not actually reduce Raiders fragility. Returns `null` (UI shows "No top-50 consensus prospect is scoring below 30 right now") when no such trap exists. See `findAvoidDespiteBoard` in `src/lib/scoring/fragility.ts`.

## Live window quick reference

As of `DATA_AS_OF = 2026-04-25T02:32:16-05:00`:

- 4 picks made (#1, #38, #67, #91)
- 6 picks upcoming
- Focus window: **#102, #134, #175**
- Next clock: **#102 (Round 4, pick 2)**
