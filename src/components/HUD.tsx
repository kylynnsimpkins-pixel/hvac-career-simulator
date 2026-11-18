"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import XPBar from "./XPBar";
import SaveIndicator from "./SaveIndicator";

export default function HUD() {
  const { active, saved, init, save } = useGameStore();

  useEffect(() => {
    init();
  }, [init]);

  if (!active) return <p className="p-2 text-sm text-slate-400">No active profile</p>;

  return (
    <header className="flex items-center gap-4 border-b border-slate-700 p-3">
      <div>
        <p className="font-semibold">{active.name}</p>
        <p className="text-xs">Level {active.player.level}</p>
      </div>
      <div className="flex-1">
        <XPBar xp={active.player.xp} />
      </div>
      <button className="rounded bg-hvac-blue px-3 py-1 text-sm" onClick={save}>
        Save
      </button>
      <SaveIndicator saved={saved} />
    </header>
  );
}
