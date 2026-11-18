"use client";

import ContractorMeter from "@/components/ContractorMeter";
import { useGameStore } from "@/store/gameStore";

export default function CompanyBuilderPage() {
  const active = useGameStore((s) => s.active);
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Company Builder</h1>
      <ContractorMeter score={active?.contractorScore ?? 0} />
    </section>
  );
}
