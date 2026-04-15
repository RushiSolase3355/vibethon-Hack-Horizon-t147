"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { ToastStack, type ToastItem } from "@/components/ui/toast-stack";
import {
  AIMLVERSE_SESSION_KEY,
  AIMLVERSE_STORAGE_KEY,
  calculateLevel,
  createId,
  deriveBadges,
  getCompletedModuleCount,
  getModuleProgress,
  getToday,
  getUserLeaderboard,
  isModuleUnlocked,
  toAppState,
  type AppState,
  type ChatEntry,
  type PublicUser,
  type SimulationEntry,
  type ToastRecord
} from "@/lib/aimlverse-state";
import { moduleDefinitions, type BadgeId, type ModuleId } from "@/data/platform-data";

const AIMLVERSE_LOCAL_MODE_KEY = "aimlverse-local-mode";

type ActionResult = {
  success: boolean;
  message?: string;
};

type MentorResult = ActionResult & {
  answer?: string;
  topic?: string;
};

type AimlverseContextValue = {
  state: AppState;
  isHydrated: boolean;
  stats: {
    xp: number;
    level: number;
    rank: number;
    completedModuleCount: number;
    totalModules: number;
    quizAverage: number;
    gamesWon: number;
    gamesPlayed: number;
    streak: number;
    badgesEarned: number;
    dailyXpClaimed: boolean;
  };
  leaderboard: Array<{ id: string; name: string; xp: number; rank: number; isCurrentUser: boolean }>;
  getModuleProgress: (moduleId: ModuleId) => number;
  isModuleUnlocked: (moduleId: ModuleId) => boolean;
  registerUser: (userName: string, email: string, password: string) => Promise<ActionResult>;
  loginUser: (email: string, password: string) => Promise<ActionResult>;
  logoutUser: () => void;
  claimDailyXp: () => Promise<ActionResult>;
  completeModuleLesson: (moduleId: ModuleId) => Promise<{ unlockedBadges: BadgeId[]; completedModule: boolean }>;
  recordQuizAttempt: (score: number, total: number) => Promise<{ unlockedBadges: BadgeId[]; xpAwarded: number }>;
  recordGameResult: (game: string, won: boolean, score: number) => Promise<{ unlockedBadges: BadgeId[]; xpAwarded: number }>;
  askMentor: (question: string) => Promise<MentorResult>;
  recordSimulation: (type: "spam" | "image" | "student", input: string, result: string) => Promise<void>;
  addToast: (toast: ToastRecord) => void;
  dismissToast: (id: string) => void;
};

export const AimlverseContext = createContext<AimlverseContextValue | null>(null);

async function fetchJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const data = (await response.json()) as T & { success?: boolean; message?: string };
  if (!response.ok) {
    throw new Error(data.message ?? "Request failed.");
  }
  return data;
}

