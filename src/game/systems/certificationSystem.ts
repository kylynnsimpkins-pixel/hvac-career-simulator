import type { Certification, CertificationId } from "@/types/certification";
import type { SaveProfile } from "@/types/saveProfile";

export const CERTIFICATIONS: Certification[] = [
  { id: "epa608", name: "EPA 608", requiredXp: 0 },
  { id: "osha10", name: "OSHA 10", requiredXp: 0 },
  { id: "osha30", name: "OSHA 30", requiredXp: 4000 },
  { id: "nate", name: "NATE", requiredXp: 5000 },
];

export function getCertification(id: CertificationId): Certification {
  return CERTIFICATIONS.find((c) => c.id === id) as Certification;
}

export function hasCertification(profile: SaveProfile, id: CertificationId): boolean {
  return profile.certifications.includes(getCertification(id).name);
}

/** Service calls the student has completed in the field. */
export const serviceCallCount = (profile: SaveProfile) => profile.completedQuests.filter((k) => k.startsWith("job:")).length;

const CALLS_REQUIRED: Record<CertificationId, number> = { epa608: 0, osha10: 3, osha30: 10, nate: 18 };
const PREREQS: Record<CertificationId, CertificationId[]> = { epa608: [], osha10: [], osha30: ["osha10"], nate: ["epa608", "osha30"] };

/** Unmet requirements before the student may sit this cert's exam. */
export function examRequirements(profile: SaveProfile, id: CertificationId): string[] {
  const missing: string[] = [];
  if (!profile.graduated) missing.push("Graduate from the program");
  for (const p of PREREQS[id]) if (!hasCertification(profile, p)) missing.push(`Earn ${getCertification(p).name} first`);
  const calls = serviceCallCount(profile);
  if (calls < CALLS_REQUIRED[id]) missing.push(`Complete ${CALLS_REQUIRED[id]} service calls (${calls} done)`);
  const xp = getCertification(id).requiredXp;
  if (profile.xp < xp) missing.push(`Reach ${xp} XP (${profile.xp} now)`);
  return missing;
}

export function canEarn(profile: SaveProfile, id: CertificationId): boolean {
  return !hasCertification(profile, id) && examRequirements(profile, id).length === 0;
}

/** Returns a new certification list including the cert (no duplicates). */
export function addCertification(profile: SaveProfile, id: CertificationId): string[] {
  const name = getCertification(id).name;
  return profile.certifications.includes(name) ? profile.certifications : [...profile.certifications, name];
}
