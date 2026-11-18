import type { SaveProfile } from "@/types/saveProfile";
import { levelTitle } from "./xpSystem";

export function createProfile(playerName: string, avatarColor = "#38bdf8", specialty = "Residential"): SaveProfile {
  return {
    avatarColor,
    seenIntro: false,
    lessonDay: 0,
    specialty,
    inventory: ["multimeter"],
    skillPoints: 0,
    unlockedSkills: [],
    completedQuests: [],
    playerName: playerName.trim() || "Student",
    xp: 0,
    graduationPoints: 0,
    contractorCredits: 0,
    money: 0,
    certifications: [],
    electrical: 0,
    mechanical: 0,
    diagnostics: 0,
    safety: 0,
    customerService: 0,
    leadership: 0,
    sales: 0,
    level: levelTitle(0),
    completedLabs: [],
    graduated: false,
  };
}
