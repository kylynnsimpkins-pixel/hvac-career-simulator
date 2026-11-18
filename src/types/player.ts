export type SkillName =
  | "electrical"
  | "mechanical"
  | "diagnostics"
  | "safety"
  | "customerService"
  | "leadership"
  | "sales";

export type Skills = Record<SkillName, number>;
