"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { QUESTS } from "@/game/data/gameContent";
import { isQuestComplete } from "@/game/systems/progressionSystem";

export default function QuestsPage() {
  const { active, init, claimQuest } = useGameStore();
  useEffect(() => init(), [init]);
  if (!active) return <p>Create or load a profile first.</p>;

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Quests</h1>
      <ul className="space-y-2">
        {QUESTS.map((q) => {
          const claimed = active.completedQuests.includes(q.id);
          const ready = isQuestComplete(active, q);
          return (
            <li key={q.id} className="flex items-center justify-between rounded border border-slate-600 p-3">
              <div>
                <p className="font-semibold">
                  {claimed ? "✅" : ready ? "🎯" : "📋"} {q.title}
                </p>
                <p className="text-sm text-slate-400">{q.description}</p>
                <p className="text-xs text-slate-500">
                  Reward: {q.reward.xp} XP, ${q.reward.money}, {q.reward.skillPoints} skill pt
                </p>
              </div>
              {!claimed && (
                <button
                  className="rounded bg-hvac-blue px-3 py-1 text-sm disabled:opacity-40"
                  disabled={!ready}
                  onClick={() => claimQuest(q.id)}
                >
                  Claim
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
