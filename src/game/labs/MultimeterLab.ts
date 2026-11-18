/** Lab: take a meter reading and compare it to the expected value. */
export class MultimeterLab {
  constructor(private readonly expected: number, private readonly tolerance = 0.1) {}

  isWithinTolerance(reading: number): boolean {
    return Math.abs(reading - this.expected) <= this.expected * this.tolerance;
  }
}
