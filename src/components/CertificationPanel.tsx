"use client";

import { CERTIFICATIONS } from "@/game/systems/certificationSystem";
import type { EarnedCertifications } from "@/types/certification";

export default function CertificationPanel({ earned }: { earned: EarnedCertifications }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CERTIFICATIONS.map((c) => (
        <li key={c.id} className="rounded border border-slate-600 p-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/icons/${c.id}.png`} alt={c.name} className="mx-auto h-12 w-12" />
          <p className="mt-2 text-sm font-semibold">{c.name}</p>
          <p className={earned[c.id] ? "text-green-400" : "text-slate-400"}>
            {earned[c.id] ? "Earned" : `Requires level ${c.requiredLevel}`}
          </p>
        </li>
      ))}
    </ul>
  );
}
