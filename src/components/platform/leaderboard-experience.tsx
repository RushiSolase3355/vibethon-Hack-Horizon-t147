"use client";

import { LeaderboardList, type LeaderboardEntry } from "@/components/platform/leaderboard-list";
import { SectionHeading } from "@/components/platform/section-heading";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

export function LeaderboardExperience() {
  const { leaderboard, state } = useAimlverseState();

  const entries: LeaderboardEntry[] = leaderboard.map((entry, index) => ({
    rank: entry.rank,
    name: entry.name,
    xp: entry.xp,
    streak: entry.isCurrentUser ? state.streak : Math.max(5, 14 - index),
    badge: entry.isCurrentUser ? "Current User" : index === 0 ? "Top Learner" : "Competitive",
    isCurrentUser: entry.isCurrentUser
  }));

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        description="Rank is now driven by live XP. As modules, quiz attempts, games, simulations, and mentor activity add XP, the leaderboard rearranges instantly."
        eyebrow="Leaderboard"
        title="See your rank move in real time against the rest of AIMLverse."
      />

      <div className="mt-8 rounded-lg border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-3 text-sm text-cyan-100">
        Current user: {state.userName || "You"} with {state.xp} XP and rank #{state.rank}
      </div>

      <div className="mt-10">
        <LeaderboardList entries={entries} />
      </div>
    </div>
  );
}
