import { z } from "zod";

export const NO_SEASON_MODE = true as const;

export const positionGroupSchema = z.enum([
  "QB",
  "RB",
  "WR",
  "TE",
  "OT",
  "IOL/C",
  "EDGE",
  "IDL",
  "LB",
  "CB",
  "S",
  "ST",
]);

export type PositionGroup = z.infer<typeof positionGroupSchema>;

export const sourceRefSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  retrievedAt: z.string().min(1),
  note: z.string().optional(),
});

export type SourceRef = z.infer<typeof sourceRefSchema>;

export const rosterPlayerSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  positionGroup: positionGroupSchema,
  positionFlex: z.array(z.string()).default([]),
  age: z.number().int().positive().nullable(),
  experience: z.string().min(1),
  college: z.string().min(1),
  sourceRefs: z.array(sourceRefSchema).min(1),
});

export type RosterPlayer = z.infer<typeof rosterPlayerSchema>;

export const schemeRoleSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  positionGroup: positionGroupSchema,
  schemeTraits: z.array(z.string().min(1)).min(1),
  dependencyScore: z.number().min(0).max(100),
  starterLeverage: z.number().min(0).max(100),
  replacementScarcity: z.number().min(0).max(100),
  failureModes: z.array(z.string().min(1)).min(1),
  sourceRefs: z.array(sourceRefSchema).min(1),
});

export type SchemeRole = z.infer<typeof schemeRoleSchema>;

export const depthAssessmentSchema = z.object({
  positionGroup: positionGroupSchema,
  starter: z.string().min(1),
  backups: z.array(z.string().min(1)).default([]),
  crossTrainedPlayers: z.array(z.string().min(1)).default([]),
  crossTrainingCoverage: z.number().min(0).max(40),
  depthDropoff: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  whatBreaks: z.string().min(1),
  sourceRefs: z.array(sourceRefSchema).min(1),
});

export type DepthAssessment = z.infer<typeof depthAssessmentSchema>;

export const draftPickSchema = z.object({
  overall: z.number().int().positive(),
  round: z.number().int().positive(),
  pickInRound: z.number().int().positive(),
  team: z.string().min(1),
  status: z.enum(["made", "upcoming"]),
  selection: z.string().optional(),
  sourceRefs: z.array(sourceRefSchema).min(1),
});

export type DraftPick = z.infer<typeof draftPickSchema>;

export const prospectSchema = z.object({
  name: z.string().min(1),
  school: z.string().min(1),
  position: z.string().min(1),
  positionGroup: positionGroupSchema,
  projectedRange: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  }),
  consensusRank: z.number().int().positive().nullable(),
  nflIqOverall: z.number().min(0).max(100),
  athleticism: z.number().min(0).max(100),
  production: z.number().min(0).max(100),
  readiness: z.number().min(0).max(1),
  roleFits: z.partialRecord(positionGroupSchema, z.number().min(0).max(1)).default({}),
  traits: z.array(z.string().min(1)).min(1),
  sourceRefs: z.array(sourceRefSchema).min(1),
  status: z.enum(["available", "drafted"]).default("available"),
});

export type Prospect = z.infer<typeof prospectSchema>;

export const fragilityScoreSchema = z.object({
  positionGroup: positionGroupSchema,
  schemeDependency: z.number().min(0).max(100),
  starterLeverage: z.number().min(0).max(100),
  depthDropoff: z.number().min(0).max(100),
  crossTrainingCushion: z.number().min(0).max(40),
  replacementScarcity: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  total: z.number(),
  rationale: z.string().min(1),
  sourceRefs: z.array(sourceRefSchema).min(1),
});

export type FragilityScore = z.infer<typeof fragilityScoreSchema>;

export const prospectFitScoreSchema = z.object({
  prospectName: z.string().min(1),
  positionGroup: positionGroupSchema,
  targetPick: z.number().int().positive(),
  roleFit: z.number().min(0).max(1),
  readiness: z.number().min(0).max(1),
  nflIqSignal: z.number().min(0).max(1),
  availabilityAtPick: z.number().min(0).max(1),
  fragilityReduction: z.number(),
  opportunityCost: z.number().min(0),
  total: z.number(),
  rationale: z.string().min(1),
  sourceRefs: z.array(sourceRefSchema).min(1),
});

export type ProspectFitScore = z.infer<typeof prospectFitScoreSchema>;

export const csvProspectRowSchema = z.object({
  name: z.string().min(1),
  school: z.string().min(1),
  position: z.string().min(1),
  positionGroup: positionGroupSchema,
  projectedMin: z.coerce.number().int().positive(),
  projectedMax: z.coerce.number().int().positive(),
  consensusRank: z.coerce.number().int().positive().optional(),
  nflIqOverall: z.coerce.number().min(0).max(100),
  athleticism: z.coerce.number().min(0).max(100),
  production: z.coerce.number().min(0).max(100),
  readiness: z.coerce.number().min(0).max(1),
  traits: z.string().min(1),
  sourceUrl: z.string().url(),
});

export type CsvProspectRow = z.infer<typeof csvProspectRowSchema>;
