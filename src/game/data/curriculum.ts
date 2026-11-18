import type { LessonContent, LessonPlan } from "./dialogue";
import type { LessonFocus } from "./labGames";

const k = (q: string, choices: string[], answer: number, why: string) => ({ q, choices, answer, why });

/** Days 6-20 of the 20-day training program (days 1-5 live in dialogue.ts). */
export const MORE_PLANS: LessonPlan[] = [
  { title: "Capacitors and Motors", agenda: ["Start versus run capacitors", "Reading microfarad (uF) ratings", "Testing a fan motor's windings"], tip: "Discharge a capacitor with a resistor before you touch its terminals." },
  { title: "Contactors and Relays", agenda: ["How a contactor pulls in", "Coil voltage versus line voltage", "Spotting pitted contacts"], tip: "Pitted or burned contacts mean replace the contactor, not file it." },
  { title: "Transformers and Low-Voltage Controls", agenda: ["120/240V primary, 24V secondary", "R, C, W, Y and G thermostat wires", "Fuses and shorts on the 24V side"], tip: "A blown 24V fuse means there is a short somewhere. Find it before replacing the fuse." },
  { title: "Refrigerants and PT Charts", agenda: ["R-22, R-410A and R-134a", "Pressure and temperature relationship", "Reading a PT chart"], tip: "Never mix refrigerants. Match the nameplate." },
  { title: "Superheat and Subcooling", agenda: ["Superheat on a fixed-orifice system", "Subcooling on a TXV system", "What high and low readings mean"], tip: "Measure with the system running at steady state for 15 minutes." },
  { title: "Evacuation and Charging", agenda: ["Pulling a deep vacuum to 500 microns", "Weighing in the charge", "Nitrogen pressure tests"], tip: "A vacuum that rises and stalls means moisture. One that keeps rising means a leak." },
  { title: "Brazing and Piping", agenda: ["Flowing nitrogen while brazing", "Flare versus braze connections", "Sizing and supporting line sets"], tip: "No nitrogen flow while brazing means scale inside the tubing." },
  { title: "Recovery and EPA Rules", agenda: ["Section 608 of the Clean Air Act", "Recovery cylinders and the 80% rule", "Leak repair requirements"], tip: "Venting refrigerant is illegal and the fines are steep." },
  { title: "Gas Furnaces", agenda: ["Sequence of operation", "Flame sensors and limit switches", "Why a furnace short cycles"], tip: "Clean the flame sensor before replacing a control board." },
  { title: "Heat Pumps", agenda: ["The reversing valve", "Defrost cycle and emergency heat", "Balance point"], tip: "Heat pumps heat with the same cycle, just reversed." },
  { title: "Ducts and Static Pressure", agenda: ["Total external static pressure", "Duct sizing and friction", "Zoning and dampers"], tip: "Measure static pressure on both sides of the filter and coil." },
  { title: "Commercial Refrigeration", agenda: ["Walk-in coolers and freezers", "Defrost heaters and timers", "Low-temperature compressors"], tip: "Frost patterns tell you where the refrigerant is starving." },
  { title: "Combustion Safety and CO", agenda: ["Complete versus incomplete combustion", "Carbon monoxide testing", "Venting and draft"], tip: "If you smell gas, leave first and call it in from outside." },
  { title: "Customer Service and Estimates", agenda: ["Explaining the problem simply", "Good, better, best options", "Paperwork and invoicing"], tip: "People remember how you treated them long after they forget the price." },
  { title: "Capstone: Full System Diagnosis", agenda: ["Combining electrical, airflow and refrigerant checks", "Prioritizing the likely cause", "Writing the final report"], tip: "Prove the fix: verify temperatures, amps and airflow before you leave." },
];

