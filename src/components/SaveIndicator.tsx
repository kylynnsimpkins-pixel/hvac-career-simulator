"use client";

import { useGameStore } from "@/store/gameStore";

export default function SaveIndicator() {
  const justSaved = useGameStore((s) => s.justSaved);
  return (
    <span
      className={`text-sm text-green-400 transition-opacity ${justSaved ? "opacity-100" : "opacity-0"}`}
      aria-live="polite"
    >
      ✅ Profile Saved
    </span>
  );
}
