"use client";

import { useEffect, useRef } from "react";
import { drawPerson } from "@/game/scenes/avatar";
import { ARTICLES, buildLook, type Wardrobe } from "@/game/data/wardrobe";

const hex = (c: number) => `#${c.toString(16).padStart(6, "0")}`;

export default function WardrobePicker({ value, onChange }: { value: Wardrobe; onChange: (w: Wardrobe) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 128, 192);
    ctx.scale(4, 4);
    drawPerson(ctx, buildLook(value), 0);
  }, [value]);

  return (
    <div className="flex flex-wrap gap-4 rounded border border-slate-600 p-3">
      <div className="flex flex-col items-center gap-2">
        <canvas ref={canvas} width={128} height={192} className="rounded bg-slate-800" aria-label="Character preview" />
        <button
          type="button"
          className="rounded bg-slate-600 px-2 py-1 text-xs"
          onClick={() =>
            onChange(Object.fromEntries(ARTICLES.map((a) => [a.key, Math.floor(Math.random() * a.items.length)])) as unknown as Wardrobe)
          }
        >
          Randomize
        </button>
      </div>
      <div className="min-w-[260px] flex-1 space-y-2">
        {ARTICLES.map((a) => (
          <div key={a.key}>
            <div className="text-xs text-slate-300">
              {a.label}: <span className="text-white">{a.items[value[a.key]]?.name}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {a.items.map((it, i) => (
                <button
                  key={it.name}
                  type="button"
                  title={it.name}
                  aria-label={`${a.label}: ${it.name}`}
                  onClick={() => onChange({ ...value, [a.key]: i })}
                  className={`flex h-7 w-7 items-center justify-center rounded border-2 text-[9px] font-bold ${value[a.key] === i ? "border-white" : "border-slate-600"}`}
                  style={{ backgroundColor: it.color ? hex(it.color) : "#0f172a", color: "#fff", textShadow: "0 0 2px #000" }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
