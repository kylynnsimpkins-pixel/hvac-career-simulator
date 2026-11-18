"use client";

import { CAREERS } from "@/game/systems/careerSystem";
import { useGameStore } from "@/store/gameStore";

export default function CommercialCareerPage() {
  const { active, chooseCareer } = useGameStore();
  const career = CAREERS.find((c) => c.id === "Commercial")!;
  if (!active) return <p>Create or load a profile first.</p>;
  if (!active.graduated) return <p>Career Services unlocks after graduation.</p>;
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Commercial Career</h1>
      <p>Employers: {career.employers.join(", ")}</p>
      <button className="rounded bg-hvac-blue px-3 py-2" onClick={() => chooseCareer("Commercial")}>
        {active.careerPath === "Commercial" ? "Current career" : "Choose Commercial"}
      </button>
    </section>
  );
}
