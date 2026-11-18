"use client";

import { GRADUATION_POINTS_REQUIRED, graduationProgress } from "@/game/systems/graduationSystem";
import type { SaveProfile } from "@/types/saveProfile";

export default function GraduationMeter({ profile }: { profile: SaveProfile }) {
  return (
    <div>
      <p className="text-sm">
        Graduation: {profile.graduationPoints} / {GRADUATION_POINTS_REQUIRED}
        {profile.graduated && " - Graduated"}
      </p>
      <div className="h-3 rounded bg-slate-700">
        <div className="h-3 rounded bg-green-500" style={{ width: `${graduationProgress(profile)}%` }} />
      </div>
    </div>
  );
}
