"use client";

import { useMemo, useState } from "react";
import { Code2, Play, Terminal } from "lucide-react";
import { PlatformShell } from "@/components/platform/platform-shell";
import { SectionHeading } from "@/components/platform/section-heading";
import { playgroundSnippets } from "@/data/final-phase-data";
import { GlassCard } from "@/components/ui/glass-card";

export function PlaygroundExperience() {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(playgroundSnippets[0].id);
  const [code, setCode] = useState<string>(playgroundSnippets[0].code);
  const [output, setOutput] = useState<string>(playgroundSnippets[0].output);
  const [isRunning, setIsRunning] = useState(false);

  const selectedSnippet = useMemo(
    () => playgroundSnippets.find((snippet) => snippet.id === selectedSnippetId) ?? playgroundSnippets[0],
    [selectedSnippetId]
  );

  const handleSnippetChange = (snippetId: string) => {
    const snippet = playgroundSnippets.find((item) => item.id === snippetId);

    if (!snippet) {
      return;
    }

    setSelectedSnippetId(snippetId);
    setCode(snippet.code);
    setOutput(snippet.output);
  };

  const handleRun = () => {
    setIsRunning(true);

    window.setTimeout(() => {
      setOutput(`${selectedSnippet.output}\n\nRun complete in AIMLverse sandbox.`);
      setIsRunning(false);
    }, 700);
  };

  return (
    <PlatformShell>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          description="Swap between ready-made examples, tweak the code, and run a mock output terminal designed for quick judge demos."
          eyebrow="Coding Playground"
          title="Experiment with AI-flavored Python snippets in one focused space."
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="p-6">
            <div className="flex flex-wrap gap-3">
              {playgroundSnippets.map((snippet) => (
                <button
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    selectedSnippetId === snippet.id
                      ? "border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyanGlow/25 hover:text-white"
                  }`}
                  key={snippet.id}
                  onClick={() => handleSnippetChange(snippet.id)}
                  type="button"
                >
                  {snippet.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-300">
                <Code2 className="h-4 w-4 text-cyanGlow" />
                <span className="text-sm font-semibold uppercase tracking-[0.22em]">
                  {selectedSnippet.language}
                </span>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-cyanGlow px-4 py-2 font-semibold text-midnight transition hover:-translate-y-1 hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-500"
                disabled={isRunning}
                onClick={handleRun}
                type="button"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>

            <textarea
              className="mt-5 min-h-[420px] w-full rounded-lg border border-white/10 bg-[#030712] p-5 font-mono text-sm leading-7 text-slate-100 outline-none transition focus:border-cyanGlow"
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              value={code}
            />
          </GlassCard>

          <div className="grid gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="h-4 w-4 text-mintGlow" />
                <span className="text-sm font-semibold uppercase tracking-[0.22em]">
                  Mock Output
                </span>
              </div>
              <pre className="mt-5 min-h-[280px] overflow-x-auto rounded-lg border border-white/10 bg-[#02050d] p-5 font-mono text-sm leading-7 text-mintGlow">
                {isRunning ? "Executing snippet...\nLoading AIMLverse runtime..." : output}
              </pre>
            </GlassCard>

            <GlassCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">
                Demo Flow
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">A fast technical moment for judges</h2>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-300">
                <p>Switch snippets to show breadth: Python basics, Pandas, and simple regression.</p>
                <p>Edit a line live, hit run, and the mock terminal updates instantly for a smooth demo.</p>
                <p>Use this as the practical counterpoint to modules, badges, and the mentor widget.</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </PlatformShell>
  );
}
