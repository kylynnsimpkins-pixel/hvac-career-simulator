import type { DialogueLine } from "./dialogue";
import { HOMEWORK, LESSON_PLANS } from "./dialogue";
import { LAB_LAYOUTS, type Station, type StationKind } from "./labLayouts";
import type { QuizQuestion } from "@/game/scenes/QuizBox";

export const INSTRUCTOR = "Mr. Rivera";

export interface LessonFocus {
  kinds: StationKind[];
  lab: string;
}

/** Which stations (by kind) support each lesson plan, and the lab that hosts them best. */
export const LESSON_FOCUS: LessonFocus[] = [
  { kinds: ["wiring", "meter", "panel"], lab: "Electrical Lab" },
  { kinds: ["compressor", "gauges", "coil", "recovery"], lab: "Refrigeration Lab" },
  { kinds: ["meter", "parts"], lab: "Electrical Lab" },
  { kinds: ["airflow"], lab: "Troubleshooting" },
  { kinds: ["workorder", "furnace", "thermostat", "meter"], lab: "Troubleshooting" },
];

export const focusFor = (lesson: number) => LESSON_FOCUS[lesson % LESSON_FOCUS.length];
export const planFor = (lesson: number) => LESSON_PLANS[lesson % LESSON_PLANS.length];

export interface CribItem {
  name: string;
  type: "tool" | "part";
}

export const CRIB_ITEMS: CribItem[] = [
  { name: "Multimeter", type: "tool" },
  { name: "Wire strippers", type: "tool" },
  { name: "Screwdriver set", type: "tool" },
  { name: "Lockout kit", type: "tool" },
  { name: "Gauge manifold", type: "tool" },
  { name: "Recovery cylinder", type: "tool" },
  { name: "Anemometer", type: "tool" },
  { name: "Wire", type: "part" },
  { name: "Capacitor", type: "part" },
  { name: "Air filter", type: "part" },
];

const isPart = (name: string) => CRIB_ITEMS.find((i) => i.name === name)?.type === "part";

/** Items that must be checked out before a station's mini game can start. */
export const REQUIRED_ITEMS: Partial<Record<StationKind, string[]>> = {
  wiring: ["Wire strippers", "Wire"],
  meter: ["Multimeter"],
  panel: ["Lockout kit"],
  parts: ["Multimeter", "Capacitor"],
  compressor: ["Gauge manifold"],
  gauges: ["Gauge manifold"],
  coil: ["Gauge manifold"],
  recovery: ["Recovery cylinder"],
  airflow: ["Anemometer", "Air filter"],
  furnace: ["Multimeter"],
  thermostat: ["Screwdriver set"],
};

export const consumedParts = (kind: StationKind) => (REQUIRED_ITEMS[kind] ?? []).filter(isPart);

export type GameDef =
  | { type: "sequence"; title: string; prompt: string; steps: string[] }
  | { type: "match"; title: string; prompt: string; pairs: [string, string][] }
  | { type: "quiz"; title: string; make: () => QuizQuestion[] };

const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T,>(arr: T[]) => arr[rnd(0, arr.length - 1)];

function numeric(q: string, correct: number, unit: string, why: string): QuizQuestion {
  const set = new Set<number>([correct]);
  const candidates = [correct * 2, Math.max(1, Math.round(correct / 2)), correct + rnd(2, 6), Math.max(1, correct - rnd(2, 6)), correct * 3];
  for (const c of candidates) if (set.size < 4) set.add(c);
  const choices = [...set].sort(() => Math.random() - 0.5);
  return { q, choices: choices.map((c) => `${c} ${unit}`), answer: choices.indexOf(correct), why };
}

const meterQuiz = (): QuizQuestion[] =>
  [0, 1, 2].map(() => {
    const v = pick([24, 120, 240]);
    const r = pick([6, 8, 10, 12, 24].filter((x) => (v / x) % 1 === 0));
    const i = v / r;
    return pick([
      () => numeric(`A circuit has ${v} V across ${r} ohms. What current flows?`, i, "A", `I = V / R = ${v} / ${r} = ${i} amps.`),
      () => numeric(`A load draws ${i} A on ${r} ohms. What is the voltage?`, v, "V", `V = I x R = ${i} x ${r} = ${v} volts.`),
      () => numeric(`${v} V and ${i} A: what is the resistance?`, r, "ohms", `R = V / I = ${v} / ${i} = ${r} ohms.`),
    ])();
  });

const capacitorQuiz = (): QuizQuestion[] =>
  [0, 1, 2].map(() => {
    const rated = pick([35, 40, 45]);
    const good = Math.random() < 0.5;
    const tol = rated * 0.06;
    const measured = good ? Math.round((rated - tol + Math.random() * tol * 2) * 10) / 10 : Math.round(rated * (0.7 + Math.random() * 0.15) * 10) / 10;
    const ok = Math.abs(measured - rated) <= tol;
    return {
      q: `Run capacitor rated ${rated} uF, +/-6%. Your meter reads ${measured} uF. What is the verdict?`,
      choices: ["Good, within tolerance", "Weak, replace it"],
      answer: ok ? 0 : 1,
      why: `Allowed range is ${(rated - tol).toFixed(1)} to ${(rated + tol).toFixed(1)} uF.`,
    };
  });

const superheatQuiz = (): QuizQuestion[] =>
  [0, 1, 2].map(() => {
    const sat = pick([36, 38, 40, 42]);
    const line = sat + rnd(8, 16);
    return numeric(`Suction line reads ${line} F and the saturation temp is ${sat} F. What is the superheat?`, line - sat, "F", `Superheat = line temp - saturation temp = ${line} - ${sat}.`);
  });

