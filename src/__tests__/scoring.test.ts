import { describe, expect, it } from "vitest";
import {
  availabilityAtPick,
  calculateFragilityScore,
  calculateProspectFitScore,
  findAvoidDespiteBoard,
  rankPositions,
  rankProspectsForPicks,
} from "@/lib/scoring/fragility";
import { parseProspectCsv, prospectCsvTemplate } from "@/lib/import/prospect-csv";
import { seedData } from "@/data/seed";
import { NO_SEASON_MODE, type DepthAssessment, type FragilityScore, type Prospect, type SchemeRole } from "@/types/domain";

const source = seedData.sources.nflIqLaunch;

function role(overrides: Partial<SchemeRole> = {}): SchemeRole {
  return {
    id: "test-role",
    label: "Test role",
    positionGroup: "IOL/C",
    schemeTraits: ["calls"],
    dependencyScore: 96,
    starterLeverage: 90,
    replacementScarcity: 84,
    failureModes: ["call sheet collapses"],
    sourceRefs: [source],
    ...overrides,
  };
}

function depth(overrides: Partial<DepthAssessment> = {}): DepthAssessment {
  return {
    positionGroup: "IOL/C",
    starter: "Starter",
    backups: [],
    crossTrainedPlayers: [],
    crossTrainingCoverage: 0,
    depthDropoff: 88,
    confidence: 0.55,
    whatBreaks: "The role has no trait-matched emergency option.",
    sourceRefs: [source],
    ...overrides,
  };
}

function prospect(overrides: Partial<Prospect> = {}): Prospect {
  return {
    name: "Trait Match",
    school: "Test State",
    position: "C",
    positionGroup: "IOL/C",
    projectedRange: { min: 45, max: 90 },
    consensusRank: 80,
    nflIqOverall: 82,
    athleticism: 78,
    production: 83,
    readiness: 0.8,
    roleFits: { "IOL/C": 0.95 },
    traits: ["center calls", "zone reach"],
    sourceRefs: [source],
    status: "available",
    ...overrides,
  };
}

describe("fragility scoring", () => {
  it("ranks a high-dependency starter with no matched backup as highly fragile", () => {
    const score = calculateFragilityScore(role(), depth());

    expect(score.total).toBeGreaterThan(85);
    expect(score.crossTrainingCushion).toBe(0);
  });

  it("lowers center fragility when a credible C/G swing option exists", () => {
    const noSwing = calculateFragilityScore(role(), depth());
    const withSwing = calculateFragilityScore(
      role(),
      depth({
        crossTrainedPlayers: ["Credible C/G swing"],
        crossTrainingCoverage: 24,
      }),
    );

    expect(withSwing.total).toBeLessThan(noSwing.total);
    expect(noSwing.total - withSwing.total).toBe(24);
  });

  it("lets a lower-board prospect outrank a better-board player when he reduces top fragility", () => {
    const cbFragility: FragilityScore = {
      positionGroup: "CB",
      schemeDependency: 90,
      starterLeverage: 84,
      depthDropoff: 82,
      crossTrainingCushion: 8,
      replacementScarcity: 86,
      confidence: 0.52,
      total: 78,
      rationale: "Nickel collapse.",
      sourceRefs: [source],
    };
    const teFragility: FragilityScore = {
      ...cbFragility,
      positionGroup: "TE",
      total: 44,
      rationale: "TE depth is cushioned.",
    };
    const cb = prospect({
      name: "Lower Board Corner",
      position: "CB",
      positionGroup: "CB",
      consensusRank: 78,
      roleFits: { CB: 0.92 },
    });
    const te = prospect({
      name: "Higher Board Tight End",
      position: "TE",
      positionGroup: "TE",
      consensusRank: 35,
      nflIqOverall: 88,
      roleFits: { TE: 0.74 },
    });

    const cbScore = calculateProspectFitScore({
      prospect: cb,
      fragilityScore: cbFragility,
      targetPick: 67,
    });
    const teScore = calculateProspectFitScore({
      prospect: te,
      fragilityScore: teFragility,
      targetPick: 67,
    });

    expect(cbScore.total).toBeGreaterThan(teScore.total);
  });
});

