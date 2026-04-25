# Scheme Assumptions

The fragility model is **scheme-aware**, not generic. Every position group is scored against a Klint Kubiak-system role definition. If the staff changes, these assumptions break and need to be revisited.

## Staff anchor

- **Head coach:** Klint Kubiak (hired Feb 9, 2026; 2026 staff announced March 1, 2026).
- **Source:** `raidersCoaches` → https://www.raiders.com/team/coaches-roster/
- **Implication:** wide-zone run game, play-action passing tree, screen sequencing, and 12-personnel mismatch creation through Brock Bowers. The role definitions below are calibrated to that system.

## The 12 scheme roles

Defined in `src/data/seed/roster.ts:357-490` (`schemeRoles[]`). Each entry has four numeric inputs that feed `calculateFragilityScore`:

- `dependencyScore` (0–100) — how scheme-coupled the role is. Higher = more catastrophic if traited replacement is missing.
- `starterLeverage` (0–100) — how much the starter individually carries the unit.
- `replacementScarcity` (0–100) — how hard it is to find a credible replacement at this trait profile.
- `crossTrainingCoverage` (0–40, **on the depth assessment**) — how much the cushion of flex players reduces fragility.

| Position | Role label | Dependency | Leverage | Scarcity | Why it's coupled to the system |
|---|---|---|---|---|---|
| QB | QB play-action operating system | 95 | 88 | 90 | Under-center timing, play-action footwork, middle-field anticipation, protection control. Kubiak QBs are the offense's nervous system. |
| RB | Outside-zone accelerator | 72 | 70 | 42 | Wide-zone track discipline, one-cut acceleration, screen tempo. Replaceable bodies; harder to replicate the explosive-stress dimension. |
| WR | Route-spacing separator stack | 82 | 72 | 63 | Motion timing, slot leverage, intermediate separation, run-block angles. Loss thins play-action windows and forces Bowers into bracketing. |
| TE | TE mismatch engine | 88 | 86 | 72 | Detached alignment, inline blocking, option routes, YAC creation. Built around Bowers; the "explosive answers vs base defense" lever. |
| OT | Wide-zone edge setters | 86 | 84 | 78 | Reach blocks, backside cutoff, play-action edges, screen release timing. Tackle injury collapses keeper game and deep PA. |
| IOL/C | Center and swing-guard axis | 92 | 82 | 76 | Combo calls, reach-and-climb, A-gap pickup, C/G emergency flexibility. Center is scheme-critical for zone calls and screen timing. |
| EDGE | Crosby pressure spine | 92 | 92 | 84 | Four-man pressure, rush lane discipline, stunt timing, run edge violence. Without it, the defense has to blitz to create heat. |
| IDL | Interior gap and pocket control | 70 | 64 | 48 | Gap integrity, pocket push, stunt anchor, early-down run fits. Lower fragility floor; rotational depth absorbs single-injury hits. |
| LB | Coverage LB traffic control | 80 | 75 | 72 | Green-dot communication, match-zone drops, screen trigger, spy and pressure utility. Traffic control is the disguise enabler. |
| CB | Corner match-coverage spine | 84 | 78 | 79 | Nickel leverage, boundary press, match-zone eyes, vertical speed. Loss forces conservative calls and pins safety help outside. |
| S | Safety disguise layer | 78 | 70 | 58 | Post rotation, box trigger, TE match, split-field communication. Drives pre-snap disguise capacity. |
| ST | Specialist operation chain | 54 | 45 | 52 | Kick operation, field-position control, long-snap timing, holder mechanics. Lowest dependency; specialist injury rarely breaks scheme. |

## Failure modes

Each role lists explicit `failureModes[]` describing what breaks first. Examples:

- **QB OS:** "Boot and keeper timing compresses, middle-field throws become late, protection checks lose command."
- **Center axis:** "Zone calls slow down, A-gap pressure changes the call sheet, screen timing loses clean releases."
- **Crosby spine:** "Defense has to blitz to create heat, coverage disguise becomes harder to protect."
- **Corner spine:** "Nickel calls become conservative, safety help gets pinned outside, pressure needs to arrive faster."

These strings power the "What breaks" copy in the UI position-detail panel and the prospect-fit `rationale`.

## Cross-training cushions

Cushions are tracked separately on each `depthAssessment` (`src/data/seed/roster.ts:492-625`):

- **QB:** Kirk Cousins as stabilizing bridge option (cushion 30 — Mendoza-suppression accounted for).
- **TE:** Mayer inline as Y, Bech as big slot (cushion 28).
- **IOL/C:** Powers-Johnson at C/G, Zuhn III at C/G with emergency T history, Meredith at C/G (cushion 30 — the highest).
- **S:** Chinn box/nickel, Stukes big nickel/split safety, T. Johnson nickel safety rotations (cushion 27).
- **EDGE:** Paye inside on pass downs, Crawford situational rush + ST (cushion 15 — limited because Crosby is the load-bearer).
- **CB:** T. Johnson nickel/boundary, Chinn big nickel (cushion 12 — tightest of the back seven).
- **OT:** Glaze can cover both tackle sides (cushion 10 — the thinnest cushion of the high-dependency roles).

The cushion is **subtracted directly** from raw fragility (no weight). A 24-point cushion at center is the difference between an 88-point fragility and a 64-point fragility.

## Confidence per position

Per `depthAssessment.confidence` in `src/data/seed/roster.ts`:

| Confidence range | Position groups |
|---|---|
| **0.60–0.64** (medium-high) | TE, IOL/C, EDGE, ST |
| **0.54–0.58** (medium) | QB, RB, S |
| **0.48–0.52** (low) | OT, IDL, LB, CB, WR |

The eight low-and-medium-confidence groups are the ones most affected by the missing official depth chart. The UI flags them with chips.

## When these assumptions break

Recompute every coefficient if **any** of the following happens:

1. Klint Kubiak is no longer head coach.
2. The offensive coordinator changes the run-game scheme (e.g. swap to gap scheme).
3. The defensive coordinator changes coverage philosophy (e.g. swap match-zone for spot-drop).
4. Brock Bowers is traded — the TE mismatch engine collapses to "competent backup TE" and dependency drops 20+ points.
5. Maxx Crosby is traded or has a long-term injury — the EDGE spine collapses.
6. The Raiders publish their official depth chart (Fall 2026) — the model-derived `depthAssessment.starter`/`backups` should be reconciled against the official lines.

## Background reading

- **Autumnwind brief** (local, file:///Users/chilly/Documents/Projects/autumnwind/raiders_bdb_2026_research_brief.md) — research on the Raiders football R&D org, the Big Data Bowl 2026 landscape, scheme observations under Kubiak, and the public-vs-internal analytics gap.
- **NFL IQ** (https://www.nfl.com/iq) — public surface for team needs, scheme summaries, and projected depth.
- **Raiders coaches roster** (https://www.raiders.com/team/coaches-roster/) — current staff list anchoring scheme assumptions.
