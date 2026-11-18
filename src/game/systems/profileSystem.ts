import type { SaveProfile } from "@/types/saveProfile";

export function createProfile(name: string): SaveProfile {
  const id = `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  return {
    id,
    name: name.trim() || "Student",
    player: { id, name: name.trim() || "Student", xp: 0, level: 1, money: 0 },
    certifications: {},
    completedCourses: [],
    careerPath: null,
    contractorScore: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function renameProfile(profile: SaveProfile, name: string): SaveProfile {
  return { ...profile, name, player: { ...profile.player, name } };
}
