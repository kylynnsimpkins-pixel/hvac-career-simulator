export type CertificationId = "epa608" | "nate" | "osha10" | "osha30";

export interface Certification {
  id: CertificationId;
  /** Display name, also the value stored in SaveProfile.certifications. */
  name: string;
  requiredXp: number;
}
