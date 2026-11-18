import type { QuizQuestion } from "@/game/scenes/QuizBox";
import type { StationKind } from "./labLayouts";
import type { Reward } from "@/store/gameStore";

export type SiteKind = "Residential" | "Commercial";

/** [x, y, w, h, color, optional label] - solid furniture or equipment. */
export type Prop = [number, number, number, number, number, string?];

export interface Level {
  name: string;
  floor: number;
  wall: number;
  props: Prop[];
  /** Stairs/ladder to the next level up (marker position). */
  up?: { x: number; y: number; label: string };
  /** Stairs/ladder back down; arrival point when coming from below. */
  down?: { x: number; y: number; label: string };
  /** Equipment to service on this level. */
  unit?: { x: number; y: number; label: string };
  roof?: boolean;
}

export interface Site {
  id: string;
  name: string;
  kind: SiteKind;
  /** Position and look on the town map. */
  map: { x: number; y: number; w: number; h: number; wall: number; roof: number };
  complaint: string;
  /** Drag-and-drop diagnosis scenario used for the service call. */
  scenario: StationKind;
  question: QuizQuestion;
  reward: Reward;
  levels: Level[];
}

const home = (name: string, floor: number): Pick<Level, "name" | "floor" | "wall"> => ({ name, floor, wall: 0xe9dcc3 });

