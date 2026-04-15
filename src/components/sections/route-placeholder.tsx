import Link from "next/link";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RoutePlaceholder({ eyebrow, title, description }: RoutePlaceholderProps) {
  return (
    <main className="min-h-screen bg-radial-grid px-4 py-6">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] max-w-5xl flex-col justify-center">
        <Link className="mb-8 flex w-fit items-center gap-2 text-sm font-semibold text-cyanGlow" href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <GlassCard className="p-6 md:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyanGlow/30 bg-cyanGlow/10 px-4 py-2 text-sm font-medium text-cyan-100">
            <Sparkles className="h-4 w-4 text-cyanGlow" />
            {eyebrow}
          </div>
          <Construction className="mb-6 h-12 w-12 text-violet-200" />
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{description}</p>
        </GlassCard>
      </section>
    </main>
  );
}
