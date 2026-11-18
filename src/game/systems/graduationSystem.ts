import type { SaveProfile } from "@/types/saveProfile";
import { percent } from "@/utils/calculations";

export const GRADUATION_POINTS_REQUIRED = 1000;

export function graduationProgress(profile: SaveProfile): number {
  return percent(profile.graduationPoints, GRADUATION_POINTS_REQUIRED);
}

export function shouldGraduate(profile: SaveProfile): boolean {
  return !profile.graduated && profile.graduationPoints >= GRADUATION_POINTS_REQUIRED;
}

/** Career Services, Certification Center and Placement Exam unlock after graduation. */
export function isGraduated(profile: SaveProfile): boolean {
  return profile.graduated;
}
