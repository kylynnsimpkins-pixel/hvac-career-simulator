"use client";

import CertificationPanel from "@/components/CertificationPanel";
import { CERTIFICATIONS, canEarn } from "@/game/systems/certificationSystem";
import { useGameStore } from "@/store/gameStore";

export default function CertificationsPage() {
  const { active, earnCertification } = useGameStore();

  if (!active) return <p>Create or load a profile first.</p>;
  if (!active.graduated) return <p>Certification Center unlocks after graduation (1000 graduation points).</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Certifications</h1>
      <CertificationPanel earned={active.certifications} />
      <div className="flex flex-wrap gap-2">
        {CERTIFICATIONS.filter((c) => canEarn(active, c.id)).map((c) => (
          <button key={c.id} className="rounded bg-hvac-blue px-3 py-2" onClick={() => earnCertification(c.id)}>
            Earn {c.name}
          </button>
        ))}
      </div>
    </section>
  );
}
