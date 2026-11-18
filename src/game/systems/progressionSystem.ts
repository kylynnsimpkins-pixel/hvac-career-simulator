import type { SaveProfile } from "@/types/saveProfile";
import { QUESTS, SKILL_TREE, TOOLS, type Quest } from "@/game/data/gameContent";

export function canBuyTool(p: SaveProfile, toolId: string): boolean {
  const tool = TOOLS.find((t) => t.id === toolId);
  return !!tool && !p.inventory.includes(toolId) && p.money >= tool.price;
}

export function canUnlockSkill(p: SaveProfile, skillId: string): boolean {
  const node = SKILL_TREE.find((s) => s.id === skillId);
  if (!node || p.unlockedSkills.includes(skillId) || p.skillPoints < node.cost) return false;
  return !node.requires || p.unlockedSkills.includes(node.requires);
}

export function isQuestComplete(p: SaveProfile, q: Quest): boolean {
  if (q.requiredLab && !p.completedLabs.includes(q.requiredLab)) return false;
  if (q.requiredTool && !p.inventory.includes(q.requiredTool)) return false;
  if (q.minXp && p.xp < q.minXp) return false;
  return true;
}

export function claimableQuests(p: SaveProfile): Quest[] {
  return QUESTS.filter((q) => !p.completedQuests.includes(q.id) && isQuestComplete(p, q));
}
