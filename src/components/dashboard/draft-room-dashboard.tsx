"use client";

import { useMemo, useState } from "react";
import {
  ArrowSquareOut,
  CaretDown,
  CaretRight,
  ChartBar,
  FileCsv,
  Funnel,
  ShieldCheck,
  Target,
  Warning,
} from "@phosphor-icons/react";
import { parseProspectCsv, prospectCsvTemplate } from "@/lib/import/prospect-csv";
import { findAvoidDespiteBoard, rankProspectsForPicks } from "@/lib/scoring/fragility";
import type { RankedPosition, RankedProspect } from "@/lib/scoring/fragility";
import type {
  DraftPick,
  FragilityScore,
  PositionGroup,
  Prospect,
  SourceRef,
} from "@/types/domain";

type DraftRoomDashboardProps = {
  dataAsOf: string;
  noSeasonMode: boolean;
  positions: RankedPosition[];
  seedProspects: Prospect[];
  fragilityScores: FragilityScore[];
  focusPicks: DraftPick[];
  madePicks: DraftPick[];
  sources: SourceRef[];
};

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

function scoreTone(score: number) {
  if (score >= 68) {
    return "text-[#f1f5f9]";
  }

  if (score >= 55) {
    return "text-[#d6dde7]";
  }

  return "text-[#9ba6b4]";
}

function ConfidenceChip({ confidence }: { confidence: number }) {
  const label = confidence >= 0.6 ? "high" : confidence >= 0.52 ? "medium" : "low";

  return (
    <span className="inline-flex items-center border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#aeb8c6]">
      {label} conf {Math.round(confidence * 100)}
    </span>
  );
}

function SourceLink({ source }: { source: SourceRef }) {
  return (
    <a
      className="inline-flex items-center gap-1 border border-white/10 px-2 py-1 text-[11px] text-[#c8d0db] transition hover:border-[#8ea3bd] hover:text-white"
      href={source.url}
      target="_blank"
      rel="noreferrer"
      title={source.note}
    >
      {source.label}
      <ArrowSquareOut size={11} weight="bold" />
    </a>
  );
}

