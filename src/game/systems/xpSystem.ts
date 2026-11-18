const LEVELS: [number, string][] = [
  [0, "Apprentice"],
  [800, "Junior Technician"],
  [2500, "Technician"],
  [4500, "Senior Technician"],
  [6500, "Master Technician"],
];

export function levelTitle(xp: number): string {
  let title = LEVELS[0][1];
  for (const [min, name] of LEVELS) if (xp >= min) title = name;
  return title;
}

/** Progress (0-100) toward the next level title; 100 at max level. */
export function levelProgress(xp: number): number {
  const idx = LEVELS.reduce((acc, [min], i) => (xp >= min ? i : acc), 0);
  const next = LEVELS[idx + 1];
  if (!next) return 100;
  const start = LEVELS[idx][0];
  return Math.round(((xp - start) / (next[0] - start)) * 100);
}
