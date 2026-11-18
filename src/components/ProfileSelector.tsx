"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";

const COLORS = ["#38bdf8", "#f97316", "#22c55e", "#a855f7", "#eab308"];
const SPECIALTIES = ["Residential", "Commercial", "Refrigeration"];

export default function ProfileSelector() {
  const { profiles, active, init, newProfile, selectProfile, removeProfile, syncToCloud, loadFromCloud } = useGameStore();
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [cloudMsg, setCloudMsg] = useState("");

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="space-y-6">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          newProfile(name, color, specialty);
          setName("");
        }}
      >
        <input
          className="flex-1 rounded border border-slate-600 bg-transparent p-2"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex w-full items-center gap-2" aria-label="Choose appearance">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-white" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <select
            className="ml-2 rounded border border-slate-600 bg-slate-900 p-2"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            {SPECIALTIES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button className="rounded bg-hvac-blue px-4 py-2" type="submit">
          New Student
        </button>
      </form>

      <div>
        <h2 className="mb-2 font-semibold">Profiles</h2>
        {profiles.length === 0 && <p className="text-sm text-slate-400">No saved profiles yet.</p>}
        <ul className="space-y-2">
          {profiles.map((p) => (
            <li key={p.playerName} className="flex items-center justify-between rounded border border-slate-600 p-2">
              <span>
                {p.playerName} - {p.specialty} ({p.level}, {p.xp} XP)
                {active?.playerName === p.playerName && " - active"}
              </span>
              <span className="space-x-2">
                <button className="rounded bg-hvac-blue px-2 py-1 text-sm" onClick={() => selectProfile(p.playerName)}>
                  Load
                </button>
                <button
                  className="rounded bg-slate-600 px-2 py-1 text-sm"
                  onClick={async () => {
                    setCloudMsg((await loadFromCloud(p.playerName)) ? "Loaded from cloud" : "Cloud load failed");
                  }}
                >
                  Cloud load
                </button>
                <button className="rounded bg-hvac-red px-2 py-1 text-sm" onClick={() => removeProfile(p.playerName)}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
        {active && (
          <div className="mt-3 flex items-center gap-3">
            <button
              className="rounded bg-slate-600 px-3 py-1 text-sm"
              onClick={async () => setCloudMsg((await syncToCloud()) ? "Synced to cloud" : "Cloud sync unavailable (check .env.local)")}
            >
              Sync active profile to cloud
            </button>
            <span className="text-sm text-slate-400">{cloudMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
