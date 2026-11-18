"use client";

import CertificationPanel from "@/components/CertificationPanel";
import { useGameStore } from "@/store/gameStore";

export default function CertificationsPage() {
  const active = useGameStore((s) => s.active);
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Certifications</h1>
      <CertificationPanel earned={active?.certifications ?? {}} />
    </section>
  );
}
