import { clamp } from "@/utils/calculations";

/** XP needed to reach `level` from level 1 (quadratic curve). */
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return 100 * (l - 1) * (l - 1);
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
}

export function addXp(currentXp: number, gained: number): { xp: number; level: number; leveledUp: boolean } {
  const xp = Math.max(0, currentXp + gained);
  const level = levelFromXp(xp);
  return { xp, level, leveledUp: level > levelFromXp(currentXp) };
}

/** Progress (0-100) toward the next level. */
export function levelProgress(xp: number): number {
  const level = levelFromXp(xp);
  const start = xpForLevel(level);
  const end = xpForLevel(level + 1);
  return clamp(Math.round(((xp - start) / (end - start)) * 100), 0, 100);
}