export const MORE_HOMEWORK: string[][] = [
  ["Worksheet: capacitor ratings", "Lab report: motor amp draw"],
  ["Diagram a contactor", "Practice: read coil voltage"],
  ["Trace the 24V circuit", "Quiz: thermostat wire colors"],
  ["Fill out a PT chart", "Compare three refrigerants"],
  ["Superheat problems 1-5", "Subcooling problems 1-5"],
  ["Write an evacuation procedure", "Quiz: micron readings"],
  ["Sketch a brazed joint", "Read: nitrogen safety"],
  ["Summarize Section 608", "Cylinder safety quiz"],
  ["Draw a furnace sequence", "Case study: short cycling"],
  ["Label a reversing valve", "Read: defrost modes"],
  ["Measure static in the lab", "Duct sizing worksheet"],
  ["Defrost cycle worksheet", "Read: walk-in basics"],
  ["CO safety checklist", "Combustion analysis lab report"],
  ["Role-play a customer call", "Write an estimate"],
  ["Final case study write-up", "Review all unit notes"],
];

export const MORE_FOCUS: LessonFocus[] = [
  { kinds: ["parts", "airflow", "meter"], lab: "Electrical Lab" },
  { kinds: ["panel", "wiring", "parts"], lab: "Electrical Lab" },
  { kinds: ["panel", "thermostat", "wiring"], lab: "Electrical Lab" },
  { kinds: ["gauges", "compressor", "coil"], lab: "Refrigeration Lab" },
  { kinds: ["gauges", "coil", "airflow"], lab: "Refrigeration Lab" },
  { kinds: ["gauges", "recovery", "parts"], lab: "Refrigeration Lab" },
  { kinds: ["parts", "coil", "recovery"], lab: "Refrigeration Lab" },
  { kinds: ["recovery", "gauges", "compressor"], lab: "Refrigeration Lab" },
  { kinds: ["furnace", "thermostat", "meter"], lab: "Troubleshooting" },
  { kinds: ["compressor", "gauges", "parts"], lab: "Refrigeration Lab" },
  { kinds: ["airflow", "meter", "thermostat"], lab: "Troubleshooting" },
  { kinds: ["coil", "recovery", "compressor"], lab: "Refrigeration Lab" },
  { kinds: ["furnace", "meter", "workorder"], lab: "Troubleshooting" },
  { kinds: ["workorder", "thermostat", "airflow"], lab: "Troubleshooting" },
  { kinds: ["workorder", "furnace", "meter", "thermostat"], lab: "Troubleshooting" },
];

