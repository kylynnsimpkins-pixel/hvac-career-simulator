"use client";

import { contractorTier } from "@/game/systems/contractorSystem";

export default function ContractorMeter({ score }: { score: number }) {
  return (
    <div>
      <p className="text-sm">Contractor reputation: {contractorTier(score)}</p>
      <div className="h-3 rounded bg-slate-700">
        <div className="h-3 rounded bg-hvac-red" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
