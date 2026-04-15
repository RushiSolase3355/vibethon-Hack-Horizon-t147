import { badgeDefinitions, moduleDefinitions, type BadgeId, type ModuleId } from "@/data/platform-data";

export const AIMLVERSE_STORAGE_KEY = "aimlverse-platform-state";

export type PlatformState = {
  xp: number;
  streak: number;
  challengeScore: number;
  dailyXpClaimed: boolean;
  moduleProgress: Record<ModuleId, number>;
  unlockedBadges: BadgeId[];
};

export const defaultPlatformState: PlatformState = {
  xp: 420,
  streak: 8,
  challengeScore: 86,
  dailyXpClaimed: false,
  moduleProgress: Object.fromEntries(
    moduleDefinitions.map((module) => [module.id, module.defaultProgress])
  ) as Record<ModuleId, number>,
  unlockedBadges: []
};

export function getCompletedModulesCount(state: PlatformState) {
  return moduleDefinitions.filter((module) => (state.moduleProgress[module.id] ?? 0) >= 100).length;
}

export function deriveUnlockedBadges(state: PlatformState): BadgeId[] {
  const unlocked = new Set<BadgeId>();

  if (getCompletedModulesCount(state) >= 1) {
    unlocked.add("fast-learner");
  }

  if (state.xp >= 500) {
    unlocked.add("data-detective");
  }

  if ((state.moduleProgress["computer-vision"] ?? 0) >= 100) {
    unlocked.add("vision-explorer");
  }

  if ((state.moduleProgress["neural-networks"] ?? 0) >= 100) {
    unlocked.add("neural-navigator");
  }

  return badgeDefinitions
    .map((badge) => badge.id)
    .filter((badgeId) => unlocked.has(badgeId));
}

export function withDerivedBadges(state: PlatformState): PlatformState {
  return {
    ...state,
    unlockedBadges: deriveUnlockedBadges(state)
  };
}

export function getInitialPlatformState(): PlatformState {
  return withDerivedBadges(defaultPlatformState);
}

export function parsePlatformState(raw: string | null): PlatformState {
  if (!raw) {
    return getInitialPlatformState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlatformState>;

    const merged: PlatformState = {
      ...getInitialPlatformState(),
      ...parsed,
      moduleProgress: {
        ...getInitialPlatformState().moduleProgress,
        ...(parsed.moduleProgress ?? {})
      }
    };

    return withDerivedBadges(merged);
  } catch {
    return getInitialPlatformState();
  }
}

export function getModuleById(moduleId: ModuleId) {
  return moduleDefinitions.find((module) => module.id === moduleId);
}
