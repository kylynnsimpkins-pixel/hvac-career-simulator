"use client";

import { useEffect } from "react";
import { GRADUATION_POINTS_REQUIRED } from "@/game/systems/graduationSystem";
import { COMPANY_CREDITS_REQUIRED } from "@/game/systems/contractorSystem";
import { useGameStore } from "@/store/gameStore";
import XPBar from "./XPBar";
import SaveIndicator from "./SaveIndicator";

export default function HUD() {
  const { active, init } = useGameStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <header className="flex items-start gap-6 border-b border-slate-700 p-3 text-sm">
      {active ? (
        <>
          <div className="space-y-1">
            <p className="font-semibold">Student: {active.playerName}</p>
            <p>Level: {active.level}</p>
            <p>Career: {active.careerPath ?? "Undecided"}</p>
          </div>
          <div className="w-48 space-y-1">
            <XPBar xp={active.xp} />
            <p>
              Graduation: {active.graduationPoints} / {GRADUATION_POINTS_REQUIRED}
            </p>
            <p>
              Contractor Credits: {active.contractorCredits} / {COMPANY_CREDITS_REQUIRED}
            </p>
          </div>
          <div>
            <p className="font-semibold">Certifications:</p>
            {active.certifications.length ? (
              active.certifications.map((c) => <p key={c}>{c}</p>)
            ) : (
              <p className="text-slate-400">None</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-slate-400">No active profile</p>
      )}
      <div className="ml-auto">
        <SaveIndicator />
      </div>
    </header>
  );
}