function MetricRail({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[88px_1fr_44px] items-center gap-3 text-[11px] text-[#8f9baa]">
      <span>{label}</span>
      <span className="h-1 overflow-hidden bg-white/10">
        <span
          className="block h-full bg-[#8ea3bd]"
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </span>
      <span className="text-right font-mono text-[#cad2dd]">{numberFormat.format(value)}</span>
    </div>
  );
}

function PickScoreCell({
  prospect,
  pick,
}: {
  prospect: RankedProspect;
  pick: DraftPick;
}) {
  const score = prospect.scores.find((entry) => entry.targetPick === pick.overall);

  if (!score) {
    return <span className="text-[#657184]">n/a</span>;
  }

  return (
    <div className="min-w-[82px]">
      <div className="font-mono text-sm text-[#eef2f7]">{numberFormat.format(score.total)}</div>
      <div className="mt-1 h-1 bg-white/10">
        <div
          className="h-full bg-[#8ea3bd]"
          style={{ width: `${Math.max(0, Math.min(score.total * 2.2, 100))}%` }}
        />
      </div>
      <div className="mt-1 font-mono text-[10px] text-[#7f8b9a]">
        avail {Math.round(score.availabilityAtPick * 100)}
      </div>
    </div>
  );
}

export function DraftRoomDashboard({
  dataAsOf,
  noSeasonMode,
  positions,
  seedProspects,
  fragilityScores,
  focusPicks,
  madePicks,
  sources,
}: DraftRoomDashboardProps) {
  const [selectedPosition, setSelectedPosition] = useState<PositionGroup>(
    positions[0]?.positionGroup ?? "EDGE",
  );
  const [minimumScore, setMinimumScore] = useState(0);
  const [pickFilter, setPickFilter] = useState<"best" | "36" | "67">("best");
  const [csv, setCsv] = useState(
    `${prospectCsvTemplate}\nKendall Daniels,Oklahoma State,S,S,88,146,119,74,78,80,0.58,"box safety|teams floor|dime utility",https://www.nfl.com/draft/`,
  );

  const selectedDetail =
    positions.find((position) => position.positionGroup === selectedPosition) ?? positions[0];

  const csvResult = useMemo(() => parseProspectCsv(csv), [csv]);

  const allProspects = useMemo(
    () => [...seedProspects, ...csvResult.prospects],
    [seedProspects, csvResult.prospects],
  );

  const prospects = useMemo(
    () =>
      rankProspectsForPicks({
        prospects: allProspects,
        fragilityScores,
        targetPicks: focusPicks,
      }),
    [allProspects, fragilityScores, focusPicks],
  );

  const rankedProspects = useMemo(() => {
    return prospects.filter((entry) => {
      const score =
        pickFilter === "best"
          ? entry.bestScore
          : entry.scores.find((candidate) => candidate.targetPick === Number(pickFilter));

      return score ? score.total >= minimumScore : false;
    });
  }, [minimumScore, pickFilter, prospects]);

  const bestPick = rankedProspects[0];
  const bestHedge = [...rankedProspects].sort(
    (a, b) => b.bestScore.fragilityReduction - a.bestScore.fragilityReduction,
  )[0];
  const bestFit = [...rankedProspects].sort(
    (a, b) => b.bestScore.roleFit - a.bestScore.roleFit,
  )[0];
  const avoidDespiteBoard = findAvoidDespiteBoard(rankedProspects);

  const recommendations: Array<{
    label: string;
    entry: RankedProspect | null | undefined;
    emptyCopy: string;
  }> = [
    {
      label: "Best pick for Super Bowl leverage",
      entry: bestPick,
      emptyCopy: "No match at this filter.",
    },
    {
      label: "Best fragility hedge",
      entry: bestHedge,
      emptyCopy: "No match at this filter.",
    },
    {
      label: "Best scheme fit",
      entry: bestFit,
      emptyCopy: "No match at this filter.",
    },
    {
      label: "Avoid despite board value",
      entry: avoidDespiteBoard,
      emptyCopy: "No top-50 consensus prospect is scoring below 30 right now.",
    },
  ];

  return (
    <main className="min-h-[100dvh] bg-[#0f1115] text-[#e7ecf3]">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header className="grid min-w-0 gap-4 border-b border-white/10 pb-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#9aa6b7]">
              <span>Las Vegas draft room</span>
              <span className="h-1 w-1 bg-[#8ea3bd]" />
              <span>Data as of {dataAsOf}</span>
              {noSeasonMode ? (
                <span className="border border-[#8ea3bd]/40 px-2 py-1 text-[#cbd5e1]">
                  Current roster only
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 max-w-5xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Depth Fragility Board
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#aab4c2]">
              Ranks current Raiders position groups by how fast the game plan breaks when a
              starter is lost, then maps available prospects to the fragility they reduce.
            </p>
          </div>
          <div className="grid min-w-0 gap-2 border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-2">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                Already locked
              </div>
              {madePicks.map((pick) => (
                <div key={pick.overall} className="mt-2 text-sm text-white">
                  <span className="font-mono text-[#8ea3bd]">#{pick.overall}</span>{" "}
                  {pick.selection}
                </div>
              ))}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                Decision window
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {focusPicks.map((pick) => (
                  <span
                    key={pick.overall}
                    className="border border-white/10 px-2 py-1 font-mono text-sm text-white"
                  >
                    R{pick.round} #{pick.overall}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="grid min-w-0 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0 border border-white/10 bg-[#12151b]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <ChartBar size={17} weight="bold" className="text-[#8ea3bd]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
                  Fragility Board
                </h2>
              </div>
              <span className="font-mono text-xs text-[#8f9baa]">
                {positions.length} groups
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {positions.map((position, index) => {
                const active = selectedPosition === position.positionGroup;

                return (
                  <button
                    key={position.positionGroup}
                    className={`grid w-full grid-cols-[44px_70px_1fr_auto] items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.04] active:translate-y-[1px] ${
                      active ? "bg-white/[0.06]" : ""
                    }`}
                    onClick={() => setSelectedPosition(position.positionGroup)}
                  >
                    <span className="font-mono text-xs text-[#7f8b9a]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-lg font-semibold text-white">
                      {position.positionGroup}
                    </span>
                    <span>
                      <span className={`block text-sm font-medium ${scoreTone(position.score.total)}`}>
                        {position.role.label}
                      </span>
                      <span className="mt-1 block h-1 bg-white/10">
                        <span
                          className="block h-full bg-[#8ea3bd]"
                          style={{ width: `${Math.min(position.score.total, 100)}%` }}
                        />
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-mono text-xl text-white">
                        {numberFormat.format(position.score.total)}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-[#7f8b9a]">
                        fragility
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDetail ? (
            <div className="min-w-0 border border-white/10 bg-[#12151b]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                    Position detail
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {selectedDetail.positionGroup}: {selectedDetail.role.label}
                  </h2>
                </div>
                <ConfidenceChip confidence={selectedDetail.score.confidence} />
              </div>
              <div className="grid gap-4 p-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                      Starter
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      {selectedDetail.depth.starter}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                      Backups
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedDetail.depth.backups.length > 0 ? (
                        selectedDetail.depth.backups.map((backup) => (
                          <span key={backup} className="border border-white/10 px-2 py-1 text-xs">
                            {backup}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[#8f9baa]">No roster backup listed</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                      Flex cushion
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedDetail.depth.crossTrainedPlayers.map((player) => (
                        <span key={player} className="border border-[#8ea3bd]/30 px-2 py-1 text-xs">
                          {player}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <MetricRail
                      label="Scheme"
                      value={selectedDetail.score.schemeDependency}
                    />
                    <MetricRail label="Dropoff" value={selectedDetail.score.depthDropoff} />
                    <MetricRail
                      label="Starter"
                      value={selectedDetail.score.starterLeverage}
                    />
                    <MetricRail
                      label="Scarcity"
                      value={selectedDetail.score.replacementScarcity}
                    />
                    <MetricRail
                      label="Flex cut"
                      value={selectedDetail.score.crossTrainingCushion}
                    />
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                      What breaks
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#c8d0db]">
                      {selectedDetail.depth.whatBreaks}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetail.score.sourceRefs.slice(0, 4).map((source) => (
                      <SourceLink key={`${source.label}-${source.url}`} source={source} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="grid min-w-0 gap-4 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="min-w-0 border border-white/10 bg-[#12151b]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <Target size={17} weight="bold" className="text-[#8ea3bd]" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
                Recommendation Panel
              </h2>
            </div>
            <div className="divide-y divide-white/10">
              {recommendations.map(({ label, entry, emptyCopy }) => (
                <div key={label} className="p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                    {label}
                  </div>
                  {entry ? (
                    <div className="mt-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {entry.prospect.name}
                          </div>
                          <div className="text-sm text-[#aab4c2]">
                            {entry.prospect.position}, {entry.prospect.school}
                          </div>
                        </div>
                        <span className="font-mono text-xl text-white">
                          {numberFormat.format(entry.bestScore.total)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#c8d0db]">
                        {entry.bestScore.rationale}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-[#8f9baa]">{emptyCopy}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 border border-white/10 bg-[#12151b]">
            <div className="grid gap-3 border-b border-white/10 px-4 py-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} weight="bold" className="text-[#8ea3bd]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
                  Prospect Overlay
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-[#9aa6b7]">
                  <Funnel size={14} weight="bold" />
                  Pick
                  <select
                    className="border border-white/10 bg-[#0f1115] px-2 py-1 text-white"
                    value={pickFilter}
                    onChange={(event) => setPickFilter(event.target.value as "best" | "36" | "67")}
                  >
                    <option value="best">Best available pick</option>
                    {focusPicks.map((pick) => (
                      <option key={pick.overall} value={String(pick.overall)}>
                        #{pick.overall}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#9aa6b7]">
                  Min FRV
                  <input
                    className="w-28 accent-[#8ea3bd]"
                    type="range"
                    min="0"
                    max="50"
                    value={minimumScore}
                    onChange={(event) => setMinimumScore(Number(event.target.value))}
                  />
                  <span className="w-8 font-mono text-white">{minimumScore}</span>
                </label>
              </div>
            </div>
            <div className="min-w-0 overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-[#8f9baa]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Prospect</th>
                    <th className="px-4 py-3 font-medium">Fit</th>
                    {focusPicks.map((pick) => (
                      <th key={pick.overall} className="px-4 py-3 font-medium">
                        #{pick.overall}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-medium">Traits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rankedProspects.map((entry) => (
                    <tr key={entry.prospect.name} className="align-top hover:bg-white/[0.03]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{entry.prospect.name}</div>
                        <div className="text-xs text-[#8f9baa]">
                          {entry.prospect.position}, {entry.prospect.school}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-white">
                          {Math.round(entry.bestScore.roleFit * 100)}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.16em] text-[#7f8b9a]">
                          {entry.prospect.positionGroup}
                        </div>
                      </td>
                      {focusPicks.map((pick) => (
                        <td key={`${entry.prospect.name}-${pick.overall}`} className="px-4 py-3">
                          <PickScoreCell prospect={entry} pick={pick} />
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex max-w-[320px] flex-wrap gap-1">
                          {entry.prospect.traits.slice(0, 4).map((trait) => (
                            <span key={trait} className="border border-white/10 px-2 py-1 text-xs">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="min-w-0 border border-white/10 bg-[#12151b]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <Warning size={17} weight="bold" className="text-[#8ea3bd]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">
                  Confidence Warnings
                </h2>
              </div>
              <span className="font-mono text-xs text-[#8f9baa]">official depth unavailable</span>
            </div>
            <div className="space-y-3 p-4 text-sm leading-6 text-[#c8d0db]">
              <p>
                The Raiders official depth chart page is not live until Fall 2026, so depth order
                is inferred from roster listings, staff context, and NFL IQ concept anchors.
              </p>
              <p>
                NFL IQ does not expose a stable public API in this build. The app includes a manual
                CSV path so live NFL IQ values can be pasted in without changing scoring code.
              </p>
            </div>
          </div>

          <div className="min-w-0 border border-white/10 bg-[#12151b]">
            <button
              className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left transition hover:bg-white/[0.03] active:translate-y-[1px]"
              type="button"
              onClick={() => setCsv((value) => value)}
            >
              <span className="flex items-center gap-2">
                <FileCsv size={17} weight="bold" className="text-[#8ea3bd]" />
                <span className="text-sm font-semibold uppercase tracking-[0.14em]">
                  Data Workbench
                </span>
              </span>
              {csvResult.errors.length ? (
                <CaretRight size={16} className="text-[#8ea3bd]" />
              ) : (
                <CaretDown size={16} className="text-[#8ea3bd]" />
              )}
            </button>
            <div className="grid min-w-0 gap-4 p-4 md:grid-cols-[1fr_0.7fr]">
              <label className="grid min-w-0 gap-2">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                  Manual prospect import preview
                </span>
                <textarea
                  className="min-h-40 resize-y border border-white/10 bg-[#0f1115] p-3 font-mono text-xs leading-5 text-[#dce3eb] outline-none transition focus:border-[#8ea3bd]"
                  value={csv}
                  onChange={(event) => setCsv(event.target.value)}
                />
              </label>
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                  Validation
                </div>
                {csvResult.errors.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {csvResult.errors.map((error) => (
                      <div key={error} className="border border-red-300/20 px-3 py-2 text-sm text-red-100">
                        {error}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 border border-[#8ea3bd]/30 px-3 py-2 text-sm text-[#dce3eb]">
                    {csvResult.prospects.length === 1
                      ? "1 prospect row merged into the rankings above."
                      : `${csvResult.prospects.length} prospect rows merged into the rankings above.`}
                  </div>
                )}
                <div className="mt-4 text-[11px] uppercase tracking-[0.18em] text-[#8f9baa]">
                  Source trail
                </div>
                <div className="mt-2 flex max-h-36 flex-wrap gap-2 overflow-auto">
                  {sources.slice(0, 8).map((source) => (
                    <SourceLink key={`${source.label}-${source.url}`} source={source} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
