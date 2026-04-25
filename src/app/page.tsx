import { DraftRoomDashboard } from "@/components/dashboard/draft-room-dashboard";
import { seedData } from "@/data/seed";
import { rankPositions } from "@/lib/scoring/fragility";
import { NO_SEASON_MODE } from "@/types/domain";

export default function Home() {
  const rankedPositions = rankPositions(seedData.schemeRoles, seedData.depthAssessments);
  const fragilityScores = rankedPositions.map((position) => position.score);

  return (
    <DraftRoomDashboard
      dataAsOf={seedData.dataAsOf}
      noSeasonMode={NO_SEASON_MODE}
      positions={rankedPositions}
      seedProspects={seedData.prospects}
      fragilityScores={fragilityScores}
      focusPicks={seedData.focusPicks}
      madePicks={seedData.draftPicks.filter((pick) => pick.status === "made")}
      sources={seedData.sourceList}
    />
  );
}
