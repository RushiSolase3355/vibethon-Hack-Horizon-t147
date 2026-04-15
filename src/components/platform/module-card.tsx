import { ArrowRight, type LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

type ModuleCardProps = {
  title: string;
  level: string;
  summary: string;
  example: string;
  progress: number;
  isLoading?: boolean;
  onOpen: () => void;
  icon: LucideIcon;
};

export function ModuleCard({
  title,
  level,
  summary,
  example,
  progress,
  isLoading = false,
  onOpen,
  icon: Icon
}: ModuleCardProps) {
  return (
    <GlassCard className="h-full p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-lg border border-cyanGlow/30 bg-cyanGlow/10">
          <Icon className="h-6 w-6 text-cyanGlow" />
        </div>
        <span className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
          {progress}% complete
        </span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyanGlow">{level}</p>
      <h3 className="text-2xl font-black text-white">{title}</h3>
      <p className="mt-3 leading-7 text-slate-300">{summary}</p>
      <p className="mt-4 text-sm font-medium text-cyan-100">Example: {example}</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyanGlow to-violetGlow transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <button
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-cyanGlow disabled:cursor-not-allowed disabled:text-slate-500"
        disabled={isLoading}
        onClick={onOpen}
        type="button"
      >
        {isLoading ? "Opening..." : "Continue Module"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </GlassCard>
  );
}
