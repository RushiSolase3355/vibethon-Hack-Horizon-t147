"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Gamepad2, PlayCircle, Sparkles, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

const previewStats = [
  { label: "12+ Modules", icon: BrainCircuit },
  { label: "3 Mini Games", icon: Gamepad2 },
  { label: "500+ Learners", icon: Users },
  { label: "95% Completion", icon: Trophy }
];

export function HeroSection() {
  const { state, stats } = useAimlverseState();

  const liveStats = state.isLoggedIn
    ? [
        { label: `${stats.xp} XP`, icon: BrainCircuit },
        { label: `Level ${stats.level}`, icon: Trophy },
        { label: `${stats.completedModuleCount} Modules`, icon: Gamepad2 },
        { label: `Rank #${stats.rank}`, icon: Users }
      ]
    : previewStats;

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden pt-24">
      <Image
        alt="Abstract AI neural network"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
        fill
        priority
        sizes="100vw"
        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1800&q=80"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight/40 via-midnight/78 to-midnight" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyanGlow/30 bg-cyanGlow/10 px-4 py-2 text-sm font-medium text-cyan-100">
            <Sparkles className="h-4 w-4 text-cyanGlow" />
            VIBETHON learning prototype
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.04] text-white sm:text-6xl lg:text-7xl">
            Learn AI by
            <span className="block">Playing, Practicing</span>
            <span className="block bg-gradient-to-r from-cyanGlow via-white to-violet-300 bg-clip-text text-transparent">
              & Exploring
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            {state.isLoggedIn
              ? `Welcome back, ${state.userName}. Your AIMLverse profile is live with shared progress across modules, quiz, mentor, games, and simulations.`
              : "AIMLverse turns AI and machine learning into guided missions, quick experiments, and progress-based challenges that are easy to demo and fun to complete."}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            {state.isLoggedIn ? (
              <>
                <Button href="/dashboard">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/modules" variant="secondary">
                  <PlayCircle className="h-4 w-4" />
                  Continue Learning
                </Button>
              </>
            ) : (
              <>
                <Button href="/register">
                  Start the journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/login" variant="secondary">
                  <PlayCircle className="h-4 w-4" />
                  Continue demo
                </Button>
              </>
            )}
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {(state.isLoggedIn ? liveStats : previewStats).map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-white/10 bg-white/[0.06] p-3 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyanGlow/40 hover:bg-cyanGlow/10"
                  initial={{ opacity: 0, y: 12 }}
                  key={stat.label}
                  transition={{ delay: 0.18 + index * 0.06, duration: 0.4 }}
                >
                  <Icon className="mb-2 h-4 w-4 text-cyanGlow" />
                  <p className="text-sm font-bold text-white">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="glass relative min-h-[430px] rounded-lg border-cyanGlow/20 p-5 shadow-[0_0_70px_rgba(45,212,255,0.16)] backdrop-blur-2xl lg:p-6"
          initial={{ opacity: 0, scale: 0.96 }}
          transition={{ delay: 0.12, duration: 0.55 }}
        >
          <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-cyanGlow to-transparent" />
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 md:p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">
                Mission Board
              </span>
              <span className="rounded-full bg-mintGlow/10 px-3 py-1 text-xs font-semibold text-mintGlow">
                Live
              </span>
            </div>
            <div className="space-y-5">
              {["AI Foundations", "Classification Quest", "Model Thinking"].map((item, index) => (
                <div
                  className="rounded-lg border border-white/10 bg-midnight/70 p-5 transition hover:-translate-y-1 hover:border-cyanGlow/45 hover:shadow-glow"
                  key={item}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{item}</p>
                      <p className="mt-1 text-sm text-slate-400">Phase {index + 1} ready path</p>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 sm:w-32">
                      <motion.div
                        animate={{ width: `${42 + index * 18}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-cyanGlow to-violetGlow"
                        initial={{ width: 0 }}
                        transition={{ delay: 0.35 + index * 0.12, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[state.isLoggedIn ? `${stats.xp}` : "1.2k", state.isLoggedIn ? `${state.streak}` : "08", state.isLoggedIn ? `#${stats.rank}` : "#14"].map((item, index) => (
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-3" key={`${item}-${index}`}>
                  <p className="text-xs text-slate-400">{index === 0 ? "XP" : index === 1 ? "Streak" : "Rank"}</p>
                  <p className="mt-1 text-lg font-black text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
