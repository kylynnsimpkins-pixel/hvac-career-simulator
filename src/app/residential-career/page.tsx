"use client";

import { CAREERS } from "@/game/systems/careerSystem";
import { useGameStore } from "@/store/gameStore";

export default function ResidentialCareerPage() {
  const { active, chooseCareer } = useGameStore();
  const career = CAREERS.find((c) => c.id === "Residential")!;
  if (!active) return <p>Create or load a profile first.</p>;
  if (!active.graduated) return <p>Career Services unlocks after graduation.</p>;
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Residential Career</h1>
      <p>Employers: {career.employers.join(", ")}</p>
      <button className="rounded bg-hvac-blue px-3 py-2" onClick={() => chooseCareer("Residential")}>
        {active.careerPath === "Residential" ? "Current career" : "Choose Residential"}
      </button>
    </section>
  );
}
