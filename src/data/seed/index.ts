import {
  depthAssessmentSchema,
  draftPickSchema,
  prospectSchema,
  rosterPlayerSchema,
  schemeRoleSchema,
} from "@/types/domain";
import { focusPicks, raidersDraftPicks } from "./draft";
import { prospects } from "./prospects";
import { depthAssessments, rosterPlayers, schemeRoles } from "./roster";
import { DATA_AS_OF, sourceList, sources } from "./sources";

export const seedData = {
  dataAsOf: DATA_AS_OF,
  sources,
  sourceList,
  rosterPlayers: rosterPlayerSchema.array().parse(rosterPlayers),
  schemeRoles: schemeRoleSchema.array().parse(schemeRoles),
  depthAssessments: depthAssessmentSchema.array().parse(depthAssessments),
  prospects: prospectSchema.array().parse(prospects),
  draftPicks: draftPickSchema.array().parse(raidersDraftPicks),
  focusPicks: draftPickSchema.array().parse(focusPicks),
};
