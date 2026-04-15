"use client";

import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { badgeDefinitions, type BadgeId } from "@/data/platform-data";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

type BadgeGridProps = {
  unlockedBadges: BadgeId[];
  highlightedBadgeIds?: BadgeId[];
};

export function BadgeGrid({ unlockedBadges, highlightedBadgeIds = [] }: BadgeGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {badgeDefinitions.map((badge, index) => {
        const Icon = badge.icon;
        const unlocked = unlockedBadges.includes(badge.id);
        const highlighted = highlightedBadgeIds.includes(badge.id);

        return (
          <motion.div
            animate={highlighted ? { y: [0, -4, 0], scale: [1, 1.02, 1] } : { y: 0, scale: 1 }}
            key={badge.title}
            transition={{ delay: index * 0.04, duration: 0.45 }}
          >
            <GlassCard
              className={cn(
                "p-5",
                highlighted ? "border-violetGlow/40 shadow-[0_0_44px_rgba(139,92,246,0.28)]" : ""
              )}
            >
              <div
                className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-lg border",
                  unlocked
                    ? "border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow"
                    : "border-white/10 bg-white/[0.05] text-slate-500"
                )}
              >
                {unlocked ? <Icon className="h-6 w-6" /> : <LockKeyhole className="h-5 w-5" />}
              </div>
              <h3 className="text-xl font-bold text-white">{badge.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{badge.description}</p>
              <p
                className={cn(
                  "mt-4 text-xs font-semibold uppercase tracking-[0.22em]",
                  unlocked ? "text-mintGlow" : "text-slate-500"
                )}
              >
                {unlocked ? "Unlocked" : "Locked"}
              </p>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}
