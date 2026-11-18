/** Superheat = suction line temp - evaporator saturation temp (°F). */
export function superheat(suctionLineTemp: number, satTemp: number): number {
  return suctionLineTemp - satTemp;
}

/** Subcooling = condenser saturation temp - liquid line temp (°F). */
export function subcooling(satTemp: number, liquidLineTemp: number): number {
  return satTemp - liquidLineTemp;
}

/** Ohm's law: voltage from current and resistance. */
export function voltage(amps: number, ohms: number): number {
  return amps * ohms;
}

/** Sensible heat formula: BTU/hr = 1.08 x CFM x delta T. */
export function sensibleBtuh(cfm: number, deltaT: number): number {
  return 1.08 * cfm * deltaT;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function percent(part: number, total: number): number {
  return total <= 0 ? 0 : clamp(Math.round((part / total) * 100), 0, 100);
}
