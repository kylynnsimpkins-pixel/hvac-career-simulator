export interface WiringConnection {
  from: string;
  to: string;
}

/** Lab: connect components with the correct wiring. */
export class WiringLab {
  constructor(private readonly solution: WiringConnection[]) {}

  check(attempt: WiringConnection[]): boolean {
    const key = (c: WiringConnection) => [c.from, c.to].sort().join("-");
    const want = new Set(this.solution.map(key));
    const got = new Set(attempt.map(key));
    return want.size === got.size && [...want].every((k) => got.has(k));
  }
}
