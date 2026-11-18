"use client";

import { useEffect, useState } from "react";
import questions from "@/game/data/placementQuestions.json";
import { useGameStore } from "@/store/gameStore";

export default function PlacementTestPage() {
  const { active, init, submitPlacement } = useGameStore();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  useEffect(() => init(), [init]);

  if (!active) return <p>Create or load a profile first.</p>;
  if (!active.graduated) return <p>Placement Exam unlocks after graduation.</p>;

  const done = active.placementScore !== undefined;
  const score = questions.filter((q) => answers[q.id] === q.answerIndex).length;

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Placement Test</h1>
      {done ? (
        <p>
          Your score: {active.placementScore}/{questions.length}.{" "}
          {(active.placementScore ?? 0) >= questions.length * 0.7
            ? "Advanced placement: you are ready for lead technician roles."
            : "Standard placement: keep training in the labs."}
        </p>
      ) : (
        <>
          <ol className="space-y-4">
            {questions.map((q, i) => (
              <li key={q.id}>
                <p className="mb-1 font-medium">
                  {i + 1}. {q.prompt}
                </p>
                {q.choices.map((c, ci) => (
                  <label key={c} className="block text-sm">
                    <input
                      type="radio"
                      name={q.id}
                      className="mr-2"
                      checked={answers[q.id] === ci}
                      onChange={() => setAnswers({ ...answers, [q.id]: ci })}
                    />
                    {c}
                  </label>
                ))}
              </li>
            ))}
          </ol>
          <button
            className="mt-4 rounded bg-hvac-blue px-4 py-2 disabled:opacity-40"
            disabled={Object.keys(answers).length < questions.length}
            onClick={() => submitPlacement(score, score * 10)}
          >
            Submit exam
          </button>
        </>
      )}
    </section>
  );
}
