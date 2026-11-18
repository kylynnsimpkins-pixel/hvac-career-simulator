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
              : "Requires 6500 XP, 1000 credits, NATE, $3,000 savings and 8 hours of program time."}
          </p>
        </>
      ) : (
        <p>Create or load a profile first.</p>
      )}
    </section>
  );
}
