"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { SKILL_TREE } from "@/game/data/gameContent";
import { canUnlockSkill } from "@/game/systems/progressionSystem";

export default function SkillsPage() {
  const { active, init, unlockSkill } = useGameStore();
  useEffect(() => init(), [init]);
  if (!active) return <p>Create or load a profile first.</p>;

  const branches = Array.from(new Set(SKILL_TREE.map((s) => s.branch)));

  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">Skill Tree</h1>
      <p className="mb-4 text-sm text-slate-400">Skill points: {active.skillPoints} (earn them from labs and quests)</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {branches.map((b) => (
          <div key={b} className="rounded border border-slate-600 p-3">
            <h2 className="mb-2 font-semibold capitalize">{b}</h2>
            <ul className="space-y-2">
              {SKILL_TREE.filter((s) => s.branch === b).map((s) => {
                const owned = active.unlockedSkills.includes(s.id);
                return (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span>
                      {owned ? "✅" : "⬜"} {s.name} ({s.cost} pt)
                    </span>
                    {!owned && (
                      <button
                        className="rounded bg-hvac-blue px-2 py-1 disabled:opacity-40"
                        disabled={!canUnlockSkill(active, s.id)}
                        onClick={() => unlockSkill(s.id)}
                      >
                        Unlock
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
