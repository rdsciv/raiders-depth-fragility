import type {
  DepthAssessment,
  DraftPick,
  FragilityScore,
  PositionGroup,
  Prospect,
  ProspectFitScore,
  SchemeRole,
  SourceRef,
} from "@/types/domain";

export type RankedPosition = {
  positionGroup: PositionGroup;
  role: SchemeRole;
  depth: DepthAssessment;
  score: FragilityScore;
};

export type RankedProspect = {
  prospect: Prospect;
  scores: ProspectFitScore[];
  bestScore: ProspectFitScore;
};

const roundOneDecimal = (value: number) => Math.round(value * 10) / 10;

const dedupeSources = (sources: SourceRef[]) => {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.label}:${source.url}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export function calculateFragilityScore(
  role: SchemeRole,
  depth: DepthAssessment,
): FragilityScore {
  const rawTotal =
    0.35 * role.dependencyScore +
    0.3 * depth.depthDropoff +
    0.2 * role.starterLeverage +
    0.15 * role.replacementScarcity -
    depth.crossTrainingCoverage;

  const total = roundOneDecimal(Math.max(0, rawTotal));

  return {
    positionGroup: role.positionGroup,
    schemeDependency: role.dependencyScore,
    starterLeverage: role.starterLeverage,
    depthDropoff: depth.depthDropoff,
    crossTrainingCushion: depth.crossTrainingCoverage,
    replacementScarcity: role.replacementScarcity,
    confidence: depth.confidence,
    total,
    rationale: `${role.label}: ${depth.whatBreaks}`,
    sourceRefs: dedupeSources([...role.sourceRefs, ...depth.sourceRefs]),
  };
}

export function rankPositions(
  roles: SchemeRole[],
  depths: DepthAssessment[],
): RankedPosition[] {
  return roles
    .map((role) => {
      const depth = depths.find(
        (assessment) => assessment.positionGroup === role.positionGroup,
      );

      if (!depth) {
        throw new Error(`Missing depth assessment for ${role.positionGroup}`);
      }

      return {
        positionGroup: role.positionGroup,
        role,
        depth,
        score: calculateFragilityScore(role, depth),
      };
    })
    .sort((a, b) => b.score.total - a.score.total);
}

export function availabilityAtPick(prospect: Prospect, pick: number) {
  if (prospect.status === "drafted") {
    return 0;
  }

  if (pick < prospect.projectedRange.min) {
    return 0.96;
  }

  if (pick <= prospect.projectedRange.max) {
    return 0.82;
  }

  if (pick <= prospect.projectedRange.max + 20) {
    return 0.36;
  }

  return 0.12;
}

export function opportunityCost(prospect: Prospect, pick: number) {
  if (prospect.status === "drafted") {
    return 100;
  }

  const reachCost =
    pick < prospect.projectedRange.min
      ? Math.min(18, (prospect.projectedRange.min - pick) * 0.18)
      : 0;

  const boardCost =
    prospect.consensusRank && prospect.consensusRank > pick + 55
      ? Math.min(12, (prospect.consensusRank - pick - 55) * 0.12)
      : 0;

  return roundOneDecimal(reachCost + boardCost);
}

export function calculateProspectFitScore({
  prospect,
  fragilityScore,
  targetPick,
}: {
  prospect: Prospect;
  fragilityScore: FragilityScore;
  targetPick: number;
}): ProspectFitScore {
  const roleFit = prospect.roleFits[fragilityScore.positionGroup] ?? 0.18;
  const nflIqSignal = prospect.nflIqOverall / 100;
  const availability = availabilityAtPick(prospect, targetPick);
  const cost = opportunityCost(prospect, targetPick);
  const fragilityReduction = roundOneDecimal(
    fragilityScore.total * roleFit * prospect.readiness,
  );
  const total = roundOneDecimal(
    fragilityScore.total *
      roleFit *
      prospect.readiness *
      availability *
      nflIqSignal -
      cost,
  );

  return {
    prospectName: prospect.name,
    positionGroup: prospect.positionGroup,
    targetPick,
    roleFit,
    readiness: prospect.readiness,
    nflIqSignal,
    availabilityAtPick: availability,
    fragilityReduction,
    opportunityCost: cost,
    total,
    rationale:
      prospect.status === "drafted"
        ? `${prospect.name} is already drafted and removed from the recommendation set.`
        : `${prospect.name} targets ${fragilityScore.positionGroup} fragility with ${prospect.traits.slice(0, 3).join(", ")}.`,
    sourceRefs: dedupeSources([...prospect.sourceRefs, ...fragilityScore.sourceRefs]),
  };
}

export function findAvoidDespiteBoard(
  rankedProspects: RankedProspect[],
): RankedProspect | null {
  return (
    rankedProspects.find(
      (entry) =>
        entry.prospect.consensusRank !== null &&
        entry.prospect.consensusRank <= 50 &&
        entry.bestScore.total < 30,
    ) ?? null
  );
}

export function rankProspectsForPicks({
  prospects,
  fragilityScores,
  targetPicks,
}: {
  prospects: Prospect[];
  fragilityScores: FragilityScore[];
  targetPicks: DraftPick[];
}): RankedProspect[] {
  if (targetPicks.length === 0) {
    throw new Error(
      "rankProspectsForPicks requires at least one pick in targetPicks to compute a bestScore.",
    );
  }

  return prospects
    .map((prospect) => {
      const matchingFragility = fragilityScores.find(
        (score) => score.positionGroup === prospect.positionGroup,
      );

      if (!matchingFragility) {
        throw new Error(`Missing fragility score for ${prospect.positionGroup}`);
      }

      const scores = targetPicks.map((pick) =>
        calculateProspectFitScore({
          prospect,
          fragilityScore: matchingFragility,
          targetPick: pick.overall,
        }),
      );

      const bestScore = [...scores].sort((a, b) => b.total - a.total)[0];

      return { prospect, scores, bestScore };
    })
    .filter((entry) => entry.prospect.status === "available")
    .sort((a, b) => b.bestScore.total - a.bestScore.total);
}
