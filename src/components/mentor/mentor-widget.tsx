"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { mentorSuggestions } from "@/data/final-phase-data";
import { useAimlverseState } from "@/hooks/use-aimlverse-state";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterMessage: ChatMessage = {
  id: "starter",
  role: "assistant",
  content:
    "Hi, I am your AIML mentor. Ask me about overfitting, CNNs, AI vs ML, or what to learn next."
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getMentorReply(input: string) {
  const normalized = input.toLowerCase();

  if (normalized.includes("overfitting")) {
    return {
      topic: "Overfitting",
      answer:
        "Overfitting means a model memorizes the training data too closely, so it performs well on seen examples but struggles on new ones."
    };
  }

  if (normalized.includes("cnn")) {
    return {
      topic: "CNN",
      answer:
        "A CNN, or Convolutional Neural Network, is a model designed for image-like data. It learns useful visual patterns such as edges, textures, and shapes."
    };
  }

  if (normalized.includes("difference") && normalized.includes("ai") && normalized.includes("ml")) {
    return {
      topic: "AI",
      answer:
        "AI is the bigger field of making systems act intelligently. ML is one approach inside AI where systems learn patterns from data instead of following only fixed rules."
    };
  }

  if (normalized.includes("what should i learn") || normalized.includes("learn next")) {
    return {
      topic: "Learning Path",
      answer:
        "A strong path is Intro to AI, then ML Basics, then Classification, and after that Neural Networks or Computer Vision depending on what excites you."
    };
  }

  return {
    topic: "AI",
    answer:
      "That is a good question. In AIMLverse terms, I would connect it to data, model behavior, and where the idea shows up in a real product. Try asking me about overfitting, CNNs, or AI vs ML."
  };
}

export function MentorWidget() {
  const { askMentor } = useAimlverseState();
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isThinking]);

  const quickActions = useMemo(() => mentorSuggestions.slice(0, 3), []);

  const sendMessage = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed || isThinking) {
      return;
    }

    setMessages((current) => [...current, { id: createId(), role: "user", content: trimmed }]);
    setInput("");
    setIsThinking(true);

    window.setTimeout(() => {
      void (async () => {
        const fallback = getMentorReply(trimmed);
        const result = await askMentor(trimmed);
        const answer = result.success ? result.answer ?? fallback.answer : fallback.answer;
        setMessages((current) => [
          ...current,
          { id: createId(), role: "assistant", content: answer }
        ]);
        setIsThinking(false);
      })();
    }, 650);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="fixed bottom-24 right-4 z-[80] w-[min(390px,calc(100vw-2rem))] rounded-lg border border-cyanGlow/20 bg-midnight/90 shadow-[0_0_48px_rgba(45,212,255,0.18)] backdrop-blur-2xl"
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-cyanGlow/30 bg-cyanGlow/10">
                  <Bot className="h-5 w-5 text-cyanGlow" />
                </span>
                <div>
                  <p className="font-semibold text-white">AI Mentor</p>
                  <p className="text-xs text-slate-400">Quick concept help with mock responses</p>
                </div>
              </div>
              <button
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 px-4 pt-4">
              {quickActions.map((prompt) => (
                <button
                  className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyanGlow/30 hover:text-white"
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="max-h-[360px] space-y-3 overflow-y-auto px-4 py-4" ref={scrollRef}>
              {messages.map((message) => (
                <div
                  className={cn(
                    "max-w-[86%] rounded-lg px-4 py-3 text-sm leading-6",
                    message.role === "assistant"
                      ? "border border-cyanGlow/20 bg-cyanGlow/10 text-slate-100"
                      : "ml-auto border border-white/10 bg-white/[0.08] text-white"
                  )}
                  key={message.id}
                >
                  {message.content}
                </div>
              ))}
              {isThinking ? (
                <div className="inline-flex items-center gap-2 rounded-lg border border-violetGlow/20 bg-violetGlow/10 px-4 py-3 text-sm text-violet-100">
                  <Sparkles className="h-4 w-4" />
                  Thinking...
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/10 p-4">
              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage(input);
                }}
              >
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyanGlow"
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask the mentor something..."
                  value={input}
                />
                <button
                  className="grid h-11 w-11 place-items-center rounded-lg bg-cyanGlow text-midnight transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-600"
                  disabled={!input.trim() || isThinking}
                  type="submit"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        className="fixed bottom-5 right-4 z-[80] inline-flex items-center gap-2 rounded-lg border border-cyanGlow/30 bg-cyanGlow/10 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-[0_0_38px_rgba(45,212,255,0.18)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-cyanGlow/15"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isOpen ? <X className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        {isOpen ? "Close Mentor" : "AI Mentor"}
      </button>
    </>
  );
}
