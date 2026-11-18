import type { QuizQuestion } from "@/game/scenes/QuizBox";
import type { CertificationId } from "@/types/certification";
import { EXAM_MINUTES, EXAM_SECTIONS, PASS_MARK } from "./epaExam";

export interface CertSection {
  id: string;
  name: string;
  blurb: string;
  questions: QuizQuestion[];
}

export interface ExamDef {
  id: CertificationId;
  title: string;
  issuer: string;
  minutes: number;
  passMark: number;
  xp: number;
  sections: CertSection[];
  /** Whether the passed section ids are enough to hold the certification. */
  isCertified: (passed: string[]) => boolean;
}

const q = (text: string, choices: string[], answer: number, why: string): QuizQuestion => ({ q: text, choices, answer, why });

const OSHA10: CertSection[] = [
  {
    id: "s1",
    name: "Hazards",
    blurb: "Falls, electrical and struck-by hazards",
    questions: [
      q("What is the leading cause of death in construction?", ["Falls", "Fires", "Noise", "Heat"], 0, "Falls lead the 'Focus Four' hazards."),
      q("Fall protection is required at what height in construction?", ["2 feet", "6 feet", "20 feet", "50 feet"], 1, "OSHA requires protection at 6 feet in construction."),
      q("The 'Focus Four' hazards include falls, electrocution, caught-in/between and...", ["Struck-by", "Sunburn", "Allergies", "Boredom"], 0, "Struck-by is the fourth hazard."),
      q("A ladder used to reach a roof must extend above the edge by at least...", ["1 foot", "3 feet", "6 inches", "10 feet"], 1, "Extend the ladder 3 feet above the landing."),
      q("Before working on an energized-capable circuit you should...", ["Lock out and tag out", "Wear a wet glove", "Skip the meter", "Hurry"], 0, "Lockout/tagout prevents accidental energizing."),
    ],
  },
  {
    id: "s2",
    name: "PPE",
    blurb: "Protective equipment and its care",
    questions: [
      q("Which PPE protects your eyes from flying debris?", ["Safety glasses", "Ear plugs", "Gloves", "Hard hat"], 0, "Safety glasses with side shields stop debris."),
      q("Who must pay for most required PPE?", ["The employer", "The customer", "The student", "Nobody"], 0, "Employers must provide required PPE."),
      q("A damaged hard hat should be...", ["Taped up", "Replaced", "Painted", "Used anyway"], 1, "Cracked PPE no longer protects you."),
      q("Hearing protection is needed when noise exceeds...", ["85 dBA over 8 hours", "20 dBA", "5 dBA", "150 dBA only"], 0, "85 dBA over an 8 hour average is the action level."),
      q("Which gloves are right for handling sharp sheet metal?", ["Cut-resistant gloves", "Cotton knit only", "None", "Latex only"], 0, "Cut-resistant gloves prevent lacerations."),
    ],
  },
  {
    id: "s3",
    name: "Worker rights",
    blurb: "Hazard communication and your rights",
    questions: [
      q("What does an SDS tell you?", ["Hazards of a chemical", "Pay rate", "Work hours", "Weather"], 0, "Safety Data Sheets describe chemical hazards and first aid."),
      q("Workers have the right to...", ["A safe workplace", "Skip training", "Ignore rules", "Choose any task"], 0, "OSHA guarantees a workplace free of recognized hazards."),
      q("You see an unsafe condition. First you should...", ["Report it to your supervisor", "Ignore it", "Post it online", "Quit"], 0, "Report hazards so they are corrected."),
      q("Can your employer punish you for reporting a safety issue?", ["No, that is retaliation", "Yes, always", "Only on Fridays", "Only in summer"], 0, "OSHA protects workers who report hazards."),
      q("How long should you flush eyes after a chemical splash?", ["At least 15 minutes", "5 seconds", "Do not flush", "1 minute"], 0, "Flush for at least 15 minutes and seek care."),
    ],
  },
];

