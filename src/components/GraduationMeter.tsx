"use client";

export default function GraduationMeter({ progress }: { progress: number }) {
  return (
    <div>
      <p className="text-sm">Graduation progress: {progress}%</p>
      <div className="h-3 rounded bg-slate-700">
        <div className="h-3 rounded bg-green-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
