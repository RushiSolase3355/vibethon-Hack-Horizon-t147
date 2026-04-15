"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastItem = {
  id: string;
  title: string;
  description: string;
  tone?: "info" | "success" | "badge";
};

type ToastStackProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

const toneClasses = {
  info: "border-cyanGlow/30 bg-midnight/90",
  success: "border-mintGlow/30 bg-midnight/90",
  badge: "border-violetGlow/40 bg-midnight/90"
};

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[70] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            animate={{ opacity: 1, x: 0, y: 0 }}
            className={cn(
              "pointer-events-auto rounded-lg border p-4 shadow-[0_0_36px_rgba(45,212,255,0.18)] backdrop-blur-2xl",
              toneClasses[toast.tone ?? "info"]
            )}
            exit={{ opacity: 0, x: 24, scale: 0.98 }}
            initial={{ opacity: 0, x: 24, y: -8 }}
            key={toast.id}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg border border-white/10 bg-white/10 p-2">
                {toast.tone === "badge" ? (
                  <Sparkles className="h-4 w-4 text-violet-300" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-cyanGlow" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{toast.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{toast.description}</p>
              </div>
              <button
                className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                onClick={() => onDismiss(toast.id)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
