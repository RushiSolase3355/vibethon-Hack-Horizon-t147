"use client";

import { useMemo, useState } from "react";
import { BrainCircuit, Gamepad2, RotateCcw, ScanSearch, Sparkles, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/platform/section-heading";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";

type ArcadeGameId = "spam-vs-safe" | "data-detective";

type SpamRound = {
  id: string;
  message: string;
  answer: "Spam" | "Safe";
  clue: string;
  concept: string;
};

type DataRound = {
  id: string;
  scenario: string;
  dataset: string[];
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  concept: string;
};

const spamRounds: SpamRound[] = [
  {
    id: "spam-1",
    message: "URGENT: You won a free iPhone. Click now and enter your bank PIN to claim it.",
    answer: "Spam",
    clue: "It uses urgency, unrealistic rewards, and asks for sensitive information.",
    concept: "Classification models often learn from words and intent patterns that signal fraud or spam."
  },
  {
    id: "spam-2",
    message: "Reminder: Your AIMLverse session starts at 5 PM today. Join with the link from your dashboard.",
    answer: "Safe",
    clue: "The message is specific, expected, and does not ask for suspicious actions.",
    concept: "Real-world classifiers learn to separate legitimate messages from risky ones using labeled examples."
  },
  {
    id: "spam-3",
    message: "Limited-time crypto jackpot. Transfer 500 rupees now and receive 50,000 by tonight.",
    answer: "Spam",
    clue: "This is a classic scam pattern with pressure and unrealistic financial promises.",
    concept: "Binary classification maps content into one of two labels, such as spam or not spam."
  },
  {
    id: "spam-4",
    message: "Your GitHub sign-in code is 248913. It expires in 10 minutes.",
    answer: "Safe",
    clue: "This looks like a normal one-time code message without a suspicious link.",
    concept: "A good model uses patterns, context, and training data to predict the right category."
  }
];

const dataRounds: DataRound[] = [
  {
    id: "data-1",
    scenario: "A school app wants to predict whether a student will pass or fail.",
    dataset: ["study_hours", "attendance", "previous_scores", "pass_or_fail"],
    question: "What is the label in this dataset?",
    options: ["study_hours", "attendance", "pass_or_fail", "previous_scores"],
    answer: "pass_or_fail",
    explanation: "The label is the target the model is trying to predict.",
    concept: "In supervised learning, features are the inputs and the label is the correct output."
  },
  {
    id: "data-2",
    scenario: "An email filter predicts Spam or Not Spam using sender history and message text.",
    dataset: ["sender_score", "contains_link", "message_length", "spam_or_safe"],
    question: "Which type of ML problem is this?",
    options: ["Regression", "Classification", "Clustering", "Sorting"],
    answer: "Classification",
    explanation: "The output is a category, so this is classification.",
    concept: "Classification predicts labels such as spam, fraud, disease type, or sentiment."
  },
  {
    id: "data-3",
    scenario: "A fitness app predicts tomorrow's calories burned as a number.",
    dataset: ["steps", "sleep_hours", "active_minutes", "calories_burned"],
    question: "Which target type best matches this task?",
    options: ["Continuous value", "Category label", "Image class", "Token sequence"],
    answer: "Continuous value",
    explanation: "A numeric prediction like calories burned is a continuous value.",
    concept: "Regression predicts a number, while classification predicts a category."
  },
  {
    id: "data-4",
    scenario: "A fruit model uses color, weight, and texture to predict apple, banana, or orange.",
    dataset: ["color", "weight", "texture", "fruit_type"],
    question: "Which columns are features?",
    options: ["fruit_type only", "color, weight, texture", "fruit_type and texture", "none of them"],
    answer: "color, weight, texture",
    explanation: "Features are the inputs used by the model to make its prediction.",
    concept: "Features are measurable properties that help the model learn useful patterns."
  }
];

const gameMeta: Array<{
  id: ArcadeGameId;
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof BrainCircuit;
  concept: string;
}> = [
  {
    id: "spam-vs-safe",
    title: "Spam vs Safe",
    eyebrow: "Text Classification",
    description: "Read a message, decide if it is suspicious, and learn how binary classification works in the real world.",
    icon: ScanSearch,
    concept: "Teaches spam detection, label prediction, and pattern recognition."
  },
  {
    id: "data-detective",
    title: "Data Detective",
    eyebrow: "ML Basics",
    description: "Inspect tiny datasets, spot labels and features, and choose the right machine learning concept under pressure.",
    icon: BrainCircuit,
    concept: "Teaches features, labels, regression, and classification."
  }
];

export function GameExperience() {
  const { recordGameResult, stats, state } = useAimlverseState();
  const [activeGame, setActiveGame] = useState<ArcadeGameId>("spam-vs-safe");

  const [spamIndex, setSpamIndex] = useState(0);
  const [spamScore, setSpamScore] = useState(0);
  const [spamFeedback, setSpamFeedback] = useState<string | null>(null);
  const [spamFinished, setSpamFinished] = useState(false);
  const [spamRecorded, setSpamRecorded] = useState(false);

  const [dataIndex, setDataIndex] = useState(0);
  const [dataScore, setDataScore] = useState(0);
  const [dataFeedback, setDataFeedback] = useState<string | null>(null);
  const [dataFinished, setDataFinished] = useState(false);
  const [dataRecorded, setDataRecorded] = useState(false);

  const currentSpamRound = spamRounds[spamIndex] ?? null;
  const currentDataRound = dataRounds[dataIndex] ?? null;

  const totalLiveScore = useMemo(() => spamScore + dataScore, [spamScore, dataScore]);

  const recordOnce = async (game: string, won: boolean, score: number, alreadyRecorded: boolean, onRecorded: () => void) => {
    if (alreadyRecorded) {
      return;
    }

    await recordGameResult(game, won, score);
    onRecorded();
  };

  const handleSpamChoice = async (choice: "Spam" | "Safe") => {
    if (!currentSpamRound || spamFinished) {
      return;
    }

    const isCorrect = choice === currentSpamRound.answer;
    const nextScore = spamScore + (isCorrect ? 1 : 0);
    setSpamScore(nextScore);
    setSpamFeedback(
      `${isCorrect ? "Correct." : "Not quite."} ${currentSpamRound.clue} ${currentSpamRound.concept}`
    );

    const nextIndex = spamIndex + 1;
    if (nextIndex >= spamRounds.length) {
      setSpamFinished(true);
      await recordOnce("Spam vs Safe", nextScore >= 3, nextScore, spamRecorded, () => setSpamRecorded(true));
      return;
    }

    setTimeout(() => {
      setSpamIndex(nextIndex);
      setSpamFeedback(null);
    }, 900);
  };

  const handleDataChoice = async (choice: string) => {
    if (!currentDataRound || dataFinished) {
      return;
    }

    const isCorrect = choice === currentDataRound.answer;
    const nextScore = dataScore + (isCorrect ? 1 : 0);
    setDataScore(nextScore);
    setDataFeedback(
      `${isCorrect ? "Correct." : "Not quite."} ${currentDataRound.explanation} ${currentDataRound.concept}`
    );

    const nextIndex = dataIndex + 1;
    if (nextIndex >= dataRounds.length) {
      setDataFinished(true);
      await recordOnce("Data Detective", nextScore >= 3, nextScore, dataRecorded, () => setDataRecorded(true));
      return;
    }

    setTimeout(() => {
      setDataIndex(nextIndex);
      setDataFeedback(null);
    }, 900);
  };

  const resetGames = () => {
    setSpamIndex(0);
    setSpamScore(0);
    setSpamFeedback(null);
    setSpamFinished(false);
    setSpamRecorded(false);

    setDataIndex(0);
    setDataScore(0);
    setDataFeedback(null);
    setDataFinished(false);
    setDataRecorded(false);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        description="The game dashboard is now a playable learning arcade. Each game teaches a real AI concept while also updating wins, scores, and shared XP."
        eyebrow="Learning Arcade"
        title="Play mini-games that teach AI concepts while you compete."
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Choose a game</p>
          <div className="mt-5 space-y-4">
            {gameMeta.map((game) => {
              const Icon = game.icon;
              const isActive = activeGame === game.id;

              return (
                <button
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isActive
                      ? "border-cyanGlow/40 bg-cyanGlow/10 shadow-[0_0_30px_rgba(45,212,255,0.12)]"
                      : "border-white/10 bg-white/[0.04] hover:border-cyanGlow/25 hover:bg-white/[0.06]"
                  }`}
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  type="button"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg border border-cyanGlow/25 bg-cyanGlow/10 p-3">
                      <Icon className="h-5 w-5 text-cyanGlow" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyanGlow">
                        {game.eyebrow}
                      </p>
                      <h2 className="mt-2 text-xl font-black text-white">{game.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{game.description}</p>
                      <p className="mt-3 text-sm text-slate-400">{game.concept}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          {activeGame === "spam-vs-safe" ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Spam vs Safe</p>
              <h2 className="mt-3 text-3xl font-black text-white">Classify each message like a real spam filter</h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                Decide whether the incoming message is suspicious or safe. After each move, you get a short explanation of the machine learning concept behind the answer.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs text-slate-400">Round</p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {Math.min(spamIndex + 1, spamRounds.length)}/{spamRounds.length}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs text-slate-400">Score</p>
                  <p className="mt-2 text-2xl font-black text-white">{spamScore}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs text-slate-400">Win rule</p>
                  <p className="mt-2 text-2xl font-black text-white">3/4</p>
                </div>
              </div>

              {!spamFinished && currentSpamRound ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyanGlow">Incoming message</p>
                  <p className="mt-4 rounded-xl border border-white/10 bg-midnight/70 p-5 text-lg leading-8 text-slate-100">
                    {currentSpamRound.message}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button onClick={() => void handleSpamChoice("Spam")}>Mark as Spam</Button>
                    <Button onClick={() => void handleSpamChoice("Safe")} variant="secondary">
                      Mark as Safe
                    </Button>
                  </div>
                  {spamFeedback ? (
                    <div className="mt-5 rounded-lg border border-cyanGlow/20 bg-cyanGlow/10 p-4 text-sm leading-7 text-slate-100">
                      {spamFeedback}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Game complete</p>
                  <h3 className="mt-3 text-2xl font-black text-white">You finished Spam vs Safe</h3>
                  <p className="mt-4 leading-7 text-slate-200">
                    Final score: {spamScore}/{spamRounds.length}. You practiced binary classification by separating suspicious text from normal communication.
                  </p>
                </div>
              )}
            </>
          ) : null}

          {activeGame === "data-detective" ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Data Detective</p>
              <h2 className="mt-3 text-3xl font-black text-white">Investigate tiny datasets and crack the ML concept</h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                Each round gives you a scenario and a mini dataset. Pick the right concept quickly to build intuition for features, labels, classification, and regression.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs text-slate-400">Round</p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {Math.min(dataIndex + 1, dataRounds.length)}/{dataRounds.length}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs text-slate-400">Score</p>
                  <p className="mt-2 text-2xl font-black text-white">{dataScore}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                  <p className="text-xs text-slate-400">Win rule</p>
                  <p className="mt-2 text-2xl font-black text-white">3/4</p>
                </div>
              </div>

              {!dataFinished && currentDataRound ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyanGlow">Scenario</p>
                  <h3 className="mt-3 text-2xl font-black text-white">{currentDataRound.scenario}</h3>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {currentDataRound.dataset.map((item) => (
                      <div
                        className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200"
                        key={item}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-lg font-semibold text-slate-100">{currentDataRound.question}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {currentDataRound.options.map((option) => (
                      <button
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left text-sm font-semibold text-slate-200 transition hover:border-cyanGlow/30 hover:bg-cyanGlow/10 hover:text-white"
                        key={option}
                        onClick={() => void handleDataChoice(option)}
                        type="button"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {dataFeedback ? (
                    <div className="mt-5 rounded-lg border border-cyanGlow/20 bg-cyanGlow/10 p-4 text-sm leading-7 text-slate-100">
                      {dataFeedback}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Game complete</p>
                  <h3 className="mt-3 text-2xl font-black text-white">You finished Data Detective</h3>
                  <p className="mt-4 leading-7 text-slate-200">
                    Final score: {dataScore}/{dataRounds.length}. You practiced spotting labels, features, and the difference between regression and classification.
                  </p>
                </div>
              )}
            </>
          ) : null}
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Gamepad2 className="h-5 w-5 text-cyanGlow" />
            <p className="font-semibold text-white">Live Arcade Stats</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-slate-400">Games Played</p>
              <p className="mt-2 text-2xl font-black text-white">{state.gamesPlayed}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-slate-400">Games Won</p>
              <p className="mt-2 text-2xl font-black text-white">{state.gamesWon}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-slate-400">Best Score</p>
              <p className="mt-2 text-2xl font-black text-white">{state.bestScore}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <p className="text-xs text-slate-400">Profile XP</p>
              <p className="mt-2 text-2xl font-black text-white">{stats.xp}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Session Summary</p>
          <p className="mt-4 text-4xl font-black text-white">{totalLiveScore}</p>
          <p className="mt-3 leading-7 text-slate-300">
            Earn points by making the correct gameplay choices. Wins continue to update your shared AIMLverse profile.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-2 text-cyanGlow">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Spam vs Safe</span>
              </div>
              <p className="mt-2 text-lg font-bold text-white">
                {spamScore}/{spamRounds.length}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-2 text-cyanGlow">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-semibold">Data Detective</span>
              </div>
              <p className="mt-2 text-lg font-bold text-white">
                {dataScore}/{dataRounds.length}
              </p>
            </div>
          </div>
          <Button className="mt-6" onClick={resetGames} variant="secondary">
            <RotateCcw className="h-4 w-4" />
            Reset Arcade
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
