"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";

export default function ProfileSelector() {
  const { profiles, active, init, newProfile, selectProfile, removeProfile } = useGameStore();
  const [name, setName] = useState("");

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="space-y-6">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          newProfile(name);
          setName("");
        }}
      >
        <input
          className="flex-1 rounded border border-slate-600 bg-transparent p-2"
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
                • {p.playerName} ({p.level}, {p.xp} XP)
                {active?.playerName === p.playerName && " - active"}
              </span>
              <span className="space-x-2">
                <button className="rounded bg-hvac-blue px-2 py-1 text-sm" onClick={() => selectProfile(p.playerName)}>
                  Load
                </button>
                <button className="rounded bg-hvac-red px-2 py-1 text-sm" onClick={() => removeProfile(p.playerName)}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
