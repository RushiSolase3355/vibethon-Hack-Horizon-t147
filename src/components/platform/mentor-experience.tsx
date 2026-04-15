"use client";

import { useMemo, useState } from "react";
import { Bot, BrainCircuit, Send, Sparkles, User2 } from "lucide-react";
import { SectionHeading } from "@/components/platform/section-heading";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";
import { cn } from "@/lib/utils";

const quickPrompts = [
  "What is AI?",
  "What is ML?",
  "Explain neural network",
  "What is NLP?",
  "What is computer vision?"
];

function getMentorReply(message: string) {
  const normalized = message.trim().toLowerCase();

  if (normalized.includes("computer vision")) {
    return {
      topic: "Computer Vision",
      answer:
        "Computer Vision teaches machines to understand images and video. It powers tasks like classification, detection, recognition, and scene understanding."
    };
  }

  if (normalized.includes("neural")) {
    return {
      topic: "Neural Network",
      answer:
        "A neural network is a layered model that transforms inputs through hidden layers and learns useful patterns for prediction."
    };
  }

  if (normalized.includes("nlp")) {
    return {
      topic: "NLP",
      answer:
        "NLP stands for Natural Language Processing. It helps machines understand and generate human language for tasks like sentiment analysis and chat."
    };
  }

  if (normalized.includes("machine learning") || normalized.includes("ml")) {
    return {
      topic: "ML",
      answer:
        "Machine learning is a branch of AI where models learn patterns from data instead of following only hard-coded rules."
    };
  }

  return {
    topic: "AI",
    answer:
      "AI is the broader goal of building systems that can reason, predict, or assist intelligently. ML, NLP, and Computer Vision all live inside AI."
  };
}

export function MentorExperience() {
  const { state, recordMentorExchange, stats } = useAimlverseState();
  const [input, setInput] = useState("");
  const conversation = useMemo(() => state.chatHistory.slice(-12), [state.chatHistory]);

  const submitPrompt = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    const reply = getMentorReply(trimmed);
    recordMentorExchange(trimmed, reply.answer, reply.topic);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-7xl">
      <SectionHeading
        description="The AI mentor now saves message history, tracks topics asked, adds XP, and contributes to badge unlocks from the same shared app state."
        eyebrow="AI Mentor"
        title="Ask questions and build a real mentoring history across the platform."
      />

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <GlassCard className="overflow-hidden">
          <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyanGlow/30 bg-cyanGlow/10 shadow-glow">
                <Bot className="h-5 w-5 text-cyanGlow" />
              </span>
              <div>
                <p className="font-semibold text-white">AIML Mentor Console</p>
                <p className="text-sm text-slate-400">Shared live chat history with topic tracking</p>
              </div>
            </div>
          </div>

          <div className="h-[460px] space-y-4 overflow-y-auto px-5 py-5">
            {conversation.length ? (
              conversation.map((message) => (
                <div
                  className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                  key={message.id}
                >
                  {message.role === "assistant" ? (
                    <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyanGlow/20 bg-cyanGlow/10">
                      <BrainCircuit className="h-4 w-4 text-cyanGlow" />
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-3xl border px-4 py-3 text-sm leading-7",
                      message.role === "assistant"
                        ? "border-white/10 bg-white/[0.04] text-slate-200"
                        : "border-cyanGlow/30 bg-cyanGlow/12 text-white"
                    )}
                  >
                    <p>{message.content}</p>
                  </div>
                  {message.role === "user" ? (
                    <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10">
                      <User2 className="h-4 w-4 text-slate-200" />
                    </span>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No mentor history yet. Ask a question to begin.</p>
            )}
          </div>

          <div className="border-t border-white/10 bg-white/[0.02] px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-cyanGlow/40 hover:bg-cyanGlow/10 hover:text-white"
                  key={prompt}
                  onClick={() => submitPrompt(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyanGlow"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    submitPrompt(input);
                  }
                }}
                placeholder="Ask about AI, ML, NLP, neural networks, or computer vision..."
                value={input}
              />
              <Button onClick={() => submitPrompt(input)}>
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-violet-200" />
              <p className="font-semibold text-white">Mentor Stats</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs text-slate-400">Messages</p>
                <p className="mt-2 text-2xl font-black text-white">{state.messagesCount}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs text-slate-400">Topics</p>
                <p className="mt-2 text-2xl font-black text-white">{state.topicsAsked.length}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">Current profile XP: {stats.xp}</p>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyanGlow">Topics Asked</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {state.topicsAsked.length ? (
                state.topicsAsked.map((topic) => (
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-200" key={topic}>
                    {topic}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">No topics yet.</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
