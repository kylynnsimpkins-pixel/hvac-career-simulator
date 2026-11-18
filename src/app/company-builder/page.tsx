"use client";

import ContractorMeter from "@/components/ContractorMeter";
import { canOpenCompany } from "@/game/systems/contractorSystem";
import { useGameStore } from "@/store/gameStore";

export default function CompanyBuilderPage() {
  const active = useGameStore((s) => s.active);
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">Company Builder</h1>
      {active ? (
        <>
          <ContractorMeter profile={active} />
          <p>
            {canOpenCompany(active)
              ? "You can open your own HVAC company!"
              : "Requires 10000 XP, 5000 credits, NATE, and $100,000 savings."}
          </p>
        </>
      ) : (
        <p>Create or load a profile first.</p>
      )}
    </section>
  );
}
