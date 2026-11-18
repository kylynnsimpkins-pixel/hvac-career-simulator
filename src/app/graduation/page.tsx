"use client";

import GraduationMeter from "@/components/GraduationMeter";
import { canGraduate, graduationProgress } from "@/game/systems/graduationSystem";
import { useGameStore } from "@/store/gameStore";

export default function GraduationPage() {
  const active = useGameStore((s) => s.active);
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Graduation</h1>
      {active ? (
        <>
          <GraduationMeter progress={graduationProgress(active)} />
          <p className="mt-2">{canGraduate(active) ? "Ready to graduate!" : "Keep training."}</p>
        </>
      ) : (
        <p>Select a profile first.</p>
      )}
    </section>
  );
}
