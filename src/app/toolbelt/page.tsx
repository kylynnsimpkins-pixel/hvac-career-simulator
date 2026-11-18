"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { TOOLS } from "@/game/data/gameContent";
import { canBuyTool } from "@/game/systems/progressionSystem";

export default function ToolbeltPage() {
  const { active, init, buyTool } = useGameStore();
  useEffect(() => init(), [init]);
  if (!active) return <p>Create or load a profile first.</p>;

  return (
    <section>
      <h1 className="mb-1 text-2xl font-bold">Toolbelt</h1>
      <p className="mb-4 text-sm text-slate-400">Cash: ${active.money}</p>
      <ul className="space-y-2">
        {TOOLS.map((t) => {
          const owned = active.inventory.includes(t.id);
          return (
            <li key={t.id} className="flex items-center justify-between rounded border border-slate-600 p-3">
              <span>
                {owned ? "🧰" : "🔒"} {t.name} {!owned && <span className="text-slate-400">(${t.price})</span>}
              </span>
              {!owned && (
                <button
                  className="rounded bg-hvac-blue px-3 py-1 text-sm disabled:opacity-40"
                  disabled={!canBuyTool(active, t.id)}
                  onClick={() => buyTool(t.id)}
                >
                  Buy
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
