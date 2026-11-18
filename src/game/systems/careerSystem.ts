import type { SaveProfile } from "@/types/saveProfile";

export type CareerPathName = "Residential" | "Commercial";

export interface CareerInfo {
  id: CareerPathName;
  employers: string[];
  salary: string;
  roles: string[];
  skills: (keyof SaveProfile)[];
}

export const CAREERS: CareerInfo[] = [
  {
    id: "Commercial",
    employers: ["Carrier", "Trane", "Johnson Controls", "Daikin", "EMCOR"],
    salary: "$55k - $95k",
    roles: ["Commercial Service Tech", "Controls Technician", "Chiller Specialist"],
    skills: ["electrical", "mechanical", "diagnostics"],
  },
  {
    id: "Residential",
    employers: ["One Hour Heating & Air", "Aire Serv", "ARS Rescue Rooter"],
    salary: "$45k - $80k",
    roles: ["Residential Install Tech", "Service Technician", "Comfort Advisor"],
    skills: ["customerService", "sales", "leadership"],
  },
];

/** Average of the career's key skills; useful for recommending a path. */
export function careerFit(profile: SaveProfile, career: CareerInfo): number {
  const total = career.skills.reduce((sum, s) => sum + (profile[s] as number), 0);
  return Math.round(total / career.skills.length);
}

export function recommendedCareer(profile: SaveProfile): CareerPathName {
  const [a, b] = CAREERS;
  return careerFit(profile, a) >= careerFit(profile, b) ? a.id : b.id;
}
