"use client";

import { useEffect } from "react";
import { GRADUATION_POINTS_REQUIRED } from "@/game/systems/graduationSystem";
import { COMPANY_CREDITS_REQUIRED, PROGRAM_HOURS_REQUIRED, programHours } from "@/game/systems/contractorSystem";
import { useGameStore } from "@/store/gameStore";
import XPBar from "./XPBar";
import SaveIndicator from "./SaveIndicator";

export default function HUD() {
  const { active, init } = useGameStore();

  useEffect(() => {
    init();
  }, [init]);

  // Count play time only while the tab is visible and the player has been active in the last minute.
  const loggedIn = !!active;
  useEffect(() => {
    if (!loggedIn) return;
    let last = Date.now();
    const touch = () => {
      last = Date.now();
    };
    const events = ["keydown", "pointerdown", "pointermove"];
    events.forEach((e) => window.addEventListener(e, touch));
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && Date.now() - last < 60000) useGameStore.getState().addPlayTime(10);
    }, 10000);
    return () => {
      clearInterval(id);
      events.forEach((e) => window.removeEventListener(e, touch));
    };
  }, [loggedIn]);

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
            <p>
              Program time: {programHours(active).toFixed(1)} / {PROGRAM_HOURS_REQUIRED} h
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