describe("draft and import invariants", () => {
  it("treats made Raiders picks as drafted and starts the live window at pick 102", () => {
    const mendoza = seedData.prospects.find((entry) => entry.name === "Fernando Mendoza");
    const stukes = seedData.prospects.find((entry) => entry.name === "Treydan Stukes");
    const crawford = seedData.prospects.find((entry) => entry.name === "Keyron Crawford");
    const zuhn = seedData.prospects.find((entry) => entry.name === "Trey Zuhn III");
    const upcoming = seedData.focusPicks.map((pick) => pick.overall);
    const made = seedData.draftPicks
      .filter((pick) => pick.status === "made")
      .map((pick) => pick.overall);

    expect(mendoza?.status).toBe("drafted");
    expect(stukes?.draftedOverall).toBe(38);
    expect(crawford?.draftedOverall).toBe(67);
    expect(zuhn?.draftedOverall).toBe(91);
    expect(availabilityAtPick(mendoza!, 102)).toBe(0);
    expect(made).toEqual([1, 38, 67, 91]);
    expect(upcoming[0]).toBe(102);
    expect(upcoming).toContain(134);
  });

  it("shows official depth chart absence as a source confidence warning", () => {
    expect(seedData.sources.raidersDepthChart.note).toContain("Fall 2026");
    expect(seedData.depthAssessments.some((entry) => entry.confidence < 0.6)).toBe(true);
  });

  it("parses manual NFL IQ CSV rows and reports validation errors", () => {
    const validCsv = `${prospectCsvTemplate}\nMakai Lemon,USC,WR,WR,42,72,58,83,80,82,0.72,"separator|return value",https://www.nfl.com/draft/`;
    const parsed = parseProspectCsv(validCsv);
    const invalid = parseProspectCsv("name,school\nOnly Name,Nowhere");

    expect(parsed.errors).toHaveLength(0);
    expect(parsed.prospects[0].name).toBe("Makai Lemon");
    expect(invalid.errors[0]).toContain("Missing headers");
  });

  it("rejects a CSV row whose nflIqOverall exceeds the 0-100 range and names the offending field", () => {
    const badNumberCsv = `${prospectCsvTemplate}\nOverflow Guy,Nowhere State,WR,WR,42,72,58,150,80,82,0.72,"fast",https://www.nfl.com/draft/`;
    const result = parseProspectCsv(badNumberCsv);

    expect(result.prospects).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/^Line 2:/);
    expect(result.errors[0]).toContain("nflIqOverall");
  });

  it("rejects a CSV row with a malformed sourceUrl and names the offending field", () => {
    const badUrlCsv = `${prospectCsvTemplate}\nBad URL Guy,Nowhere State,WR,WR,42,72,58,72,80,82,0.72,"fast",not-a-real-url`;
    const result = parseProspectCsv(badUrlCsv);

    expect(result.prospects).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain("sourceUrl");
  });

  it("rankProspectsForPicks throws when targetPicks is empty instead of returning prospects with undefined bestScore", () => {
    expect(() =>
      rankProspectsForPicks({
        prospects: seedData.prospects,
        fragilityScores: rankPositions(
          seedData.schemeRoles,
          seedData.depthAssessments,
        ).map((position) => position.score),
        targetPicks: [],
      }),
    ).toThrow(/targetPicks/);
  });

  it("keeps rankings deterministic from seed data", () => {
    const positions = rankPositions(seedData.schemeRoles, seedData.depthAssessments);
    const prospects = rankProspectsForPicks({
      prospects: seedData.prospects,
      fragilityScores: positions.map((position) => position.score),
      targetPicks: seedData.focusPicks,
    });

    expect(positions[0].positionGroup).toBe("OT");
    expect(prospects[0].bestScore.total).toBeGreaterThan(20);
    expect(
      prospects.every((entry) => entry.prospect.status === "available"),
    ).toBe(true);
  });

  it("surfaces parsed CSV prospects in rankProspectsForPicks output alongside seed prospects", () => {
    const csvRow = `${prospectCsvTemplate}\nCsv Import Prospect,Oklahoma State,S,S,88,146,119,74,78,80,0.58,"box safety|dime utility",https://www.nfl.com/draft/`;
    const imported = parseProspectCsv(csvRow);
    expect(imported.errors).toHaveLength(0);
    expect(imported.prospects).toHaveLength(1);

    const fragilityScores = rankPositions(
      seedData.schemeRoles,
      seedData.depthAssessments,
    ).map((position) => position.score);

    const ranked = rankProspectsForPicks({
      prospects: [...seedData.prospects, ...imported.prospects],
      fragilityScores,
      targetPicks: seedData.focusPicks,
    });

    expect(
      ranked.some((entry) => entry.prospect.name === "Csv Import Prospect"),
    ).toBe(true);
  });

  it("locks the product to current-roster mode instead of a season selector", () => {
    expect(NO_SEASON_MODE).toBe(true);
    expect(seedData.focusPicks.every((pick) => pick.status === "upcoming")).toBe(true);
  });
});

describe("findAvoidDespiteBoard", () => {
  const fragility: FragilityScore = {
    positionGroup: "IOL/C",
    schemeDependency: 90,
    starterLeverage: 85,
    depthDropoff: 82,
    crossTrainingCushion: 0,
    replacementScarcity: 80,
    confidence: 0.6,
    total: 84,
    rationale: "Test.",
    sourceRefs: [source],
  };

  function rankedEntry(
    overrides: Partial<Prospect>,
    totalOverride: number,
  ): { prospect: Prospect; scores: ReturnType<typeof calculateProspectFitScore>[]; bestScore: ReturnType<typeof calculateProspectFitScore> } {
    const p = prospect(overrides);
    const score = calculateProspectFitScore({
      prospect: p,
      fragilityScore: fragility,
      targetPick: 36,
    });
    const stubbedBest = { ...score, total: totalOverride };
    return { prospect: p, scores: [stubbedBest], bestScore: stubbedBest };
  }

  it("returns a top-50 consensus prospect whose best score is below 30", () => {
    const strongFit = rankedEntry({ name: "Strong Fit", consensusRank: 12 }, 72);
    const trap = rankedEntry({ name: "Board Trap", consensusRank: 28 }, 18);
    const filler = rankedEntry({ name: "Filler", consensusRank: 140 }, 10);

    const result = findAvoidDespiteBoard([strongFit, trap, filler]);

    expect(result?.prospect.name).toBe("Board Trap");
  });

  it("returns null when no prospect meets the consensus-rank-and-low-score criterion", () => {
    const strongFit = rankedEntry({ name: "Strong Fit", consensusRank: 12 }, 72);
    const midTier = rankedEntry({ name: "Mid Tier", consensusRank: 80 }, 22);
    const deepCut = rankedEntry({ name: "Deep Cut", consensusRank: null }, 14);

    const result = findAvoidDespiteBoard([strongFit, midTier, deepCut]);

    expect(result).toBeNull();
  });

  it("returns null when given an empty ranked list", () => {
    expect(findAvoidDespiteBoard([])).toBeNull();
  });
});
