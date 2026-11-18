"use client";

export default function SaveIndicator({ saved }: { saved: boolean }) {
  return (
    <span className={saved ? "text-xs text-green-400" : "text-xs text-yellow-400"}>
      {saved ? "Saved" : "Unsaved changes"}
    </span>
  );
}
