"use client";

import { useMemo, useState } from "react";
import { BadgeGrid } from "@/components/platform/badge-grid";
import { ModuleCard } from "@/components/platform/module-card";
import { ModuleModal } from "@/components/platform/module-modal";
import { SectionHeading } from "@/components/platform/section-heading";
import {
  filterTabs,
  moduleDefinitions,
  type ModuleDefinition,
  type ModuleLevel
} from "@/data/platform-data";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";
import { GlassCard } from "@/components/ui/glass-card";

export function ModulesExperience() {
  const { state, isModuleUnlocked, getModuleProgress, completeModuleLesson } = useAimlverseState();
  const [activeFilter, setActiveFilter] = useState<ModuleLevel>("All");
  const [selectedModule, setSelectedModule] = useState<ModuleDefinition | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const filteredModules = useMemo(() => {
    if (activeFilter === "All") {
      return moduleDefinitions;
    }

    return moduleDefinitions.filter((module) => module.level === activeFilter);
  }, [activeFilter]);

  const groupedModules = useMemo(() => {
    const groups: Record<string, ModuleDefinition[]> = {};
    filteredModules.forEach((module) => {
      if (!groups[module.level]) {
        groups[module.level] = [];
      }
      groups[module.level].push(module);
    });
    return groups;
  }, [filteredModules]);

  const handleAdvance = () => {
    if (!selectedModule) {
      return;
    }

    completeModuleLesson(selectedModule.id);
    const nextLessons = (state.moduleLessonsCompleted[selectedModule.id] ?? 0) + 1;

    if (nextLessons >= 3) {
      setSelectedModule(null);
      setSelectedAnswer("");
      return;
    }

    setSelectedAnswer("");
  };

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          description="Modules now follow a real learning flow with concept, example, and mini quiz steps. Completion unlocks XP, badges, streak progress, and the next module."
          eyebrow="Learning Modules"
          title="Structured tracks with real lesson flow and unlock logic."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {filterTabs.map((tab) => (
            <button
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                activeFilter === tab
                  ? "border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow"
                  : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyanGlow/25 hover:text-white"
              }`}
              key={tab}
              onClick={() => setActiveFilter(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {Object.entries(groupedModules).map(([level, modules]) => (
            <section key={level}>
              <GlassCard className="p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">
                      {level}
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white">{level} Track</h2>
                  </div>
                  <p className="max-w-2xl text-base leading-7 text-slate-300">
                    {level === "Beginner"
                      ? "Build intuition first, then unlock richer model behavior."
                      : level === "Intermediate"
                        ? "Move into prediction logic and layered learning."
                        : "Tackle real language and vision workflows."}
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  {modules.map((module) => (
                    <ModuleCard
                      example={module.example}
                      icon={module.icon}
                      key={module.id}
                      level={module.level}
                      locked={!isModuleUnlocked(module.id)}
                      onOpen={() => {
                        setSelectedModule(module);
                        setSelectedAnswer("");
                      }}
                      progress={getModuleProgress(module.id)}
                      summary={module.summary}
                      title={module.title}
                    />
                  ))}
                </div>
              </GlassCard>
            </section>
          ))}
        </div>

        <section className="mt-16">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">
              Badge Progress
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">Learning milestones unlock in real time</h2>
          </div>
          <BadgeGrid unlockedBadges={state.badgesUnlocked} />
        </section>
      </div>

      <ModuleModal
        lessonsCompleted={selectedModule ? state.moduleLessonsCompleted[selectedModule.id] ?? 0 : 0}
        module={selectedModule}
        onAdvance={handleAdvance}
        onAnswerSelect={setSelectedAnswer}
        onClose={() => setSelectedModule(null)}
        selectedAnswer={selectedAnswer}
      />
    </>
  );
}
