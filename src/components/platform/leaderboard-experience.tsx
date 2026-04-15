"use client";

import { LeaderboardList, type LeaderboardEntry } from "@/components/platform/leaderboard-list";
import { SectionHeading } from "@/components/platform/section-heading";
import { leaderboardBaseEntries } from "@/data/platform-data";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

function getCurrentUserBadge(xp: number) {
  if (xp >= 500) {
    return "Data Detective";
  }

  if (xp >= 300) {
    return "Fast Learner";
  }

  return "Rising Learner";
}

export function LeaderboardExperience() {
  const { stats, state } = useAimlverseState();

  const entries: LeaderboardEntry[] = leaderboardBaseEntries
    .map<LeaderboardEntry>((entry) => ({
      ...entry,
      badge: entry.rank === 1 ? "Rank Badge: Gold" : entry.rank === 2 ? "Rank Badge: Silver" : "Rank Badge: Bronze",
      streak: entry.rank === 1 ? 16 : entry.rank === 2 ? 14 : 12
    }))
    .concat({
      rank: 4,
      name: "You",
      xp: stats.xp,
      streak: stats.streak,
      badge: `Rank Badge: ${getCurrentUserBadge(stats.xp)}`,
      isCurrentUser: true
    });

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        description="A little healthy competition keeps the demo lively. Your live XP updates here automatically, so judges can test progression in real time."
        eyebrow="Leaderboard"
        title="See how learners are climbing through the AIMLverse ranks."
      />

      <div className="mt-8 rounded-lg border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-3 text-sm text-cyan-100">
        Your current badge: {state.unlockedBadges.length ? getCurrentUserBadge(stats.xp) : "Rising Learner"}
      </div>

      <div className="mt-10">
        <LeaderboardList entries={entries} />
      </div>
    </div>
  );
}
