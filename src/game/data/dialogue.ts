export interface DialogueLine {
  speaker: string;
  text: string;
}

const TEACHER = "Mr. Rivera";
const say = (text: string): DialogueLine => ({ speaker: TEACHER, text });

export const INTRO: DialogueLine[] = [
  say("Welcome to HVAC Tech Academy, {name}! I'm Mr. Rivera, your lead instructor."),
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

export function classroomLines(name: string, day: number): DialogueLine[] {
  const plan = LESSON_PLANS[day % LESSON_PLANS.length];
  const homework = HOMEWORK[day % HOMEWORK.length];
  return [
    say(`Good morning, ${name}! Take a seat. This is day ${day + 1} of your training.`),
    say(`Today's lesson: ${plan.title}.`),
    ...plan.agenda.map((item, i) => say(`Plan item ${i + 1}: ${item}.`)),
    say(`Assignments due next class: ${homework.join(" and ")}.`),
    say(`Tip of the day: ${plan.tip}`),
    say("That's the plan. Great work today. Now go put it to use in the labs!"),
  ];
}

export const BRIEFINGS: Record<string, DialogueLine[]> = {
  "Electrical Lab": [say("Welcome to the Electrical Lab. Today you'll wire a control circuit. Meter first, then power!")],
  "Refrigeration Lab": [say("Refrigeration Lab. Build the condenser loop and watch your pressures. Safety glasses on!")],
  Troubleshooting: [say("Troubleshooting Center. A customer has no cooling. Find the fault: power, controls, then the load.")],
};
