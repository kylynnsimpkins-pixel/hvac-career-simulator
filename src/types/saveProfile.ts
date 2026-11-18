import type { Player } from "./player";
import type { EarnedCertifications } from "./certification";

export type CareerPath = "residential" | "commercial" | "company" | null;

export interface SaveProfile {
  id: string;
  name: string;
  player: Player;
  certifications: EarnedCertifications;
  completedCourses: string[];
  careerPath: CareerPath;
  contractorScore: number;
  updatedAt: string;
}
