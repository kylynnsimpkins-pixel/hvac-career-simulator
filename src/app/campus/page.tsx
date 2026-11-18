"use client";

import { useGameStore, type Reward } from "@/store/gameStore";

const ACTIVITIES: { label: string; labId?: string; reward: Reward }[] = [
  { label: "Classroom: correct answer", reward: { xp: 25, graduationPoints: 25 } },
  { label: "Wiring Lab: complete challenge", labId: "wiring-lab", reward: { xp: 50, contractorCredits: 20, skill: "electrical", skillPoints: 2 } },
  { label: "Refrigeration Lab: complete condenser build", labId: "refrigeration-lab", reward: { xp: 75, contractorCredits: 25, skill: "mechanical", skillPoints: 2 } },
  { label: "Troubleshooting Center: correct diagnosis", labId: "electrical-diagnostics", reward: { xp: 100, contractorCredits: 50, skill: "diagnostics", skillPoints: 2 } },
];

export default function CampusPage() {
  const { active, reward, completeLab } = useGameStore();

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Campus</h1>
      {!active ? (
        <p>Create or load a profile first.</p>
      ) : (
        <ul className="space-y-2">
          {ACTIVITIES.map((a) => (
            <li key={a.label}>
              <button
                className="w-full rounded border border-slate-600 p-3 text-left hover:bg-slate-800"
                onClick={() => (a.labId ? completeLab(a.labId, a.reward) : reward(a.reward))}
              >
                {a.label} (+{a.reward.xp} XP)
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
