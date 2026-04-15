"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { ToastStack, type ToastItem } from "@/components/ui/toast-stack";
import {
  AIMLVERSE_STORAGE_KEY,
  addDailyActivity,
  type ChatEntry,
  createId,
  deriveState,
  getCompletedModuleCount,
  getModuleProgress,
  getNewBadges,
  getStoredUser,
  getToday,
  getUserLeaderboard,
  isModuleUnlocked,
  loginSession,
  logoutSession,
  parseStoredState,
  registerSession,
  type AppState,
  type QuizHistoryEntry,
  type SimulationEntry,
  type ToastRecord
} from "@/lib/aimlverse-state";
import { moduleDefinitions, type BadgeId, type ModuleId } from "@/data/platform-data";

type ActionResult = {
  success: boolean;
  message?: string;
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
  registerUser: (userName: string, email: string, password: string) => ActionResult;
  loginUser: (email: string, password: string) => ActionResult;
  logoutUser: () => void;
  claimDailyXp: () => ActionResult;
  completeModuleLesson: (moduleId: ModuleId) => { unlockedBadges: BadgeId[]; completedModule: boolean };
  recordQuizAttempt: (score: number, total: number) => { unlockedBadges: BadgeId[]; xpAwarded: number };
  recordGameResult: (game: string, won: boolean, score: number) => { unlockedBadges: BadgeId[]; xpAwarded: number };
  recordMentorExchange: (question: string, answer: string, topic: string) => { unlockedBadges: BadgeId[] };
  recordSimulation: (type: "spam" | "image" | "student", input: string, result: string) => void;
  addToast: (toast: ToastRecord) => void;
  dismissToast: (id: string) => void;
};

export const AimlverseContext = createContext<AimlverseContextValue | null>(null);

