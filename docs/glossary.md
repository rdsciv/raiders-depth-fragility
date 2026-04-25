# Glossary

Plain-English definitions of every term and score range the tool produces.

## Position-level scores

### `fragility.total` (0–100)
*How fast the game plan breaks if a starter is lost.* Higher = more fragile.

Composed of `dependencyScore`, `depthDropoff`, `starterLeverage`, `replacementScarcity`, minus `crossTrainingCushion`. See [methodology.md](./methodology.md) for the formula.

Reading the numbers:
- **80–100** — alarm-bell positions (typical: EDGE Crosby spine, IOL/C, OT in this seed)
- **60–79** — meaningful fragility worth addressing in the draft (typical: WR, TE mismatch engine, S, CB)
- **40–59** — manageable; depth investments are nice-to-have (typical: RB, IDL)
- **0–39** — well-cushioned (typical: ST, post-draft QB after Mendoza)

### `dependencyScore` (0–100)
How scheme-coupled the role is. A 95 means losing a traited replacement collapses the call sheet. A 50 means the position has a generic enough role that a replacement can step in without scheme accommodation.

### `depthDropoff` (0–100)
The quality gap from starter to next-best on the roster. 100 = "if the starter goes down we're starting a journeyman." 0 = "the backup is essentially co-starter quality."

### `starterLeverage` (0–100)
How much the starter individually carries the unit's output. Crosby is a 92 — the entire pressure plan rotates around him. A safety with two competent peers might be a 60.

### `replacementScarcity` (0–100)
How rare it is to find a credible replacement at this trait profile in the league. EDGE rushers with Crosby-tier pressure win-rate are scarce (84). RB1s in a wide-zone scheme are not (42).

### `crossTrainingCushion` (0–40)
A direct subtraction from raw fragility for every credible flex player who could fill in. A C/G swing player with real reps is worth 15–24 points. Note: this is `crossTrainingCoverage` on the depth assessment, renamed `crossTrainingCushion` on the output.

### `confidence` (0–1)
How sure the underlying depth read is. Six of twelve groups are below 0.6 because the official Raiders depth chart isn't published until Fall 2026 — see [data-sources.md](./data-sources.md).

| Range | Chip label |
|---|---|
| ≥ 0.60 | high conf |
| 0.52–0.59 | medium conf |
| < 0.52 | low conf |

## Prospect-level scores

### `fit.total` (typically -10 to ~70)
*Per-pick prospect fit.* Higher = better selection at this slot.

The headline number on every prospect card. Composed of `fragility × roleFit × readiness × availabilityAtPick × nflIqSignal − opportunityCost`.

Reading the numbers:
- **40+** — clear-edge selection at this pick
- **25–40** — solid value
- **10–25** — defensible
- **< 10** — better options exist
- **Negative** — opportunity cost outweighs the fit; this is a reach

### `fragilityReduction`
*Best-case in-season fragility reduction.* Computed as `fragility × roleFit × readiness` — strips out availability and opportunity cost so you can see the upside if the player is in fact selected at this slot.

### `roleFit` (0–1)
How well the prospect's traits match a specific scheme role. Set on the prospect (`roleFits` map per position group). A safety with `{S: 0.86, CB: 0.24}` is an 86% fit at S and a 24% fit at CB. Default 0.18 if the prospect's `roleFits` doesn't list the position group being scored.

### `readiness` (0–1)
Probability the prospect can take meaningful 2026 snaps in the role. A polished college senior with scheme overlap is ~0.8. A developmental edge rusher might be 0.55–0.6.

### `nflIqSignal` (0–1)
Just `nflIqOverall / 100`. A separate name because it's used as a multiplier in the fit formula, not a raw score.

### `availabilityAtPick` (0–1)
Probability the prospect is still on the board at the target pick. See the bucket table in [methodology.md](./methodology.md).

### `opportunityCost` (0+)
Subtracted from the fit total. Combines:
- **Reach cost** if the pick is before the prospect's `projectedRange.min` (capped at 18).
- **Board-value cost** if the prospect's `consensusRank` is more than 55 picks worse than the pick (capped at 12).

## Pick-level terminology

### Focus picks
The next three upcoming Raiders picks. See [draft-state.md](./draft-state.md). Currently **#102, #134, #175**.

### "Best pick for Super Bowl leverage"
The top-ranked prospect by `bestScore.total` across the focus window.

### "Best fragility hedge"
The top-ranked prospect by `bestScore.fragilityReduction` — the player who removes the most game-plan-collapse risk regardless of pick economics.

### "Best scheme fit"
The top-ranked prospect by `bestScore.roleFit` — the cleanest trait match for one of the 12 scheme roles.

### "Avoid despite board value"
A prospect who sits at consensus rank ≤ 50 but whose `bestScore.total` is < 30 — i.e. a name the public board likes that the fragility model says won't move the Super Bowl needle. Returns `null` (with explicit "no trap detected" copy) when no such mismatch exists. See `findAvoidDespiteBoard`.

## Position groups

The 12 enum values in `positionGroupSchema`:

| Group | Includes | Excludes |
|---|---|---|
| QB | Quarterbacks | — |
| RB | Halfbacks, fullbacks | — |
| WR | Outside and slot receivers | TEs aligned wide (those stay TE) |
| TE | Tight ends, H-backs | — |
| OT | Left and right tackles | Swing tackles only count if primary T |
| **IOL/C** | Centers and guards (one combined group) | OTs |
| EDGE | DEs, OLBs in 3-4, stand-up rushers | — |
| IDL | DTs, NTs, 3-techs, 5-techs in 4-3 base | — |
| LB | Off-ball MIKE/WILL/SAM | EDGE rushers (split out separately) |
| CB | Outside and nickel corners | Big-nickel/box safeties (those stay S) |
| S | Free, strong, post, box, nickel safeties | — |
| ST | Specialists (K, P, LS) | Returners (those stay at primary position) |

Important: **IOL/C is one group**, not separate IOL and C. Center calls and guard play share enough scheme overlap (combo blocks, A-gap pickup, swing emergency) that the model treats them as one unit. A G with center upside and a C with guard upside share `positionGroup: "IOL/C"` and use `roleFits: { "IOL/C": <value> }`.

## NO_SEASON_MODE

A `const true` flag in `src/types/domain.ts:3`. Locks the product to current-roster, current-staff mode — there is no in-season selector, no historical lookback, no "what would 2025 say." Tested in `src/__tests__/scoring.test.ts`.
