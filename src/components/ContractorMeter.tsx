"use client";

import { COMPANY_CREDITS_REQUIRED, creditsProgress } from "@/game/systems/contractorSystem";
import type { SaveProfile } from "@/types/saveProfile";

export default function ContractorMeter({ profile }: { profile: SaveProfile }) {
  return (
    <div>
      <p className="text-sm">
        Contractor Credits: {profile.contractorCredits} / {COMPANY_CREDITS_REQUIRED}
      </p>
      <div className="h-3 rounded bg-slate-700">
        <div className="h-3 rounded bg-hvac-red" style={{ width: `${creditsProgress(profile)}%` }} />
      </div>
    </div>
  );
}
