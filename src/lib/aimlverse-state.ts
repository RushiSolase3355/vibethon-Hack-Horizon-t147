import {
  badgeDefinitions,
  beginnerModuleIds,
  leaderboardBaseUsers,
  moduleDefinitions,
  type BadgeId,
  type ModuleId
} from "@/data/platform-data";

export const AIMLVERSE_STORAGE_KEY = "aimlverse-live-state";

export type ChatEntry = {
  id: string;
  role: "user" | "assistant";
  content: string;
  topic: string;
  createdAt: string;
};

export type SimulationEntry = {
  id: string;
  type: "spam" | "image" | "student";
  input: string;
  result: string;
  createdAt: string;
};

export type QuizHistoryEntry = {
  id: string;
  score: number;
  total: number;
  percent: number;
  createdAt: string;
};

export type GameHistoryEntry = {
  id: string;
  game: string;
  won: boolean;
  score: number;
  createdAt: string;
};

export type StoredUser = {
  userName: string;
  email: string;
  password: string;
};

export type AppState = {
  userName: string;
  email: string;
  password: string;
  isLoggedIn: boolean;
  xp: number;
  level: number;
  rank: number;
  completedModules: ModuleId[];
  currentModule: ModuleId;
  moduleLessonsCompleted: Record<ModuleId, number>;
  quizAttempts: number;
  quizAverage: number;
  quizHistory: QuizHistoryEntry[];
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
  streak: number;
  badgesUnlocked: BadgeId[];
  leaderboardUsers: Array<{ id: string; name: string; xp: number }>;
  chatHistory: ChatEntry[];
  simulationHistory: SimulationEntry[];
  dailyActivity: string[];
  dailyXpClaimedDate: string | null;
  messagesCount: number;
  topicsAsked: string[];
};

export type ToastRecord = {
  id: string;
  title: string;
  description: string;
  tone?: "info" | "success" | "badge";
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getInitialState(): AppState {
  const base: AppState = {
    userName: "Explorer",
    email: "",
    password: "",
    isLoggedIn: false,
    xp: 120,
    level: 1,
    rank: leaderboardBaseUsers.length + 1,
    completedModules: [],
    currentModule: moduleDefinitions[0].id,
    moduleLessonsCompleted: Object.fromEntries(
      moduleDefinitions.map((module) => [module.id, 0])
    ) as Record<ModuleId, number>,
    quizAttempts: 0,
    quizAverage: 0,
    quizHistory: [],
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    streak: 1,
    badgesUnlocked: [],
    leaderboardUsers: leaderboardBaseUsers.map((user) => ({ ...user })),
    chatHistory: [],
    simulationHistory: [],
    dailyActivity: [],
    dailyXpClaimedDate: null,
    messagesCount: 0,
    topicsAsked: []
  };

  return deriveState(base);
}

export function parseStoredState(raw: string | null) {
  if (!raw) {
    return getInitialState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const initial = getInitialState();
    return deriveState({
      ...initial,
      ...parsed,
      moduleLessonsCompleted: {
        ...initial.moduleLessonsCompleted,
        ...(parsed.moduleLessonsCompleted ?? {})
      },
      leaderboardUsers: parsed.leaderboardUsers ?? initial.leaderboardUsers,
      quizHistory: parsed.quizHistory ?? initial.quizHistory,
      chatHistory: parsed.chatHistory ?? initial.chatHistory,
      simulationHistory: parsed.simulationHistory ?? initial.simulationHistory,
      dailyActivity: parsed.dailyActivity ?? initial.dailyActivity,
      topicsAsked: parsed.topicsAsked ?? initial.topicsAsked
    });
  } catch {
    return getInitialState();
  }
}

export function getModuleProgress(moduleId: ModuleId, state: AppState) {
  return Math.round(((state.moduleLessonsCompleted[moduleId] ?? 0) / 3) * 100);
}

export function isModuleUnlocked(moduleId: ModuleId, state: AppState) {
  const index = moduleDefinitions.findIndex((module) => module.id === moduleId);

  if (index <= 0) {
    return true;
  }

  const previousModule = moduleDefinitions[index - 1];
  return state.completedModules.includes(previousModule.id);
}

export function getCompletedModuleCount(state: AppState) {
  return state.completedModules.length;
}

export function getAllTopicsAsked(state: AppState) {
  return state.topicsAsked;
}

export function getUserLeaderboard(state: AppState) {
  const users = [...state.leaderboardUsers, { id: "you", name: state.userName || "You", xp: state.xp }];
  return users
    .sort((left, right) => right.xp - left.xp)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      isCurrentUser: user.id === "you"
    }));
}

export function deriveBadges(state: AppState) {
  const unlocked = new Set<BadgeId>(state.badgesUnlocked);

  if (state.isLoggedIn) {
    unlocked.add("first-login");
  }

  if (state.completedModules.length >= 1) {
    unlocked.add("first-module");
  }

  if (state.xp >= 500) {
    unlocked.add("xp-500");
  }

  if (state.quizAverage >= 80 && state.quizAttempts > 0) {
    unlocked.add("quiz-master");
  }

  if (state.gamesWon >= 3) {
    unlocked.add("game-winner");
  }

  if (beginnerModuleIds.every((moduleId) => state.completedModules.includes(moduleId))) {
    unlocked.add("beginner-finished");
  }

  if (state.chatHistory.some((entry) => entry.role === "user")) {
    unlocked.add("mentor-used");
  }

  return badgeDefinitions.map((badge) => badge.id).filter((badgeId) => unlocked.has(badgeId));
}

export function deriveState(state: AppState): AppState {
  const leaderboard = getUserLeaderboard(state);
  const currentUser = leaderboard.find((entry) => entry.isCurrentUser);

  return {
    ...state,
    level: Math.max(1, Math.floor(state.xp / 250) + 1),
    rank: currentUser?.rank ?? leaderboard.length,
    badgesUnlocked: deriveBadges(state)
  };
}

export function getNewBadges(previous: AppState, next: AppState) {
  return next.badgesUnlocked.filter((badgeId) => !previous.badgesUnlocked.includes(badgeId));
}

export function getStoredUser(state: AppState): StoredUser | null {
  if (!state.email || !state.password) {
    return null;
  }

  return {
    userName: state.userName,
    email: state.email,
    password: state.password
  };
}

export function registerSession(state: AppState, userName: string, email: string, password: string) {
  return deriveState({
    ...state,
    userName,
    email,
    password,
    isLoggedIn: true
  });
}

export function loginSession(state: AppState) {
  return deriveState({
    ...state,
    isLoggedIn: true
  });
}

export function logoutSession(state: AppState) {
  return deriveState({
    ...state,
    isLoggedIn: false
  });
}

export function addDailyActivity(state: AppState) {
  const today = getTodayKey();
  if (state.dailyActivity.includes(today)) {
    return state;
  }

  return {
    ...state,
    dailyActivity: [...state.dailyActivity, today]
  };
}

export function getToday() {
  return getTodayKey();
}
