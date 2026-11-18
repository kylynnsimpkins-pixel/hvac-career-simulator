export type CertificationId = "epa608" | "nate" | "osha10" | "osha30";

export interface Certification {
  id: CertificationId;
  name: string;
  requiredLevel: number;
  passingScore: number;
}

export type EarnedCertifications = Partial<Record<CertificationId, string>>;