const cfmQuiz = (): QuizQuestion[] =>
  [2, 3, 4].map((t) => numeric(`A ${t}-ton system needs about how much airflow (400 CFM per ton)?`, t * 400, "CFM", `${t} x 400 = ${t * 400} CFM.`));

export const GAMES: Partial<Record<StationKind, GameDef>> = {
  wiring: {
    type: "match",
    title: "WIRING BENCH",
    prompt: "Match each wire to its terminal. Tap a wire, then a terminal.",
    pairs: [["Red wire", "24V power (R)"], ["Blue wire", "Common (C)"], ["Green wire", "Ground"], ["White wire", "Neutral"]],
  },
  gauges: {
    type: "match",
    title: "GAUGE MANIFOLD",
    prompt: "Match each gauge part to what it does.",
    pairs: [["Blue gauge", "Low side"], ["Red gauge", "High side"], ["Yellow hose", "Charging line"], ["Suction line", "Larger, cooler line"]],
  },
  thermostat: {
    type: "match",
    title: "THERMOSTAT WIRING",
    prompt: "Match each thermostat terminal to its function.",
    pairs: [["R", "24V power"], ["W", "Heat call"], ["Y", "Cooling call"], ["G", "Fan call"]],
  },
  panel: {
    type: "sequence",
    title: "LOCKOUT / TAGOUT",
    prompt: "Put the lockout steps in the right order.",
    steps: ["Notify others", "Shut off the breaker", "Apply lock and tag", "Verify dead with a meter"],
  },
  furnace: {
    type: "sequence",
    title: "NO-HEAT DIAGNOSIS",
    prompt: "Check things in the right order, simplest first.",
    steps: ["Check power", "Check thermostat call", "Check ignition", "Check gas valve"],
  },
  workorder: {
    type: "sequence",
    title: "SERVICE CALL",
    prompt: "Order the steps of a good service call.",
    steps: ["Hear the complaint", "Check power", "Check controls", "Check the load", "Document the repair"],
  },
  compressor: {
    type: "sequence",
    title: "REFRIGERATION CYCLE",
    prompt: "Follow the refrigerant: start at the compressor.",
    steps: ["Compressor", "Condenser", "Metering device", "Evaporator"],
  },
  recovery: {
    type: "sequence",
    title: "REFRIGERANT RECOVERY",
    prompt: "Order the recovery steps.",
    steps: ["Connect hoses", "Purge the hoses", "Start recovery", "Close valves and weigh cylinder"],
  },
  meter: { type: "quiz", title: "MULTIMETER: OHM'S LAW", make: meterQuiz },
  parts: { type: "quiz", title: "CAPACITOR TEST", make: capacitorQuiz },
  coil: { type: "quiz", title: "SUPERHEAT CHECK", make: superheatQuiz },
  airflow: { type: "quiz", title: "AIRFLOW (CFM)", make: cfmQuiz },
};

export const stationKey = (lesson: number, lab: string, id: string) => `${lesson}:${lab}:${id}`;

const relevantIn = (lab: string, kinds: StationKind[]) => LAB_LAYOUTS[lab].stations.filter((s) => kinds.includes(s.kind));

/** Where the student should go for today's lesson, preferring the current lab. */
export function findTarget(currentLab: string, lesson: number): { lab: string; station: Station } | null {
  const focus = focusFor(lesson);
  for (const lab of [currentLab, focus.lab, ...Object.keys(LAB_LAYOUTS)]) {
    const s = relevantIn(lab, focus.kinds)[0];
    if (s) return { lab, station: s };
  }
  return null;
}

const say = (text: string): DialogueLine => ({ speaker: INSTRUCTOR, text });

export function labGreeting(lab: string, lessonDay: number): DialogueLine[] {
  if (lessonDay <= 0) return [say("You haven't had class yet. Head to the Classroom for today's lesson first, then come back here.")];
  const lesson = lessonDay - 1;
  const focus = focusFor(lesson);
  const here = relevantIn(lab, focus.kinds);
  const plan = planFor(lesson);
  if (here.length === 0) {
    const t = findTarget(lab, lesson);
    return [say(`Today's lesson is ${plan.title}. Nothing here supports it. Head to the ${t?.lab ?? focus.lab}${t ? `, and visit the ${t.station.name}` : ""}.`)];
  }
  const needed = [...new Set(here.flatMap((s) => REQUIRED_ITEMS[s.kind] ?? []))];
  return [
    say(`Today's lesson is ${plan.title}. Your stations here: ${here.map((s) => s.name).join(", ")}.`),
    say(`Assignments: ${HOMEWORK[lesson % HOMEWORK.length].join(" and ")}.`),
    say(`Check out what you need from the Tool Crib first: ${needed.join(", ")}.`),
  ];
}

export function redirectLines(lab: string, lesson: number, station: Station): DialogueLine[] {
  const plan = planFor(lesson);
  const t = findTarget(lab, lesson);
  const where = t ? (t.lab === lab ? `the ${t.station.name} here` : `the ${t.station.name} in the ${t.lab}`) : "the right station";
  return [say(`${station.name} isn't part of today's lesson, ${plan.title}. Head to ${where} instead.`)];
}

export function missingItemLines(missing: string[]): DialogueLine[] {
  return [say(`You still need ${missing.join(" and ")}. Check ${missing.length > 1 ? "them" : "it"} out from the Tool Crib first.`)];
}
