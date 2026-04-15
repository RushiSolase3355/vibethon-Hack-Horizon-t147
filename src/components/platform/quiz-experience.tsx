"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, CircleDot, RotateCcw, Timer, Trophy, XCircle } from "lucide-react";
import { SectionHeading } from "@/components/platform/section-heading";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";
import { cn } from "@/lib/utils";

const quizQuestions = [
  {
    question: "Which AIMLverse module explains how machines learn from examples?",
    options: ["ML Basics", "Computer Vision", "Game Arena", "Leaderboard"],
    answer: "ML Basics",
    explanation: "ML Basics introduces the idea of learning patterns from data."
  },
  {
    question: "Spam detection is an example of what kind of task?",
    options: ["Classification", "Animation", "Compression", "Rendering"],
    answer: "Classification",
    explanation: "The system predicts one of a fixed set of labels such as spam or not spam."
  },
  {
    question: "What area focuses on understanding human language?",
    options: ["NLP", "Neural Rendering", "Routing", "Indexing"],
    answer: "NLP",
    explanation: "NLP stands for Natural Language Processing."
  },
  {
    question: "What do hidden layers do in a neural network?",
    options: [
      "Learn useful representations",
      "Store browser cookies",
      "Deploy the model",
      "Rename training files"
    ],
    answer: "Learn useful representations",
    explanation: "Hidden layers transform inputs into features that help with prediction."
  },
  {
    question: "Which module would you open for image-based prediction tasks?",
    options: ["Computer Vision", "Login", "ML Basics", "Features"],
    answer: "Computer Vision",
    explanation: "Computer Vision handles images and video."
  }
];

const QUIZ_DURATION_SECONDS = 75;

export function QuizExperience() {
  const { recordQuizAttempt, state, stats } = useAimlverseState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [isFinished, setIsFinished] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  useEffect(() => {
    if (isFinished) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setIsFinished(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isFinished]);

  useEffect(() => {
    if (!isFinished || hasRecorded) {
      return;
    }

    recordQuizAttempt(score, quizQuestions.length);
    setHasRecorded(true);
  }, [hasRecorded, isFinished, recordQuizAttempt, score]);

  const currentQuestion = quizQuestions[currentIndex];
  const progressPercent = useMemo(
    () => Math.round((submittedAnswers.length / quizQuestions.length) * 100),
    [submittedAnswers.length]
  );

  const finishQuiz = () => {
    setIsFinished(true);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || submittedAnswers[currentIndex]) {
      return;
    }

    const nextAnswers = [...submittedAnswers];
    nextAnswers[currentIndex] = selectedOption;
    setSubmittedAnswers(nextAnswers);

    if (selectedOption === currentQuestion.answer) {
      setScore((current) => current + 1);
    }
  };

  const handleNext = () => {
    if (!submittedAnswers[currentIndex]) {
      return;
    }

    if (currentIndex === quizQuestions.length - 1) {
      finishQuiz();
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setSelectedOption(submittedAnswers[nextIndex] ?? null);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmittedAnswers([]);
    setScore(0);
    setTimeLeft(QUIZ_DURATION_SECONDS);
    setIsFinished(false);
    setHasRecorded(false);
  };

  const latestResult = state.quizHistory[0];

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        description="This quiz engine tracks time, score, attempts, average, and XP in the same shared state used by the dashboard and leaderboard."
        eyebrow="Quiz Arena"
        title="Run a real timed assessment and watch the profile update live."
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <GlassCard className="p-6 md:p-8">
          {!isFinished ? (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">
                    Question {currentIndex + 1}/{quizQuestions.length}
                  </p>
                  <h2 className="mt-3 text-2xl font-black text-white">{currentQuestion.question}</h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Timer</p>
                  <p className="mt-1 flex items-center justify-end gap-2 text-3xl font-black text-white">
                    <Timer className="h-5 w-5 text-cyanGlow" />
                    {timeLeft}s
                  </p>
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyanGlow via-sky-300 to-violet-300 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-8 space-y-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option;
                  const showCorrect = submittedAnswers[currentIndex] && option === currentQuestion.answer;
                  const showWrong = submittedAnswers[currentIndex] === option && option !== currentQuestion.answer;

                  return (
                    <button
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition",
                        isSelected
                          ? "border-cyanGlow/40 bg-cyanGlow/10 shadow-glow"
                          : "border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]",
                        showCorrect && "border-mintGlow/40 bg-mintGlow/10",
                        showWrong && "border-rose-400/40 bg-rose-400/10"
                      )}
                      disabled={Boolean(submittedAnswers[currentIndex])}
                      key={option}
                      onClick={() => setSelectedOption(option)}
                      type="button"
                    >
                      {showCorrect ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-mintGlow" />
                      ) : showWrong ? (
                        <XCircle className="h-5 w-5 shrink-0 text-rose-300" />
                      ) : isSelected ? (
                        <CircleDot className="h-5 w-5 shrink-0 text-cyanGlow" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-slate-500" />
                      )}
                      <span className="text-sm font-medium text-slate-100">{option}</span>
                    </button>
                  );
                })}
              </div>

              {submittedAnswers[currentIndex] ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyanGlow">Instant Feedback</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{currentQuestion.explanation}</p>
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button disabled={!selectedOption || Boolean(submittedAnswers[currentIndex])} onClick={handleCheckAnswer}>
                  Check Answer
                </Button>
                <Button disabled={!Boolean(submittedAnswers[currentIndex])} onClick={handleNext} variant="secondary">
                  {currentIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Quiz Complete</p>
              <h2 className="mt-3 text-4xl font-black text-white">
                {score}/{quizQuestions.length}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Result saved to history. Dashboard, badges, XP, and rank are already updated.
              </p>
              <Button className="mt-6" onClick={handleRestart} variant="secondary">
                <RotateCcw className="h-4 w-4" />
                Restart Quiz
              </Button>
            </div>
          )}
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-violet-200" />
              <p className="font-semibold text-white">Live Quiz Stats</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs text-slate-400">Attempts</p>
                <p className="mt-2 text-2xl font-black text-white">{state.quizAttempts}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs text-slate-400">Average</p>
                <p className="mt-2 text-2xl font-black text-white">{stats.quizAverage}%</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Latest Result</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {latestResult
                ? `${latestResult.percent}% scored on ${new Date(latestResult.createdAt).toLocaleDateString()}.`
                : "No quiz history yet. Finish a run to create a real assessment record."}
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
