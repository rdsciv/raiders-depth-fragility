# Scoring Methodology

The Raiders Depth Fragility tool uses **deterministic scoring only** — no LLM, no network calls, no randomness. Two pure functions in `src/lib/scoring/fragility.ts` produce every number you see in the UI: `calculateFragilityScore` (per position) and `calculateProspectFitScore` (per prospect × pick).

## 1. Position fragility

Per-position fragility answers: *how fast does the game plan break if a starter is lost?*

```
fragility.total =
    0.35 × role.dependencyScore        // how scheme-coupled the role is
  + 0.30 × depth.depthDropoff          // how far quality falls to backup
  + 0.20 × role.starterLeverage        // how much the starter carries the unit
  + 0.15 × role.replacementScarcity    // how hard a replacement is to find
  − depth.crossTrainingCoverage        // credible flex options reduce fragility
```

Result is `Math.max(0, raw)` (no negative fragility), rounded to one decimal.

**Inputs** — see `src/data/seed/roster.ts`:
- `schemeRoles[]` provides `dependencyScore`, `starterLeverage`, `replacementScarcity`, `failureModes` per position group.
- `depthAssessments[]` provides `depthDropoff`, `crossTrainingCoverage`, `confidence`, `whatBreaks` per position group.

**Coefficients explained:**
- `0.35` on `dependencyScore` — the largest weight, because a scheme-critical role (Kubiak's QB OS, Crosby pressure spine, center axis) is what actually breaks first.
- `0.30` on `depthDropoff` — the second-largest weight; a star at a position with a competent backup is less fragile than a competent starter with no plan B.
- `0.20` on `starterLeverage` — secondary multiplier for "how much one player carries the unit."
- `0.15` on `replacementScarcity` — smallest weight; the market for replacements at any position is real but slower-moving than scheme fit.
- `crossTrainingCoverage` is **subtracted, not weighted** — it's a direct reduction. A C/G swing player credibly removes ~24 fragility points (see `src/__tests__/scoring.test.ts:73-85` for the proof).

Code: `calculateFragilityScore` in `src/lib/scoring/fragility.ts:39-64`.

## 2. Prospect fit score

Per-prospect-per-pick fit answers: *if we drafted this player at this slot, how much fragility would we actually reduce?*

```
fit.total =
    fragility.total
  × roleFit                  // how well the prospect fits this position group's role (0–1)
  × readiness                // can he start meaningful snaps in 2026? (0–1)
  × availabilityAtPick       // probability he's still on the board (0–1)
  × nflIqSignal              // nflIqOverall / 100 (0–1)
  − opportunityCost          // reach + board-value penalty
```

A separate `fragilityReduction` value is reported for the recommendation panel:

```
fragilityReduction = fragility.total × roleFit × readiness
```

This is the "best-case in-season impact" if the player is in fact available and selected.

Code: `calculateProspectFitScore` in `src/lib/scoring/fragility.ts:128-170`.

### 2a. `availabilityAtPick`

Probability buckets — calibrated against `prospect.projectedRange`:

| Pick position vs. projected range | Probability |
|---|---|
| Pick is **before** `projectedRange.min` (we'd be reaching) | **0.96** |
| Pick is **inside** the range | **0.82** |
| Pick is **0–20 picks past** `projectedRange.max` | **0.36** |
| Pick is **more than 20 picks past** the range | **0.12** |
| `prospect.status === "drafted"` | **0** |

These are coarse buckets, not posterior estimates. They're tuned so the model rewards range-aware patience and punishes deep-reach optimism. If you want different curves, change them in `availabilityAtPick` in `src/lib/scoring/fragility.ts:90-108`.

### 2b. `opportunityCost`

Two costs combine, both rounded to one decimal:

**Reach cost** (taking too early):
- 0 if pick is at or after `projectedRange.min`
- otherwise `min(18, (projectedRange.min − pick) × 0.18)` — caps at 18 to prevent any single reach from dominating.

**Board-value cost** (taking too late vs consensus):
- 0 if `consensusRank` is null or within 55 of the pick
- otherwise `min(12, (consensusRank − pick − 55) × 0.12)` — caps at 12.

The 55-pick cushion exists because consensus is noise; a small mismatch shouldn't penalize.

Code: `opportunityCost` in `src/lib/scoring/fragility.ts:110-126`.

### 2c. The `roleFit` default

If a prospect's `roleFits` map doesn't list the position group being scored, the engine falls back to **0.18** (`src/lib/scoring/fragility.ts:137`). This is intentional: a prospect with no claimed positional crossover at the target group should still produce a small non-zero fit (he might still develop), but shouldn't anchor a recommendation.

## 3. Why deterministic

Three reasons:
1. **Reproducibility in the room.** Two coaches looking at the same seed data must see the same number.
2. **Auditability.** Every number traces to a coefficient and a source row. There is no opaque LLM judgment to defend.
3. **Source confidence is honest.** Each `depthAssessment.confidence` is propagated to the UI so users see exactly how shaky the underlying read is. An LLM would smooth that uncertainty away.

## 4. Empty-input behavior

`rankProspectsForPicks` throws if `targetPicks` is empty (`src/lib/scoring/fragility.ts:181-185`). Calling code is responsible for filtering picks to the live window before passing them in. The seed already locks `focusPicks` to upcoming picks only.

## 5. Where to adjust

| To change… | Edit… |
|---|---|
| The four fragility weights | `calculateFragilityScore` in `src/lib/scoring/fragility.ts:43-48` |
| The availability buckets | `availabilityAtPick` in `src/lib/scoring/fragility.ts:90-108` |
| Reach/board cost caps and slopes | `opportunityCost` in `src/lib/scoring/fragility.ts:115-125` |
| Default roleFit when no key matches | `src/lib/scoring/fragility.ts:137` |
| The "avoid despite board" trigger (consensus ≤ 50 AND total < 30) | `findAvoidDespiteBoard` in `src/lib/scoring/fragility.ts` |

Every number is one constant in one file. Adjust with intent.
