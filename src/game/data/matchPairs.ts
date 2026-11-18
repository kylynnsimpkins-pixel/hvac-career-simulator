import type { StationKind } from "./labLayouts";
import { focusFor } from "./labGames";

export interface MatchPair {
  term: string;
  def: string;
}

export const MATCH_BANK: Partial<Record<StationKind, MatchPair[]>> = {
  meter: [
    { term: "Ohm", def: "Unit of resistance" },
    { term: "Amp", def: "Unit of current flow" },
    { term: "Volt", def: "Unit of electrical pressure" },
    { term: "OL on meter", def: "Open circuit / over range" },
  ],
  wiring: [
    { term: "Series circuit", def: "One path for current" },
    { term: "Parallel circuit", def: "Multiple paths for current" },
    { term: "Common (C)", def: "Return side of 24V control power" },
    { term: "Ground wire", def: "Safety path to earth" },
  ],
  panel: [
    { term: "Lockout/Tagout", def: "Keeps power off while you work" },
    { term: "Breaker", def: "Trips to protect against overload" },
    { term: "Disconnect", def: "Local switch to cut equipment power" },
    { term: "Contactor", def: "Relay that switches compressor power" },
  ],
  parts: [
    { term: "Capacitor", def: "Gives motors a starting/running boost" },
    { term: "Transformer", def: "Steps 240V/120V down to 24V" },
    { term: "Relay", def: "Low-voltage coil switching a circuit" },
    { term: "Fuse", def: "Sacrificial link that opens on overcurrent" },
  ],
  airflow: [
    { term: "CFM", def: "Cubic feet of air per minute" },
    { term: "Static pressure", def: "Resistance to airflow in ductwork" },
    { term: "Return air", def: "Air drawn back to the equipment" },
    { term: "Delta T", def: "Supply and return temperature difference" },
  ],
  thermostat: [
    { term: "R terminal", def: "24V power from the transformer" },
    { term: "W terminal", def: "Calls for heat" },
    { term: "Y terminal", def: "Calls for cooling" },
    { term: "G terminal", def: "Turns on the blower fan" },
  ],
  furnace: [
    { term: "Flame sensor", def: "Proves the burner flame is lit" },
    { term: "Limit switch", def: "Shuts the burner off when too hot" },
    { term: "Heat exchanger", def: "Keeps flue gas apart from supply air" },
    { term: "Inducer motor", def: "Draws combustion gases through the furnace" },
  ],
  workorder: [
    { term: "Work order", def: "Written record of the complaint and work done" },
    { term: "Customer complaint", def: "Where every diagnosis begins" },
    { term: "Follow-up call", def: "Confirms the repair held up" },
    { term: "Preventive maintenance", def: "Scheduled service to avoid breakdowns" },
  ],
  compressor: [
    { term: "Compressor", def: "Pumps refrigerant and raises its pressure" },
    { term: "Locked rotor amps", def: "Surge when a compressor tries to start" },
    { term: "Run capacitor", def: "Helps the compressor run efficiently" },
    { term: "Liquid slugging", def: "Liquid refrigerant entering the compressor" },
  ],
  gauges: [
    { term: "Low side (blue)", def: "Suction pressure gauge" },
    { term: "High side (red)", def: "Discharge pressure gauge" },
    { term: "Superheat", def: "Vapor temperature above saturation" },
    { term: "Subcooling", def: "Liquid temperature below saturation" },
  ],
  coil: [
    { term: "Evaporator", def: "Absorbs heat from indoor air" },
    { term: "Condenser", def: "Rejects heat to outdoor air" },
    { term: "Metering device", def: "Drops refrigerant pressure" },
    { term: "Frozen coil", def: "Often caused by low airflow or low charge" },
  ],
  recovery: [
    { term: "Recovery machine", def: "Removes refrigerant from a system" },
    { term: "Evacuation", def: "Pulling a deep vacuum to remove moisture" },
    { term: "Micron gauge", def: "Measures depth of vacuum" },
    { term: "Section 608", def: "EPA rule on handling refrigerants" },
  ],
};

/** Up to six pairs covering every topic in the day's lesson focus. */
export function matchRound(lesson: number): MatchPair[] {
  const kinds = focusFor(lesson).kinds;
  const pool = kinds.map((k) => [...(MATCH_BANK[k] ?? [])].sort(() => Math.random() - 0.5));
  const out: MatchPair[] = [];
  for (let i = 0; out.length < 6 && i < 4; i++) {
    for (const p of pool) {
      if (p[i] && out.length < 6) out.push(p[i]);
    }
  }
  return out;
}
