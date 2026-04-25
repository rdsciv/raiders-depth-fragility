import type { DraftPick } from "@/types/domain";
import { sources } from "./sources";

export const raidersDraftPicks: DraftPick[] = [
  {
    overall: 1,
    round: 1,
    pickInRound: 1,
    team: "Las Vegas Raiders",
    status: "made",
    selection: "Fernando Mendoza, QB, Indiana",
    sourceRefs: [sources.raidersMendoza],
  },
  {
    overall: 36,
    round: 2,
    pickInRound: 4,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
  {
    overall: 67,
    round: 3,
    pickInRound: 3,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
  {
    overall: 102,
    round: 4,
    pickInRound: 4,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
  {
    overall: 137,
    round: 5,
    pickInRound: 3,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
  {
    overall: 158,
    round: 5,
    pickInRound: 24,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
  {
    overall: 177,
    round: 6,
    pickInRound: 2,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
  {
    overall: 201,
    round: 6,
    pickInRound: 26,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
  {
    overall: 215,
    round: 6,
    pickInRound: 40,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
  {
    overall: 219,
    round: 6,
    pickInRound: 44,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflDraftOrder],
  },
];

export const focusPicks = raidersDraftPicks.filter(
  (pick) => pick.status === "upcoming" && [36, 67].includes(pick.overall),
);
