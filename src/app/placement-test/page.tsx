"use client";

import questions from "@/game/data/placementQuestions.json";
import { useGameStore } from "@/store/gameStore";

export default function PlacementTestPage() {
  const active = useGameStore((s) => s.active);
  if (!active) return <p>Create or load a profile first.</p>;
  if (!active.graduated) return <p>Placement Exam unlocks after graduation.</p>;
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Placement Test</h1>
      <ol className="list-decimal space-y-2 pl-6">
        {questions.map((q) => (
          <li key={q.id}>{q.prompt}</li>
        ))}
      </ol>
    </section>
  );
}
