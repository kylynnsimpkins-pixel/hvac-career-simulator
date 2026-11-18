import type { DialogueLine } from "./dialogue";
import { HOMEWORK, LESSON_PLANS } from "./dialogue";
import { LAB_LAYOUTS, type Station, type StationKind } from "./labLayouts";

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
  wiring: ["Multimeter", "Wire strippers", "Wire"],
  meter: ["Multimeter", "Wire"],
  panel: ["Multimeter", "Lockout kit"],
  parts: ["Multimeter", "Capacitor"],
  compressor: ["Gauge manifold", "Multimeter", "Capacitor"],
  gauges: ["Gauge manifold", "Air filter"],
  coil: ["Gauge manifold", "Multimeter", "Wire"],
  recovery: ["Gauge manifold", "Recovery cylinder"],
  airflow: ["Anemometer", "Air filter"],
  furnace: ["Multimeter", "Wire"],
  workorder: ["Multimeter", "Screwdriver set"],
  thermostat: ["Multimeter", "Screwdriver set"],
};

/** Only the replacement part is used up; measuring parts are never required. */
export const consumedParts = (kind: StationKind) => (REQUIRED_ITEMS[kind] ?? []).filter(isPart);

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
