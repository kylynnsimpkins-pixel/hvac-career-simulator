import { create } from "zustand";
import type { SaveProfile } from "@/types/saveProfile";
import type { CertificationId } from "@/types/certification";
import { createProfile } from "@/game/systems/profileSystem";
import { addXp } from "@/game/systems/xpSystem";
import { awardCertification } from "@/game/systems/certificationSystem";
import {
  deleteProfile,
  getActiveProfileId,
  listProfiles,
  loadProfile,
  saveProfile,
  setActiveProfileId,
} from "@/game/systems/saveSystem";

interface GameState {
  profiles: SaveProfile[];
  active: SaveProfile | null;
  saved: boolean;
  init: () => void;
  newProfile: (name: string) => void;
  selectProfile: (id: string) => void;
  removeProfile: (id: string) => void;
  gainXp: (amount: number) => void;
  completeCourse: (course: string) => void;
  attemptCert: (id: CertificationId, score: number) => boolean;
  save: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  profiles: [],
  active: null,
  saved: true,

  init: () => {
    const activeId = getActiveProfileId();
    set({ profiles: listProfiles(), active: activeId ? loadProfile(activeId) : null });
  },

  newProfile: (name) => {
    const profile = createProfile(name);
    saveProfile(profile);
    setActiveProfileId(profile.id);
    set({ profiles: listProfiles(), active: profile, saved: true });
  },

  selectProfile: (id) => {
    setActiveProfileId(id);
    set({ active: loadProfile(id), saved: true });
  },

  removeProfile: (id) => {
    deleteProfile(id);
    set({ profiles: listProfiles(), active: get().active?.id === id ? null : get().active });
  },

  gainXp: (amount) => {
    const a = get().active;
    if (!a) return;
    const { xp, level } = addXp(a.player.xp, amount);
    set({ active: { ...a, player: { ...a.player, xp, level } }, saved: false });
  },

  completeCourse: (course) => {
    const a = get().active;
    if (!a || a.completedCourses.includes(course)) return;
    set({ active: { ...a, completedCourses: [...a.completedCourses, course] }, saved: false });
  },

  attemptCert: (id, score) => {
    const a = get().active;
    if (!a) return false;
    const result = awardCertification(a.certifications, id, score, a.player.level);
    set({ active: { ...a, certifications: result.earned }, saved: false });
    return result.passed;
  },

  save: () => {
    const a = get().active;
    if (!a) return;
    saveProfile(a);
    set({ profiles: listProfiles(), saved: true });
  },
}));