export const SITES: Site[] = [
  {
    id: "ranch",
    scenario: "parts",
    name: "One-Story Home",
    kind: "Residential",
    map: { x: 110, y: 330, w: 90, h: 56, wall: 0xe8c7a0, roof: 0x8b3a2f },
    complaint: "The AC is running but the house won't cool. Check the attic air handler, then the condenser on the roof.",
    question: {
      q: "Warm air, outdoor fan running, compressor silent and humming. What is the most likely cause?",
      choices: ["Dirty filter", "Failed run capacitor", "Low thermostat battery", "Closed supply vent"],
      answer: 1,
      why: "A humming compressor that will not start is a classic failed capacitor.",
    },
    reward: { xp: 60, contractorCredits: 20, money: 120, skill: "diagnostics", skillPoints: 1 },
    levels: [
      {
        ...home("Living Area", 0xb98550),
        props: [[140, 220, 130, 40, 0x6b8fb5, "Sofa"], [470, 230, 110, 60, 0xa66b3a, "Kitchen"], [320, 330, 70, 40, 0x8a5a2b, "Table"]],
        up: { x: 570, y: 120, label: "Attic ladder" },
      },
      {
        name: "Attic",
        floor: 0x8a6b45,
        wall: 0x5b4630,
        props: [[160, 250, 120, 50, 0x9aa5b1, "Air handler"], [450, 300, 90, 40, 0xc9b27c, "Insulation"], [330, 200, 70, 30, 0xb98550, "Boxes"]],
        down: { x: 70, y: 120, label: "Ladder down" },
        up: { x: 570, y: 120, label: "Roof hatch" },
      },
      {
        name: "Roof",
        floor: 0x4a4f57,
        wall: 0x87ceeb,
        roof: true,
        props: [[180, 270, 70, 40, 0x1f2937, "Vent stack"]],
        down: { x: 70, y: 120, label: "Hatch down" },
        unit: { x: 450, y: 260, label: "Condenser" },
      },
    ],
  },
  {
    id: "twostory",
    scenario: "airflow",
    name: "Two-Story Home",
    kind: "Residential",
    map: { x: 260, y: 330, w: 90, h: 76, wall: 0xb7d0c0, roof: 0x4a5a78 },
    complaint: "Upstairs is 10 degrees warmer than downstairs. Climb the stairs, check the attic, then inspect the rooftop unit.",
    question: {
      q: "The upstairs is always hotter than the downstairs. Which fix is most likely?",
      choices: ["Replace the thermostat", "Balance dampers and check attic duct leaks", "Add refrigerant", "Swap the contactor"],
      answer: 1,
      why: "Hot upper floors are usually airflow problems: duct leaks and unbalanced dampers.",
    },
    reward: { xp: 80, contractorCredits: 30, money: 160, skill: "diagnostics", skillPoints: 1 },
    levels: [
      {
        ...home("Downstairs", 0xb98550),
        props: [[150, 230, 120, 40, 0x7a9e7e, "Sofa"], [480, 230, 100, 60, 0xa66b3a, "Kitchen"], [330, 340, 70, 40, 0x8a5a2b, "Table"]],
        up: { x: 570, y: 120, label: "Stairs up" },
      },
      {
        ...home("Upstairs", 0xc9a47a),
        props: [[150, 230, 110, 60, 0xd1c4e9, "Bed"], [470, 240, 90, 50, 0x90a4ae, "Dresser"], [320, 360, 80, 36, 0x7986cb, "Rug"]],
        down: { x: 70, y: 120, label: "Stairs down" },
        up: { x: 570, y: 120, label: "Attic door" },
      },
      {
        name: "Attic",
        floor: 0x8a6b45,
        wall: 0x5b4630,
        props: [[160, 250, 120, 50, 0x9aa5b1, "Air handler"], [440, 300, 110, 40, 0xc9b27c, "Insulation"], [330, 200, 90, 30, 0xb98550, "Ductwork"]],
        down: { x: 70, y: 120, label: "Door down" },
        up: { x: 570, y: 120, label: "Roof access" },
      },
      {
        name: "Roof",
        floor: 0x4a4f57,
        wall: 0x87ceeb,
        roof: true,
        props: [[170, 280, 70, 40, 0x1f2937, "Chimney"]],
        down: { x: 70, y: 120, label: "Access down" },
        unit: { x: 450, y: 260, label: "Condenser" },
      },
    ],
  },
  {
    id: "grocery",
    scenario: "coil",
    name: "Grocery Store",
    kind: "Commercial",
    map: { x: 430, y: 190, w: 120, h: 60, wall: 0xd9d9d9, roof: 0x2f855a },
    complaint: "The produce cooler is warm. Go through the stockroom, climb the roof ladder and check the rooftop condenser.",
    question: {
      q: "A walk-in cooler is warm and the condenser coil is caked with debris. What do you do first?",
      choices: ["Add refrigerant", "Clean the condenser coil", "Replace the compressor", "Lower the setpoint"],
      answer: 1,
      why: "A dirty condenser raises head pressure and cuts capacity. Clean it before anything else.",
    },
    reward: { xp: 90, contractorCredits: 35, money: 220, skill: "mechanical", skillPoints: 1 },
    levels: [
      {
        name: "Sales Floor",
        floor: 0xe5e7eb,
        wall: 0xcbd5e1,
        props: [[130, 230, 130, 30, 0x4ade80, "Produce"], [320, 230, 90, 30, 0x60a5fa, "Dairy"], [500, 230, 110, 30, 0xfbbf24, "Bakery"], [200, 340, 160, 28, 0xa78bfa, "Aisle"], [470, 360, 100, 28, 0xf87171, "Checkout"]],
        up: { x: 570, y: 120, label: "Stockroom" },
      },
      {
        name: "Stockroom",
        floor: 0x9ca3af,
        wall: 0x6b7280,
        props: [[150, 230, 120, 40, 0xb45309, "Pallets"], [330, 220, 90, 40, 0x60a5fa, "Walk-in cooler"], [470, 330, 110, 30, 0xb45309, "Shelves"]],
        down: { x: 70, y: 120, label: "Sales floor" },
        up: { x: 570, y: 120, label: "Roof ladder" },
      },
      {
        name: "Roof",
        floor: 0x6b7280,
        wall: 0x87ceeb,
        roof: true,
        props: [[170, 260, 90, 50, 0xcbd5e1, "Exhaust fan"], [320, 340, 80, 40, 0xcbd5e1, "Vent"]],
        down: { x: 70, y: 120, label: "Ladder down" },
        unit: { x: 470, y: 260, label: "Rooftop condenser" },
      },
    ],
  },
  {
    id: "school",
    scenario: "thermostat",
    name: "School",
    kind: "Commercial",
    map: { x: 80, y: 190, w: 130, h: 60, wall: 0xc2410c, roof: 0x57534e },
    complaint: "Room 204 is stuffy and the kids are complaining. Head up to the second floor, then the roof to check the RTU.",
    question: {
      q: "A classroom rooftop unit blows warm air and the supply fan is running. What do you check first?",
      choices: ["Thermostat call and cooling stages", "Gym floor", "Fire alarm", "Paint color"],
      answer: 0,
      why: "Confirm the thermostat is calling for cooling and the stages are energizing before you dig deeper.",
    },
    reward: { xp: 90, contractorCredits: 35, money: 200, skill: "electrical", skillPoints: 1 },
    levels: [
      {
        name: "First Floor Hall",
        floor: 0xd6d3d1,
        wall: 0xf5deb3,
        props: [[140, 230, 60, 80, 0x3b82f6, "Lockers"], [260, 230, 60, 80, 0x3b82f6, "Lockers"], [440, 230, 100, 60, 0xb07a45, "Office"], [320, 360, 140, 30, 0xfcd34d, "Trophy case"]],
        up: { x: 570, y: 120, label: "Stairs up" },
      },
      {
        name: "Room 204",
        floor: 0xc9a47a,
        wall: 0xa9bdd0,
        props: [[150, 230, 50, 30, 0xb07a45, "Desks"], [250, 230, 50, 30, 0xb07a45, "Desks"], [150, 330, 50, 30, 0xb07a45, "Desks"], [250, 330, 50, 30, 0xb07a45, "Desks"], [470, 220, 100, 40, 0x166534, "Chalkboard"]],
        down: { x: 70, y: 120, label: "Stairs down" },
        up: { x: 570, y: 120, label: "Roof door" },
      },
      {
        name: "Roof",
        floor: 0x57534e,
        wall: 0x87ceeb,
        roof: true,
        props: [[170, 260, 80, 50, 0xcbd5e1, "Exhaust"], [320, 360, 80, 30, 0xcbd5e1, "Vent"]],
        down: { x: 70, y: 120, label: "Door down" },
        unit: { x: 470, y: 260, label: "Rooftop unit" },
      },
    ],
  },
  {
    id: "restaurant",
    scenario: "gauges",
    name: "Restaurant",
    kind: "Commercial",
    map: { x: 250, y: 190, w: 110, h: 56, wall: 0xf4a261, roof: 0x9d2c2c },
    complaint: "The dining room is hot and the kitchen hood is loud. Go through the kitchen, climb the ladder and check the roof unit.",
    question: {
      q: "A restaurant dining room is warm and the rooftop unit's filters are black with grease. What now?",
      choices: ["Replace or clean the filters", "Turn the thermostat down", "Close the hood", "Add oil"],
      answer: 0,
      why: "Clogged filters starve airflow, so the coil freezes and the room warms up.",
    },
    reward: { xp: 90, contractorCredits: 35, money: 210, skill: "customerService", skillPoints: 1 },
    levels: [
      {
        name: "Dining Room",
        floor: 0xa16207,
        wall: 0xf1d9b5,
        props: [[150, 240, 60, 40, 0xdc2626, "Booth"], [280, 240, 60, 40, 0xdc2626, "Booth"], [150, 350, 60, 40, 0xdc2626, "Booth"], [280, 350, 60, 40, 0xdc2626, "Booth"], [470, 360, 100, 30, 0x8a5a2b, "Host stand"]],
        up: { x: 570, y: 120, label: "Kitchen" },
      },
      {
        name: "Kitchen",
        floor: 0x94a3b8,
        wall: 0xe5e7eb,
        props: [[170, 230, 140, 40, 0xcbd5e1, "Range hood"], [400, 240, 100, 40, 0xcbd5e1, "Prep table"], [330, 350, 120, 30, 0xcbd5e1, "Dish pit"]],
        down: { x: 70, y: 120, label: "Dining room" },
        up: { x: 570, y: 120, label: "Roof ladder" },
      },
      {
        name: "Roof",
        floor: 0x57534e,
        wall: 0x87ceeb,
        roof: true,
        props: [[170, 260, 90, 50, 0x9ca3af, "Grease fan"]],
        down: { x: 70, y: 120, label: "Ladder down" },
        unit: { x: 470, y: 260, label: "Rooftop unit" },
      },
    ],
  },
];

