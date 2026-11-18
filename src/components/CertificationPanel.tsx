"use client";

import { CERTIFICATIONS } from "@/game/systems/certificationSystem";

export default function CertificationPanel({ earned }: { earned: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CERTIFICATIONS.map((c) => {
        const has = earned.includes(c.name);
        return (
          <li key={c.id} className="rounded border border-slate-600 p-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/icons/${c.id}.png`}
              alt={c.name}
              className={`mx-auto h-12 w-12 ${has ? "" : "opacity-40"}`}
            />
            <p className="mt-2 text-sm font-semibold">{c.name}</p>
            <p className={has ? "text-green-400" : "text-slate-400"}>
              {has ? "Earned" : `Requires ${c.requiredXp} XP`}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