export function AimlverseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(toAppState(null));
  const [isHydrated, setIsHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const enableLocalMode = useCallback(() => {
    window.localStorage.setItem(AIMLVERSE_LOCAL_MODE_KEY, "true");
  }, []);

  const disableLocalMode = useCallback(() => {
    window.localStorage.removeItem(AIMLVERSE_LOCAL_MODE_KEY);
  }, []);

  const persistCachedState = useCallback((nextState: AppState) => {
    const cached = window.localStorage.getItem(AIMLVERSE_STORAGE_KEY);
    const parsed = cached ? (JSON.parse(cached) as Record<string, unknown>) : {};

    window.localStorage.setItem(
      AIMLVERSE_STORAGE_KEY,
      JSON.stringify({
        ...parsed,
        name: nextState.userName,
        email: nextState.email,
        xp: nextState.xp,
        level: nextState.level,
        rank: nextState.rank,
        completedModules: nextState.completedModules,
        currentModule: nextState.currentModule,
        moduleLessonsCompleted: nextState.moduleLessonsCompleted,
        quizAttempts: nextState.quizAttempts,
        quizAverage: nextState.quizAverage,
        quizHistory: nextState.quizHistory,
        gamesPlayed: nextState.gamesPlayed,
        gamesWon: nextState.gamesWon,
        bestScore: nextState.bestScore,
        streak: nextState.streak,
        badges: nextState.badgesUnlocked,
        chatHistory: nextState.chatHistory,
        simulationHistory: nextState.simulationHistory,
        dailyActivity: nextState.dailyActivity,
        dailyXpClaimedDate: nextState.dailyXpClaimedDate,
        messagesCount: nextState.messagesCount,
        topicsAsked: nextState.topicsAsked
      })
    );
  }, []);

  const buildLocalState = useCallback((updater: (current: AppState) => AppState) => {
    const nextState = updater(state);
    setState(nextState);
    persistCachedState(nextState);
    enableLocalMode();
    return nextState;
  }, [enableLocalMode, persistCachedState, state]);

  const withDerivedState = useCallback((nextState: AppState) => {
    const derivedBadges = deriveBadges({
      completedModules: nextState.completedModules,
      xp: nextState.xp,
      quizAverage: nextState.quizAverage,
      quizAttempts: nextState.quizAttempts,
      gamesWon: nextState.gamesWon,
      chatHistory: nextState.chatHistory
    });

    return {
      ...nextState,
      level: calculateLevel(nextState.xp),
      badgesUnlocked: Array.from(new Set([...nextState.badgesUnlocked, ...derivedBadges]))
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: ToastRecord) => {
    setToasts((current) => [...current, toast]);
    window.setTimeout(() => dismissToast(toast.id), 3200);
  }, [dismissToast]);

  const syncUser = useCallback(async (email: string) => {
    const data = await fetchJson<{ success: true; user: PublicUser }>(`/api/user/profile?email=${encodeURIComponent(email)}`);
    setState((current) => ({
      ...toAppState(data.user),
      leaderboardUsers: current.leaderboardUsers
    }));
    window.localStorage.setItem(AIMLVERSE_STORAGE_KEY, JSON.stringify(data.user));
    disableLocalMode();
    return data.user;
  }, [disableLocalMode]);

  const refreshLeaderboard = useCallback(async () => {
    const data = await fetchJson<{ success: true; users: Array<{ rank: number; name: string; email: string; xp: number }> }>("/api/leaderboard");
    setState((current) => ({
      ...current,
      leaderboardUsers: data.users.map((user) => ({
        id: user.email,
        name: user.name,
        xp: user.xp
      }))
    }));
  }, []);

  const syncAll = useCallback(async (email: string) => {
    await Promise.all([syncUser(email), refreshLeaderboard()]);
  }, [refreshLeaderboard, syncUser]);

  useEffect(() => {
    const sessionEmail = window.localStorage.getItem(AIMLVERSE_SESSION_KEY);
    const cached = window.localStorage.getItem(AIMLVERSE_STORAGE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as PublicUser;
        setState((current) => ({ ...current, ...toAppState(parsed), isLoggedIn: Boolean(sessionEmail) }));
      } catch {
        setState(toAppState(null));
      }
    }

    const localModeEnabled = window.localStorage.getItem(AIMLVERSE_LOCAL_MODE_KEY) === "true";

    if (sessionEmail && !localModeEnabled) {
      void syncAll(sessionEmail).finally(() => setIsHydrated(true));
    } else {
      void refreshLeaderboard().finally(() => setIsHydrated(true));
    }
  }, [refreshLeaderboard, syncAll]);

  const getNewBadges = (previous: BadgeId[], next: BadgeId[]) =>
    next.filter((badgeId) => !previous.includes(badgeId));

  const applyServerUser = useCallback(async (user: PublicUser) => {
    const previousBadges = state.badgesUnlocked;
    const nextState = {
      ...toAppState(user),
      leaderboardUsers: state.leaderboardUsers
    };
    setState(nextState);
    window.localStorage.setItem(AIMLVERSE_STORAGE_KEY, JSON.stringify(user));
    window.localStorage.setItem(AIMLVERSE_SESSION_KEY, user.email);
    disableLocalMode();

    getNewBadges(previousBadges, nextState.badgesUnlocked).forEach((badgeId) => {
      addToast({
        id: createId("badge"),
        title: "Badge Unlocked!",
        description: badgeId.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase()),
        tone: "badge"
      });
    });

    await refreshLeaderboard();
    return nextState;
  }, [addToast, disableLocalMode, refreshLeaderboard, state.badgesUnlocked, state.leaderboardUsers]);

  const registerUser = useCallback(async (userName: string, email: string, password: string) => {
    try {
      const data = await fetchJson<{ success: true; user: PublicUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: userName, email, password })
      });
      await applyServerUser(data.user);
      addToast({
        id: createId("auth"),
        title: "Account created",
        description: "You are now logged in and ready to explore AIMLverse.",
        tone: "success"
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : "Registration failed." };
    }
  }, [addToast, applyServerUser]);

  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const data = await fetchJson<{ success: true; user: PublicUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      await applyServerUser(data.user);
      addToast({
        id: createId("auth"),
        title: "Welcome back",
        description: `Logged in as ${data.user.name}.`,
        tone: "success"
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : "Login failed." };
    }
  }, [addToast, applyServerUser]);

  const logoutUser = useCallback(() => {
    window.localStorage.removeItem(AIMLVERSE_SESSION_KEY);
    setState((current) => ({ ...current, isLoggedIn: false }));
    addToast({
      id: createId("auth"),
      title: "Logged out",
      description: "The local session ended, but your backend profile is still saved.",
      tone: "info"
    });
  }, [addToast]);

  const requireEmail = useCallback(
    () => state.email || window.localStorage.getItem(AIMLVERSE_SESSION_KEY) || "",
    [state.email]
  );

  const claimDailyXp = useCallback(async () => {
    try {
      const email = requireEmail();
      if (!email) {
        throw new Error("Login required.");
      }
      const today = getToday();
      if (state.dailyXpClaimedDate === today) {
        return { success: false, message: "Today's XP has already been claimed." };
      }
      const data = await fetchJson<{ success: true; user: PublicUser }>("/api/user/update", {
        method: "POST",
        body: JSON.stringify({
          email,
          xp: 100,
          dailyXpClaimedDate: today,
          dailyActivityDate: today
        })
      });
      await applyServerUser(data.user);
      addToast({
        id: createId("xp"),
        title: "Daily XP claimed",
        description: "+100 XP added to your profile.",
        tone: "success"
      });
      return { success: true };
    } catch (error) {
      const email = requireEmail();
      if (!email) {
        return { success: false, message: error instanceof Error ? error.message : "Unable to claim XP." };
      }

      const today = getToday();
      if (state.dailyXpClaimedDate === today) {
        return { success: false, message: "Today's XP has already been claimed." };
      }

      buildLocalState((current) =>
        withDerivedState({
          ...current,
          xp: current.xp + 100,
          dailyXpClaimedDate: today,
          dailyActivity: current.dailyActivity.includes(today) ? current.dailyActivity : [...current.dailyActivity, today]
        })
      );
      addToast({
        id: createId("xp"),
        title: "Daily XP claimed",
        description: "+100 XP saved in browser mode for this device.",
        tone: "success"
      });
      return { success: true };
    }
  }, [addToast, applyServerUser, buildLocalState, requireEmail, state.dailyXpClaimedDate, withDerivedState]);

  const completeModuleLesson = useCallback(async (moduleId: ModuleId) => {
    const email = requireEmail();
    if (!email) {
      return { unlockedBadges: [], completedModule: false };
    }

    const currentLessons = state.moduleLessonsCompleted[moduleId] ?? 0;
    const nextLessons = Math.min(3, currentLessons + 1);
    const isCompleted = nextLessons === 3 && !state.completedModules.includes(moduleId);
    const moduleDefinition = moduleDefinitions.find((module) => module.id === moduleId);
    const previousBadges = state.badgesUnlocked;

    try {
      const data = await fetchJson<{ success: true; user: PublicUser }>("/api/user/update", {
        method: "POST",
        body: JSON.stringify({
          email,
          currentModule: moduleId,
          moduleLessonIncrement: 1,
          xp: isCompleted ? moduleDefinition?.xpReward ?? 0 : 20,
          completedModule: isCompleted ? moduleId : undefined,
          streakIncrement: isCompleted ? 1 : 0,
          dailyActivityDate: getToday()
        })
      });

      const nextState = await applyServerUser(data.user);
      addToast({
        id: createId("module"),
        title: isCompleted ? "Module completed" : "Lesson completed",
        description: isCompleted ? "XP and unlock progress updated." : "Lesson progress saved.",
        tone: "success"
      });

      return {
        unlockedBadges: getNewBadges(previousBadges, nextState.badgesUnlocked),
        completedModule: isCompleted
      };
    } catch {
      const today = getToday();
      const nextState = buildLocalState((current) =>
        withDerivedState({
          ...current,
          currentModule: moduleId,
          xp: current.xp + (isCompleted ? moduleDefinition?.xpReward ?? 0 : 20),
          streak: current.streak + (isCompleted ? 1 : 0),
          completedModules: isCompleted && !current.completedModules.includes(moduleId)
            ? [...current.completedModules, moduleId]
            : current.completedModules,
          moduleLessonsCompleted: {
            ...current.moduleLessonsCompleted,
            [moduleId]: Math.min(3, (current.moduleLessonsCompleted[moduleId] ?? 0) + 1)
          },
          dailyActivity: current.dailyActivity.includes(today) ? current.dailyActivity : [...current.dailyActivity, today]
        })
      );

      addToast({
        id: createId("module"),
        title: isCompleted ? "Module completed" : "Lesson completed",
        description: "Progress saved in browser mode for this device.",
        tone: "success"
      });

      return {
        unlockedBadges: getNewBadges(previousBadges, nextState.badgesUnlocked),
        completedModule: isCompleted
      };
    }
  }, [addToast, applyServerUser, buildLocalState, requireEmail, state.badgesUnlocked, state.completedModules, state.moduleLessonsCompleted, withDerivedState]);

  const recordQuizAttempt = useCallback(async (score: number, total: number) => {
    const email = requireEmail();
    if (!email) {
      return { unlockedBadges: [], xpAwarded: 0 };
    }
    const percent = Math.round((score / total) * 100);
    const xpAwarded = 40 + score * 15 + (percent >= 80 ? 25 : 0);
    const previousBadges = state.badgesUnlocked;
    try {
      const data = await fetchJson<{ success: true; user: PublicUser }>("/api/user/update", {
        method: "POST",
        body: JSON.stringify({
          email,
          quizScore: score,
          quizTotal: total,
          xp: xpAwarded,
          dailyActivityDate: getToday()
        })
      });
      const nextState = await applyServerUser(data.user);
      return { unlockedBadges: getNewBadges(previousBadges, nextState.badgesUnlocked), xpAwarded };
    } catch {
      const today = getToday();
      const nextQuizHistory = [
        {
          id: createId("quiz"),
          score,
          total,
          percent,
          createdAt: new Date().toISOString()
        },
        ...state.quizHistory
      ].slice(0, 20);
      const nextState = buildLocalState((current) =>
        withDerivedState({
          ...current,
          xp: current.xp + xpAwarded,
          quizAttempts: current.quizAttempts + 1,
          quizAverage: Math.round(
            [...nextQuizHistory].reduce((sum, entry) => sum + entry.percent, 0) / nextQuizHistory.length
          ),
          quizHistory: nextQuizHistory,
          dailyActivity: current.dailyActivity.includes(today) ? current.dailyActivity : [...current.dailyActivity, today]
        })
      );
      return { unlockedBadges: getNewBadges(previousBadges, nextState.badgesUnlocked), xpAwarded };
    }
  }, [applyServerUser, buildLocalState, requireEmail, state.badgesUnlocked, state.quizHistory, withDerivedState]);

  const recordGameResult = useCallback(async (game: string, won: boolean, score: number) => {
    const email = requireEmail();
    if (!email) {
      return { unlockedBadges: [], xpAwarded: 0 };
    }
    const xpAwarded = won ? 55 : 20;
    const previousBadges = state.badgesUnlocked;
    try {
      const data = await fetchJson<{ success: true; user: PublicUser }>("/api/user/update", {
        method: "POST",
        body: JSON.stringify({
          email,
          gameWon: won,
          gameName: game,
          gameScore: score,
          xp: xpAwarded,
          dailyActivityDate: getToday()
        })
      });
      const nextState = await applyServerUser(data.user);
      return { unlockedBadges: getNewBadges(previousBadges, nextState.badgesUnlocked), xpAwarded };
    } catch {
      const today = getToday();
      const nextState = buildLocalState((current) =>
        withDerivedState({
          ...current,
          xp: current.xp + xpAwarded,
          gamesPlayed: current.gamesPlayed + 1,
          gamesWon: current.gamesWon + (won ? 1 : 0),
          bestScore: Math.max(current.bestScore, score),
          dailyActivity: current.dailyActivity.includes(today) ? current.dailyActivity : [...current.dailyActivity, today]
        })
      );
      return { unlockedBadges: getNewBadges(previousBadges, nextState.badgesUnlocked), xpAwarded };
    }
  }, [applyServerUser, buildLocalState, requireEmail, state.badgesUnlocked, withDerivedState]);

  const askMentor = useCallback(async (question: string) => {
    try {
      const mentorData = await fetchJson<{ success: true; reply: string; topic: string }>("/api/mentor", {
        method: "POST",
        body: JSON.stringify({ message: question })
      });

      const email = requireEmail();
      if (email) {
        const chatEntry: ChatEntry[] = [
          { id: createId("chat-user"), role: "user", content: question, topic: mentorData.topic, createdAt: new Date().toISOString() },
          { id: createId("chat-assistant"), role: "assistant", content: mentorData.reply, topic: mentorData.topic, createdAt: new Date().toISOString() }
        ];
        try {
          const data = await fetchJson<{ success: true; user: PublicUser }>("/api/user/update", {
            method: "POST",
            body: JSON.stringify({
              email,
              xp: 12,
              chatEntry,
              topicAsked: mentorData.topic,
              messagesCountIncrement: 1,
              dailyActivityDate: getToday()
            })
          });
          await applyServerUser(data.user);
        } catch {
          const today = getToday();
          buildLocalState((current) =>
            withDerivedState({
              ...current,
              xp: current.xp + 12,
              chatHistory: [...current.chatHistory, ...chatEntry].slice(-30),
              topicsAsked: current.topicsAsked.includes(mentorData.topic)
                ? current.topicsAsked
                : [...current.topicsAsked, mentorData.topic],
              messagesCount: current.messagesCount + 1,
              dailyActivity: current.dailyActivity.includes(today) ? current.dailyActivity : [...current.dailyActivity, today]
            })
          );
        }
      }

      return { success: true, answer: mentorData.reply, topic: mentorData.topic };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : "Mentor request failed." };
    }
  }, [applyServerUser, buildLocalState, requireEmail, withDerivedState]);

  const recordSimulation = useCallback(async (type: "spam" | "image" | "student", input: string, result: string) => {
    const email = requireEmail();
    if (!email) {
      return;
    }
    const simulationEntry: SimulationEntry = {
      id: createId("sim"),
      type,
      input,
      result,
      createdAt: new Date().toISOString()
    };
    try {
      const data = await fetchJson<{ success: true; user: PublicUser }>("/api/user/update", {
        method: "POST",
        body: JSON.stringify({
          email,
          xp: 18,
          simulationEntry,
          dailyActivityDate: getToday()
        })
      });
      await applyServerUser(data.user);
    } catch {
      const today = getToday();
      buildLocalState((current) =>
        withDerivedState({
          ...current,
          xp: current.xp + 18,
          simulationHistory: [simulationEntry, ...current.simulationHistory].slice(0, 20),
          dailyActivity: current.dailyActivity.includes(today) ? current.dailyActivity : [...current.dailyActivity, today]
        })
      );
    }
  }, [applyServerUser, buildLocalState, requireEmail, withDerivedState]);

  const leaderboard = useMemo(
    () =>
      getUserLeaderboard(
        state.leaderboardUsers.filter((user) => user.id !== state.email),
        state.isLoggedIn ? { name: state.userName, xp: state.xp } : undefined
      ),
    [state.email, state.isLoggedIn, state.leaderboardUsers, state.userName, state.xp]
  );

  const stats = useMemo(
    () => ({
      xp: state.xp,
      level: state.level,
      rank: state.rank,
      completedModuleCount: getCompletedModuleCount(state),
      totalModules: moduleDefinitions.length,
      quizAverage: state.quizAverage,
      gamesWon: state.gamesWon,
      gamesPlayed: state.gamesPlayed,
      streak: state.streak,
      badgesEarned: state.badgesUnlocked.length,
      dailyXpClaimed: state.dailyXpClaimedDate === getToday()
    }),
    [state]
  );

  const value = useMemo<AimlverseContextValue>(() => ({
    state,
    isHydrated,
    stats,
    leaderboard,
    getModuleProgress: (moduleId: ModuleId) => getModuleProgress(moduleId, state),
    isModuleUnlocked: (moduleId: ModuleId) => isModuleUnlocked(moduleId, state),
    registerUser,
    loginUser,
    logoutUser,
    claimDailyXp,
    completeModuleLesson,
    recordQuizAttempt,
    recordGameResult,
    askMentor,
    recordSimulation,
    addToast,
    dismissToast
  }), [
    addToast,
    askMentor,
    claimDailyXp,
    completeModuleLesson,
    dismissToast,
    isHydrated,
    leaderboard,
    loginUser,
    logoutUser,
    recordGameResult,
    recordQuizAttempt,
    recordSimulation,
    registerUser,
    state,
    stats
  ]);

  return (
    <AimlverseContext.Provider value={value}>
      {children}
      <ToastStack onDismiss={dismissToast} toasts={toasts} />
    </AimlverseContext.Provider>
  );
}