export const MORE_CONTENT: LessonContent[] = [
  {
    lecture: [
      "A run capacitor keeps a motor efficient while it spins. A start capacitor gives a short boost to get a compressor or motor turning.",
      "Capacitors are rated in microfarads (uF). A capacitor that reads more than 10% below its rating is weak and should be replaced.",
    ],
    example: ["Example: a fan motor hums but will not spin. A 5 uF capacitor reads 3 uF, so it is weak. Replace it with the same rating."],
    quiz: [
      k("What does a start capacitor do?", ["Cleans the air", "Gives a short boost to start a motor", "Measures amps", "Lowers voltage"], 1, "Start capacitors give extra torque to get a motor turning."),
      k("A capacitor is rated in...", ["Ohms", "Microfarads", "Watts", "Psi"], 1, "Capacitance is measured in microfarads (uF)."),
      k("Before touching a capacitor's terminals you should...", ["Spray it", "Discharge it safely", "Lick it", "Heat it"], 1, "Capacitors store a charge that can shock you."),
      k("A motor hums but will not turn. The most likely cause is...", ["A weak capacitor", "A new filter", "A cold room", "A clean coil"], 0, "A weak capacitor commonly causes a humming, non-starting motor."),
    ],
  },
  {
    lecture: [
      "A contactor is an electrical switch. A small 24V signal energizes the coil, which pulls in contacts that carry line voltage to the compressor and fan.",
      "Over time the contacts pit and burn. Look for blackened or welded contacts and a coil that does not pull in.",
    ],
    example: ["Example: the thermostat calls for cooling and you measure 24V at the coil, but the contacts do not close. The coil is bad, so replace the contactor."],
    quiz: [
      k("What energizes a contactor coil?", ["240V", "24V control voltage", "Refrigerant", "Static pressure"], 1, "A 24V signal from the thermostat pulls the contactor in."),
      k("24V is present at the coil but the contacts won't close. Likely cause?", ["Bad coil", "Good coil", "Clean filter", "Low charge"], 0, "Voltage in and no pull-in means a failed coil."),
      k("Pitted, burned contacts mean you should...", ["File them smooth", "Replace the contactor", "Ignore them", "Add oil"], 1, "Damaged contacts cause heat and voltage drop. Replace the part."),
      k("A contactor switches which voltage to the compressor?", ["24V", "Line voltage", "5V", "No voltage"], 1, "The contacts carry line voltage to the loads."),
    ],
  },
  {
    lecture: [
      "A control transformer steps line voltage (120 or 240V) down to 24V. The 24V side powers the thermostat and control relays.",
      "Thermostat wires follow a color code: R is power, C is common, W is heat, Y is cooling and G is the fan.",
    ],
    example: ["Example: the thermostat is blank. You measure 0V between R and C. Check the transformer's input voltage and the 24V fuse next."],
    quiz: [
      k("A control transformer outputs about...", ["12V", "24V", "48V", "120V"], 1, "Residential controls run on 24V."),
      k("Which thermostat terminal calls for cooling?", ["W", "Y", "G", "R"], 1, "Y is the cooling call."),
      k("A blown 24V fuse usually means...", ["A short in the low-voltage wiring", "A dirty filter", "Low refrigerant", "A cold house"], 0, "Find and fix the short before replacing the fuse."),
      k("The C terminal on a thermostat is the...", ["Common", "Cooling", "Compressor", "Clock"], 0, "C is the common side of the 24V circuit."),
    ],
  },
  {
    lecture: [
      "Different systems use different refrigerants. R-22 is older, R-410A is common on newer residential systems, and R-134a is used in many small and automotive systems.",
      "A PT chart lists the pressure that matches each temperature for a refrigerant. It lets you convert gauge readings into saturation temperatures.",
    ],
    example: ["Example: R-410A at 118 psig has a saturation temperature of about 40 degrees F. That is a typical evaporator reading."],
    quiz: [
      k("Which refrigerant is most common on newer residential AC?", ["R-12", "R-410A", "R-11", "R-717"], 1, "R-410A replaced R-22 on newer residential systems."),
      k("A PT chart relates...", ["Price and time", "Pressure and temperature", "Power and torque", "Pipe and tube"], 1, "PT stands for pressure-temperature."),
      k("Can you mix different refrigerants in one system?", ["Yes, if they are similar", "No, never", "Yes, if cold", "Only on Mondays"], 1, "Mixing refrigerants ruins performance and creates a hazard."),
      k("As refrigerant temperature rises in a sealed cylinder, pressure...", ["Rises", "Falls", "Stays at zero", "Disappears"], 0, "Pressure and temperature rise together."),
    ],
  },
  {
    lecture: [
      "Superheat is how many degrees the vapor is above its boiling point. It is the charging target on fixed-orifice systems.",
      "Subcooling is how many degrees the liquid is below its condensing point. It is the charging target on TXV systems.",
    ],
    example: ["Example: suction line is 55 F and saturation is 40 F. Superheat = 55 - 40 = 15 degrees."],
    quiz: [
      k("Superheat is measured on which line?", ["Suction line", "Liquid line", "Discharge line", "Drain line"], 0, "Superheat uses the suction line temperature and pressure."),
      k("Which charging method uses subcooling?", ["TXV systems", "Fixed orifice only", "Window units", "No systems"], 0, "TXV systems are charged by subcooling."),
      k("Suction line 55 F, saturation 40 F. Superheat?", ["95", "15", "40", "55"], 1, "55 minus 40 is 15 degrees of superheat."),
      k("Very high superheat usually points to...", ["Low charge", "Overcharge", "Clean coil", "Good airflow"], 0, "Too little refrigerant starves the evaporator, raising superheat."),
    ],
  },
  {
    lecture: [
      "Before charging, a system must be evacuated. A vacuum pump removes air and moisture. The target is 500 microns or lower.",
      "After evacuation, close the manifold and watch the micron gauge. A rapid rise means a leak or moisture. Charge by weight when the manufacturer specifies it.",
    ],
    example: ["Example: the vacuum rises from 400 to 1500 microns and stalls. That points to moisture, so continue pulling vacuum."],
    quiz: [
      k("What is the typical evacuation target?", ["500 microns", "500 psi", "50 degrees", "5 inches"], 0, "500 microns or lower shows the system is dry."),
      k("What does evacuation remove?", ["Oil", "Air and moisture", "Copper", "Nitrogen only"], 1, "Vacuum boils off moisture and removes non-condensables."),
      k("A vacuum that rises and stalls usually means...", ["Moisture", "A big leak", "A perfect system", "No refrigerant"], 0, "It levels out as moisture boils off."),
      k("What gas is used for a pressure test?", ["Oxygen", "Dry nitrogen", "Compressed shop air", "Propane"], 1, "Dry nitrogen is inert and safe."),
    ],
  },
  {
    lecture: [
      "Copper tubing is joined by brazing or flare fittings. Brazing needs heat above 840 degrees F and a filler rod such as silver alloy.",
      "Always flow dry nitrogen through the tubing while brazing to stop scale from forming inside. Wrap valves and wet rags protect nearby parts.",
    ],
    example: ["Example: you braze a joint with no nitrogen. Black flakes later clog the metering device. Always purge with nitrogen."],
    quiz: [
      k("Why flow nitrogen while brazing?", ["It cools the torch", "It prevents scale inside the tube", "It adds refrigerant", "It is optional"], 1, "Nitrogen prevents oxidation scale that clogs the system."),
      k("Brazing happens at about...", ["200 F", "500 F", "Above 840 F", "100 F"], 2, "Brazing filler melts above 840 degrees F."),
      k("A flare fitting is joined by...", ["Welding", "Flaring the tube and tightening a nut", "Gluing", "Taping"], 1, "A flare nut seals the flared end of the tube."),
      k("A line set should be...", ["Left unsupported", "Properly insulated and supported", "Buried bare", "Kinked"], 1, "Support and insulation protect against sagging and heat gain."),
    ],
  },
  {
    lecture: [
      "Section 608 of the Clean Air Act makes it illegal to knowingly vent refrigerants. Technicians must be certified to buy and handle them.",
      "Recovered refrigerant goes into a recovery cylinder, which is never filled past 80% by weight. Keep records of what you recover.",
    ],
    example: ["Example: a 30 lb recovery cylinder should hold no more than 24 lb of refrigerant."],
    quiz: [
      k("Which law covers refrigerant handling?", ["Clean Air Act Section 608", "Fair Housing Act", "Tax Code", "Clean Water Act"], 0, "Section 608 governs refrigerant management."),
      k("Maximum fill of a recovery cylinder?", ["50%", "80%", "100%", "120%"], 1, "80% by weight leaves room for liquid expansion."),
      k("Venting refrigerant is...", ["Allowed outdoors", "Prohibited", "Fine under 5 lb", "Required"], 1, "Intentional venting is illegal."),
      k("You need which credential to buy refrigerant?", ["EPA 608 certification", "A pilot license", "A driver's permit", "None"], 0, "Section 608 certification is required."),
    ],
  },
  {
    lecture: [
      "A gas furnace runs through a sequence: thermostat call, inducer starts, pressure switch closes, igniter heats, gas valve opens, flame sensor proves flame, blower starts.",
      "If the flame sensor does not detect flame within a few seconds, the control shuts the gas off. A dirty sensor is a very common cause.",
    ],
    example: ["Example: the burners light then shut off after 3 seconds. Clean the flame sensor with fine abrasive and test again."],
    quiz: [
      k("What proves flame to the control board?", ["The thermostat", "The flame sensor", "The filter", "The blower"], 1, "The flame sensor confirms combustion."),
      k("Burners light then shut off quickly. First check...", ["Flame sensor", "Refrigerant", "Capacitor", "Condensate"], 0, "A dirty flame sensor is a classic cause."),
      k("Which component starts first in the sequence?", ["Inducer motor", "Blower", "Gas valve", "Filter"], 0, "The inducer purges the heat exchanger first."),
      k("A limit switch protects against...", ["Overheating", "Low voltage", "Low gas pressure", "Dirty coils"], 0, "The limit opens if temperatures get dangerously high."),
    ],
  },
  {
    lecture: [
      "A heat pump moves heat both ways. The reversing valve flips the flow of refrigerant so the outdoor coil can act as the evaporator in winter.",
      "In heating mode the outdoor coil can frost up, so the unit goes into defrost. Emergency heat uses electric strips when the heat pump itself is off.",
    ],
    example: ["Example: in winter the outdoor coil is covered in frost and the unit blows cool air. Check the defrost board and sensors."],
    quiz: [
      k("What switches a heat pump between heating and cooling?", ["Reversing valve", "Filter drier", "Capacitor", "Thermostat bulb"], 0, "The reversing valve changes refrigerant direction."),
      k("Why does a heat pump go into defrost?", ["Outdoor coil frosts over", "The filter is clean", "The blower is on", "It is summer"], 0, "Frost on the outdoor coil blocks heat transfer."),
      k("Emergency heat uses...", ["Electric resistance strips", "Refrigerant", "Solar panels", "Gas valve"], 0, "Emergency heat energizes the electric heat strips."),
      k("In cooling mode the indoor coil is the...", ["Evaporator", "Condenser", "Compressor", "Receiver"], 0, "Indoor coil absorbs heat when cooling."),
    ],
  },
  {
    lecture: [
      "Total external static pressure (TESP) is the sum of the pressure drops in the duct system. Most residential systems are designed for around 0.5 inches of water column.",
      "High static means restriction: dirty filters, closed dampers, crushed flex duct or undersized returns. The blower moves less air as static goes up.",
    ],
    example: ["Example: TESP measures 1.0 in. w.c. on a system designed for 0.5. Check the filter, coil and ductwork for restrictions."],
    quiz: [
      k("A typical design static pressure is about...", ["0.5 in. w.c.", "5 in. w.c.", "50 in. w.c.", "0 in. w.c."], 0, "Many systems are designed around 0.5 inches of water column."),
      k("High static pressure means...", ["Less airflow", "More airflow", "No effect", "Cooler air"], 0, "Restrictions reduce airflow."),
      k("Which causes high static?", ["Clean oversized return", "Crushed flex duct", "New filter", "Open dampers"], 1, "Restricted ducts raise static pressure."),
      k("Where do you measure static pressure?", ["On both sides of the equipment", "At the thermostat", "At the compressor", "In the attic only"], 0, "Measure supply and return sides to get the total."),
    ],
  },
  {
    lecture: [
      "Walk-in coolers and freezers use low-temperature compressors, evaporators with defrost heaters and timers, and condensing units outside.",
      "Defrost melts frost off the evaporator. A failed defrost heater or timer lets ice build until airflow stops and the box warms.",
    ],
    example: ["Example: a walk-in freezer has a block of ice on the evaporator. The defrost heater reads open, so replace it."],
    quiz: [
      k("Why does a walk-in evaporator have a defrost cycle?", ["To remove frost", "To add refrigerant", "To clean the filter", "To raise voltage"], 0, "Defrost melts the frost build-up."),
      k("Ice covers the evaporator coil. Likely cause?", ["Failed defrost", "A clean coil", "Good airflow", "High charge"], 0, "No defrost lets ice accumulate."),
      k("The condensing unit for a walk-in is usually...", ["Outdoors or remote", "Inside the cooler", "In the ceiling tile", "Not required"], 0, "The condensing unit rejects heat outside the box."),
      k("Frost only at the start of the coil suggests...", ["Low refrigerant", "A perfect charge", "Clean air", "High amps"], 0, "A starved evaporator frosts at the inlet."),
    ],
  },
  {
    lecture: [
      "Complete combustion produces carbon dioxide and water. Incomplete combustion produces carbon monoxide (CO), an odorless, deadly gas.",
      "Test flue gases with a combustion analyzer. Look for a cracked heat exchanger, blocked vent, or insufficient combustion air if CO is high.",
    ],
    example: ["Example: the analyzer shows 150 ppm CO in the flue. Shut the furnace down, tag it out, and find the cause before it runs again."],
    quiz: [
      k("Carbon monoxide is...", ["Odorless and deadly", "Harmless", "Visible", "Smelly"], 0, "CO has no smell and can kill."),
      k("Incomplete combustion produces...", ["CO", "Only water", "Fresh air", "Ozone"], 0, "Not enough oxygen creates carbon monoxide."),
      k("If you smell natural gas you should...", ["Leave and call from outside", "Flip light switches", "Light a match", "Keep working"], 0, "Avoid any spark and evacuate."),
      k("A cracked heat exchanger can allow...", ["Flue gases into the airstream", "More airflow", "Less noise", "Better efficiency"], 0, "A cracked exchanger leaks combustion gases."),
    ],
  },
  {
    lecture: [
      "Customers want clear answers. Explain the problem in plain words, show what failed, and give them options such as good, better and best repairs.",
      "Write a clear invoice listing the parts, labor and warranty. Honest communication builds repeat customers and referrals.",
    ],
    example: ["Example: instead of 'the capacitor is open', say 'a part that helps your motor start has worn out, and it is a quick fix'."],
    quiz: [
      k("How should you explain a repair?", ["In plain words", "With jargon only", "Silently", "Never explain"], 0, "Customers appreciate simple explanations."),
      k("Good-better-best gives the customer...", ["Options", "Confusion", "No choices", "A free repair"], 0, "Options let customers choose what fits their budget."),
      k("An invoice should list...", ["Parts, labor and warranty", "Only a total", "Nothing", "Your lunch order"], 0, "A detailed invoice avoids disputes."),
      k("Honest service leads to...", ["Referrals and repeat business", "Lost jobs", "Fines", "Nothing"], 0, "Trust is how technicians build a customer base."),
    ],
  },
  {
    lecture: [
      "A full diagnosis combines everything: confirm the complaint, check power and controls, measure airflow, then read refrigerant pressures and temperatures.",
      "Rank the likely causes, test the cheapest and fastest first, and prove your fix by verifying temperatures, amps and airflow before leaving.",
    ],
    example: ["Example: no cooling. 24V present, contactor closed, compressor humming. You test the capacitor: it reads 2 uF on a 40 uF rating. Replace it and verify amps and temperature split."],
    quiz: [
      k("What is the first step of a full diagnosis?", ["Confirm the complaint", "Replace parts", "Add refrigerant", "Call the boss"], 0, "Start with the complaint and verify it."),
      k("After a repair you should...", ["Verify temperatures, amps and airflow", "Leave quickly", "Skip paperwork", "Hope it works"], 0, "Proof of repair prevents callbacks."),
      k("Which cause do you test first?", ["The cheapest and most likely", "The rarest", "The most expensive", "A random one"], 0, "Rank causes by likelihood and cost."),
      k("A humming compressor with a failed capacitor is fixed by...", ["Replacing the capacitor", "Replacing the filter", "Adding oil", "Replacing the thermostat"], 0, "The capacitor starts the compressor."),
    ],
  },
];
