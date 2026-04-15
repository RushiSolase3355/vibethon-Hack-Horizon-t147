import { promises as fs } from "fs";
import path from "path";
import { badgeDefinitions, type BadgeId, type ModuleId } from "@/data/platform-data";
import {
  calculateLevel,
  createId,
  deriveBadges,
  getDefaultUserRecord,
  toPublicUser,
  type ChatEntry,
  type GameHistoryEntry,
  type PublicUser,
  type QuizHistoryEntry,
  type SimulationEntry,
  type UserRecord
} from "@/lib/aimlverse-state";

const usersFilePath = path.join(process.cwd(), "src", "data", "users.json");

type UpdatePayload = {
  email: string;
  xp?: number;
  completedModule?: ModuleId | string;
  currentModule?: ModuleId;
  moduleLessonIncrement?: number;
  quizScore?: number;
  quizTotal?: number;
  gameWon?: boolean;
  gameName?: string;
  gameScore?: number;
  messagesCountIncrement?: number;
  topicAsked?: string;
  chatEntry?: ChatEntry[];
  simulationEntry?: SimulationEntry;
  streakIncrement?: number;
  dailyXpClaimedDate?: string;
  dailyActivityDate?: string;
};

async function ensureUsersFile() {
  try {
    await fs.access(usersFilePath);
  } catch {
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    await fs.writeFile(usersFilePath, "[]", "utf8");
  }
}

async function readUsers(): Promise<UserRecord[]> {
  await ensureUsersFile();
  const content = await fs.readFile(usersFilePath, "utf8");
  return JSON.parse(content) as UserRecord[];
}

async function writeUsers(users: UserRecord[]) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf8");
}

function assignRanks(users: UserRecord[]) {
  const sorted = [...users].sort((left, right) => right.xp - left.xp);
  const rankMap = new Map(sorted.map((user, index) => [user.email, index + 1]));
  return users.map((user) => ({
    ...user,
    rank: rankMap.get(user.email) ?? users.length
  }));
}

function recalculateUser(user: UserRecord): UserRecord {
  const quizAttempts = user.quizHistory.length;
  const quizAverage = quizAttempts
    ? Math.round(user.quizHistory.reduce((sum, entry) => sum + entry.percent, 0) / quizAttempts)
    : 0;

  const badges = new Set<BadgeId>(deriveBadges({
    completedModules: user.completedModules,
    xp: user.xp,
    quizAverage,
    quizAttempts,
    gamesWon: user.gamesWon,
    chatHistory: user.chatHistory
  }));

  if (user.createdAt) {
    badges.add("first-login");
  }

  return {
    ...user,
    level: calculateLevel(user.xp),
    quizAttempts,
    quizAverage,
    badges: badgeDefinitions.map((badge) => badge.id).filter((badgeId) => badges.has(badgeId))
  };
}

export async function createUser(name: string, email: string, password: string): Promise<PublicUser> {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("Email already registered.");
  }

  const newUser = getDefaultUserRecord(name.trim(), normalizedEmail, password);
  const rankedUsers = assignRanks(users.concat(newUser)).map(recalculateUser);
  await writeUsers(rankedUsers);
  const created = rankedUsers.find((user) => user.email === normalizedEmail);

  if (!created) {
    throw new Error("Failed to create user.");
  }

  return toPublicUser(created);
}

export async function authenticateUser(email: string, password: string): Promise<PublicUser> {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((entry) => entry.email === normalizedEmail && entry.password === password);

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  return toPublicUser(recalculateUser(user));
}

export async function getUserProfile(email: string): Promise<PublicUser> {
  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const rankedUsers = assignRanks(users).map(recalculateUser);
  const user = rankedUsers.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    throw new Error("User not found.");
  }

  await writeUsers(rankedUsers);
  return toPublicUser(user);
}

export async function updateUserProgress(payload: UpdatePayload): Promise<PublicUser> {
  const users = await readUsers();
  const normalizedEmail = payload.email.trim().toLowerCase();
  const userIndex = users.findIndex((entry) => entry.email === normalizedEmail);

  if (userIndex === -1) {
    throw new Error("User not found.");
  }

  const user = { ...users[userIndex] };

  if (typeof payload.xp === "number") {
    user.xp += payload.xp;
  }

  if (payload.currentModule) {
    user.currentModule = payload.currentModule;
  }

  if (payload.completedModule && !user.completedModules.includes(payload.completedModule as ModuleId)) {
    user.completedModules = [...user.completedModules, payload.completedModule as ModuleId];
  }

  if (payload.moduleLessonIncrement && payload.currentModule) {
    user.moduleLessonsCompleted = {
      ...user.moduleLessonsCompleted,
      [payload.currentModule]: Math.min(
        3,
        (user.moduleLessonsCompleted[payload.currentModule] ?? 0) + payload.moduleLessonIncrement
      )
    };
  }

  if (typeof payload.quizScore === "number") {
    const total = payload.quizTotal ?? 100;
    const percent = Math.round((payload.quizScore / total) * 100);
    const historyEntry: QuizHistoryEntry = {
      id: createId("quiz"),
      score: payload.quizScore,
      total,
      percent,
      createdAt: new Date().toISOString()
    };
    user.quizScores = [...user.quizScores, percent];
    user.quizHistory = [historyEntry, ...user.quizHistory].slice(0, 20);
  }

  if (typeof payload.gameWon === "boolean") {
    user.gamesPlayed += 1;
    if (payload.gameWon) {
      user.gamesWon += 1;
    }
    user.bestScore = Math.max(user.bestScore, payload.gameScore ?? 0);
    const historyEntry: GameHistoryEntry = {
      id: createId("game"),
      game: payload.gameName ?? "Game",
      won: payload.gameWon,
      score: payload.gameScore ?? 0,
      createdAt: new Date().toISOString()
    };
    void historyEntry;
  }

  if (payload.chatEntry?.length) {
    user.chatHistory = [...user.chatHistory, ...payload.chatEntry].slice(-30);
  }

  if (payload.topicAsked && !user.topicsAsked.includes(payload.topicAsked)) {
    user.topicsAsked = [...user.topicsAsked, payload.topicAsked];
  }

  if (payload.messagesCountIncrement) {
    user.messagesCount += payload.messagesCountIncrement;
  }

  if (payload.simulationEntry) {
    user.simulationHistory = [payload.simulationEntry, ...user.simulationHistory].slice(0, 20);
  }

  if (typeof payload.streakIncrement === "number") {
    user.streak += payload.streakIncrement;
  }

  if (payload.dailyXpClaimedDate) {
    user.dailyXpClaimedDate = payload.dailyXpClaimedDate;
  }

  if (payload.dailyActivityDate && !user.dailyActivity.includes(payload.dailyActivityDate)) {
    user.dailyActivity = [...user.dailyActivity, payload.dailyActivityDate];
  }

  const nextUsers = assignRanks(
    users.map((entry, index) => (index === userIndex ? recalculateUser(user) : recalculateUser(entry)))
  ).map(recalculateUser);
  await writeUsers(nextUsers);
  const updated = nextUsers.find((entry) => entry.email === normalizedEmail);

  if (!updated) {
    throw new Error("Unable to update user.");
  }

  return toPublicUser(updated);
}

export async function getLeaderboard() {
  const users = assignRanks((await readUsers()).map(recalculateUser))
    .sort((left, right) => right.xp - left.xp)
    .map((user) => ({
      rank: user.rank,
      name: user.name,
      email: user.email,
      xp: user.xp,
      level: user.level
    }));

  return users;
}
