"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { DEFAULT_WARDROBE, TOPS, type Wardrobe } from "@/game/data/wardrobe";
import { hasAccount, registerAccount, verifyLogin } from "@/game/systems/accountSystem";
import WardrobePicker from "./WardrobePicker";

const SPECIALTIES = ["Residential", "Commercial", "Refrigeration"];
const inputCls = "rounded border border-slate-600 bg-transparent p-2";

export default function ProfileSelector() {
  const { profiles, active, init, newProfile, selectProfile, removeProfile, setWardrobe, logout, syncToCloud, loadFromCloud } = useGameStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [wardrobe, setLocalWardrobe] = useState<Wardrobe>(DEFAULT_WARDROBE);
  const [msg, setMsg] = useState("");
  const [cloudMsg, setCloudMsg] = useState("");

  useEffect(() => {
    init();
  }, [init]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (mode === "register") {
      if (password !== confirm) return setMsg("Passwords do not match");
      const res = await registerAccount(username, password);
      if (!res.ok) return setMsg(res.error ?? "Could not create account");
      newProfile(username, "#" + TOPS[wardrobe.top].color.toString(16).padStart(6, "0"), specialty, wardrobe);
      setPassword("");
      setConfirm("");
      return setMsg("Account created. You are logged in.");
    }
    if (!hasAccount(username)) return setMsg("No account with that username. Create one first.");
    if (!(await verifyLogin(username, password))) return setMsg("Wrong username or password");
    selectProfile(username);
    setPassword("");
    setMsg("Logged in.");
  };

  return (
    <div className="space-y-6">
      {active ? (
        <div className="space-y-3 rounded border border-slate-600 p-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Logged in as {active.playerName}</h2>
            <button className="rounded bg-slate-600 px-3 py-1 text-sm" onClick={logout}>
              Log out
            </button>
          </div>
          <h3 className="text-sm text-slate-300">Wardrobe (10 options per article)</h3>
          <WardrobePicker value={active.wardrobe ?? DEFAULT_WARDROBE} onChange={setWardrobe} />
        </div>
      ) : (
        <form className="space-y-3" onSubmit={submit}>
          <div className="flex gap-2">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setMsg("");
                }}
                className={`rounded px-3 py-1 text-sm ${mode === m ? "bg-hvac-blue" : "bg-slate-700"}`}
              >
                {m === "login" ? "Student log in" : "Create account"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <input className={`${inputCls} flex-1`} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            <input className={`${inputCls} flex-1`} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
            {mode === "register" && (
              <>
                <input className={`${inputCls} flex-1`} type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
                <select className="rounded border border-slate-600 bg-slate-900 p-2" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                  {SPECIALTIES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </>
            )}
          </div>
          {mode === "register" && <WardrobePicker value={wardrobe} onChange={setLocalWardrobe} />}
          <div className="flex items-center gap-3">
            <button className="rounded bg-hvac-blue px-4 py-2" type="submit">
              {mode === "login" ? "Log in" : "Create account & start"}
            </button>
            <span className="text-sm text-amber-300">{msg}</span>
          </div>
        </form>
      )}
      {active && msg && <p className="text-sm text-amber-300">{msg}</p>}

      <div>
        <h2 className="mb-2 font-semibold">Students on this computer</h2>
        {profiles.length === 0 && <p className="text-sm text-slate-400">No student accounts yet.</p>}
        <ul className="space-y-2">
          {profiles.map((p) => {
            const locked = hasAccount(p.playerName);
            return (
              <li key={p.playerName} className="flex items-center justify-between rounded border border-slate-600 p-2">
                <span>
                  {p.playerName} - {p.specialty} ({p.level}, {p.xp} XP)
                  {active?.playerName === p.playerName && " - active"}
                  {locked && " 🔒"}
                </span>
                <span className="space-x-2">
                  {locked ? (
                    <button
                      className="rounded bg-hvac-blue px-2 py-1 text-sm"
                      onClick={() => {
                        if (active) logout();
                        setMode("login");
                        setUsername(p.playerName);
                        setMsg("Enter the password to log in");
                      }}
                    >
                      Log in
                    </button>
                  ) : (
                    <button className="rounded bg-hvac-blue px-2 py-1 text-sm" onClick={() => selectProfile(p.playerName)}>
                      Load
                    </button>
                  )}
                  <button
                    className="rounded bg-slate-600 px-2 py-1 text-sm"
                    onClick={async () => setCloudMsg((await loadFromCloud(p.playerName)) ? "Loaded from cloud" : "Cloud load failed")}
                  >
                    Cloud load
                  </button>
                  <button className="rounded bg-hvac-red px-2 py-1 text-sm" onClick={() => removeProfile(p.playerName)}>
                    Delete
                  </button>
                </span>
              </li>
            );
          })}
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
