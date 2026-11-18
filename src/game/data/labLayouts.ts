export type StationKind =
  | "wiring" | "meter" | "panel" | "parts"
  | "compressor" | "gauges" | "recovery" | "coil"
  | "furnace" | "thermostat" | "airflow" | "workorder";

export interface Station {
  id: string;
  name: string;
  kind: StationKind;
  x: number;
  y: number;
  w: number;
  lines: string[];
}

export interface LabLayout {
  title: string;
  floor: number;
  floorLine: number;
  wall: number;
  trim: number;
  stations: Station[];
}

const BACK_Y = 205;
const MID_Y = 340;

export const LAB_LAYOUTS: Record<string, LabLayout> = {
  "Electrical Lab": {
    title: "ELECTRICAL LAB",
    floor: 0x8d949c,
    floorLine: 0x747b83,
    wall: 0xc9ced6,
    trim: 0xe0a800,
    stations: [
      { id: "wiring", name: "Wiring Bench", kind: "wiring", x: 95, y: BACK_Y, w: 110, lines: ["Wiring Bench: build control circuits here. Match wire colors to terminals and always de-energize first."] },
      { id: "meter", name: "Multimeter Station", kind: "meter", x: 235, y: BACK_Y, w: 110, lines: ["Multimeter Station: practice reading volts, amps and ohms. Meter first, then power."] },
      { id: "panel", name: "Breaker Panel", kind: "panel", x: 405, y: BACK_Y, w: 110, lines: ["Breaker Panel: lockout/tagout before touching anything. Verify dead with your meter."] },
      { id: "parts", name: "Parts Cabinet", kind: "parts", x: 545, y: BACK_Y, w: 110, lines: ["Parts Cabinet: capacitors, contactors and relays. Match the rating on the old part."] },
      { id: "xformer", name: "Transformer Rack", kind: "panel", x: 140, y: MID_Y, w: 100, lines: ["Transformer Rack: step 240V down to 24V for the control circuit."] },
      { id: "motor", name: "Motor Test Bench", kind: "airflow", x: 500, y: MID_Y, w: 100, lines: ["Motor Test Bench: check windings, run capacitor and amp draw on fan motors."] },
    ],
  },
  "Refrigeration Lab": {
    title: "REFRIGERATION LAB",
    floor: 0xa9c3cf,
    floorLine: 0x8caab8,
    wall: 0xd7e6ee,
    trim: 0x1aa3b8,
    stations: [
      { id: "compressor", name: "Compressor Rack", kind: "compressor", x: 95, y: BACK_Y, w: 110, lines: ["Compressor Rack: the heart of the system. It raises refrigerant pressure and temperature."] },
      { id: "gauges", name: "Gauge Manifold Station", kind: "gauges", x: 235, y: BACK_Y, w: 110, lines: ["Gauge Manifold: blue is low side, red is high side. Read pressures before adding charge."] },
      { id: "coil", name: "Evaporator Coil Trainer", kind: "coil", x: 405, y: BACK_Y, w: 110, lines: ["Evaporator Coil: refrigerant absorbs heat here. Check superheat to confirm proper charge."] },
      { id: "condenser", name: "Condenser Trainer", kind: "airflow", x: 545, y: BACK_Y, w: 110, lines: ["Condenser: rejects heat outdoors. Dirty coils mean high head pressure."] },
      { id: "recovery", name: "Recovery Machine", kind: "recovery", x: 140, y: MID_Y, w: 100, lines: ["Recovery Machine: never vent refrigerant. Recover it into a certified cylinder."] },
      { id: "parts", name: "Tool and Parts Cart", kind: "parts", x: 500, y: MID_Y, w: 100, lines: ["Tool Cart: flare tools, tubing cutters, nitrogen and a vacuum pump live here."] },
    ],
  },
  Troubleshooting: {
    title: "TROUBLESHOOTING CENTER",
    floor: 0xb9a48f,
    floorLine: 0x9c8872,
    wall: 0xe0cdb9,
    trim: 0xc23b3b,
    stations: [
      { id: "workorder", name: "Work Order Desk", kind: "workorder", x: 95, y: BACK_Y, w: 110, lines: ["Work Order Desk: read the customer complaint first. Good diagnosis starts with good questions."] },
      { id: "furnace", name: "Furnace Trainer", kind: "furnace", x: 235, y: BACK_Y, w: 110, lines: ["Furnace Trainer: no heat? Check power, thermostat call, ignition, then gas."] },
      { id: "thermostat", name: "Thermostat Wall", kind: "thermostat", x: 405, y: BACK_Y, w: 110, lines: ["Thermostat Wall: practice R, W, Y, G and C wiring and test for a 24V call."] },
      { id: "airflow", name: "Airflow Station", kind: "airflow", x: 545, y: BACK_Y, w: 110, lines: ["Airflow Station: dirty filters and weak blowers cause many 'no cooling' calls."] },
      { id: "meter", name: "Diagnostic Meter Bench", kind: "meter", x: 140, y: MID_Y, w: 100, lines: ["Diagnostic Bench: power, controls, then the load. Let your meter find the fault."] },
      { id: "compressor", name: "Fault Trainer Rig", kind: "compressor", x: 500, y: MID_Y, w: 100, lines: ["Fault Trainer Rig: the instructor plants a fault and you track it down step by step."] },
    ],
  },
};
