import type { SaveProfile } from "@/types/saveProfile";
import { DEFAULT_WARDROBE, type Wardrobe } from "@/game/data/wardrobe";
import { levelTitle } from "./xpSystem";

export function createProfile(playerName: string, avatarColor = "#38bdf8", specialty = "Residential", wardrobe: Wardrobe = DEFAULT_WARDROBE): SaveProfile {
  return {
    avatarColor,
    wardrobe: { ...wardrobe },
    seenIntro: false,
    graduationSeen: false,
    epaSections: [],
    examPassed: [],
    playSeconds: 0,
    lessonDay: 0,
    stationsDone: [],
    checkedOut: [],
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
