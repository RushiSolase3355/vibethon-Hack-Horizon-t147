"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { moduleDefinitions, type BadgeId, type ModuleId } from "@/data/platform-data";
import {
  AIMLVERSE_STORAGE_KEY,
  getCompletedModulesCount,
  getInitialPlatformState,
  parsePlatformState,
  withDerivedBadges,
  type PlatformState
} from "@/lib/aimlverse-state";

type ActionResult = {
  state: PlatformState;
  unlockedBadges: BadgeId[];
};

function getNewBadges(previous: PlatformState, next: PlatformState) {
  return next.unlockedBadges.filter((badgeId) => !previous.unlockedBadges.includes(badgeId));
}

export function useAimlverseState() {
  const [state, setState] = useState<PlatformState>(getInitialPlatformState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(AIMLVERSE_STORAGE_KEY);
    setState(parsePlatformState(stored));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(AIMLVERSE_STORAGE_KEY, JSON.stringify(state));
  }, [isHydrated, state]);

  const updateState = useCallback((updater: (current: PlatformState) => PlatformState): ActionResult => {
    const current = state;
    const next = withDerivedBadges(updater(current));
    const unlockedBadges = getNewBadges(current, next);

    setState(next);

    return { state: next, unlockedBadges };
  }, [state]);

  const claimDailyXp = useCallback(() => {
    if (state.dailyXpClaimed) {
      return { alreadyClaimed: true, ...updateState((current) => current) };
    }

    return {
      alreadyClaimed: false,
      ...updateState((current) => ({
        ...current,
        xp: current.xp + 100,
        dailyXpClaimed: true
      }))
    };
  }, [state.dailyXpClaimed, updateState]);

  const startLearning = useCallback(
    (moduleId: ModuleId) => {
      return updateState((current) => {
        const moduleEntry = moduleDefinitions.find((item) => item.id === moduleId);

        if (!moduleEntry) {
          return current;
        }

        const currentProgress = current.moduleProgress[moduleId] ?? 0;
        const nextProgress = Math.min(100, currentProgress + moduleEntry.progressStep);
        const progressGained = nextProgress - currentProgress;
        const xpEarned =
          progressGained > 0 ? Math.round((moduleEntry.xpReward * progressGained) / 100) : 0;

        return {
          ...current,
          xp: current.xp + xpEarned,
          challengeScore: Math.min(99, current.challengeScore + (progressGained >= 20 ? 2 : 1)),
          moduleProgress: {
            ...current.moduleProgress,
            [moduleId]: nextProgress
          }
        };
      });
    },
    [updateState]
  );

  const stats = useMemo(() => {
    const completedModules = getCompletedModulesCount(state);

    return {
      completedModules,
      totalModules: moduleDefinitions.length,
      xp: state.xp,
      streak: state.streak,
      challengeScore: state.challengeScore,
      dailyXpClaimed: state.dailyXpClaimed
    };
  }, [state]);

  return {
    isHydrated,
    state,
    stats,
    claimDailyXp,
    startLearning
  };
}
