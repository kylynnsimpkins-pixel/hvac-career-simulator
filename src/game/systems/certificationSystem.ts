import type { Certification, CertificationId } from "@/types/certification";
import type { SaveProfile } from "@/types/saveProfile";

export const CERTIFICATIONS: Certification[] = [
  { id: "epa608", name: "EPA 608", requiredXp: 500 },
  { id: "osha10", name: "OSHA 10", requiredXp: 500 },
  { id: "osha30", name: "OSHA 30", requiredXp: 2000 },
  { id: "nate", name: "NATE", requiredXp: 3000 },
];

export function getCertification(id: CertificationId): Certification {
  return CERTIFICATIONS.find((c) => c.id === id) as Certification;
}

export function hasCertification(profile: SaveProfile, id: CertificationId): boolean {
  return profile.certifications.includes(getCertification(id).name);
}

export function canEarn(profile: SaveProfile, id: CertificationId): boolean {
  return !hasCertification(profile, id) && profile.xp >= getCertification(id).requiredXp;
}

/** Returns a new certification list including the cert (no duplicates). */
export function addCertification(profile: SaveProfile, id: CertificationId): string[] {
  const name = getCertification(id).name;
  return profile.certifications.includes(name) ? profile.certifications : [...profile.certifications, name];
}
