"use client";

import { useState } from "react";
import { BadgeGrid } from "@/components/platform/badge-grid";
import { ProgressPanel } from "@/components/platform/progress-panel";
import { SectionHeading } from "@/components/platform/section-heading";
import { StatCard } from "@/components/platform/stat-card";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

export function DashboardExperience() {
  const { stats, state, claimDailyXp } = useAimlverseState();
  const [isClaiming, setIsClaiming] = useState(false);

  const statItems = [
    {
      title: "XP",
      value: `${stats.xp}`,
      detail: `Level ${stats.level} with rank #${stats.rank}`,
      tone: "violet" as const
    },
    {
      title: "Completed Modules",
      value: `${stats.completedModuleCount}/${stats.totalModules}`,
      detail: `Current module: ${state.currentModule.replace(/-/g, " ")}`,
      tone: "cyan" as const
    },
    {
      title: "Quiz Average",
      value: `${stats.quizAverage}%`,
      detail: `${state.quizAttempts} attempts saved`,
      tone: "amber" as const
    },
    {
      title: "Games Won",
      value: `${stats.gamesWon}/${stats.gamesPlayed || 0}`,
      detail: `Best score ${state.bestScore}`,
      tone: "mint" as const
    },
    {
      title: "Streak",
      value: `${stats.streak} days`,
      detail: `${state.dailyActivity.length} active days tracked`,
      tone: "mint" as const
    },
    {
      title: "Badges Earned",
      value: `${stats.badgesEarned}`,
      detail: "Unlocks update in real time",
      tone: "cyan" as const
    },
    {
      title: "Leaderboard Rank",
      value: `#${stats.rank}`,
      detail: "Dynamic rank based on XP",
      tone: "amber" as const
    },
    {
      title: "Mentor Messages",
      value: `${state.messagesCount}`,
      detail: `${state.topicsAsked.length} topics explored`,
      tone: "violet" as const
    }
  ];

  const handleClaimDailyXp = async () => {
    setIsClaiming(true);
    await claimDailyXp();
    setIsClaiming(false);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        description="This dashboard is now connected to every working feature. XP, level, rank, modules, quiz stats, games, mentor usage, and badges all update from the same live state."
        eyebrow="Dashboard"
        title="Your AIMLverse profile is now a real-time learning command center."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((stat) => (
          <StatCard {...stat} key={stat.title} />
        ))}
      </div>

      <div className="mt-8">
        <ProgressPanel
          dailyXpClaimed={stats.dailyXpClaimed}
          isClaiming={isClaiming}
          onClaimDailyXp={handleClaimDailyXp}
        />
      </div>

      <section className="mt-16">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">
            Badge System
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">Every meaningful action unlocks visible progress</h2>
        </div>
        <BadgeGrid unlockedBadges={state.badgesUnlocked} />
      </section>
    </div>
  );
}
