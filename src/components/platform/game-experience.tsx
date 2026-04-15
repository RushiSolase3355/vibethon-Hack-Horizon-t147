"use client";

import { useMemo, useState } from "react";
import { Gamepad2, RotateCcw } from "lucide-react";
import { SectionHeading } from "@/components/platform/section-heading";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

const classificationItems = [
  { item: "Spam email", answer: "Text" },
  { item: "Fruit photo", answer: "Image" },
  { item: "Customer review", answer: "Text" }
];

const decisionQuestions = [
  { prompt: "Has labeled data?", yes: "Supervised", no: "Unsupervised" },
  { prompt: "Need category output?", yes: "Classification", no: "Regression" }
];

const memorySequence = ["Input Layer", "Hidden Layer", "Output Layer"];

export function GameExperience() {
  const { recordGameResult, stats, state } = useAimlverseState();
  const [classificationIndex, setClassificationIndex] = useState(0);
  const [classificationScore, setClassificationScore] = useState(0);
  const [decisionIndex, setDecisionIndex] = useState(0);
  const [decisionScore, setDecisionScore] = useState(0);
  const [memoryInput, setMemoryInput] = useState<string[]>([]);
  const [memoryComplete, setMemoryComplete] = useState(false);

  const classificationDone = classificationIndex >= classificationItems.length;
  const decisionDone = decisionIndex >= decisionQuestions.length;

  const totalLiveScore = useMemo(
    () => classificationScore + decisionScore + (memoryComplete ? 1 : 0),
    [classificationScore, decisionScore, memoryComplete]
  );

  const finishClassification = (choice: string) => {
    if (classificationDone) {
      return;
    }

    const current = classificationItems[classificationIndex];
    const isCorrect = current.answer === choice;
    const nextScore = classificationScore + (isCorrect ? 1 : 0);
    setClassificationScore(nextScore);
    const nextIndex = classificationIndex + 1;
    setClassificationIndex(nextIndex);

    if (nextIndex >= classificationItems.length) {
      recordGameResult("Classification Sort", nextScore >= 2, nextScore);
    }
  };

  const finishDecision = (choice: "yes" | "no") => {
    if (decisionDone) {
      return;
    }

    const current = decisionQuestions[decisionIndex];
    const expected = decisionIndex === 0 ? "yes" : "yes";
    const isCorrect = choice === expected;
    const nextScore = decisionScore + (isCorrect ? 1 : 0);
    setDecisionScore(nextScore);
    const nextIndex = decisionIndex + 1;
    setDecisionIndex(nextIndex);

    if (nextIndex >= decisionQuestions.length) {
      recordGameResult("Decision Tree Choice", nextScore >= 1, nextScore);
    }
  };

  const handleMemoryPick = (value: string) => {
    if (memoryComplete) {
      return;
    }

    const next = [...memoryInput, value];
    setMemoryInput(next);

    if (next.length === memorySequence.length) {
      const won = next.join("|") === memorySequence.join("|");
      setMemoryComplete(true);
      recordGameResult("Neural Path Memory", won, won ? 3 : 1);
    }
  };

  const resetGames = () => {
    setClassificationIndex(0);
    setClassificationScore(0);
    setDecisionIndex(0);
    setDecisionScore(0);
    setMemoryInput([]);
    setMemoryComplete(false);
  };

  const currentClassification = classificationItems[classificationIndex];
  const currentDecision = decisionQuestions[decisionIndex];

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        description="Three working mini-games now feed the shared profile: classification sort, decision tree choice, and a neural path memory round."
        eyebrow="Mini Games"
        title="Play real interactive games and watch wins update the full app."
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Classification Sort</p>
          {!classificationDone && currentClassification ? (
            <>
              <h2 className="mt-3 text-2xl font-black text-white">{currentClassification.item}</h2>
              <div className="mt-6 grid gap-3">
                {["Text", "Image"].map((choice) => (
                  <Button key={choice} onClick={() => finishClassification(choice)} variant="secondary">
                    {choice}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-300">Finished with {classificationScore}/3 correct.</p>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Decision Tree Choice</p>
          {!decisionDone && currentDecision ? (
            <>
              <h2 className="mt-3 text-2xl font-black text-white">{currentDecision.prompt}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                This branch leads toward {currentDecision.yes} if yes, otherwise {currentDecision.no}.
              </p>
              <div className="mt-6 flex gap-3">
                <Button onClick={() => finishDecision("yes")}>Yes</Button>
                <Button onClick={() => finishDecision("no")} variant="secondary">
                  No
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-300">Finished with {decisionScore}/2 correct.</p>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Neural Path Memory</p>
          <h2 className="mt-3 text-2xl font-black text-white">Tap the correct layer order</h2>
          <div className="mt-6 grid gap-3">
            {["Hidden Layer", "Input Layer", "Output Layer"].map((choice) => (
              <Button key={choice} onClick={() => handleMemoryPick(choice)} variant="secondary">
                {choice}
              </Button>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Current sequence: {memoryInput.length ? memoryInput.join(" -> ") : "waiting..."}
          </p>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Gamepad2 className="h-5 w-5 text-cyanGlow" />
            <p className="font-semibold text-white">Live Game Stats</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-slate-400">Played</p>
              <p className="mt-2 text-2xl font-black text-white">{state.gamesPlayed}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-slate-400">Won</p>
              <p className="mt-2 text-2xl font-black text-white">{state.gamesWon}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-slate-400">Best Score</p>
              <p className="mt-2 text-2xl font-black text-white">{state.bestScore}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-slate-400">Dashboard XP</p>
              <p className="mt-2 text-2xl font-black text-white">{stats.xp}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Session Score</p>
          <p className="mt-4 text-4xl font-black text-white">{totalLiveScore}</p>
          <Button className="mt-6" onClick={resetGames} variant="secondary">
            <RotateCcw className="h-4 w-4" />
            Reset Games
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
