import { MORE_CONTENT, MORE_HOMEWORK, MORE_PLANS } from "./curriculum";
import { EXTRA_CONTENT, EXTRA_HOMEWORK, EXTRA_PLANS } from "./curriculum2";
import type { QuizQuestion } from "@/game/scenes/QuizBox";

export interface DialogueLine {
  speaker: string;
  text: string;
}

const TEACHER = "Mr. Simpkins";
const say = (text: string): DialogueLine => ({ speaker: TEACHER, text });

export const INTRO: DialogueLine[] = [
  say("Welcome to HVAC Tech Academy, {name}! I'm Mr. Simpkins, your lead instructor."),
  say("Heating, cooling and refrigeration keep homes, hospitals and grocery stores running. Good technicians are always in demand."),
  say("Here's how it works: walk through the campus and step on the yellow arrow at a building's door."),
  say("The Classroom is where we go over each day's lesson plan. The labs are where you get hands-on and earn XP, credits and cash."),
  say("Earn 1000 graduation points to graduate, then take the placement exam and pick a career path."),
  say("Your toolbelt, skill tree and quests are in the menu at the top. Ready? Head into the Classroom for your first lesson!"),
];

export interface LessonPlan {
  title: string;
  agenda: string[];
  tip: string;
}

export const LESSON_PLANS: LessonPlan[] = [
  {
    title: "Electrical Basics",
    agenda: ["Voltage, current and resistance", "Ohm's law: V = I x R", "Reading a wiring diagram"],
    tip: "Always lock out and tag out before touching a circuit.",
  },
  {
    title: "The Refrigeration Cycle",
    agenda: ["Compressor, condenser, metering device, evaporator", "Where refrigerant changes state", "Superheat and subcooling"],
    tip: "Heat moves from where you don't want it to where you do not mind it.",
  },
  {
    title: "Using a Multimeter",
    agenda: ["Measuring volts, amps and ohms", "Testing a capacitor and contactor", "Safe meter placement"],
    tip: "Check your meter on a known live source before trusting it.",
  },
  {
    title: "Airflow and Comfort",
    agenda: ["CFM and static pressure", "Filters, ducts and blower motors", "Why airflow problems look like refrigerant problems"],
    tip: "A dirty filter causes more service calls than almost anything else.",
  },
  {
    title: "Troubleshooting Method",
    agenda: ["Gather the customer's complaint", "Check power, then controls, then the load", "Document what you found"],
    tip: "Work from the simplest cause to the most complex.",
  },
];

export const HOMEWORK: string[][] = [
  ["Worksheet: 5 Ohm's law problems", "Label a wiring diagram"],
  ["Draw the refrigeration cycle", "Quiz: state changes"],
  ["Lab report: meter readings", "Practice: read 3 meter scales"],
  ["Calculate CFM for a 3-ton system", "Read: duct basics"],
  ["Write a 5-step service checklist", "Case study: no-cool call"],
];

export interface LessonContent {
  lecture: string[];
  example: string[];
  quiz: QuizQuestion[];
}

