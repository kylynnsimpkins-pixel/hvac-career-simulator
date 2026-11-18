import type { SaveProfile } from "@/types/saveProfile";
import { percent } from "@/utils/calculations";
import { CERTIFICATIONS, earnedCount } from "./certificationSystem";

export const REQUIRED_COURSES = ["classroom", "electrical-lab", "refrigeration-lab", "troubleshooting"];
export const GRADUATION_LEVEL = 5;

/** Weighted graduation progress, 0-100: courses 50%, certifications 30%, level 20%. */
export function graduationProgress(profile: SaveProfile): number {
  const courses = percent(
    REQUIRED_COURSES.filter((c) => profile.completedCourses.includes(c)).length,
    REQUIRED_COURSES.length,
  );
  const certs = percent(earnedCount(profile.certifications), CERTIFICATIONS.length);
  const level = percent(profile.player.level, GRADUATION_LEVEL);
  return Math.round(courses * 0.5 + certs * 0.3 + level * 0.2);
}

export function canGraduate(profile: SaveProfile): boolean {
  return (
    REQUIRED_COURSES.every((c) => profile.completedCourses.includes(c)) &&
    !!profile.certifications.epa608 &&
    profile.player.level >= GRADUATION_LEVEL
  );
}
