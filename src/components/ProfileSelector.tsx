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
    <div className="space-y-4">
      <ul className="space-y-2">
        {profiles.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded border border-slate-600 p-2">
            <span>
              {p.name} (Lv {p.player.level}) {active?.id === p.id && "- active"}
            </span>
            <span className="space-x-2">
              <button className="rounded bg-hvac-blue px-2 py-1 text-sm" onClick={() => selectProfile(p.id)}>
                Select
              </button>
              <button className="rounded bg-hvac-red px-2 py-1 text-sm" onClick={() => removeProfile(p.id)}>
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          newProfile(name);
          setName("");
        }}
      >
        <input
          className="flex-1 rounded border border-slate-600 bg-transparent p-2"
          placeholder="New profile name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="rounded bg-hvac-blue px-4 py-2" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
