import type { SaveProfile } from "@/types/saveProfile";
import { createProfile } from "./profileSystem";

const PROFILE_PREFIX = "hvac-profile-";
const ACTIVE_KEY = "hvac-active-profile";

export function profileKey(playerName: string): string {
  return `${PROFILE_PREFIX}${playerName.trim().toLowerCase()}`;
}

/** Saves a profile under its own key so several students can share one computer. */
export function saveGame(profile: SaveProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(profileKey(profile.playerName), JSON.stringify(profile));
  localStorage.setItem(ACTIVE_KEY, profile.playerName);
}

export function loadGame(playerName: string): SaveProfile | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(profileKey(playerName));
  if (!data) return null;
  try {
    // Merge over defaults so older saves missing new fields still load.
    return { ...createProfile(playerName), ...JSON.parse(data) } as SaveProfile;
  } catch {
    return null;
  }
}

export function deleteSave(playerName: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(profileKey(playerName));
  if (localStorage.getItem(ACTIVE_KEY)?.toLowerCase() === playerName.trim().toLowerCase()) {
    localStorage.removeItem(ACTIVE_KEY);
  }
}

export function listProfiles(): SaveProfile[] {
  if (typeof window === "undefined") return [];
  const profiles: SaveProfile[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PROFILE_PREFIX)) continue;
    const name = (JSON.parse(localStorage.getItem(key) ?? "{}") as Partial<SaveProfile>).playerName;
    const profile = name ? loadGame(name) : null;
    if (profile) profiles.push(profile);
  }
  return profiles.sort((a, b) => a.playerName.localeCompare(b.playerName));
}

export function getActiveProfileName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_KEY);
}