const OSHA30: CertSection[] = [
  {
    id: "s1",
    name: "Management",
    blurb: "Supervisor duties and safety programs",
    questions: [
      q("A supervisor's main safety duty is to...", ["Identify and correct hazards", "Avoid paperwork", "Let workers decide", "Cut training"], 0, "Supervisors find and fix hazards before injuries."),
      q("A Job Hazard Analysis (JHA) is used to...", ["Break down a task and its hazards", "Track payroll", "Order parts", "Schedule breaks"], 0, "A JHA lists steps, hazards and controls."),
      q("The hierarchy of controls ranks which control as most effective?", ["Elimination", "PPE", "Signs", "Training"], 0, "Eliminating the hazard is the best control."),
      q("Serious injuries must be reported to OSHA within...", ["24 hours for in-patient hospitalization", "30 days", "1 year", "Never"], 0, "Hospitalizations must be reported within 24 hours."),
      q("What should a good site safety plan include?", ["Emergency procedures and responsibilities", "Only a slogan", "Lunch menu", "Nothing"], 0, "Plans cover roles, hazards and emergencies."),
    ],
  },
  {
    id: "s2",
    name: "Electrical",
    blurb: "Electrical safety, LOTO and arc flash",
    questions: [
      q("Lockout/tagout is meant to...", ["Control hazardous energy", "Speed up work", "Cool the room", "Test fuel"], 0, "LOTO keeps equipment from energizing during service."),
      q("A GFCI protects people from...", ["Ground-fault shock", "Low refrigerant", "Dirty filters", "Noise"], 0, "GFCIs trip on small leakage currents."),
      q("Only who may remove a personal lock?", ["The person who placed it", "Anyone", "The customer", "A neighbor"], 0, "Each worker controls their own lock."),
      q("Arc flash hazards come from...", ["Fault current releasing energy", "Cold weather", "Dust", "Refrigerant"], 0, "Faults release intense heat and light."),
      q("Extension cords used outdoors must be...", ["Rated for outdoor use", "Indoor only", "Spliced", "Wet"], 0, "Use cords rated for the conditions."),
    ],
  },
  {
    id: "s3",
    name: "Fall and scaffold",
    blurb: "Fall protection, ladders and scaffolds",
    questions: [
      q("A personal fall arrest system includes an anchor, a harness and...", ["A connector or lanyard", "A rope toy", "A hard hat", "A radio"], 0, "Anchor, body harness and connector make the system."),
      q("Roof edge guardrails top rails are about...", ["42 inches high", "12 inches", "10 feet", "6 inches"], 0, "Top rails are 42 inches plus or minus 3."),
      q("Ladders should be inspected...", ["Before each use", "Once a year", "Never", "When broken"], 0, "Inspect before every use."),
      q("When climbing a ladder you should maintain...", ["Three points of contact", "One hand free for the phone", "Speed", "No contact"], 0, "Keep three points of contact."),
      q("Scaffold platforms must be...", ["Fully planked", "Partly planked", "Slippery", "Unsecured"], 0, "Fully planked platforms prevent falls through."),
    ],
  },
  {
    id: "s4",
    name: "Health hazards",
    blurb: "Confined space, heat, asbestos and chemicals",
    questions: [
      q("Before entering a confined space you must test...", ["The air", "The radio", "The shoes", "The ladder only"], 0, "Atmospheric testing checks oxygen and gases."),
      q("Heat illness first aid includes...", ["Shade, water and cooling", "More work", "No water", "Heavy clothing"], 0, "Cool the worker and give fluids."),
      q("Old pipe insulation may contain...", ["Asbestos", "Helium", "Gold", "Sugar"], 0, "Do not disturb suspected asbestos."),
      q("Carbon monoxide poisoning symptoms include...", ["Headache and dizziness", "Itchy elbows", "Hiccups", "Sneezing only"], 0, "CO causes headache, dizziness and confusion."),
      q("Chemical containers must be...", ["Labeled", "Unmarked", "Mixed", "Hidden"], 0, "Labels warn of hazards."),
    ],
  },
];

