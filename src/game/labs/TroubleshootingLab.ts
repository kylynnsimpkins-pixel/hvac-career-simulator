export interface Fault {
  id: string;
  symptom: string;
  cause: string;
}

/** Lab: diagnose a fault from its symptom. */
export class TroubleshootingLab {
  constructor(private readonly faults: Fault[]) {}

  random(): Fault {
    return this.faults[Math.floor(Math.random() * this.faults.length)];
  }

  diagnose(fault: Fault, guessedCause: string): boolean {
    return fault.cause.toLowerCase() === guessedCause.toLowerCase();
  }
}
