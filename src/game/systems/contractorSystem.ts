import { clamp } from "@/utils/calculations";

/** Contractor reputation meter, 0-100. */
export function applyJobResult(score: number, success: boolean, difficulty = 1): number {
  return clamp(score + (success ? 5 * difficulty : -8 * difficulty), 0, 100);
}

export function contractorTier(score: number): "Apprentice" | "Journeyman" | "Master" {
  if (score >= 75) return "Master";
  if (score >= 40) return "Journeyman";
  return "Apprentice";
}

export function jobPayout(basePay: number, score: number): number {
  return Math.round(basePay * (1 + score / 200));
}