const NATE: CertSection[] = [
  {
    id: "core",
    name: "Core",
    blurb: "Safety, tools and basic electrical",
    questions: [
      q("Ohm's law states that V equals...", ["I x R", "I / R", "R / I", "I + R"], 0, "Voltage equals current times resistance."),
      q("A meter set to ohms should be used on a circuit that is...", ["De-energized", "Live", "Wet", "Overloaded"], 0, "Always remove power before measuring resistance."),
      q("A 24V transformer secondary reads 0V. Primary shows 120V. Likely fault?", ["Open secondary winding", "Dirty filter", "Low charge", "Bad blower"], 0, "Power in and none out means a failed transformer."),
      q("Which tool measures current without breaking the circuit?", ["Clamp meter", "Thermometer", "Manometer", "Leak detector"], 0, "Clamp-on ammeters read the field around a conductor."),
      q("Torque specs matter because they...", ["Prevent loose or damaged fittings", "Look neat", "Add weight", "Are decoration"], 0, "Proper torque keeps connections safe and sealed."),
    ],
  },
  {
    id: "ac",
    name: "Air conditioning",
    blurb: "Charging, airflow and cooling diagnosis",
    questions: [
      q("On a fixed-orifice system, the charging target is...", ["Superheat", "Subcooling", "Voltage", "Static"], 0, "Fixed metering devices use superheat."),
      q("Air conditioners are designed for about how many CFM per ton?", ["400", "40", "4000", "4"], 0, "A rule of thumb is 400 CFM per ton."),
      q("A typical temperature drop across a healthy evaporator coil is...", ["15 to 22 degrees F", "1 degree F", "60 degrees F", "0 degrees F"], 0, "A split of 15 to 22 degrees is normal."),
      q("High head pressure and low suction temperature rise point to...", ["Dirty condenser", "Perfect charge", "Cold weather", "Bad thermostat"], 0, "A dirty condenser raises head pressure."),
      q("Which part sees low-pressure vapor returning to the compressor?", ["Suction line", "Liquid line", "Discharge line", "Drain line"], 0, "The suction line carries cool low-pressure vapor."),
    ],
  },
  {
    id: "hp",
    name: "Heat pump",
    blurb: "Reversing valves, defrost and heating modes",
    questions: [
      q("The reversing valve is controlled by a...", ["Solenoid", "Float", "Filter", "Bearing"], 0, "A solenoid pilots the reversing valve."),
      q("In heating mode which coil is the evaporator?", ["Outdoor coil", "Indoor coil", "Neither", "Both"], 0, "The outdoor coil absorbs heat in winter."),
      q("Balance point refers to...", ["Outdoor temp where capacity equals load", "Tire alignment", "Pipe slope", "Wire gauge"], 0, "Below it, supplemental heat is needed."),
      q("Defrost is normally terminated by...", ["Temperature or time", "Filter change", "Voltage drop", "Refrigerant color"], 0, "Sensors or timers end the cycle."),
      q("Auxiliary heat on a heat pump is usually...", ["Electric resistance strips", "Solar", "Wood", "Water"], 0, "Heat strips supplement the heat pump."),
    ],
  },
  {
    id: "gas",
    name: "Gas heat",
    blurb: "Furnace sequence, combustion and safety",
    questions: [
      q("Natural gas furnace combustion air must be...", ["Sufficient and clean", "Blocked", "Cold only", "Absent"], 0, "Burners need adequate clean air."),
      q("The pressure switch proves...", ["Inducer draft", "Gas flow", "Flame", "Voltage"], 0, "It confirms the inducer is creating draft."),
      q("A rollout switch opens when...", ["Flames roll out of the burner area", "The filter is clean", "The fan is on", "The room is cold"], 0, "It protects against blocked flues."),
      q("Ideal natural gas manifold pressure is about...", ["3.5 in. w.c.", "35 in. w.c.", "0 in. w.c.", "350 in. w.c."], 0, "Natural gas furnaces run around 3.5 in. w.c."),
      q("A yellow, lazy burner flame indicates...", ["Poor combustion", "Perfect burn", "Low voltage", "A good filter"], 0, "Burners should show a steady blue flame."),
    ],
  },
];

export const EXAMS: ExamDef[] = [
  {
    id: "epa608",
    title: "EPA 608 Technician Certification",
    issuer: "U.S. EPA Section 608",
    minutes: EXAM_MINUTES,
    passMark: PASS_MARK,
    xp: 150,
    sections: EXAM_SECTIONS,
    isCertified: (p) => p.includes("core") && ["type1", "type2", "type3"].some((t) => p.includes(t)),
  },
  {
    id: "osha10",
    title: "OSHA 10-Hour Construction",
    issuer: "OSHA Outreach Training",
    minutes: 20,
    passMark: 0.7,
    xp: 100,
    sections: OSHA10,
    isCertified: (p) => OSHA10.every((s) => p.includes(s.id)),
  },
  {
    id: "osha30",
    title: "OSHA 30-Hour Construction",
    issuer: "OSHA Outreach Training",
    minutes: 30,
    passMark: 0.75,
    xp: 250,
    sections: OSHA30,
    isCertified: (p) => OSHA30.every((s) => p.includes(s.id)),
  },
  {
    id: "nate",
    title: "NATE Certified HVAC Technician",
    issuer: "North American Technician Excellence",
    minutes: 40,
    passMark: 0.75,
    xp: 400,
    sections: NATE,
    isCertified: (p) => NATE.every((s) => p.includes(s.id)),
  },
];

export const examFor = (id: CertificationId) => EXAMS.find((e) => e.id === id) as ExamDef;

/** Section progress is stored in epaSections for EPA 608 and examPassed ("cert:section") for others. */
export function passedSections(profile: { epaSections: string[]; examPassed?: string[] }, id: CertificationId): string[] {
  if (id === "epa608") return profile.epaSections;
  return (profile.examPassed ?? []).filter((x) => x.startsWith(`${id}:`)).map((x) => x.slice(id.length + 1));
}
