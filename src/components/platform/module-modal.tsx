"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Layers3, Star, X } from "lucide-react";
import { type ModuleDefinition } from "@/data/platform-data";
import { Button } from "@/components/ui/button";

type ModuleModalProps = {
  module: ModuleDefinition | null;
  lessonsCompleted: number;
  selectedAnswer: string;
  onAnswerSelect: (value: string) => void;
  onAdvance: () => void;
  onClose: () => void;
};

export function ModuleModal({
  module,
  lessonsCompleted,
  selectedAnswer,
  onAnswerSelect,
  onAdvance,
  onClose
}: ModuleModalProps) {
  const currentStep = Math.min(lessonsCompleted + 1, 3);

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
            className="glass relative w-full max-w-3xl rounded-lg border border-cyanGlow/20 p-6 shadow-[0_0_60px_rgba(45,212,255,0.16)]"
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
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
            <p className="mt-4 text-sm leading-7 text-slate-300">{module.description}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <div className="flex items-center gap-2 text-cyanGlow">
                  <Layers3 className="h-4 w-4" />
                  <span className="text-sm font-semibold">Lessons</span>
                </div>
                <p className="mt-2 text-lg font-bold text-white">3 guided steps</p>
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
                <p className="mt-2 text-lg font-bold text-white">{module.xpReward} XP</p>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyanGlow">
                Lesson {currentStep}
              </p>

              {currentStep === 1 ? (
                <>
                  <h4 className="mt-3 text-2xl font-black text-white">Concept</h4>
                  <p className="mt-4 leading-7 text-slate-300">{module.concept}</p>
                </>
              ) : null}

              {currentStep === 2 ? (
                <>
                  <h4 className="mt-3 text-2xl font-black text-white">Example</h4>
                  <p className="mt-4 text-cyan-100">{module.example}</p>
                  <p className="mt-4 leading-7 text-slate-300">{module.walkthrough}</p>
                </>
              ) : null}

              {currentStep === 3 ? (
                <>
                  <h4 className="mt-3 text-2xl font-black text-white">Mini Quiz</h4>
                  <p className="mt-4 leading-7 text-slate-200">{module.quiz.question}</p>
                  <div className="mt-5 grid gap-3">
                    {module.quiz.options.map((option) => (
                      <button
                        className={`rounded-lg border px-4 py-3 text-left transition ${
                          selectedAnswer === option
                            ? "border-cyanGlow/40 bg-cyanGlow/10 text-white"
                            : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyanGlow/25"
                        }`}
                        key={option}
                        onClick={() => onAnswerSelect(option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {selectedAnswer ? (
                    <p className="mt-4 text-sm text-slate-400">{module.quiz.explanation}</p>
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                disabled={currentStep === 3 && selectedAnswer !== module.quiz.answer}
                onClick={onAdvance}
              >
                {currentStep === 3 ? "Complete Module" : "Complete Lesson"}
              </Button>
              <Button onClick={onClose} variant="secondary">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
