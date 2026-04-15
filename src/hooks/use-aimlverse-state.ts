"use client";

import { useContext } from "react";
import { AimlverseContext } from "@/components/providers/aimlverse-provider";

export function useAimlverseState() {
  const context = useContext(AimlverseContext);

  if (!context) {
    throw new Error("useAimlverseState must be used within an AimlverseProvider.");
  }

  return context;
}
