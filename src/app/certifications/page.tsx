"use client";

import CertificationPanel from "@/components/CertificationPanel";
import { useGameStore } from "@/store/gameStore";

export default function CertificationsPage() {
  const { active } = useGameStore();

  if (!active) return <p>Create or load a profile first.</p>;
  if (!active.graduated) return <p>Certification Center unlocks after graduation (1000 graduation points).</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Certifications</h1>
      <CertificationPanel profile={active} />
      <p className="text-sm text-slate-400">
        Each certification has its own proctored exam. Take them at the Testing Center on campus.
      </p>
    </section>
  );
}
