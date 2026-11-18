import type { SkillName } from "@/types/player";

export interface Tool {
  id: string;
  name: string;
  price: number;
}

export const TOOLS: Tool[] = [
  { id: "multimeter", name: "Multimeter", price: 0 },
  { id: "screwdrivers", name: "Insulated Screwdrivers", price: 40 },
  { id: "manifold-gauges", name: "Manifold Gauges", price: 150 },
  { id: "clamp-meter", name: "Clamp Meter", price: 120 },
  { id: "vacuum-pump", name: "Vacuum Pump", price: 300 },
  { id: "leak-detector", name: "Leak Detector", price: 200 },
  { id: "recovery-machine", name: "Recovery Machine", price: 450 },
  { id: "tubing-cutter", name: "Tubing Cutter & Flare Kit", price: 90 },
  { id: "nut-drivers", name: "Nut Driver Set", price: 35 },
  { id: "psychrometer", name: "Digital Psychrometer", price: 110 },
];

export interface SkillNode {
  id: string;
  name: string;
  branch: SkillName;
  cost: number;
  requires?: string;
}

export const SKILL_TREE: SkillNode[] = [
  { id: "elec-1", name: "Basic Wiring", branch: "electrical", cost: 1 },
  { id: "elec-2", name: "Control Circuits", branch: "electrical", cost: 2, requires: "elec-1" },
  { id: "mech-1", name: "Refrigeration Cycle", branch: "mechanical", cost: 1 },
  { id: "mech-2", name: "Compressor Service", branch: "mechanical", cost: 2, requires: "mech-1" },
  { id: "diag-1", name: "Meter Readings", branch: "diagnostics", cost: 1 },
  { id: "diag-2", name: "Fault Isolation", branch: "diagnostics", cost: 2, requires: "diag-1" },
  { id: "safe-1", name: "Lockout/Tagout", branch: "safety", cost: 1 },
  { id: "elec-3", name: "Motor & Capacitor Testing", branch: "electrical", cost: 3, requires: "elec-2" },
  { id: "mech-3", name: "Brazing & Evacuation", branch: "mechanical", cost: 3, requires: "mech-2" },
  { id: "diag-3", name: "Superheat & Subcooling", branch: "diagnostics", cost: 3, requires: "diag-2" },
  { id: "safe-2", name: "Refrigerant Handling", branch: "safety", cost: 2, requires: "safe-1" },
  { id: "cust-1", name: "Customer Communication", branch: "customerService", cost: 1 },
  { id: "cust-2", name: "Estimates & Upselling", branch: "customerService", cost: 2, requires: "cust-1" },
];

export interface Quest {
  id: string;
  title: string;
  description: string;
  requiredLab?: string;
  requiredTool?: string;
  minXp?: number;
  reward: { xp: number; money: number; skillPoints: number };
}

export const QUESTS: Quest[] = [
  {
    id: "first-day",
    title: "First Day",
    description: "Earn your first 25 XP.",
    minXp: 25,
    reward: { xp: 50, money: 25, skillPoints: 1 },
  },
  {
    id: "wire-it-up",
    title: "Wire It Up",
    description: "Finish the electrical lab.",
    requiredLab: "wiring-lab",
    reward: { xp: 100, money: 50, skillPoints: 1 },
  },
  {
    id: "gear-up",
    title: "Gear Up",
    description: "Buy manifold gauges for the toolbelt.",
    requiredTool: "manifold-gauges",
    reward: { xp: 75, money: 0, skillPoints: 1 },
  },
  {
    id: "cooling-down",
    title: "Cooling Down",
    description: "Finish the refrigeration lab.",
    requiredLab: "refrigeration-lab",
    reward: { xp: 120, money: 60, skillPoints: 1 },
  },
  {
    id: "meter-ready",
    title: "Meter Ready",
    description: "Buy a clamp meter.",
    requiredTool: "clamp-meter",
    reward: { xp: 60, money: 20, skillPoints: 1 },
  },
  {
    id: "green-tech",
    title: "Green Tech",
    description: "Buy a recovery machine for EPA-compliant work.",
    requiredTool: "recovery-machine",
    reward: { xp: 150, money: 75, skillPoints: 1 },
  },
  {
    id: "apprentice",
    title: "Apprentice",
    description: "Reach 500 XP.",
    minXp: 500,
    reward: { xp: 100, money: 75, skillPoints: 1 },
  },
  {
    id: "rising-star",
    title: "Rising Star",
    description: "Reach 1000 XP.",
    minXp: 1000,
    reward: { xp: 150, money: 100, skillPoints: 2 },
  },
];
