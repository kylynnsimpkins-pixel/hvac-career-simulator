import type { SaveProfile } from "@/types/saveProfile";
import { loadJSON, removeKey, saveJSON } from "@/utils/localStorage";

const PROFILES_KEY = "hvac-sim:profiles";
const ACTIVE_KEY = "hvac-sim:active";

export function listProfiles(): SaveProfile[] {
  return loadJSON<SaveProfile[]>(PROFILES_KEY, []);
}

export function saveProfile(profile: SaveProfile): boolean {
  const updated = { ...profile, updatedAt: new Date().toISOString() };
  const others = listProfiles().filter((p) => p.id !== profile.id);
  return saveJSON(PROFILES_KEY, [...others, updated]);
}

export function loadProfile(id: string): SaveProfile | null {
  return listProfiles().find((p) => p.id === id) ?? null;
}

export function deleteProfile(id: string): void {
  saveJSON(PROFILES_KEY, listProfiles().filter((p) => p.id !== id));
  if (getActiveProfileId() === id) removeKey(ACTIVE_KEY);
}

export function getActiveProfileId(): string | null {
  return loadJSON<string | null>(ACTIVE_KEY, null);
}

export function setActiveProfileId(id: string): void {
  saveJSON(ACTIVE_KEY, id);
}