export function AimlverseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(parseStoredState(null));
  const [isHydrated, setIsHydrated] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    setState(parseStoredState(window.localStorage.getItem(AIMLVERSE_STORAGE_KEY)));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(AIMLVERSE_STORAGE_KEY, JSON.stringify(state));
  }, [isHydrated, state]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: ToastRecord) => {
    setToasts((current) => [...current, toast]);
    window.setTimeout(() => {
      dismissToast(toast.id);
    }, 3200);
  }, [dismissToast]);

  const updateState = useCallback((updater: (current: AppState) => AppState) => {
    const previous = state;
    const next = deriveState(updater(previous));
    const unlockedBadges = getNewBadges(previous, next);
    setState(next);

    unlockedBadges.forEach((badgeId) => {
      addToast({
        id: createId("badge"),
        title: "Badge Unlocked!",
        description: badgeId.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase()),
        tone: "badge"
      });
    });

    return { next, unlockedBadges };
  }, [addToast, state]);

  const registerUser = useCallback((userName: string, email: string, password: string) => {
    if (!userName.trim() || !email.trim() || !password.trim()) {
      return { success: false, message: "Fill in all fields." };
    }

    updateState((current) => registerSession(current, userName.trim(), email.trim().toLowerCase(), password));
    addToast({
      id: createId("auth"),
      title: "Account created",
      description: "You are now logged in and ready to explore AIMLverse.",
      tone: "success"
    });
    return { success: true };
  }, [addToast, updateState]);

  const loginUser = useCallback((email: string, password: string) => {
    const storedUser = getStoredUser(state);

    if (!storedUser) {
      return { success: false, message: "No account found yet. Register first." };
    }

    if (storedUser.email !== email.trim().toLowerCase() || storedUser.password !== password) {
      return { success: false, message: "Email or password is incorrect." };
    }

    updateState((current) => loginSession(current));
    addToast({
      id: createId("auth"),
      title: "Welcome back",
      description: `Logged in as ${storedUser.userName}.`,
      tone: "success"
    });
    return { success: true };
  }, [addToast, state, updateState]);

  const logoutUser = useCallback(() => {
    setState((current) => logoutSession(current));
    addToast({
      id: createId("auth"),
      title: "Logged out",
      description: "Your progress is still saved locally on this device.",
      tone: "info"
    });
  }, [addToast]);

  const claimDailyXp = useCallback(() => {
    const today = getToday();

    if (state.dailyXpClaimedDate === today) {
      return { success: false, message: "Today's XP has already been claimed." };
    }

    updateState((current) =>
      addDailyActivity({
        ...current,
        xp: current.xp + 100,
        dailyXpClaimedDate: today
      })
    );
    addToast({
      id: createId("xp"),
      title: "Daily XP claimed",
      description: "+100 XP added to your profile.",
      tone: "success"
    });
    return { success: true };
  }, [addToast, state.dailyXpClaimedDate, updateState]);

  const completeModuleLesson = useCallback((moduleId: ModuleId) => {
    const result = updateState((current) => {
      if (!isModuleUnlocked(moduleId, current)) {
        return current;
      }

      const currentLessons = current.moduleLessonsCompleted[moduleId] ?? 0;
      if (currentLessons >= 3) {
        return current;
      }

      const nextLessons = currentLessons + 1;
      const moduleDefinition = moduleDefinitions.find((module) => module.id === moduleId);
      const isModuleNowComplete = nextLessons === 3;

      return addDailyActivity({
        ...current,
        currentModule: moduleId,
        xp: current.xp + (isModuleNowComplete && moduleDefinition ? moduleDefinition.xpReward : 20),
        streak: current.streak + (isModuleNowComplete ? 1 : 0),
        completedModules: isModuleNowComplete && !current.completedModules.includes(moduleId)
          ? [...current.completedModules, moduleId]
          : current.completedModules,
        moduleLessonsCompleted: {
          ...current.moduleLessonsCompleted,
          [moduleId]: nextLessons
        }
      });
    });

    const completedModule = result.next.completedModules.includes(moduleId) && !state.completedModules.includes(moduleId);

    addToast({
      id: createId("module"),
      title: completedModule ? "Module completed" : "Lesson completed",
      description: completedModule
        ? "XP, streak, and unlock progress updated instantly."
        : "Your module progress has been saved.",
      tone: "success"
    });

    return {
      unlockedBadges: result.unlockedBadges,
      completedModule
    };
  }, [addToast, state.completedModules, updateState]);

  const recordQuizAttempt = useCallback((score: number, total: number) => {
    const percent = Math.round((score / total) * 100);
    const xpAwarded = 40 + score * 15 + (percent >= 80 ? 25 : 0);

    const result = updateState((current) => {
      const nextAttempts = current.quizAttempts + 1;
      const cumulativeScore = current.quizAverage * current.quizAttempts + percent;
      const nextAverage = Math.round(cumulativeScore / nextAttempts);

      const historyEntry: QuizHistoryEntry = {
        id: createId("quiz"),
        score,
        total,
        percent,
        createdAt: new Date().toISOString()
      };

      return addDailyActivity({
        ...current,
        xp: current.xp + xpAwarded,
        quizAttempts: nextAttempts,
        quizAverage: nextAverage,
        quizHistory: [historyEntry, ...current.quizHistory].slice(0, 10)
      });
    });

    addToast({
      id: createId("quiz"),
      title: "Quiz saved",
      description: `Scored ${percent}% and earned +${xpAwarded} XP.`,
      tone: "success"
    });

    return { unlockedBadges: result.unlockedBadges, xpAwarded };
  }, [addToast, updateState]);

  const recordGameResult = useCallback((game: string, won: boolean, score: number) => {
    const xpAwarded = won ? 55 : 20;

    const result = updateState((current) =>
      addDailyActivity({
        ...current,
        xp: current.xp + xpAwarded,
        gamesPlayed: current.gamesPlayed + 1,
        gamesWon: current.gamesWon + (won ? 1 : 0),
        bestScore: Math.max(current.bestScore, score)
      })
    );

    addToast({
      id: createId("game"),
      title: won ? `${game} won` : `${game} played`,
      description: won ? `Great run. +${xpAwarded} XP added.` : `Good try. +${xpAwarded} XP for practice.`,
      tone: won ? "success" : "info"
    });

    return { unlockedBadges: result.unlockedBadges, xpAwarded };
  }, [addToast, updateState]);

  const recordMentorExchange = useCallback((question: string, answer: string, topic: string) => {
    const result = updateState((current) =>
      addDailyActivity({
        ...current,
        xp: current.xp + 12,
        messagesCount: current.messagesCount + 1,
        topicsAsked: current.topicsAsked.includes(topic)
          ? current.topicsAsked
          : [...current.topicsAsked, topic],
        chatHistory: [
          ...current.chatHistory,
          {
            id: createId("chat-user"),
            role: "user" as const,
            content: question,
            topic,
            createdAt: new Date().toISOString()
          },
          {
            id: createId("chat-assistant"),
            role: "assistant" as const,
            content: answer,
            topic,
            createdAt: new Date().toISOString()
          }
        ].slice(-30) as ChatEntry[]
      })
    );

    addToast({
      id: createId("mentor"),
      title: "Mentor updated",
      description: "Question saved to shared learning history.",
      tone: "success"
    });

    return { unlockedBadges: result.unlockedBadges };
  }, [addToast, updateState]);

  const recordSimulation = useCallback((type: "spam" | "image" | "student", input: string, resultText: string) => {
    const entry: SimulationEntry = {
      id: createId("sim"),
      type,
      input,
      result: resultText,
      createdAt: new Date().toISOString()
    };

    setState((current) =>
      deriveState(
        addDailyActivity({
          ...current,
          xp: current.xp + 18,
          simulationHistory: [entry, ...current.simulationHistory].slice(0, 12)
        })
      )
    );

    addToast({
      id: createId("sim"),
      title: "Simulation recorded",
      description: "This demo result is now part of the live profile history.",
      tone: "success"
    });
  }, [addToast]);

  const leaderboard = useMemo(() => getUserLeaderboard(state), [state]);

  const stats = useMemo(() => ({
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
  }), [state]);

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
    recordMentorExchange,
    recordSimulation,
    addToast,
    dismissToast
  }), [
    addToast,
    claimDailyXp,
    completeModuleLesson,
    dismissToast,
    isHydrated,
    leaderboard,
    loginUser,
    logoutUser,
    recordGameResult,
    recordMentorExchange,
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
