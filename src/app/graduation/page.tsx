"use client";

import GraduationMeter from "@/components/GraduationMeter";
import { useGameStore } from "@/store/gameStore";

export default function GraduationPage() {
  const active = useGameStore((s) => s.active);
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Graduation</h1>
      {active ? (
        <>
          <GraduationMeter profile={active} />
          <p>
            {active.graduated
              ? "Graduated! Career Services, Certification Center and Placement Exam are unlocked."
              : "Earn 1000 graduation points to graduate."}
          </p>
        </>
      ) : (
        <p>Create or load a profile first.</p>
      )}
    </section>
  );
}
