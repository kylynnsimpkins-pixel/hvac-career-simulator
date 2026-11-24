import type { StationKind } from "./labLayouts";
import { VARIANTS } from "./scenarioVariants";

export interface Comp {
  id: string;
  name: string;
  look: string;
  tests: Record<string, string>;
}

export interface Quiz {
  q: string;
  choices: string[];
  answer: number;
}

export interface Scenario {
  title: string;
  symptom: string;
  comps: Comp[];
  fault: string;
  fix: string;
  done: string;
  quiz: Quiz;
}

type Base = Omit<Scenario, "quiz">;

const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const comp = (id: string, name: string, look: string, tests: Record<string, string> = {}): Comp => ({ id, name, look, tests });
const shuffled = (sc: Base): Base => ({ ...sc, comps: [...sc.comps].sort(() => Math.random() - 0.5) });

/** Tools each scenario needs on the belt: measuring tools plus the fix item. */
const BASE: Partial<Record<StationKind, () => Base>> = {
  meter: () =>
    shuffled({
      title: "NO-START: FOLLOW THE VOLTAGE",
      symptom: "AC is dead. The thermostat is calling for cool but nothing starts.",
      comps: [
        comp("disc", "Disconnect", "Pull-out is in. Looks fine.", { Multimeter: `${rnd(238, 246)} V on the line side. Power is present.` }),
        comp("pri", "Transformer primary", "No burn marks.", { Multimeter: "240 V in. Good." }),
        comp("sec", "Transformer secondary", "Clean terminals.", { Multimeter: `${rnd(24, 26)}.${rnd(0, 9)} V out. Transformer is good.` }),
        comp("wire", "Thermostat wire", "Insulation is cracked near the air handler.", { Multimeter: "OL: no continuity. The wire is broken inside." }),
      ],
      fault: "wire",
      fix: "Wire",
      done: "The control wire was open, so the 24 V call never arrived. Follow the voltage until it disappears.",
    }),
  parts: () =>
    shuffled({
      title: "FAN HUMS, WON'T SPIN",
      symptom: "Condenser fan hums but won't spin. Compressor is getting hot.",
      comps: [
        comp("cap", "Run capacitor", "Slightly domed top.", { Multimeter: `Rated 40 uF, reads ${rnd(24, 28)} uF. Far below -6%: weak.` }),
        comp("motor", "Fan motor", "Shaft turns freely by hand.", { Multimeter: "Windings read 3.2 ohm. Motor is good." }),
        comp("cont", "Contactor", "Contacts look clean.", { Multimeter: "240 V on the load side. Contacts are closing." }),
        comp("disc", "Disconnect", "Handle is in.", { Multimeter: "240 V present." }),
      ],
      fault: "cap",
      fix: "Capacitor",
      done: "A weak run capacitor can't start the motor. Always test it with a meter before replacing.",
    }),
  airflow: () =>
    shuffled({
      title: "WEAK AIRFLOW",
      symptom: "Weak air at the registers and the coil is icing up. Target is about 400 CFM per ton.",
      comps: [
        comp("filter", "Return filter", "Packed solid with dust and lint.", { Anemometer: `${rnd(80, 120)} CFM through the filter. Needs about 400.` }),
        comp("supply", "Supply register", "Very little air coming out.", { Anemometer: `${rnd(100, 140)} CFM. Low, but that's only a symptom. Find the cause.` }),
        comp("blower", "Blower wheel", "Clean and spinning.", { Anemometer: "Wheel spins at full speed. The restriction is not here." }),
        comp("duct", "Return duct", "No crushed sections.", { Anemometer: "Duct is clear." }),
      ],
      fault: "filter",
      fix: "Air filter",
      done: "A clogged filter starved the blower of air. Fix the cause, not the symptom at the register.",
    }),
  wiring: () =>
    shuffled({
      title: "THERMOSTAT HAS NO POWER",
      symptom: "New thermostat is dead. 24 V should be present between R and C.",
      comps: [
        comp("r", "R (red) wire", "Connected tightly.", { Multimeter: "24 V at R. Power side is good.", "Wire strippers": "Conductor is fine." }),
        comp("c", "C (blue) wire", "Cut halfway through the jacket near a staple.", { Multimeter: "OL: no continuity back to the transformer.", "Wire strippers": "Conductor is nicked clean through." }),
        comp("g", "G (green) wire", "Looks fine.", { Multimeter: "Continuity OK.", "Wire strippers": "Conductor is fine." }),
        comp("w", "W (white) wire", "Looks fine.", { Multimeter: "Continuity OK.", "Wire strippers": "Conductor is fine." }),
      ],
      fault: "c",
      fix: "Wire",
      done: "Cut out the damaged section, strip clean ends and splice in new wire. The common is restored.",
    }),
  thermostat: () =>
    shuffled({
      title: "NO COOLING CALL",
      symptom: "Heat works, but the AC never starts when the thermostat calls for cool.",
      comps: [
        comp("y", "Y terminal", "The wire is only half under the screw.", { Multimeter: "0 V between Y and C while calling for cool. The signal is not leaving." }),
        comp("r", "R terminal", "Tight.", { Multimeter: "24 V to C. Power is good." }),
        comp("w", "W terminal", "Tight.", { Multimeter: "24 V when heat is called. Heat circuit works." }),
        comp("g", "G terminal", "Tight.", { Multimeter: "Fan call comes through fine." }),
      ],
      fault: "y",
      fix: "Screwdriver set",
      done: "A loose Y terminal stopped the cooling call. Snug it down and the contactor pulls in.",
    }),
  panel: () =>
    shuffled({
      title: "MAKE IT SAFE FIRST",
      symptom: "You must replace the condenser fan motor. Make the equipment safe before touching it.",
      comps: [
        comp("breaker", "Breaker / disconnect", "Handle is ON.", { Multimeter: "240 V on the line side." }),
        comp("motor", "Fan motor", "Wired to the contactor.", { Multimeter: "240 V is LIVE here. Not safe to touch!" }),
        comp("cont", "Contactor", "Looks normal.", { Multimeter: "240 V at the line lugs. Still energized." }),
        comp("cap", "Capacitor", "Can hold a charge even with power off.", { Multimeter: "Treat it as live until discharged." }),
      ],
      fault: "breaker",
      fix: "Lockout kit",
      done: "Breaker off, lock and tag on, then verify dead with the meter before you touch anything.",
    }),
  furnace: () =>
    shuffled({
      title: "NO HEAT",
      symptom: "Furnace has no heat. The inducer motor never starts.",
      comps: [
        comp("xfmr", "Transformer", "Clean.", { Multimeter: "24.5 V out. Good." }),
        comp("door", "Door switch wiring", "Harness is pinched under the panel.", { Multimeter: "OL: the wire to the door switch is open." }),
        comp("inducer", "Inducer motor", "Spins freely by hand.", { Multimeter: "0 V at the motor. It is not getting a call." }),
        comp("valve", "Gas valve", "Closed, as expected.", { Multimeter: "0 V. The valve waits for the inducer to prove airflow." }),
      ],
      fault: "door",
      fix: "Wire",
      done: "The pinched wire broke the safety circuit. Check simple things first and follow the circuit.",
    }),
  workorder: () =>
    shuffled({
      title: "WORK ORDER: NOT COOLING",
      symptom: "Customer says the AC isn't cooling. Thermostat calls and the breaker is on.",
      comps: [
        comp("stat", "Thermostat", "Display shows COOL calling.", { Multimeter: "24 V at Y. The call leaves the thermostat." }),
        comp("cont", "Contactor", "Burn mark around a load lug. The lug is loose.", { Multimeter: `Coil is pulled in but only ${rnd(185, 195)} V on the load side: voltage drop.` }),
        comp("fan", "Condenser fan", "Not moving.", { Multimeter: "Low voltage here. It's a symptom, not the cause." }),
        comp("breaker", "Breaker", "ON.", { Multimeter: "240 V at the breaker. Good." }),
      ],
      fault: "cont",
      fix: "Screwdriver set",
      done: "A loose lug caused a voltage drop and heat. Tighten it, then document the repair on the work order.",
    }),
  compressor: () =>
    shuffled({
      title: "COMPRESSOR HUMS, NO COOLING",
      symptom: "Compressor hums and trips, and there is no cooling.",
      comps: [
        comp("suction", "Suction port", "Gauge hose connected.", { "Gauge manifold": `${rnd(118, 128)} psi. Pressures are equalized: the compressor isn't pumping.` }),
        comp("disch", "Discharge port", "Gauge hose connected.", { "Gauge manifold": `${rnd(118, 128)} psi, same as suction. No pressure difference.` }),
        comp("cap", "Run capacitor", "Top is bulged.", { Multimeter: "Rated 45 uF, reads 28 uF. Weak." }),
        comp("comp", "Compressor", "Warm and humming.", { Multimeter: "Windings measure normal. The compressor itself is fine." }),
      ],
      fault: "cap",
      fix: "Capacitor",
      done: "Equal pressures plus a hum means the compressor can't start. The weak capacitor was the cause.",
    }),
  gauges: () =>
    shuffled({
      title: "LOW PRESSURES, FROSTING COIL",
      symptom: "Cooling is weak and the evaporator is frosting up.",
      comps: [
        comp("suction", "Suction port", "Gauge hose connected.", { "Gauge manifold": `${rnd(52, 60)} psi. Far below normal for R-410A (about 118).` }),
        comp("disch", "Discharge port", "Gauge hose connected.", { "Gauge manifold": `${rnd(210, 235)} psi. Low, because the load is low.` }),
        comp("coil", "Evaporator coil", "Frost on the coil face.", { "Gauge manifold": "Low suction means low heat load: think restricted airflow before low charge." }),
        comp("filter", "Return filter", "Solid gray with dirt.", {}),
      ],
      fault: "filter",
      fix: "Air filter",
      done: "Low suction with a frosting coil points to airflow. A dirty filter was starving the coil.",
    }),
  coil: () =>
    shuffled({
      title: "ICED EVAPORATOR",
      symptom: "Weak cooling and the evaporator is icing. The blower isn't running.",
      comps: [
        comp("suction", "Suction port", "Gauge hose connected.", { "Gauge manifold": `${rnd(50, 58)} psi and only 2 F superheat. The coil is starved of air.` }),
        comp("blower", "Blower motor", "Not turning.", { Multimeter: "0 V at the motor leads." }),
        comp("lead", "Blower power lead", "Burned end at the connector.", { Multimeter: "OL: the lead is open." }),
        comp("xfmr", "Transformer", "Clean.", { Multimeter: "24 V. Good." }),
      ],
      fault: "lead",
      fix: "Wire",
      done: "Low superheat plus no blower: the burned lead cut power to the blower. Repair it and the coil thaws.",
    }),
  recovery: () =>
    shuffled({
      title: "RECOVER BEFORE YOU REPAIR",
      symptom: "The system must be opened for repair. Recover the refrigerant first.",
      comps: [
        comp("port", "System service port", "Core is intact.", { "Gauge manifold": `${rnd(115, 125)} psi. The system is still charged.` }),
        comp("hose", "Hoses", "Connected but not purged.", { "Gauge manifold": "Air is trapped in the lines. Purge before recovery." }),
        comp("scale", "Recovery scale", "Zeroed.", {}),
        comp("cond", "Condenser", "Clean.", {}),
      ],
      fault: "port",
      fix: "Recovery cylinder",
      done: "Never vent refrigerant. The gauges show it is charged, so recover it into a cylinder first.",
    }),
};

