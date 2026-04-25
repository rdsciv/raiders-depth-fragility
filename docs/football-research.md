# Football Research

This page is the football reasoning that justifies every number in the seed data. The full underlying research artifact is the **Raiders Analytics Advantage Brief** (April 20, 2026), included in-repo at [`docs/raiders-research-brief.md`](./raiders-research-brief.md). This page extracts the parts that directly drive the depth-fragility tool.

If you cloned this repo and don't understand why a particular `dependencyScore` or `roleFit` is what it is, this is the page that should answer it. If it doesn't, the brief at `docs/raiders-research-brief.md` is the deeper layer; the brief's own citations are the third layer.

---

## 1. Coaching ground truth

The model is calibrated to the **Klint Kubiak** staff hired Feb 9, 2026, with the rest of the staff finalized March 1, 2026.

| Role | Name | Source in the brief |
|---|---|---|
| GM | John Spytek | §4.1 |
| Head coach | **Klint Kubiak** (hired Feb 9, 2026) | §4.1 + raiders.com Kubiak hire announcement |
| Offensive coordinator | Andrew Janocko | §4.1 |
| Defensive coordinator | Rob Leonard | §4.1 |
| Pass game coordinator / DBs | Joe Woods | §4.1 |
| Special teams coordinator | Joe DeCamillis | §4.1 |
| Assistant HC | Mike McCoy | §4.1 |

> **Brief, §4.1:** "Changed within 90 days: every staff item above except the GM-facing draft coverage."

This matters because the entire fragility model assumes scheme continuity through these names. If Kubiak leaves, every `dependencyScore` and `failureMode` in `src/data/seed/roster.ts` needs to be re-derived.

---

## 2. Scheme identity → why the dependency scores are what they are

### 2.1 Offense — Kubiak's wide-zone / play-action / keeper system

> **Brief, §4.3:** "Kubiak's background points to a Shanahan/Kubiak family structure: under-center, wide-zone / keeper / play-action stress, but with enough passing-game flexibility to incorporate modern shotgun answers. His hiring announcement explicitly highlights successful recent work in Seattle, New Orleans, San Francisco, and Minnesota, all strong play-action/play-sequencing environments."

This drives the offensive scheme roles in `src/data/seed/roster.ts:357-490`:

| Role | Why it scores high on dependency |
|---|---|
| **QB play-action operating system** (dep 95) | Under-center timing and middle-field anticipation are the Kubiak system's nervous system. A QB who can't operate the play-action menu collapses the entire offense's identity. |
| **Center and swing-guard axis** (dep 92) | Combo calls and reach-and-climb are scheme-critical for the wide-zone identity. Center calls drive everything else. |
| **TE mismatch engine** (dep 88) | Bowers-centric: detached alignment + inline blocking + option routes is the explosive-answer lever vs base defense. The brief (§3.5) flags Bowers's rookie-cost efficiency as something the team should "lean into." |
| **Wide-zone edge setters** (dep 86) | Reach blocks, backside cutoff, play-action edges. Tackle injury collapses keeper game and deep PA. |
| **Route-spacing separator stack** (dep 82) | Motion timing + slot leverage. The brief (§3.6) explicitly flags "Big slot / movement WRs who can block and win from reduced splits" as fitting "Kubiak-tree play-action and condensed-formation sequencing." |
| **Outside-zone accelerator** (RB, dep 72) | Wide-zone track discipline. Lower dependency because the brief and league context show RB is a more replaceable trait profile in this scheme. |

### 2.2 Defense — Rob Leonard / Joe Woods modernized blend

> **Brief, §4.3:** "the current public staff map points less to a pure 'Pete Carroll defense' and more to a modernized blend through Rob Leonard and Joe Woods. The actionable question is not whether the Raiders 'are Cover 3'; it is how often they can show single-high structure and rotate into matchup-sound answers against condensed-motion offenses."

This drives the defensive scheme roles:

