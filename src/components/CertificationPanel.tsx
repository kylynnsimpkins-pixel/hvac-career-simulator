"use client";

import { CERTIFICATIONS, examRequirements } from "@/game/systems/certificationSystem";
import type { SaveProfile } from "@/types/saveProfile";

export default function CertificationPanel({ profile }: { profile: SaveProfile }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CERTIFICATIONS.map((c) => {
        const has = profile.certifications.includes(c.name);
        const missing = has ? [] : examRequirements(profile, c.id);
        return (
          <li key={c.id} className="rounded border border-slate-600 p-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/icons/${c.id}.png`} alt={c.name} className={`mx-auto h-12 w-12 ${has ? "" : "opacity-40"}`} />
            <p className="mt-2 text-sm font-semibold">{c.name}</p>
            {has ? (
              <p className="text-green-400">Earned</p>
            ) : missing.length === 0 ? (
              <p className="text-yellow-300">Ready: take the exam</p>
            ) : (
              <ul className="text-xs text-slate-400">
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