const QUESTIONS: Partial<Record<StationKind, Quiz>> = {
  meter: { q: "The primary shows 240 V but the thermostat wire has no continuity. Where is the fault?", choices: ["In the open control wire", "In the transformer primary", "At the disconnect"], answer: 0 },
  parts: { q: "A 40 uF capacitor reads about 26 uF. What is the verdict?", choices: ["Weak, replace it", "Good, within tolerance", "Shorted to ground"], answer: 0 },
  airflow: { q: "How much airflow does a 3-ton system need (400 CFM per ton)?", choices: ["1200 CFM", "800 CFM", "400 CFM"], answer: 0 },
  wiring: { q: "Which thermostat wire carries 24 V common?", choices: ["Blue (C)", "Red (R)", "Green (G)"], answer: 0 },
  thermostat: { q: "Which terminal sends the cooling call?", choices: ["Y", "W", "G"], answer: 0 },
  panel: { q: "What do you do right after locking out the breaker?", choices: ["Verify dead with a meter", "Start the repair", "Remove the lock"], answer: 0 },
  furnace: { q: "When a furnace has no heat, what do you check first?", choices: ["Power and the simple controls", "Replace the gas valve", "Replace the board"], answer: 0 },
  workorder: { q: "What causes a voltage drop and heat at a loose lug?", choices: ["High resistance at the connection", "Too much refrigerant", "A dirty filter"], answer: 0 },
  compressor: { q: "Equal high and low pressures with a humming compressor means what?", choices: ["It is not starting or pumping", "The charge is perfect", "The coil is clean"], answer: 0 },
  gauges: { q: "Low suction pressure with a frosting coil most often points to what?", choices: ["Restricted airflow", "Overcharge", "A good system"], answer: 0 },
  coil: { q: "Superheat is very low and the coil is icing. What is likely?", choices: ["Not enough airflow across the coil", "Too much heat load", "Overheated compressor"], answer: 0 },
  recovery: { q: "What must you do with refrigerant before opening a charged system?", choices: ["Recover it into a cylinder", "Vent it outside", "Leave it and cut the line"], answer: 0 },
};

/** `variant` picks one of the cases for this station type; each has its own quiz question. */
export const SCENARIOS: Partial<Record<StationKind, (variant?: number) => Scenario>> = Object.fromEntries(
  (Object.keys(BASE) as StationKind[]).map((k) => [
    k,
    (variant = 0) => {
      const extra = VARIANTS[k] ?? [];
      const i = Math.abs(variant) % (extra.length + 1);
      return i === 0 ? { ...BASE[k]!(), quiz: QUESTIONS[k]! } : extra[i - 1]();
    },
  ]),
);
