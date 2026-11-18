"use client";

import { levelProgress } from "@/game/systems/xpSystem";

export default function XPBar({ xp }: { xp: number }) {
  const pct = levelProgress(xp);
  return (
    <div className="w-full">
      <div className="h-3 rounded bg-slate-700">
        <div className="h-3 rounded bg-hvac-blue" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-300">{xp} XP</p>
    </div>
  );
}
