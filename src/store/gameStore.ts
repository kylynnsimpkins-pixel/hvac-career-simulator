import { create } from "zustand";
import type { SaveProfile } from "@/types/saveProfile";
import type { CertificationId } from "@/types/certification";
import type { SkillName } from "@/types/player";
import { createProfile } from "@/game/systems/profileSystem";
import { levelTitle } from "@/game/systems/xpSystem";
import { addCertification, canEarn } from "@/game/systems/certificationSystem";
import { shouldGraduate } from "@/game/systems/graduationSystem";
import { deleteSave, getActiveProfileName, listProfiles, loadGame, saveGame } from "@/game/systems/saveSystem";

export interface Reward {
  xp?: number;
  graduationPoints?: number;
  contractorCredits?: number;
  money?: number;
  skill?: SkillName;
  skillPoints?: number;
}

interface GameState {
  profiles: SaveProfile[];
  active: SaveProfile | null;
  justSaved: boolean;
  init: () => void;
  newProfile: (name: string) => void;
  selectProfile: (name: string) => void;
  removeProfile: (name: string) => void;
  reward: (r: Reward) => void;
  completeLab: (labId: string, r: Reward) => void;
  earnCertification: (id: CertificationId) => boolean;
  chooseCareer: (path: string) => void;
}

let flashTimer: ReturnType<typeof setTimeout> | undefined;

export const useGameStore = create<GameState>((set, get) => {
  /** Persists the profile (auto save) and briefly shows the save indicator. */
  const commit = (profile: SaveProfile) => {
    const next = { ...profile, level: levelTitle(profile.xp) };
    if (shouldGraduate(next)) next.graduated = true;
    saveGame(next);
    set({ active: next, profiles: listProfiles(), justSaved: true });
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => set({ justSaved: false }), 2000);
  };

  const applyReward = (p: SaveProfile, r: Reward): SaveProfile => {
    const next = {
      ...p,
      xp: p.xp + (r.xp ?? 0),
      graduationPoints: p.graduationPoints + (r.graduationPoints ?? 0),
      contractorCredits: p.contractorCredits + (r.contractorCredits ?? 0),
      money: p.money + (r.money ?? 0),
    };
    if (r.skill) next[r.skill] = p[r.skill] + (r.skillPoints ?? 1);
    return next;
  };

  return {
    profiles: [],
    active: null,
    justSaved: false,

    init: () => {
      const name = getActiveProfileName();
      set({ profiles: listProfiles(), active: name ? loadGame(name) : null });
    },

    newProfile: (name) => {
      const existing = loadGame(name);
      commit(existing ?? createProfile(name));
    },

    selectProfile: (name) => {
      const profile = loadGame(name);
      if (profile) commit(profile);
    },

    removeProfile: (name) => {
      deleteSave(name);
      const active = get().active;
      set({
        profiles: listProfiles(),
        active: active?.playerName.toLowerCase() === name.toLowerCase() ? null : active,
      });
    },

    reward: (r) => {
      const a = get().active;
      if (a) commit(applyReward(a, r));
    },

    completeLab: (labId, r) => {
      const a = get().active;
      if (!a) return;
      const withReward = applyReward(a, r);
      commit({
        ...withReward,
        completedLabs: a.completedLabs.includes(labId) ? a.completedLabs : [...a.completedLabs, labId],
      });
    },

    earnCertification: (id) => {
      const a = get().active;
      if (!a || !canEarn(a, id)) return false;
      commit({ ...a, certifications: addCertification(a, id) });
      return true;
    },

    chooseCareer: (path) => {
      const a = get().active;
      if (a && a.graduated) commit({ ...a, careerPath: path });
    },
  };
});
