import type { LessonContent, LessonPlan } from "./dialogue";
import type { LessonFocus } from "./labGames";

const k = (q: string, choices: string[], answer: number, why: string) => ({ q, choices, answer, why });

/** Days 21-26: advanced topics so a full graduation never repeats a lesson. */
export const EXTRA_PLANS: LessonPlan[] = [
  { title: "Load Calculations and Sizing", agenda: ["Manual J basics", "Square footage versus real load", "Why oversizing hurts comfort"], tip: "A bigger system is not a better system. Oversized units short cycle." },
  { title: "Indoor Air Quality", agenda: ["Filtration ratings (MERV)", "Humidity control", "Ventilation and fresh air"], tip: "Ask about allergies and humidity before you recommend a filter." },
  { title: "Variable-Speed and Inverter Systems", agenda: ["ECM blower motors", "Inverter compressors", "Communicating controls"], tip: "Read the error code history before touching an inverter board." },
  { title: "Preventive Maintenance", agenda: ["Seasonal tune-up checklist", "Coil cleaning and drain care", "Recording readings for comparison"], tip: "Good maintenance records turn guesses into trends." },
  { title: "Business and Code Compliance", agenda: ["Permits and inspections", "Warranty and liability", "Pricing a job profitably"], tip: "Pull the permit. It protects you and the customer." },
  { title: "Final Review and Practical", agenda: ["Review electrical, refrigerant and airflow", "Timed troubleshooting drill", "Prepare for the certification exams"], tip: "Slow is smooth and smooth is fast." },
];

export const EXTRA_HOMEWORK: string[][] = [
  ["Size a 1,800 sq ft house", "Worksheet: oversizing effects"],
  ["Compare MERV 8 and MERV 13", "Humidity case study"],
  ["Read an error code table", "Diagram an ECM motor"],
  ["Write a tune-up checklist", "Log sample readings"],
  ["Mock estimate and invoice", "Permit process summary"],
  ["Full review packet", "Timed practice diagnosis"],
];

export const EXTRA_FOCUS: LessonFocus[] = [
  { kinds: ["airflow", "gauges", "workorder"], lab: "Troubleshooting" },
  { kinds: ["airflow", "thermostat", "meter"], lab: "Troubleshooting" },
  { kinds: ["meter", "parts", "wiring"], lab: "Electrical Lab" },
  { kinds: ["coil", "gauges", "airflow"], lab: "Refrigeration Lab" },
  { kinds: ["workorder", "thermostat", "furnace"], lab: "Troubleshooting" },
  { kinds: ["workorder", "furnace", "meter", "airflow"], lab: "Troubleshooting" },
];

