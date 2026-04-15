import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  tone: "cyan" | "violet" | "mint" | "amber";
};

const toneClasses = {
  cyan: "border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow",
  violet: "border-violetGlow/25 bg-violetGlow/10 text-violet-300",
  mint: "border-mintGlow/25 bg-mintGlow/10 text-mintGlow",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-200"
};

export function StatCard({ title, value, detail, tone }: StatCardProps) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-300">{detail}</p>
        </div>
        <span
          className={cn(
            "rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]",
            toneClasses[tone]
          )}
        >
          Live
        </span>
      </div>
    </GlassCard>
  );
}
