import type { Certification, CertificationId, EarnedCertifications } from "@/types/certification";

export const CERTIFICATIONS: Certification[] = [
  { id: "epa608", name: "EPA 608", requiredLevel: 2, passingScore: 70 },
  { id: "osha10", name: "OSHA 10", requiredLevel: 2, passingScore: 70 },
  { id: "osha30", name: "OSHA 30", requiredLevel: 4, passingScore: 70 },
  { id: "nate", name: "NATE", requiredLevel: 5, passingScore: 75 },
];

export function getCertification(id: CertificationId): Certification {
  return CERTIFICATIONS.find((c) => c.id === id) as Certification;
}

export function canAttempt(id: CertificationId, level: number): boolean {
  return level >= getCertification(id).requiredLevel;
}

export function awardCertification(
  earned: EarnedCertifications,
  id: CertificationId,
  score: number,
  level: number,
): { earned: EarnedCertifications; passed: boolean } {
  const cert = getCertification(id);
  if (earned[id]) return { earned, passed: true };
  if (level < cert.requiredLevel || score < cert.passingScore) return { earned, passed: false };
  return { earned: { ...earned, [id]: new Date().toISOString() }, passed: true };
}

export function earnedCount(earned: EarnedCertifications): number {
  return CERTIFICATIONS.filter((c) => earned[c.id]).length;
}
