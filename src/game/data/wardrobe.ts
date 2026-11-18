import type { Look } from "@/game/scenes/avatar";

export type Gender = "boy" | "girl";
export type HairStyle = "bald" | "bob" | "pigtails" | "bun" | "braid" | "pixie" | "sidesweep" | "buzz" | "crop" | "side" | "curly" | "afro" | "long" | "ponytail" | "mohawk" | "dreads";
export type HatStyle = "none" | "hardhat" | "cap" | "beanie";

export interface Wardrobe {
  gender?: Gender;
  skin: number;
  hair: number;
  hat: number;
  top: number;
  pants: number;
  shoes: number;
}

export const DEFAULT_WARDROBE: Wardrobe = { skin: 1, hair: 1, hat: 0, top: 0, pants: 0, shoes: 0 };

export const SKIN_TONES = [
  { name: "Porcelain", color: 0xf8d9c0 },
  { name: "Fair", color: 0xf1c27d },
  { name: "Tan", color: 0xd9a066 },
  { name: "Olive", color: 0xc68642 },
  { name: "Caramel", color: 0xa56b3f },
  { name: "Brown", color: 0x8d5524 },
  { name: "Deep brown", color: 0x6b3f1d },
  { name: "Ebony", color: 0x4a2a14 },
];

/** Ten options per article of clothing. */
export const HAIR: { name: string; style: HairStyle; color: number }[] = [
  { name: "Buzz cut", style: "buzz", color: 0x2a1a10 },
  { name: "Short crop", style: "crop", color: 0x3b2314 },
  { name: "Side part", style: "side", color: 0x8a5a2b },
  { name: "Curly top", style: "curly", color: 0x1f1510 },
  { name: "Afro", style: "afro", color: 0x15100c },
  { name: "Long hair", style: "long", color: 0xd8b25c },
  { name: "Ponytail", style: "ponytail", color: 0x6b2e1a },
  { name: "Mohawk", style: "mohawk", color: 0x2a6fd6 },
  { name: "Dreads", style: "dreads", color: 0x2a1a10 },
  { name: "Bald", style: "bald", color: 0x000000 },
];

export const HATS: { name: string; style: HatStyle; color: number }[] = [
  { name: "Yellow hard hat", style: "hardhat", color: 0xffd400 },
  { name: "White hard hat", style: "hardhat", color: 0xf5f5f5 },
  { name: "Orange hard hat", style: "hardhat", color: 0xf97316 },
  { name: "Blue hard hat", style: "hardhat", color: 0x2563eb },
  { name: "Red cap", style: "cap", color: 0xc23b3b },
  { name: "Navy cap", style: "cap", color: 0x1e3a8a },
  { name: "Green cap", style: "cap", color: 0x2f855a },
  { name: "Black beanie", style: "beanie", color: 0x1f2937 },
  { name: "Grey beanie", style: "beanie", color: 0x9ca3af },
  { name: "No hat", style: "none", color: 0 },
];

export const TOPS = [
  { name: "Navy work shirt", color: 0x1e3a8a },
  { name: "Red polo", color: 0xc23b3b },
  { name: "Green tee", color: 0x2f855a },
  { name: "Grey hoodie", color: 0x6b7280 },
  { name: "Hi-vis orange", color: 0xf97316 },
  { name: "Black tee", color: 0x1f2937 },
  { name: "White button-up", color: 0xf5f5f5 },
  { name: "Yellow coveralls", color: 0xe0a800 },
  { name: "Purple polo", color: 0x7e3fb8 },
  { name: "Denim shirt", color: 0x4a6fa5 },
];

export const PANTS = [
  { name: "Navy work pants", color: 0x2b3a67 },
  { name: "Khaki", color: 0xb59a6a },
  { name: "Black cargo", color: 0x1f2937 },
  { name: "Blue jeans", color: 0x3b5b92 },
  { name: "Charcoal", color: 0x4b5563 },
  { name: "Olive cargo", color: 0x5a6b3a },
  { name: "Brown duck", color: 0x7a5230 },
  { name: "Grey slacks", color: 0x9ca3af },
  { name: "Dark denim", color: 0x1e2a44 },
  { name: "Tan carpenter", color: 0xc9a66b },
];

export const SHOES = [
  { name: "Brown work boots", color: 0x5b3a1e },
  { name: "Black boots", color: 0x111827 },
  { name: "Tan boots", color: 0xb08a54 },
  { name: "White sneakers", color: 0xf3f4f6 },
  { name: "Black sneakers", color: 0x1f2937 },
  { name: "Red sneakers", color: 0xc23b3b },
  { name: "Blue sneakers", color: 0x2563eb },
  { name: "Grey trainers", color: 0x9ca3af },
  { name: "Steel toes", color: 0x3f3f46 },
  { name: "Green boots", color: 0x365314 },
];

export const HAIR_GIRL: { name: string; style: HairStyle; color: number }[] = [
  { name: "Long hair", style: "long", color: 0x3b2314 },
  { name: "Ponytail", style: "ponytail", color: 0xd8b25c },
  { name: "Bob", style: "bob", color: 0x15100c },
  { name: "Pigtails", style: "pigtails", color: 0x6b2e1a },
  { name: "Top bun", style: "bun", color: 0x2a1a10 },
  { name: "Side braid", style: "braid", color: 0x8a5a2b },
  { name: "Pixie cut", style: "pixie", color: 0xc23b3b },
  { name: "Curly top", style: "curly", color: 0x1f1510 },
  { name: "Afro puffs", style: "afro", color: 0x15100c },
  { name: "Side sweep", style: "sidesweep", color: 0xe5c07b },
];

export const hairFor = (g?: Gender) => (g === "girl" ? HAIR_GIRL : HAIR);

type Article = { key: Exclude<keyof Wardrobe, "gender">; label: string; items: { name: string; color: number }[] };
export const articlesFor = (g?: Gender): Article[] => [
  { key: "skin", label: "Skin tone", items: SKIN_TONES },
  { key: "hair", label: "Hair", items: hairFor(g) },
  { key: "hat", label: "Hat", items: HATS },
  { key: "top", label: "Top", items: TOPS },
  { key: "pants", label: "Pants", items: PANTS },
  { key: "shoes", label: "Shoes", items: SHOES },
];

export const ARTICLES: Article[] = [
  { key: "skin", label: "Skin tone", items: SKIN_TONES },
  { key: "hair", label: "Hair", items: HAIR },
  { key: "hat", label: "Hat", items: HATS },
  { key: "top", label: "Top", items: TOPS },
  { key: "pants", label: "Pants", items: PANTS },
  { key: "shoes", label: "Shoes", items: SHOES },
];

const pick = <T,>(list: T[], i: number | undefined) => list[Math.max(0, Math.min(list.length - 1, i ?? 0))];

export function buildLook(w: Wardrobe | undefined): Look {
  const wd = { ...DEFAULT_WARDROBE, ...w };
  const hair = pick(hairFor(wd.gender), wd.hair);
  const hat = pick(HATS, wd.hat);
  return {
    shirt: pick(TOPS, wd.top).color,
    pants: pick(PANTS, wd.pants).color,
    shoes: pick(SHOES, wd.shoes).color,
    skin: pick(SKIN_TONES, wd.skin).color,
    hairStyle: hair.style,
    hair: hair.color,
    hatStyle: hat.style,
    hat: hat.color,
    belt: true,
    female: wd.gender === "girl",
  };
}
