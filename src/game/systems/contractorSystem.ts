import type { SaveProfile } from "@/types/saveProfile";
import { percent } from "@/utils/calculations";

export const COMPANY_CREDITS_REQUIRED = 5000;
export const COMPANY_XP_REQUIRED = 10000;
export const COMPANY_MONEY_REQUIRED = 100000;

export function creditsProgress(profile: SaveProfile): number {
  return percent(profile.contractorCredits, COMPANY_CREDITS_REQUIRED);
}

export function canOpenCompany(profile: SaveProfile): boolean {
  return (
    profile.xp >= COMPANY_XP_REQUIRED &&
    profile.contractorCredits >= COMPANY_CREDITS_REQUIRED &&
    profile.money >= COMPANY_MONEY_REQUIRED &&
    profile.certifications.includes("NATE")
  );
}
