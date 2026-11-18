import type { CareerPath, SaveProfile } from "@/types/saveProfile";

export interface CareerInfo {
  id: Exclude<CareerPath, null>;
  title: string;
  baseSalary: number;
  requiredCert: "epa608" | "nate";
}

export const CAREERS: CareerInfo[] = [
  { id: "residential", title: "Residential Technician", baseSalary: 48000, requiredCert: "epa608" },
  { id: "commercial", title: "Commercial Technician", baseSalary: 62000, requiredCert: "nate" },
  { id: "company", title: "Company Owner", baseSalary: 85000, requiredCert: "nate" },
];

export function eligibleCareers(profile: SaveProfile): CareerInfo[] {
  return CAREERS.filter((c) => !!profile.certifications[c.requiredCert]);
}

export function chooseCareer(profile: SaveProfile, path: Exclude<CareerPath, null>): SaveProfile {
  const info = CAREERS.find((c) => c.id === path);
  if (!info || !profile.certifications[info.requiredCert]) return profile;
  return { ...profile, careerPath: path };
}

export function projectedSalary(profile: SaveProfile): number {
  const info = CAREERS.find((c) => c.id === profile.careerPath);
  if (!info) return 0;
  return Math.round(info.baseSalary * (1 + profile.contractorScore / 200));
}