export const LESSON_CONTENT: LessonContent[] = [
  {
    lecture: [
      "Voltage is the electrical pressure, measured in volts. Current is the flow, measured in amps. Resistance opposes flow, measured in ohms.",
      "Ohm's law ties them together: V = I x R. Know any two values and you can find the third.",
    ],
    example: ["Example: a heater element draws 10 amps on a 240 volt circuit. Resistance = 240 / 10 = 24 ohms."],
    quiz: [
      { q: "What does Ohm's law state?", choices: ["V = I x R", "V = I + R", "R = V x I", "I = R / V"], answer: 0, why: "Voltage equals current times resistance." },
      { q: "A circuit has 120 V and 6 ohms. How many amps flow?", choices: ["10 A", "20 A", "720 A", "0.05 A"], answer: 1, why: "I = V / R = 120 / 6 = 20 amps." },
      { q: "What do you do before touching a circuit?", choices: ["Wear a watch", "Lock out and tag out", "Guess it's off", "Use wet gloves"], answer: 1, why: "Lockout/tagout keeps the circuit de-energized while you work." },
    ],
  },
  {
    lecture: [
      "The cycle has four parts. The compressor squeezes refrigerant vapor. The condenser rejects heat and turns it to liquid.",
      "The metering device drops the pressure. The evaporator absorbs heat as the liquid boils back into vapor.",
    ],
    example: ["Example: the warm line outside the house is the condenser side. The cold coil inside above the furnace is the evaporator."],
    quiz: [
      { q: "Which part raises refrigerant pressure?", choices: ["Evaporator", "Compressor", "Filter", "Thermostat"], answer: 1, why: "The compressor pumps vapor to high pressure and temperature." },
      { q: "Where does refrigerant absorb heat from the room?", choices: ["Condenser", "Compressor", "Evaporator", "Liquid line"], answer: 2, why: "The evaporator boils refrigerant, which absorbs heat." },
      { q: "What does the metering device do?", choices: ["Drops pressure", "Adds oil", "Cleans air", "Measures amps"], answer: 0, why: "It restricts flow so pressure and temperature drop." },
    ],
  },
  {
    lecture: [
      "A multimeter measures volts, amps and ohms. Always set the dial and leads for what you're measuring before you touch anything.",
      "Test resistance only with power off. Test voltage with power on, using the correct range and keeping your fingers behind the probe guards.",
    ],
    example: ["Example: a contactor coil should read about 24 volts when called. No 24 volts means look at the thermostat or transformer."],
    quiz: [
      { q: "When do you measure resistance (ohms)?", choices: ["With power on", "With power off", "Only on live wires", "Never"], answer: 1, why: "Measuring ohms on a live circuit can damage the meter and hurt you." },
      { q: "Before trusting a meter, you should...", choices: ["Shake it", "Check it on a known live source", "Hide the leads", "Replace the battery daily"], answer: 1, why: "A quick check on a known source proves the meter works." },
      { q: "A 24V contactor coil reads 0 volts when called. Where do you look?", choices: ["The control side", "The tires", "The refrigerant", "The ductwork"], answer: 0, why: "No control voltage points to the thermostat, wiring or transformer." },
    ],
  },
  {
    lecture: [
      "Airflow is measured in CFM, cubic feet per minute. A typical rule is about 400 CFM for each ton of cooling.",
      "Static pressure is the resistance air meets in the duct system. Dirty filters, closed dampers and small ducts raise it.",
    ],
    example: ["Example: a 3-ton system needs about 3 x 400 = 1200 CFM across the coil."],
    quiz: [
      { q: "What does CFM measure?", choices: ["Cooling fluid mass", "Airflow volume", "Electrical current", "Pressure drop"], answer: 1, why: "CFM is cubic feet of air per minute." },
      { q: "About how much CFM per ton of cooling?", choices: ["40", "400", "4000", "40000"], answer: 1, why: "The usual rule of thumb is about 400 CFM per ton." },
      { q: "A very common cause of weak airflow is...", choices: ["Dirty filter", "New thermostat", "Cold weather", "Shiny ducts"], answer: 0, why: "A clogged filter restricts air and causes many service calls." },
    ],
  },
  {
    lecture: [
      "Good troubleshooting is a method, not a guess. Start with the customer's complaint, then verify it yourself.",
      "Work from simple to complex: check power first, then controls, then the load. Document what you found at each step.",
    ],
    example: ["Example: no cooling. Is there power? Is the thermostat calling? Is the contactor pulled in? Is the compressor running?"],
    quiz: [
      { q: "What do you do first on a service call?", choices: ["Replace the compressor", "Gather the complaint", "Add refrigerant", "Leave a note"], answer: 1, why: "Listening to the complaint points you toward the problem." },
      { q: "What is the right troubleshooting order?", choices: ["Load, controls, power", "Controls, load, power", "Power, controls, load", "Random"], answer: 2, why: "Simplest causes first: power, then controls, then the load." },
      { q: "Why document your findings?", choices: ["It's optional", "To track the repair and protect you and the customer", "To fill paper", "No reason"], answer: 1, why: "Records support the repair and help future visits." },
    ],
  },
];

export const QUIZ_XP_BASE = 10;
export const QUIZ_XP_PER_CORRECT = 10;
export const QUIZ_GRAD_PER_CORRECT = 10;

export function quizReward(correct: number, total = 4) {
  const f = total > 0 ? correct / total : 0;
  return { xp: QUIZ_XP_BASE + Math.round(f * 40), graduationPoints: Math.round(f * 30) };
}

export function quizGrade(correct: number, total: number): string {
  const pct = correct / total;
  if (pct === 1) return "Perfect score! Outstanding work.";
  if (pct >= 0.67) return "Nice job. Review the ones you missed.";
  if (pct > 0) return "Study up and try to do better tomorrow.";
  return "Rough day. Review your notes before the next class.";
}

export function lessonContent(day: number): LessonContent {
  return LESSON_CONTENT[day % LESSON_CONTENT.length];
}

export function classroomLines(name: string, day: number): DialogueLine[] {
  const plan = LESSON_PLANS[day % LESSON_PLANS.length];
  const homework = HOMEWORK[day % HOMEWORK.length];
  const content = lessonContent(day);
  return [
    say(`Good morning, ${name}! Take a seat. This is day ${day + 1} of your training.`),
    say(`Today's lesson: ${plan.title}.`),
    ...plan.agenda.map((item, i) => say(`Plan item ${i + 1}: ${item}.`)),
    ...content.lecture.map((t) => say(t)),
    ...content.example.map((t) => say(t)),
    say(`Tip of the day: ${plan.tip}`),
    say(`Assignments due next class: ${homework.join(" and ")}.`),
    say("Pencils ready. Time for today's quiz. Your score decides your points!"),
  ];
}

export const BRIEFINGS: Record<string, DialogueLine[]> = {
  "Electrical Lab": [say("Welcome to the Electrical Lab. Today you'll wire a control circuit. Meter first, then power!")],
  "Refrigeration Lab": [say("Refrigeration Lab. Build the condenser loop and watch your pressures. Safety glasses on!")],
  Troubleshooting: [say("Troubleshooting Center. A customer has no cooling. Find the fault: power, controls, then the load.")],
};

LESSON_PLANS.push(...MORE_PLANS);
HOMEWORK.push(...MORE_HOMEWORK);
LESSON_CONTENT.push(...MORE_CONTENT);
LESSON_PLANS.push(...EXTRA_PLANS);
HOMEWORK.push(...EXTRA_HOMEWORK);
LESSON_CONTENT.push(...EXTRA_CONTENT);
