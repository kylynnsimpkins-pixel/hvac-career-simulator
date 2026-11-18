import type { SaveProfile } from "@/types/saveProfile";
import { percent } from "@/utils/calculations";

export const COMPANY_CREDITS_REQUIRED = 1000;
export const COMPANY_XP_REQUIRED = 6500;
export const COMPANY_MONEY_REQUIRED = 3000;
export const PROGRAM_HOURS_REQUIRED = 8;

export function creditsProgress(profile: SaveProfile): number {
  return percent(profile.contractorCredits, COMPANY_CREDITS_REQUIRED);
}

export const programHours = (profile: SaveProfile) => (profile.playSeconds ?? 0) / 3600;

export function canOpenCompany(profile: SaveProfile): boolean {
  return (
    profile.xp >= COMPANY_XP_REQUIRED &&
    profile.contractorCredits >= COMPANY_CREDITS_REQUIRED &&
    profile.money >= COMPANY_MONEY_REQUIRED &&
    profile.certifications.includes("NATE") &&
    programHours(profile) >= PROGRAM_HOURS_REQUIRED
  );
}
