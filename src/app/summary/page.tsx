"use client";

import { useGameStore } from "@/store/gameStore";

export default function SummaryPage() {
  const active = useGameStore((s) => s.active);
  if (!active) return <p>Create or load a profile first.</p>;
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Summary</h1>
      <pre className="overflow-x-auto rounded bg-slate-800 p-4 text-sm">{JSON.stringify(active, null, 2)}</pre>
    </section>
  );
}
