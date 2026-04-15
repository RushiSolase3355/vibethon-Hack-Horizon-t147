import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyanGlow/30 bg-cyanGlow/10">
            <BrainCircuit className="h-5 w-5 text-cyanGlow" />
          </span>
          <span className="font-bold text-white">AIMLverse</span>
        </Link>
        <p className="max-w-xl text-sm leading-6 text-slate-400">
          Learn AI by Playing, Practicing & Exploring. Built for VIBETHON with a phase-first
          commit strategy.
        </p>
        <div className="flex gap-4 text-sm text-slate-300">
          <Link className="hover:text-white" href="/playground">
            Playground
          </Link>
          <Link className="hover:text-white" href="/login">
            Login
          </Link>
          <Link className="hover:text-white" href="/register">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
