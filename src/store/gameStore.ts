import { create } from "zustand";
import type { SaveProfile } from "@/types/saveProfile";
import type { CertificationId } from "@/types/certification";
import type { SkillName } from "@/types/player";
import { createProfile } from "@/game/systems/profileSystem";
import { levelTitle } from "@/game/systems/xpSystem";
import { addCertification, canEarn } from "@/game/systems/certificationSystem";
import { shouldGraduate } from "@/game/systems/graduationSystem";
import { canBuyTool, canUnlockSkill, isQuestComplete } from "@/game/systems/progressionSystem";
import { QUESTS, SKILL_TREE, TOOLS } from "@/game/data/gameContent";
import { pullFromCloud, pushToCloud } from "@/game/systems/cloudSync";
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
  newProfile: (name: string, avatarColor?: string, specialty?: string) => void;
  buyTool: (id: string) => boolean;
  unlockSkill: (id: string) => boolean;
  claimQuest: (id: string) => boolean;
  syncToCloud: () => Promise<boolean>;
  loadFromCloud: (name: string) => Promise<boolean>;
  selectProfile: (name: string) => void;
  removeProfile: (name: string) => void;
  reward: (r: Reward) => void;
  completeLab: (labId: string, r: Reward) => void;
  earnCertification: (id: CertificationId) => boolean;
  chooseCareer: (path: string) => void;
  submitPlacement: (score: number, xp: number) => void;
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

    newProfile: (name, avatarColor, specialty) => {
      const existing = loadGame(name);
      commit(existing ?? createProfile(name, avatarColor, specialty));
    },

    buyTool: (id) => {
      const a = get().active;
      if (!a || !canBuyTool(a, id)) return false;
      const tool = TOOLS.find((t) => t.id === id)!;
      commit({ ...a, money: a.money - tool.price, inventory: [...a.inventory, id] });
      return true;
    },

    unlockSkill: (id) => {
      const a = get().active;
      if (!a || !canUnlockSkill(a, id)) return false;
      const node = SKILL_TREE.find((s) => s.id === id)!;
      commit({ ...a, skillPoints: a.skillPoints - node.cost, unlockedSkills: [...a.unlockedSkills, id] });
      return true;
    },

    claimQuest: (id) => {
      const a = get().active;
      const q = QUESTS.find((x) => x.id === id);
      if (!a || !q || a.completedQuests.includes(id) || !isQuestComplete(a, q)) return false;
      commit({
        ...applyReward(a, q.reward),
        skillPoints: a.skillPoints + q.reward.skillPoints,
        completedQuests: [...a.completedQuests, id],
      });
      return true;
    },

    syncToCloud: async () => {
      const a = get().active;
      return a ? pushToCloud(a) : false;
    },

    loadFromCloud: async (name) => {
      const remote = await pullFromCloud(name);
      if (!remote) return false;
      commit({ ...createProfile(name), ...remote });
      return true;
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
      const firstTime = !a.completedLabs.includes(labId);
      commit({
        ...withReward,
        skillPoints: withReward.skillPoints + (firstTime ? 1 : 0),
        completedLabs: a.completedLabs.includes(labId) ? a.completedLabs : [...a.completedLabs, labId],
      });
    },

    earnCertification: (id) => {
      const a = get().active;
      if (!a || !canEarn(a, id)) return false;
      commit({ ...a, certifications: addCertification(a, id) });
      return true;
    },

    submitPlacement: (score, xp) => {
      const a = get().active;
      if (!a || !a.graduated || a.placementScore !== undefined) return;
      commit({ ...a, xp: a.xp + xp, placementScore: score });
    },

    chooseCareer: (path) => {
      const a = get().active;
      if (a && a.graduated) commit({ ...a, careerPath: path });
    },
  };
});
