import type { Skills } from "./player";

export interface SaveProfile extends Skills {
  playerName: string;

  xp: number;
  graduationPoints: number;
  contractorCredits: number;
  money: number;

  certifications: string[];

  level: string;
  careerPath?: string;
  placementScore?: number;
  seenIntro: boolean;
  graduationSeen: boolean;
  epaSections: string[];
  lessonDay: number;
  stationsDone: string[];
  checkedOut: string[];

  completedLabs: string[];
  graduated: boolean;

  avatarColor: string;
  specialty: string;
  inventory: string[];
  skillPoints: number;
  unlockedSkills: string[];
  completedQuests: string[];
}
