import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-radial-grid px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-6xl flex-col">
        <Link className="flex w-fit items-center gap-3 text-white" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-cyanGlow/30 bg-cyanGlow/10 shadow-glow">
            <BrainCircuit className="h-5 w-5 text-cyanGlow" />
          </span>
          <span className="text-lg font-bold tracking-wide">AIMLverse</span>
        </Link>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_460px]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-cyanGlow">
              {eyebrow}
            </p>
            <h1 className="text-balance text-4xl font-black leading-tight text-white md:text-6xl">
              Learn AI by Playing, Practicing & Exploring.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Your progress, challenges, and learning quests will connect here as the hackathon
              build grows across each commit.
            </p>
          </div>

          <GlassCard className="p-6 md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-200">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
            </div>
            {children}
          </GlassCard>
        </section>
      </div>
    </main>
  );
}
