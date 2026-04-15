"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Layers3, Star, X } from "lucide-react";
import { type ModuleDefinition } from "@/data/platform-data";

type ModuleModalProps = {
  module: ModuleDefinition | null;
  progress: number;
  isLoading: boolean;
  onClose: () => void;
  onStartLearning: () => void;
};

export function ModuleModal({
  module,
  progress,
  isLoading,
  onClose,
  onStartLearning
}: ModuleModalProps) {
  return (
    <AnimatePresence>
      {module ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-midnight/80 px-4 py-8 backdrop-blur-md"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass relative w-full max-w-2xl rounded-lg border border-cyanGlow/20 p-6 shadow-[0_0_60px_rgba(45,212,255,0.16)]"
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              onClick={onClose}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">
              {module.level}
            </p>
            <h3 className="mt-3 text-3xl font-black text-white">{module.title}</h3>
            <p className="mt-4 leading-7 text-slate-300">{module.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center gap-2 text-cyanGlow">
                  <Layers3 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Lessons</span>
                </div>
                <p className="mt-2 text-lg font-bold text-white">{module.lessons} sessions</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center gap-2 text-violet-300">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Estimated time</span>
                </div>
                <p className="mt-2 text-lg font-bold text-white">{module.estimatedTime}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center gap-2 text-mintGlow">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-semibold">XP reward</span>
                </div>
                <p className="mt-2 text-lg font-bold text-white">{module.xpReward} XP total</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center gap-2 text-amber-200">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-semibold">Difficulty</span>
                </div>
                <p className="mt-2 text-lg font-bold text-white">{module.difficulty}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Current progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyanGlow to-violetGlow transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-cyanGlow px-5 py-3 font-semibold text-midnight transition hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-500"
              disabled={isLoading}
              onClick={onStartLearning}
              type="button"
            >
              {isLoading ? "Loading lesson..." : "Start Learning"}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
