"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeGrid } from "@/components/platform/badge-grid";
import { ModuleCard } from "@/components/platform/module-card";
import { ModuleModal } from "@/components/platform/module-modal";
import { SectionHeading } from "@/components/platform/section-heading";
import { ToastStack, type ToastItem } from "@/components/ui/toast-stack";
import {
  badgeDefinitions,
  filterTabs,
  moduleDefinitions,
  type BadgeId,
  type ModuleDefinition,
  type ModuleLevel
} from "@/data/platform-data";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";
import { GlassCard } from "@/components/ui/glass-card";

function createToast(title: string, description: string, tone: ToastItem["tone"] = "info"): ToastItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    description,
    tone
  };
}

export function ModulesExperience() {
  const { state, startLearning } = useAimlverseState();
  const [activeFilter, setActiveFilter] = useState<ModuleLevel>("All");
  const [selectedModule, setSelectedModule] = useState<ModuleDefinition | null>(null);
  const [loadingModuleId, setLoadingModuleId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [highlightedBadgeIds, setHighlightedBadgeIds] = useState<BadgeId[]>([]);

  useEffect(() => {
    if (!highlightedBadgeIds.length) {
      return;
    }

    const timeout = window.setTimeout(() => setHighlightedBadgeIds([]), 2600);
    return () => window.clearTimeout(timeout);
  }, [highlightedBadgeIds]);

  const dismissToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = (toast: ToastItem) => {
    setToasts((current) => [...current, toast]);
    window.setTimeout(() => dismissToast(toast.id), 3200);
  };

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

  const handleOpen = (module: ModuleDefinition) => {
    setLoadingModuleId(module.id);
    window.setTimeout(() => {
      setSelectedModule(module);
      setLoadingModuleId(null);
    }, 220);
  };

  const handleStartLearning = () => {
    if (!selectedModule) {
      return;
    }

    setLoadingModuleId(selectedModule.id);

    window.setTimeout(() => {
      const result = startLearning(selectedModule.id);
      const progress = result.state.moduleProgress[selectedModule.id];

      pushToast(
        createToast(
          "Lesson progress saved",
          `${selectedModule.title} is now at ${progress}% progress.`,
          "success"
        )
      );

      if (result.unlockedBadges.length) {
        setHighlightedBadgeIds(result.unlockedBadges);
        result.unlockedBadges.forEach((badgeId) => {
          const badge = badgeDefinitions.find((item) => item.id === badgeId);

          if (badge) {
            pushToast(createToast("Badge Unlocked!", badge.title, "badge"));
          }
        });
      }

      setSelectedModule((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          description: current.description
        };
      });

      setLoadingModuleId(null);
    }, 700);
  };

  return (
    <>
      <ToastStack onDismiss={dismissToast} toasts={toasts} />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          description="AIMLverse teaches through compact concepts, concrete examples, and visible progress, split across Beginner, Intermediate, and Advanced tracks."
          eyebrow="Learning Modules"
          title="Structured paths that make AI and ML easier to finish."
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
                      ? "Build intuition before touching deeper model behavior."
                      : level === "Intermediate"
                        ? "Move into model decisions, features, and learned patterns."
                        : "Explore how AI tackles language and vision in modern systems."}
                  </p>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  {modules.map((module) => (
                    <ModuleCard
                      example={module.example}
                      icon={module.icon}
                      isLoading={loadingModuleId === module.id}
                      key={module.id}
                      level={module.level}
                      onOpen={() => handleOpen(module)}
                      progress={state.moduleProgress[module.id] ?? 0}
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
            <h2 className="mt-3 text-3xl font-black text-white">Every lesson can unlock something new</h2>
          </div>
          <BadgeGrid
            highlightedBadgeIds={highlightedBadgeIds}
            unlockedBadges={state.unlockedBadges}
          />
        </section>
      </div>

      <ModuleModal
        isLoading={loadingModuleId === selectedModule?.id}
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
        onStartLearning={handleStartLearning}
        progress={selectedModule ? state.moduleProgress[selectedModule.id] ?? 0 : 0}
      />
    </>
  );
}