export const EXTRA_CONTENT: LessonContent[] = [
  {
    lecture: ["A load calculation (Manual J) estimates how much heating and cooling a home needs based on insulation, windows, orientation and air leakage.", "An oversized system cools quickly, shuts off, and never removes enough humidity. It also short cycles and wears out sooner."],
    example: ["Example: a 3-ton system is installed in a home that needs 2 tons. The house feels clammy because the unit never runs long enough to dehumidify."],
    quiz: [
      k("Which calculation sizes equipment properly?", ["Manual J", "Square footage only", "Neighbor's size", "Price"], 0, "Manual J accounts for the real load."),
      k("An oversized AC commonly causes...", ["Short cycling and poor humidity control", "Better comfort", "Lower wear", "No change"], 0, "It satisfies the thermostat before dehumidifying."),
      k("Which affects cooling load?", ["Windows and insulation", "Paint color of the van", "Thermostat brand", "Filter size only"], 0, "Envelope and windows drive load."),
      k("Rule of thumb sizing by square footage alone is...", ["Unreliable", "Exact", "Required by code", "Best practice"], 0, "Real load varies widely."),
    ],
  },
  {
    lecture: ["MERV ratings describe how well a filter captures particles. Higher MERV catches smaller particles but adds airflow resistance.", "Ideal indoor humidity is roughly 30 to 50 percent. Too high invites mold and too low causes dry air."],
    example: ["Example: a customer installs a MERV 16 filter and airflow drops. Step down to a lower MERV or a larger filter cabinet."],
    quiz: [
      k("A higher MERV filter generally...", ["Captures finer particles but restricts air more", "Has no restriction", "Is always better", "Removes humidity"], 0, "More filtration means more resistance."),
      k("Comfortable indoor humidity is about...", ["30 to 50 percent", "90 percent", "5 percent", "100 percent"], 0, "That range limits mold and dryness."),
      k("High humidity indoors can cause...", ["Mold growth", "Lower bills", "Dry skin", "Frozen pipes"], 0, "Moist air supports mold."),
      k("Fresh air ventilation is used to...", ["Dilute indoor pollutants", "Add refrigerant", "Raise static", "Cool the compressor"], 0, "Ventilation brings in outdoor air."),
    ],
  },
  {
    lecture: ["Variable-speed ECM blowers adjust airflow to match the demand. Inverter compressors change speed instead of cycling on and off.", "These systems use communicating controls and error codes. Check the code history and wiring before replacing a board."],
    example: ["Example: an inverter unit shows a communication error. A loose two-wire control connection was the cause, not the board."],
    quiz: [
      k("An inverter compressor...", ["Varies its speed", "Only runs at full speed", "Has no motor", "Uses no power"], 0, "Inverters modulate capacity."),
      k("An ECM blower motor is...", ["Electronically commutated and variable speed", "A single-speed PSC", "A gas valve", "A pump"], 0, "ECM motors are efficient and adjustable."),
      k("Before replacing a communicating board you should...", ["Check wiring and error history", "Replace it at once", "Ignore codes", "Add oil"], 0, "Loose wiring causes many comm errors."),
      k("Modulating systems mainly improve...", ["Comfort and efficiency", "Noise only", "Pipe size", "Voltage"], 0, "Steady operation saves energy and evens out temperatures."),
    ],
  },
  {
    lecture: ["Preventive maintenance includes cleaning coils, flushing the condensate drain, changing filters, checking electrical connections and measuring amps and temperatures.", "Record readings each visit. A slow change over time reveals problems before they become breakdowns."],
    example: ["Example: compressor amps climb 10 percent over two years. The record shows a coil slowly clogging, so you clean it before it fails."],
    quiz: [
      k("Why record readings at each visit?", ["To spot trends", "To fill paper", "It is illegal not to", "No reason"], 0, "Trends reveal developing problems."),
      k("A tune-up includes...", ["Cleaning coils and checking drains", "Removing the filter", "Venting refrigerant", "Skipping amps"], 0, "Coils and drains are key items."),
      k("Loose electrical connections cause...", ["Heat and failures", "Cooler wires", "Less amp draw always", "Nothing"], 0, "Resistance creates heat."),
      k("The best time for AC maintenance is...", ["Before cooling season", "After it breaks", "Never", "In the middle of a heat wave"], 0, "Spring tune-ups prevent summer failures."),
    ],
  },
  {
    lecture: ["Most jurisdictions require permits and inspections for equipment changes. Permits protect the customer and prove the work meets code.", "Price jobs to cover parts, labor, overhead and profit. Honest estimates and warranties protect your business."],
    example: ["Example: you replace a furnace without a permit. A later inspection fails and you must redo the work at your own cost."],
    quiz: [
      k("Permits and inspections help ensure...", ["Work meets code", "Higher prices only", "Faster jobs", "Nothing"], 0, "Inspections verify safe, compliant installs."),
      k("A job price should cover...", ["Parts, labor, overhead and profit", "Parts only", "Labor only", "Nothing"], 0, "All costs must be covered."),
      k("A warranty gives the customer...", ["Assurance of the work", "A discount only", "No protection", "A free system"], 0, "Warranties show confidence in the repair."),
      k("Skipping a required permit can lead to...", ["Fines and redoing work", "Bonuses", "Nothing", "Better reviews"], 0, "Unpermitted work creates liability."),
    ],
  },
  {
    lecture: ["Today is review. Walk through the safe order: lockout, power, controls, load, then airflow and refrigerant checks.", "Before your certification exams, review Ohm's law, superheat and subcooling, PT charts, recovery rules and combustion safety."],
    example: ["Example: a no-cool call. Verify power, then the capacitor and contactor, then airflow, then pressures. Document each step."],
    quiz: [
      k("What comes first on any electrical job?", ["Lockout and verify dead", "Start work", "Add charge", "Clean coil"], 0, "Safety first."),
      k("Superheat applies to which metering device?", ["Fixed orifice", "TXV only", "None", "Both always"], 0, "Fixed orifice systems are charged by superheat."),
      k("Maximum recovery cylinder fill is...", ["80 percent", "100 percent", "50 percent", "120 percent"], 0, "Leave room for expansion."),
      k("Best troubleshooting order?", ["Power, controls, load", "Load, controls, power", "Random", "Replace everything"], 0, "Simple causes first."),
    ],
  },
];
