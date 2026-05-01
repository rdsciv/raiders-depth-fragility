import type { SourceRef } from "@/types/domain";

export const DATA_AS_OF = "2026-04-30T21:50:14-05:00";

export const sources = {
  nflDraftInfo: {
    label: "NFL Draft event info",
    url: "https://www.nfl.com/draft/event-info/",
    retrievedAt: DATA_AS_OF,
    note: "Day 2 verified as Friday, April 24, 2026, Rounds 2-3 at 7 PM ET.",
  },
  nflDraftOrder: {
    label: "NFL 2026 draft order",
    url: "https://www.nfl.com/news/2026-nfl-draft-order-for-all-seven-rounds",
    retrievedAt: DATA_AS_OF,
    note: "Initial full draft order source; live tracker supersedes it once picks are made and trades update slots.",
  },
  nflRaidersDraftTracker: {
    label: "NFL Raiders draft tracker",
    url: "https://www.nfl.com/draft/tracker/2026/teams/las-vegas-raiders",
    retrievedAt: DATA_AS_OF,
    note: "Live Raiders tracker verified the complete 10-player 2026 draft class.",
  },
  raidersMendoza: {
    label: "Raiders Fernando Mendoza selection",
    url: "https://www.raiders.com/news/fernando-mendoza-no-1-overall-pick-raiders-quarterback-2026-nfl-draft-indiana-football",
    retrievedAt: DATA_AS_OF,
    note: "Mendoza selected first overall by Las Vegas on April 23, 2026.",
  },
  raidersRoster: {
    label: "Raiders official roster",
    url: "https://www.raiders.com/team/players-roster/",
    retrievedAt: DATA_AS_OF,
    note: "Roster positions are official; depth order is model-derived.",
  },
  raidersDepthChart: {
    label: "Raiders official depth chart",
    url: "https://www.raiders.com/team/depth-chart",
    retrievedAt: DATA_AS_OF,
    note: "Official page says depth chart will be available in Fall 2026.",
  },
  raidersCoaches: {
    label: "Raiders official coaches",
    url: "https://www.raiders.com/team/coaches-roster/",
    retrievedAt: DATA_AS_OF,
    note: "Staff page anchors Klint Kubiak and the current coaching staff.",
  },
  nflIqLaunch: {
    label: "NFL IQ launch",
    url: "https://www.nfl.com/news/nfl-iq-launches-on-nfl-com-bringing-fans-inside-the-front-office-from-free-agency-through-the-draft/",
    retrievedAt: DATA_AS_OF,
    note: "NFL IQ includes team needs, cap, draft capital, projected depth, and scheme summaries.",
  },
  nflIqProspects: {
    label: "NFL IQ prospect grading",
    url: "https://www.nfl.com/news/nfl-iq-ten-under-the-radar-prospects-who-boosted-their-draft-scores-at-combine/",
    retrievedAt: DATA_AS_OF,
    note: "NFL IQ uses Next Gen Stats Draft Scores and prospect data.",
  },
  nflDayTwoProspects: {
    label: "NFL Day 2 and Day 3 prospects",
    url: "https://www.nfl.com/news/2026-nfl-draft-day-2-day-3-prospects-to-watch",
    retrievedAt: DATA_AS_OF,
    note: "Public fallback prospect pool for available Day 2 and Day 3 targets.",
  },
  nflUndraftedProspects: {
    label: "NFL undrafted prospect tracker",
    url: "https://www.nfl.com/draft/tracker/2026/prospects/all_all?collegeClass=all&page=1&status=undrafted",
    retrievedAt: DATA_AS_OF,
    note: "Live NFL prospect tracker filtered to undrafted players after Rounds 1-3.",
  },
  raidersUdfaSignings: {
    label: "Raiders 2026 UDFA signings",
    url: "https://www.raiders.com/news/raiders-sign-17-undrafted-free-agents-2026-nfl-transactions",
    retrievedAt: DATA_AS_OF,
    note: "Raiders announced 17 undrafted free-agent signings on April 30, 2026.",
  },
  autumnwindBrief: {
    label: "Raiders analytics brief",
    url: "file:///Users/chilly/Documents/Projects/autumnwind/raiders_bdb_2026_research_brief.md",
    retrievedAt: DATA_AS_OF,
    note: "Local background only; not required for live facts.",
  },
} satisfies Record<string, SourceRef>;

export const sourceList = Object.values(sources);
