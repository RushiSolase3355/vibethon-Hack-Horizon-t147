"use client";

import { useState } from "react";
import { Radar, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/platform/section-heading";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

const sampleImages = [
  { label: "Cat photo", result: "Cat - 94%" },
  { label: "Banana image", result: "Banana - 91%" },
  { label: "Car photo", result: "Vehicle - 88%" }
];

function analyzeSpam(text: string) {
  const lowered = text.toLowerCase();
  if (["free", "win", "claim", "urgent", "offer"].some((word) => lowered.includes(word))) {
    return "Spam - strong promotional triggers detected";
  }
  return "Likely Safe - message looks informational";
}

function predictStudentScore(hours: number) {
  const score = Math.min(99, Math.round(42 + hours * 6.5));
  return `Likely score: ${score}`;
}

export function SimulationExperience() {
  const { recordSimulation, state } = useAimlverseState();
  const [spamInput, setSpamInput] = useState("Win a free prize now");
  const [spamResult, setSpamResult] = useState("");
  const [imageResult, setImageResult] = useState("");
  const [studyHours, setStudyHours] = useState("5");
  const [studentResult, setStudentResult] = useState("");

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        description="The simulation lab now includes three real client-side demos that write into shared history and update the global profile."
        eyebrow="Simulation Lab"
        title="Use applied AI demos that feel connected to the whole platform."
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Spam Detector</p>
          <textarea
            className="mt-5 min-h-36 w-full rounded-lg border border-white/10 bg-midnight/70 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyanGlow"
            onChange={(event) => setSpamInput(event.target.value)}
            value={spamInput}
          />
          <Button
            className="mt-5"
            onClick={() => {
              const result = analyzeSpam(spamInput);
              setSpamResult(result);
              recordSimulation("spam", spamInput, result);
            }}
          >
            <Radar className="h-4 w-4" />
            Analyze Text
          </Button>
          {spamResult ? <p className="mt-4 text-sm leading-7 text-slate-300">{spamResult}</p> : null}
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Image Classifier</p>
          <div className="mt-5 grid gap-3">
            {sampleImages.map((image) => (
              <Button
                key={image.label}
                onClick={() => {
                  setImageResult(image.result);
                  recordSimulation("image", image.label, image.result);
                }}
                variant="secondary"
              >
                {image.label}
              </Button>
            ))}
          </div>
          {imageResult ? <p className="mt-4 text-sm leading-7 text-slate-300">{imageResult}</p> : null}
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Student Predictor</p>
          <input
            className="mt-5 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none"
            onChange={(event) => setStudyHours(event.target.value)}
            type="number"
            value={studyHours}
          />
          <Button
            className="mt-5"
            onClick={() => {
              const result = predictStudentScore(Number(studyHours));
              setStudentResult(result);
              recordSimulation("student", `${studyHours} hours`, result);
            }}
          >
            Predict Score
          </Button>
          {studentResult ? <p className="mt-4 text-sm leading-7 text-slate-300">{studentResult}</p> : null}
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-violet-200" />
            <p className="font-semibold text-white">Simulation History</p>
          </div>
          <div className="mt-5 grid gap-3">
            {state.simulationHistory.length ? (
              state.simulationHistory.slice(0, 4).map((entry) => (
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4" key={entry.id}>
                  <p className="text-sm font-semibold text-white">{entry.type.toUpperCase()}</p>
                  <p className="mt-1 text-sm text-slate-400">{entry.input}</p>
                  <p className="mt-2 text-sm text-slate-300">{entry.result}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Run a demo to create live simulation history.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Usage Count</p>
          <p className="mt-4 text-4xl font-black text-white">{state.simulationHistory.length}</p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Every run adds XP, saves a record, and updates the persistent learning profile.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
