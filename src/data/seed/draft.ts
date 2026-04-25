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
    sourceRefs: [sources.raidersMendoza, sources.nflRaidersDraftTracker],
  },
  {
    overall: 38,
    round: 2,
    pickInRound: 6,
    team: "Las Vegas Raiders",
    status: "made",
    selection: "Treydan Stukes, S, Arizona",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
  {
    overall: 67,
    round: 3,
    pickInRound: 3,
    team: "Las Vegas Raiders",
    status: "made",
    selection: "Keyron Crawford, EDGE, Auburn",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
  {
    overall: 91,
    round: 3,
    pickInRound: 27,
    team: "Las Vegas Raiders",
    status: "made",
    selection: "Trey Zuhn III, C, Texas A&M",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
  {
    overall: 102,
    round: 4,
    pickInRound: 2,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
  {
    overall: 134,
    round: 4,
    pickInRound: 34,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
  {
    overall: 175,
    round: 5,
    pickInRound: 35,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
  {
    overall: 185,
    round: 6,
    pickInRound: 4,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
  {
    overall: 208,
    round: 6,
    pickInRound: 27,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
  {
    overall: 219,
    round: 7,
    pickInRound: 3,
    team: "Las Vegas Raiders",
    status: "upcoming",
    sourceRefs: [sources.nflRaidersDraftTracker],
  },
];

export const focusPicks = raidersDraftPicks.filter(
  (pick) => pick.status === "upcoming",
).slice(0, 3);
