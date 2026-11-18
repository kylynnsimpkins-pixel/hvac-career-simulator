"use client";

import { projectedSalary } from "@/game/systems/careerSystem";
import { useGameStore } from "@/store/gameStore";

export default function SummaryPage() {
  const active = useGameStore((s) => s.active);
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Summary</h1>
      {active ? (
        <ul className="space-y-1">
          <li>Name: {active.name}</li>
          <li>Level: {active.player.level}</li>
          <li>XP: {active.player.xp}</li>
          <li>Career: {active.careerPath ?? "none"}</li>
          <li>Projected salary: ${projectedSalary(active).toLocaleString()}</li>
        </ul>
      ) : (
        <p>Select a profile first.</p>
      )}
    </section>
  );
}
