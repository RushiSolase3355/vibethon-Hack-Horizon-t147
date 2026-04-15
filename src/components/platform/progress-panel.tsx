"use client";

import Link from "next/link";
import { Flame, Gift, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

type ProgressPanelProps = {
  dailyXpClaimed: boolean;
  onClaimDailyXp: () => void;
  isClaiming: boolean;
};

export function ProgressPanel({ dailyXpClaimed, onClaimDailyXp, isClaiming }: ProgressPanelProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyanGlow">
            Weekly Momentum
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Your actions now update every major AIMLverse view instantly.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Learn a module, finish a quiz, win a game, or use a simulation and the dashboard,
            leaderboard, badges, and progress history all stay in sync.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex items-center gap-2 text-mintGlow">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">Continue Learning</span>
            </div>
            <p className="text-sm leading-6 text-slate-300">Jump back into your current module and keep the streak moving.</p>
            <div className="mt-4">
              <Button href="/modules" size="sm">
                Continue Learning
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex items-center gap-2 text-cyanGlow">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-semibold">Claim Daily XP</span>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Grab a quick bonus once per day to keep the app feeling active.
            </p>
            <button
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-cyanGlow/30 bg-cyanGlow/10 px-4 py-2 text-sm font-semibold text-cyanGlow transition hover:-translate-y-1 hover:bg-cyanGlow/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.04] disabled:text-slate-500"
              disabled={dailyXpClaimed || isClaiming}
              onClick={onClaimDailyXp}
              type="button"
            >
              {dailyXpClaimed ? "XP Claimed" : isClaiming ? "Claiming..." : "Claim Daily XP"}
            </button>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex items-center gap-2 text-amber-200">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-semibold">Resume Quiz</span>
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Improve your average and push your rank higher with a strong run.
            </p>
            <Link className="mt-4 inline-flex items-center text-sm font-semibold text-white hover:text-cyanGlow" href="/quiz">
              Resume Quiz
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