| Role | Why it scores high on dependency |
|---|---|
| **Crosby pressure spine** (dep 92, leverage 92) | The single highest-leverage role on the roster. Without it the defense is forced into blitz-to-pressure, which forfeits coverage disguise (per §4.3 and §3.5 brief context on Crosby's centrality). |
| **Corner match-coverage spine** (dep 84) | Nickel leverage + boundary press + match-zone eyes. Per the brief (§3.5), corner is in NFL IQ's top need stack — the room cannot afford a single-injury collapse here. |
| **Coverage LB traffic control** (dep 80) | Green-dot communication + match-zone drops. Modern AFC West offenses force matchups (brief §3.6, "coverage-capable linebackers" as an undervalued archetype). |
| **Safety disguise layer** (dep 78) | Drives pre-snap disguise capacity per the §4.3 framing of single-high structure with rotation. |
| **Interior gap and pocket control** (IDL, dep 70) | Lower because rotational depth absorbs single-injury hits per the brief's §3.5 discussion of roster shape. |

### 2.3 Special teams

> **Brief, §2.5:** "Special-teams tracking is a real edge domain because public attention is thinner."

ST gets dependency 54 — the lowest. Specialists can be replaced from the street without scheme-level damage; the brief reinforces that ST is more of an analytical edge than a roster-fragility risk.

---

## 3. Roster context (April 2026)

### 3.1 What the brief says about the roster

> **Brief, §3.5 (Documented core strengths):**
> - **Star edge:** Maxx Crosby remains the centerpiece.
> - **Cheap offensive skill talent:** Brock Bowers and Ashton Jeanty are still on favorable rookie structures.
> - **NFL IQ offensive core snapshot:** Cousins/O'Connell at QB, Jeanty at RB, Bowers/Mayer at TE, Tucker/Nailor/Bech/Thornton Jr. at WR.
> - **NFL IQ offensive-line core snapshot:** Miller, Linderbaum, Powers-Johnson, Burford, Glaze. Miller/Linderbaum as the clear veteran cornerstones.

These are the names that get high `starterLeverage` and `crossTrainingCoverage` credit in `depthAssessments[]`. Cross-training cushions reflect the brief's read that Mayer keeps 12-personnel playable, that Powers-Johnson and Zuhn III give the C/G axis real swing depth, and that Chinn + Stukes give the safety room a credible big-nickel cushion.

### 3.2 What the brief flags as weaknesses

> **Brief, §3.5 (Likely weaknesses):**
> - **Long-term QB certainty** is not solved by Cousins alone (both QBs tracking to 2027 free agency).
> - **WR depth / separation creation** remains a public concern; NFL IQ "explicitly says the current room still lacks a true WR1."
> - **OL beyond Miller/Linderbaum/JPJ core** remains a build area; Ask NFL IQ flags guard as a glaring hole.
> - **CB and IDL** also show in NFL IQ's need stack.

These weaknesses translate directly into elevated fragility scores at WR (depth dropoff 58, low confidence 0.5), OT (depth dropoff 62, confidence 0.52), and CB (depth dropoff 68, lowest confidence 0.5 alongside WR).

### 3.3 Cap context (why the tool exists)

> **Brief, §3.5:** "Over the Cap lists about $23.25M in 2026 effective cap space, but also about $52.0M in dead money; 2027 projects much cleaner at about $108.5M of effective cap space."

The model's bias toward **fragility-reducing rookies who can play in 2026** (high `readiness` weight in the fit formula) reflects the cap shape: the team needs cheap rookie impact to bridge to a clean 2027.

---

## 4. Why Mendoza is locked in at #1

> **Brief, §3.2:** "Fernando Mendoza: QB value swamps positional-market concerns if the internal model clears him. Public Raiders coverage strongly suggests he is the live No. 1 overall discussion."

Confirmed by the raiders.com Mendoza announcement (April 23, 2026, see `sources.raidersMendoza`). The model:

- Sets Mendoza's `status: "drafted"` in `src/data/seed/prospects.ts`.
- Suppresses any QB recommendations downstream by lowering QB depth dropoff to 40 (`depthAssessments[]` for QB explicitly notes "the tool treats Mendoza as already drafted, so remaining QB value is suppressed unless the room wants a redundant emergency investment").

A test in `src/__tests__/scoring.test.ts` locks the invariant: `availabilityAtPick(mendoza, 102) === 0`.

---

## 5. Undervalued archetypes (why specific prospect roleFits look the way they do)

> **Brief, §3.6:**
> 1. **Big slot / movement WRs who can block and win from reduced splits.** Fits Kubiak-tree play-action and condensed-formation sequencing.
> 2. **Coverage-capable linebackers and big nickel defenders.** Modern AFC West offenses force matchups, not just gap fits.
> 3. **Day-2/Day-3 tackles with verified movement skill** who can be developed inside/outside before 2027 cap clean-up.
> 4. **Corners with length plus speed but modest ball-production résumés.** Public models may slightly discount them; scheme fit may not.

These four archetypes inform several `roleFits` weightings in `src/data/seed/prospects.ts`. For example:

- Safety prospects with nickel/CB crossover (e.g. Treydan Stukes `roleFits: { S: 0.88, CB: 0.32 }`, A.J. Haulcy `{ S: 0.86, CB: 0.24 }`, Kamari Ramsey `{ S: 0.8, LB: 0.22 }`) get crossover weight reflecting archetype #2.
- Big-frame WR prospects (Chris Bell, Bryce Lance) lean into archetype #1.
- IOL prospects with C/G swing potential (Pregnon, Slaughter, Rutledge) reflect archetype #3.
- Length-and-speed corners with thinner ball production (Cisse, Dixon) reflect archetype #4.

---

## 6. Pick inventory and trade-value snapshot

> **Brief, §3.4:**
>
> | Round | Pick | Jimmy Johnson | Rich Hill | Fitzgerald-Spielberger / OTC |
> |---|---|---|---|---|
> | 1 | 1 | 3000 | 1000 | 514 |
> | 2 | 36 | 540 | 166 | 159 |
> | 3 | 67 | 255 | 75 | 91 |
> | 4 | 102 | 92 | 34 | 52 |
> | 4 | 117 | 60 | 26 | 41 |
> | 4 | 134 | 39 | 17 | 31 |
> | 5 | 175 | 21.4 | 8 | 16 |
> | 6 | 185 | 17 | 7 | 13 |
> | 6 | 208 | 7.8 | 4 | 8 |
> | 7 | 219 | 3 | 4 | 6 |
>
> **Interpretation:** Jimmy Johnson still massively overstates the value of No. 1 overall versus modern charts. If the Raiders trade down, they should anchor negotiations to a modern chart, not let another club frame the deal with legacy Jimmy Johnson math.

The original pick inventory is reflected in `src/data/seed/draft.ts`. The Raiders' actual draft has unfolded as: #1 Mendoza (made), #38 Stukes (made — note the brief's pick was #36 because of a trade), #67 Crawford (made), #91 Zuhn III (made — also from a trade). Live tracking via `sources.nflRaidersDraftTracker`.

The trade chart context isn't currently used in the scoring engine (the model uses `availabilityAtPick` and `opportunityCost` instead), but it's useful background if you ever extend the model to evaluate trade-down scenarios.

---

## 7. Where the model is *not* the brief

The brief is broader than this tool. It covers BDB 2027 strategy, public-vs-proprietary analytics gaps, organizational outreach, and a 90-day plan. Sections **not** baked into the depth-fragility model:

- **Section 1** (BDB landscape 2019–2026) — context only.
- **Section 2** (NFL analytics state of the art) — context only.
- **Section 5** (Strategic advantage brainstorm) — concept catalog for separate projects, not features of this tool.
- **Section 6** (BDB 2027 bets) — separate prototype roadmap.
- **Section 7** (Outreach and positioning) — career strategy.
- **Prioritized 90-Day Action Plan** — separate execution track.

If anything in this tool ever needs to draw on those sections (e.g. trade-value modeling, scheme-weighted surplus boards, comp-pick farming), the linked sections of [`docs/raiders-research-brief.md`](./raiders-research-brief.md) are the starting point.

---

## 8. When to refresh this page

Update **all** of the following whenever any of these happen:

| Event | Refresh |
|---|---|
| Klint Kubiak departs as head coach | Re-derive every `schemeRoles[]` entry; this page's §1 + §2 must be rewritten. |
| Maxx Crosby is traded or has a long-term injury | EDGE pressure spine collapses; §2.2 needs an immediate revision. |
| Brock Bowers is traded | TE mismatch engine collapses; §2.1 row must be rewritten. |
| Raiders publish their official depth chart (Fall 2026) | Reconcile every `depthAssessment.starter`/`backups` against the official lines; raise `confidence` to ≥ 0.8 for matches. |
| Cap context shifts materially (extension, restructure, dead money write-off) | §3.3 update. |
| The brief itself is revised | Re-copy the brief into `docs/raiders-research-brief.md` and re-cite the updated section numbers from this page. |
