import type { StationKind } from "./labLayouts";

export type Route = "electrical" | "controls" | "airflow" | "refrigerant";

export const ROUTES: { id: Route; label: string }[] = [
  { id: "electrical", label: "Electrical: check power, breaker, capacitor and contactor first" },
  { id: "controls", label: "Controls: check the thermostat, wiring and 24V circuit first" },
  { id: "airflow", label: "Airflow: check the filter, blower and ductwork first" },
  { id: "refrigerant", label: "Refrigerant: hook up gauges and check charge and coils first" },
];

export const routeOf = (kind: StationKind): Route => {
  switch (kind) {
    case "meter":
    case "wiring":
    case "panel":
    case "parts":
      return "electrical";
    case "thermostat":
    case "workorder":
      return "controls";
    case "airflow":
    case "furnace":
      return "airflow";
    default:
      return "refrigerant";
  }
};

export interface InterviewQuestion {
  ask: string;
  /** Uninformative questions get the same answer whatever the fault is. */
  generic?: string;
  answers?: Record<Route, string>;
}

export const QUESTIONS: InterviewQuestion[] = [
  {
    ask: "What exactly is it doing, or not doing?",
    answers: {
      electrical: "Nothing at all. No fan, no hum, no lights on the unit. It is completely dead.",
      controls: "I change the thermostat and nothing responds. Sometimes the screen is blank.",
      airflow: "It runs, but hardly any air comes out of the vents, and some rooms get nothing.",
      refrigerant: "It runs all day but the air coming out is never really cold.",
    },
  },
  {
    ask: "Do you hear or smell anything unusual?",
    answers: {
      electrical: "A loud buzzing or humming outside, and once there was a faint burning smell.",
      controls: "No. It is quiet. It just never starts when I ask it to.",
      airflow: "The blower is loud and whistles at the vents. It sounds strained.",
      refrigerant: "There is a hissing sound by the outside unit, and the pipe was frosty.",
    },
  },
  {
    ask: "When did it start, and did anything change?",
    answers: {
      electrical: "Right after the thunderstorm last night. The lights flickered once.",
      controls: "After we replaced the thermostat batteries and reset the schedule.",
      airflow: "It got worse slowly over a few weeks. I honestly can't remember the last time anyone touched it.",
      refrigerant: "It got worse bit by bit all summer, and the power bill went up a lot.",
    },
  },
  {
    ask: "Has a breaker tripped or the power gone out?",
    answers: {
      electrical: "Yes. The breaker tripped twice this week. I flipped it back on.",
      controls: "No, the power has been fine everywhere else.",
      airflow: "No, the power has been fine.",
      refrigerant: "No breakers have tripped.",
    },
  },
  {
    ask: "What does the thermostat say?",
    answers: {
      electrical: "It is lit and set to 72, but nothing ever happens.",
      controls: "The screen is dim, shows the wrong temperature, and ignores the buttons.",
      airflow: "Set to 72, but the house sits at 80 and some rooms are hotter.",
      refrigerant: "Set to 72, the house is stuck at 79 and never reaches it.",
    },
  },
  {
    ask: "When did you last change the air filter?",
    answers: {
      electrical: "Last month, I put in a new one.",
      controls: "A couple of months ago, so it should be fine.",
      airflow: "Um... over a year ago? It's probably gray and clogged by now.",
      refrigerant: "Two months ago, it was still pretty clean.",
    },
  },
  {
    ask: "Is there any ice, water or oil around the equipment?",
    answers: {
      electrical: "No, everything looks dry.",
      controls: "No, everything looks normal.",
      airflow: "A little water around the indoor unit, and frost on the vent once.",
      refrigerant: "Yes, there is ice on the outdoor line and an oily spot on a fitting.",
    },
  },
  { ask: "How old is the system?", generic: "About twelve years old, I think. It has been a good unit until now." },
  { ask: "Who installed it, and was it ever serviced?", generic: "It came with the house. I don't think it has been serviced in years." },
];

export const MAX_QUESTIONS = 3;

/** Informative questions asked that actually pointed at the true fault. */
export const clueCount = (asked: number[]) => asked.filter((i) => !QUESTIONS[i].generic).length;
