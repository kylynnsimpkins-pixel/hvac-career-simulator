"use client";

import { useEffect } from "react";
import { CAREERS, careerFit, recommendedCareer, type CareerPathName } from "@/game/systems/careerSystem";
import { useGameStore } from "@/store/gameStore";

export default function CareerView({ id }: { id: CareerPathName }) {
  const { active, init, chooseCareer } = useGameStore();
  useEffect(() => init(), [init]);
  const career = CAREERS.find((c) => c.id === id)!;

  if (!active) return <p>Create or load a profile first.</p>;
  if (!active.graduated) return <p>Career Services unlocks after graduation.</p>;

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">{id} Career</h1>
      <p>Typical pay: {career.salary}</p>
      <p>Roles: {career.roles.join(", ")}</p>
      <p>Employers: {career.employers.join(", ")}</p>
      <p>
        Skill fit: {careerFit(active, career)} (key skills: {career.skills.join(", ")})
        {recommendedCareer(active) === id && " - recommended for you"}
      </p>
      <button className="rounded bg-hvac-blue px-3 py-2" onClick={() => chooseCareer(id)}>
        {active.careerPath === id ? "Current career" : `Choose ${id}`}
      </button>
    </section>
  );
}