export const ROUNDS = 5;

/** Round 1 keeps the original key so existing saves stay valid. */
export const jobKey = (siteId: string, round = 1) => (round <= 1 ? `job:${siteId}` : `job:${siteId}:${round}`);

/** Number of finished service calls (0 to ROUNDS) at a site. */
export const roundsDone = (done: string[], siteId: string) => {
  let n = 0;
  while (n < ROUNDS && done.includes(jobKey(siteId, n + 1))) n++;
  return n;
};

const ROUND_KINDS: StationKind[] = ["furnace", "thermostat", "meter", "airflow", "gauges", "wiring", "panel", "coil", "compressor", "recovery"];

/** Later rounds bring a different fault than the first call. */
export function scenarioFor(site: Site, round: number): StationKind {
  if (round <= 1) return site.scenario;
  const i = SITES.indexOf(site);
  return ROUND_KINDS[(i * 2 + round) % ROUND_KINDS.length];
}

export const COMPLAINTS = [
  "",
  "The customer called back with a new problem: the system is acting up again. Find out what is going on.",
  "Urgent callback: the customer says it is worse this week. Diagnose it carefully.",
  "Another visit: a different part of the system is now failing. Run a full diagnosis.",
  "Final callback: the customer wants a complete check-up and a clear explanation.",
];

