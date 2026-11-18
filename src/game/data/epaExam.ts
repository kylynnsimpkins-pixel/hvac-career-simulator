import type { QuizQuestion } from "@/game/scenes/QuizBox";

export interface ExamSection {
  id: "core" | "type1" | "type2" | "type3";
  name: string;
  blurb: string;
  questions: QuizQuestion[];
}

export const PASS_MARK = 0.7;
export const EXAM_MINUTES = 30;

const q = (text: string, choices: string[], answer: number, why: string): QuizQuestion => ({ q: text, choices, answer, why });

/** Shortened EPA Section 608 exam: Core plus Types I, II and III, 70% needed per section. */
export const EXAM_SECTIONS: ExamSection[] = [
  {
    id: "core",
    name: "Core",
    blurb: "Regulations, refrigerant handling, recovery and safety",
    questions: [
      q("Which law makes it illegal to knowingly vent most refrigerants?", ["Clean Water Act", "Clean Air Act, Section 608", "OSHA Act", "Safe Drinking Water Act"], 1, "Section 608 of the Clean Air Act covers refrigerant management."),
      q("Which element in CFC and HCFC refrigerants damages the ozone layer?", ["Fluorine", "Hydrogen", "Chlorine", "Carbon"], 2, "Chlorine atoms break down ozone molecules."),
      q("The maximum safe fill for a recovery cylinder is:", ["60% by weight", "70% by weight", "80% by weight", "100% by volume"], 2, "Never fill past 80% so liquid expansion cannot rupture the cylinder."),
      q("A recovery cylinder is painted:", ["Solid green", "Yellow top with a gray body", "Solid orange", "Blue body"], 1, "Recovery cylinders have a gray body and yellow shoulders."),
      q("Refillable refrigerant cylinders must be hydrostatically tested every:", ["1 year", "3 years", "5 years", "10 years"], 2, "DOT requires testing every 5 years."),
      q("Disposable (non-refillable) cylinders:", ["May be refilled once", "Must never be refilled", "Can hold recovered refrigerant", "Are used for oil only"], 1, "Disposable cylinders are single use only."),
      q("In a sealed system, if the temperature of a refrigerant rises, the pressure:", ["Falls", "Stays the same", "Rises", "Drops to zero"], 2, "Pressure and temperature of a confined refrigerant rise together."),
      q("Reclaiming refrigerant means:", ["Cleaning it in the field", "Processing it to new product specifications", "Venting it safely", "Mixing it with new refrigerant"], 1, "Reclaim restores purity to AHRI 700 standards at a certified reclaimer."),
      q("Refrigerant leaking in a closed room is dangerous mainly because it:", ["Is always flammable", "Displaces oxygen", "Raises humidity", "Lowers the temperature to freezing"], 1, "Heavy refrigerant vapor pushes out oxygen and can cause asphyxiation."),
      q("A zeotropic blend (R-400 series) is one that:", ["Has a single boiling point", "Changes composition and has temperature glide", "Is always R-22", "Never leaks"], 1, "Zeotropes fractionate and show temperature glide when they leak or change phase."),
      q("Evacuating a system with a vacuum pump removes:", ["Oil and refrigerant", "Moisture and non-condensables", "Dirt only", "Only nitrogen"], 1, "Vacuum boils off moisture and removes air."),
      q("Which of these must a technician NOT do when servicing equipment?", ["Recover refrigerant", "Vent refrigerant to the atmosphere", "Use a certified recovery machine", "Keep service records"], 1, "Intentional venting is prohibited and carries heavy fines."),
    ],
  },
  {
    id: "type1",
    name: "Type I",
    blurb: "Small appliances (5 lb or less of refrigerant)",
    questions: [
      q("A small appliance is one that contains how much refrigerant?", ["5 lb or less", "15 lb or less", "50 lb or less", "Any amount"], 0, "Type I covers factory-sealed units with 5 lb or less."),
      q("Which is an example of a small appliance?", ["Rooftop unit", "Household refrigerator", "Centrifugal chiller", "Walk-in cooler"], 1, "Refrigerators, window ACs and dehumidifiers are small appliances."),
      q("Using recovery equipment on a small appliance with a working compressor, you must recover:", ["50%", "70%", "90%", "100%"], 2, "90% when the compressor is operating, 80% when it is not."),
      q("A process stub on a small appliance is used to:", ["Add oil", "Access the sealed system", "Vent refrigerant", "Test voltage"], 1, "Piercing or access valves are attached to the process stub."),
      q("Which certification is the minimum to work on a household refrigerator?", ["Type I", "Type II", "Type III", "None"], 0, "Type I covers small appliances."),
    ],
  },
  {
    id: "type2",
    name: "Type II",
    blurb: "High-pressure appliances (R-22, R-410A systems)",
    questions: [
      q("At or above what leak rate must comfort-cooling appliances be repaired?", ["5%", "10%", "50%", "100%"], 1, "Comfort-cooling equipment has a 10% trigger under the leak repair rules."),
      q("After a trigger-rate leak is found, repairs generally must be made within:", ["30 days", "6 months", "1 year", "Immediately, same hour"], 0, "The repair window is 30 days."),
      q("Which of these is a safe way to leak check a high-pressure system?", ["Pressurize with pure oxygen", "Use dry nitrogen with soap bubbles", "Use compressed air from the shop", "Light a flame"], 1, "Dry nitrogen is safe; never use oxygen or compressed air."),
      q("To recover R-22 from a high-pressure appliance with less than 200 lb of charge, recover to:", ["4 in. Hg vacuum", "0 psig", "10 psig", "25 mm Hg"], 1, "Under 200 lb of HCFC-22 requires recovery to 0 psig."),
      q("An electronic leak detector is best used by:", ["Moving fast around joints", "Moving slowly and checking below fittings", "Holding it still in a corner", "Using it only on the compressor"], 1, "Refrigerant is heavier than air, so go slowly and look low."),
    ],
  },
  {
    id: "type3",
    name: "Type III",
    blurb: "Low-pressure appliances (chillers using R-11, R-123)",
    questions: [
      q("A low-pressure chiller can draw in air and moisture through a leak because:", ["It runs at high pressure", "Parts of it operate in a vacuum", "It has no seals", "It uses oil"], 1, "Low-pressure systems can sit below atmospheric pressure."),
      q("A purge unit on a low-pressure chiller removes:", ["Oil", "Non-condensables", "Dirt", "Liquid refrigerant"], 1, "The purge unit vents air and non-condensables from the condenser."),
      q("The rupture disc on a low-pressure chiller typically releases at about:", ["5 psig", "15 psig", "150 psig", "300 psig"], 1, "Low-pressure chillers use a 15 psig rupture disc."),
      q("Recovery from a low-pressure chiller must reach a vacuum of:", ["0 psig", "4 in. Hg", "25 mm Hg absolute", "10 psig"], 2, "The target is 25 mm Hg absolute for low-pressure appliances."),
      q("Before opening a low-pressure chiller for service you should:", ["Leave it in a vacuum", "Raise the pressure to a slight positive pressure", "Vent the refrigerant", "Drain the oil"], 1, "Bring the system up to about 10 psig so air and moisture are not drawn in."),
    ],
  },
];
