/** Lab: evacuation / charging steps in the correct order. */
export class RefrigerationLab {
  static readonly STEPS = ["recover", "evacuate", "leak-check", "charge", "verify"];
  private index = 0;

  step(action: string): boolean {
    if (RefrigerationLab.STEPS[this.index] !== action) return false;
    this.index += 1;
    return true;
  }

  get complete(): boolean {
    return this.index === RefrigerationLab.STEPS.length;
  }
}
