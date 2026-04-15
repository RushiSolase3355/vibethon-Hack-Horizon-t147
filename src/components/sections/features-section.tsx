"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Brain, Gamepad2, LineChart, Lock, Route } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const features = [
  {
    title: "Structured learning paths",
    description: "Begin with AI basics and move toward ML concepts through concise guided modules.",
    icon: Route
  },
  {
    title: "Interactive challenge core",
    description: "Games, quiz flows, and simulations will become the visible demo engine in later phases.",
    icon: Gamepad2
  },
  {
    title: "Progress that feels earned",
    description: "XP, streaks, badges, and completed lessons are designed for fast judging walkthroughs.",
    icon: LineChart
  },
  {
    title: "Local auth flow",
    description: "Login and register screens make the prototype feel product-ready without backend delay.",
    icon: Lock
  },
  {
    title: "AI-first interface",
    description: "A focused premium theme keeps the experience polished while staying lightweight.",
    icon: Brain
  },
  {
    title: "Vercel ready",
    description: "Next.js App Router, TypeScript, and Tailwind keep the project easy to run and deploy.",
    icon: BadgeCheck
  }
];

export function FeaturesSection() {
  return (
    <section className="relative px-4 pb-24 pt-28 sm:px-6 lg:px-8" id="features">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyanGlow/60 to-transparent" />
      <div className="absolute left-1/2 top-0 h-24 w-2/3 -translate-x-1/2 bg-cyanGlow/10 blur-3xl" />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanGlow">
            Phase 1 foundation
          </p>
          <h2 className="mt-4 text-balance text-4xl font-black text-white md:text-5xl">
            A real product shell ready for rapid feature commits
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            AIMLverse starts polished and runnable, then grows into learning modules, challenges,
            and simulations through clean commit milestones.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                key={feature.title}
                transition={{ delay: index * 0.04, duration: 0.45 }}
                viewport={{ once: true, amount: 0.35 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="h-full p-6">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg border border-cyanGlow/30 bg-cyanGlow/10">
                    <Icon className="h-6 w-6 text-cyanGlow" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{feature.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
