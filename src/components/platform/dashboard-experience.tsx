"use client";

import { useEffect, useState } from "react";
import { BadgeGrid } from "@/components/platform/badge-grid";
import { ProgressPanel } from "@/components/platform/progress-panel";
import { SectionHeading } from "@/components/platform/section-heading";
import { StatCard } from "@/components/platform/stat-card";
import { ToastStack, type ToastItem } from "@/components/ui/toast-stack";
import { badgeDefinitions, type BadgeId } from "@/data/platform-data";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

function createToast(title: string, description: string, tone: ToastItem["tone"] = "info"): ToastItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    description,
    tone
  };
}

export function DashboardExperience() {
  const { isHydrated, stats, state, claimDailyXp } = useAimlverseState();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [highlightedBadgeIds, setHighlightedBadgeIds] = useState<BadgeId[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    if (!highlightedBadgeIds.length) {
      return;
    }

    const timeout = window.setTimeout(() => setHighlightedBadgeIds([]), 2600);
    return () => window.clearTimeout(timeout);
  }, [highlightedBadgeIds]);

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = (toast: ToastItem) => {
    setToasts((current) => [...current, toast]);
    window.setTimeout(() => dismissToast(toast.id), 3200);
  };

  const handleClaimDailyXp = () => {
    setIsClaiming(true);

    window.setTimeout(() => {
      const result = claimDailyXp();

      if (result.alreadyClaimed) {
        pushToast(createToast("Already claimed", "Today's XP bonus has already been collected."));
      } else {
        pushToast(createToast("Daily XP claimed", "+100 XP has been added to your profile.", "success"));
      }

      if (result.unlockedBadges.length) {
        setHighlightedBadgeIds(result.unlockedBadges);
        result.unlockedBadges.forEach((badgeId) => {
          const badge = badgeDefinitions.find((item) => item.id === badgeId);

          if (badge) {
            pushToast(createToast("Badge Unlocked!", badge.title, "badge"));
          }
        });
      }

      setIsClaiming(false);
    }, 700);
  };

  const statItems = [
    {
      title: "Completed Modules",
      value: `${stats.completedModules}/${stats.totalModules}`,
      detail: stats.completedModules > 0 ? "Keep chaining completions" : "Finish one module to unlock your first badge",
      tone: "cyan" as const
    },
    {
      title: "XP Earned",
      value: isHydrated ? `${stats.xp}` : "...",
      detail: stats.dailyXpClaimed ? "Daily XP already claimed" : "Claim 100 XP from today's reward",
      tone: "violet" as const
    },
    {
      title: "Current Streak",
      value: isHydrated ? `${stats.streak} days` : "...",
      detail: "Stay active to keep climbing",
      tone: "mint" as const
    },
    {
      title: "Challenge Score",
      value: isHydrated ? `${stats.challengeScore}%` : "...",
      detail: "Improves as you learn modules",
      tone: "amber" as const
    }
  ];

  return (
    <>
      <ToastStack onDismiss={dismissToast} toasts={toasts} />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          description="Track your streak, XP, module completion, and challenge score in one place. This phase turns the prototype into something judges can actually click through."
          eyebrow="Dashboard"
          title="Your progress is starting to look like a real learning journey."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statItems.map((stat) => (
            <StatCard {...stat} key={stat.title} />
          ))}
        </div>

        <div className="mt-8">
          <ProgressPanel
            dailyXpClaimed={state.dailyXpClaimed}
            isClaiming={isClaiming}
            onClaimDailyXp={handleClaimDailyXp}
          />
        </div>

        <section className="mt-16">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">
              Badge System
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">Wins that make progress visible</h2>
          </div>
          <BadgeGrid
            highlightedBadgeIds={highlightedBadgeIds}
            unlockedBadges={state.unlockedBadges}
          />
        </section>
      </div>
    </>
  );
}