const fq = (q: string, choices: string[], answer: number, why: string): QuizQuestion => ({ q, choices, answer, why });

export const FOLLOWUPS: QuizQuestion[] = [
  fq("The customer asks how often to change a 1-inch filter. What do you say?", ["Every 1-3 months", "Every 5 years", "Never", "Only when broken"], 0, "Typical 1-inch filters need changing every 1 to 3 months."),
  fq("The customer asks why the unit froze up. Most common reason?", ["Poor airflow or low charge", "Too clean a coil", "A new thermostat", "Cool weather only"], 0, "Low airflow or low charge drops coil temperature below freezing."),
  fq("The customer wants to cut their bill. A good suggestion is...", ["Annual tune-up and a programmable thermostat", "Block the vents", "Run the fan on high all night", "Remove the filter"], 0, "Maintenance and smart setbacks reduce energy use."),
  fq("The customer asks if it is safe to run the AC while it ices. You say...", ["Turn it off and let it thaw", "Keep running it", "Pour hot water on the compressor", "Close all vents"], 0, "Running an iced system can flood the compressor."),
  fq("The customer notices a burning smell at first heat of the season. Likely cause?", ["Dust burning off the heat exchanger", "A gas leak", "Refrigerant", "A bad capacitor only"], 0, "Dust burn-off is common; a gas smell is different and needs evacuation."),
  fq("Why should the customer keep the outdoor unit clear of plants?", ["Airflow across the condenser", "Looks", "Noise", "Sunlight"], 0, "Condensers need free airflow to reject heat."),
  fq("What does SEER measure?", ["Seasonal cooling efficiency", "Gas pressure", "Duct size", "Voltage"], 0, "SEER is Seasonal Energy Efficiency Ratio."),
  fq("The customer asks what a TXV does. You explain it...", ["Meters refrigerant to the evaporator", "Cleans air", "Reads amps", "Cools the compressor oil"], 0, "A thermostatic expansion valve meters refrigerant flow."),
  fq("The customer hears water dripping inside. Check first...", ["The condensate drain", "The compressor", "The thermostat battery", "The gas valve"], 0, "A clogged condensate drain overflows."),
  fq("The customer asks why the system short cycles. A common cause is...", ["An oversized unit or restricted airflow", "A clean filter", "Too much sunlight", "A full tank"], 0, "Oversizing and restrictions cut run cycles short."),
  fq("The customer asks if a higher MERV filter is always better. You say...", ["Not always, it can restrict airflow", "Yes, always", "Filters do nothing", "Only for gas heat"], 0, "Match the filter to what the system can handle."),
  fq("The customer asks why you need a permit. You explain...", ["It verifies the work meets code", "It raises your price", "It is optional decoration", "It is for the manufacturer"], 0, "Permits and inspections protect the home."),
  fq("The customer wants a CO detector recommendation. You say...", ["Install them near sleeping areas", "They are optional decoration", "Only in the attic", "Not needed with electric heat"], 0, "Place CO alarms outside bedrooms and on each level."),
];

export const followUpFor = (site: Site, round: number): QuizQuestion =>
  round <= 1 ? site.question : FOLLOWUPS[(SITES.indexOf(site) * 2 + round) % FOLLOWUPS.length];

export interface Address {
  street: string;
  customer: string;
  note: string;
}

/** What the work order says; the buildings on the town map only show their street address. */
export const ADDRESSES: Record<string, Address> = {
  ranch: { street: "412 Maple Lane", customer: "Ms. Patel", note: "One-story home, attic unit" },
  twostory: { street: "1208 Oak Street", customer: "The Johnson family", note: "Two-story home, bedroom hall" },
  grocery: { street: "88 Market Avenue", customer: "Fresh Mart manager", note: "Grocery store, rooftop unit" },
  school: { street: "300 Learning Way", customer: "Principal Davis", note: "School, classroom wing" },
  restaurant: { street: "52 Main Street", customer: "Rosa, owner", note: "Restaurant, kitchen rooftop unit" },
};

/** The site dispatch sends the tech to next: the unfinished site with the fewest calls done. */
export function assignedSite(done: string[]): Site | null {
  let best: Site | null = null;
  let bestN = ROUNDS;
  for (const s of SITES) {
    const n = roundsDone(done, s.id);
    if (n < bestN) {
      best = s;
      bestN = n;
    }
  }
  return best;
}
