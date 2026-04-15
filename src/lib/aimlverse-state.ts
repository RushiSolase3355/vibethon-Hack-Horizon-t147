import { badgeDefinitions, beginnerModuleIds, leaderboardBaseUsers, moduleDefinitions, type BadgeId, type ModuleId } from "@/data/platform-data";

export const AIMLVERSE_STORAGE_KEY = "aimlverse-live-state";
export const AIMLVERSE_SESSION_KEY = "aimlverse-session-email";

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

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  xp: number;
  level: number;
  rank: number;
  completedModules: ModuleId[];
  currentModule: ModuleId;
  moduleLessonsCompleted: Record<ModuleId, number>;
  quizScores: number[];
  quizAverage: number;
  quizAttempts: number;
  quizHistory: QuizHistoryEntry[];
  gamesPlayed: number;
  gamesWon: number;
  bestScore: number;
  streak: number;
  badges: BadgeId[];
  chatHistory: ChatEntry[];
  simulationHistory: SimulationEntry[];
  dailyActivity: string[];
  dailyXpClaimedDate: string | null;
  messagesCount: number;
  topicsAsked: string[];
  createdAt: string;
};

export type PublicUser = Omit<UserRecord, "password">;

export type AppState = {
  userName: string;
  email: string;
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

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function createEmptyLessons() {
  return Object.fromEntries(moduleDefinitions.map((module) => [module.id, 0])) as Record<ModuleId, number>;
}

export function getDefaultUserRecord(name: string, email: string, password: string): UserRecord {
  return {
    id: createId("user"),
    name,
    email: email.toLowerCase(),
    password,
    xp: 0,
    level: 1,
    rank: 0,
    completedModules: [],
    currentModule: moduleDefinitions[0].id,
    moduleLessonsCompleted: createEmptyLessons(),
    quizScores: [],
    quizAverage: 0,
    quizAttempts: 0,
    quizHistory: [],
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    streak: 0,
    badges: [],
    chatHistory: [],
    simulationHistory: [],
    dailyActivity: [],
    dailyXpClaimedDate: null,
    messagesCount: 0,
    topicsAsked: [],
    createdAt: new Date().toISOString()
  };
}

export function getModuleProgress(moduleId: ModuleId, state: Pick<AppState, "moduleLessonsCompleted">) {
  return Math.round(((state.moduleLessonsCompleted[moduleId] ?? 0) / 3) * 100);
}

export function isModuleUnlocked(moduleId: ModuleId, state: Pick<AppState, "completedModules">) {
  const index = moduleDefinitions.findIndex((module) => module.id === moduleId);

  if (index <= 0) {
    return true;
  }

  return state.completedModules.includes(moduleDefinitions[index - 1].id);
}

export function getCompletedModuleCount(state: Pick<AppState, "completedModules">) {
  return state.completedModules.length;
}

export function getUserLeaderboard(users: Array<{ id: string; name: string; xp: number }>, currentUser?: { name: string; xp: number }) {
  const merged = currentUser ? [...users, { id: "you", name: currentUser.name || "You", xp: currentUser.xp }] : users;
  return merged
    .sort((left, right) => right.xp - left.xp)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
      isCurrentUser: user.id === "you"
    }));
}

export function deriveBadges(user: Pick<UserRecord, "completedModules" | "xp" | "quizAverage" | "quizAttempts" | "gamesWon" | "chatHistory">): BadgeId[] {
  const unlocked = new Set<BadgeId>();

  if (user.completedModules.length >= 1) {
    unlocked.add("first-module");
  }

  if (user.xp >= 500) {
    unlocked.add("xp-500");
  }

  if (user.quizAttempts > 0 && user.quizAverage >= 80) {
    unlocked.add("quiz-master");
  }

  if (user.gamesWon >= 3) {
    unlocked.add("game-winner");
  }

  if (beginnerModuleIds.every((moduleId) => user.completedModules.includes(moduleId))) {
    unlocked.add("beginner-finished");
  }

  if (user.chatHistory.some((entry) => entry.role === "user")) {
    unlocked.add("mentor-used");
  }

  return badgeDefinitions.map((badge) => badge.id).filter((badgeId) => unlocked.has(badgeId));
}

export function calculateLevel(xp: number) {
  return Math.max(1, Math.floor(xp / 250) + 1);
}

export function toPublicUser(user: UserRecord): PublicUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

export function toAppState(user?: PublicUser | null): AppState {
  return {
    userName: user?.name ?? "Explorer",
    email: user?.email ?? "",
    isLoggedIn: Boolean(user),
    xp: user?.xp ?? 0,
    level: user?.level ?? 1,
    rank: user?.rank ?? leaderboardBaseUsers.length + 1,
    completedModules: user?.completedModules ?? [],
    currentModule: user?.currentModule ?? moduleDefinitions[0].id,
    moduleLessonsCompleted: user?.moduleLessonsCompleted ?? createEmptyLessons(),
    quizAttempts: user?.quizAttempts ?? 0,
    quizAverage: user?.quizAverage ?? 0,
    quizHistory: user?.quizHistory ?? [],
    gamesPlayed: user?.gamesPlayed ?? 0,
    gamesWon: user?.gamesWon ?? 0,
    bestScore: user?.bestScore ?? 0,
    streak: user?.streak ?? 0,
    badgesUnlocked: user?.badges ?? [],
    leaderboardUsers: leaderboardBaseUsers.map((entry) => ({ ...entry })),
    chatHistory: user?.chatHistory ?? [],
    simulationHistory: user?.simulationHistory ?? [],
    dailyActivity: user?.dailyActivity ?? [],
    dailyXpClaimedDate: user?.dailyXpClaimedDate ?? null,
    messagesCount: user?.messagesCount ?? 0,
    topicsAsked: user?.topicsAsked ?? []
  };
}
