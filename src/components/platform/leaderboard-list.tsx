"use client";

import { Crown, Medal, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  xp: number;
  streak?: number;
  badge: string;
  isCurrentUser?: boolean;
};

type LeaderboardListProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardList({ entries }: LeaderboardListProps) {
  return (
    <div className="grid gap-4">
      {entries.map((entry) => (
        <GlassCard className="p-5" key={entry.rank}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-lg border text-sm font-black",
                  entry.rank === 1
                    ? "border-amber-200/40 bg-amber-200/10 text-amber-200"
                    : entry.rank === 2
                      ? "border-slate-200/20 bg-white/10 text-slate-200"
                      : entry.rank === 3
                        ? "border-orange-300/30 bg-orange-300/10 text-orange-200"
                        : "border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow"
                )}
              >
                {entry.rank === 1 ? <Crown className="h-5 w-5" /> : <span>#{entry.rank}</span>}
              </div>
              <div>
                <p className="text-xl font-black text-white">{entry.name}</p>
                <p className="mt-1 text-sm text-slate-400">{entry.badge}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 md:w-[330px]">
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-3">
                <p className="text-xs text-slate-500">XP</p>
                <p className="mt-1 font-bold text-white">{entry.xp}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-3">
                <p className="text-xs text-slate-500">Streak</p>
                <p className="mt-1 font-bold text-white">{entry.streak ?? 8} days</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-3">
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 flex items-center gap-1 font-bold text-mintGlow">
                  <Medal className="h-4 w-4" />
                  {entry.isCurrentUser ? "You" : "Active"}
                </p>
              </div>
            </div>
          </div>
          {entry.isCurrentUser ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyanGlow/25 bg-cyanGlow/10 px-3 py-2 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4 text-cyanGlow" />
              You are {Math.max(0, entries[0].xp - entry.xp)} XP away from first place.
            </div>
          ) : null}
        </GlassCard>
      ))}
    </div>
  );
}
