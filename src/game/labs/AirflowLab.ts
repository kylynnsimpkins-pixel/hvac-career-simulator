import { sensibleBtuh } from "@/utils/calculations";

/** Lab: airflow (CFM) and delta-T calculations. */
export class AirflowLab {
  capacity(cfm: number, deltaT: number): number {
    return sensibleBtuh(cfm, deltaT);
  }

  /** Rule of thumb: ~400 CFM per ton. */
  requiredCfm(tons: number): number {
    return tons * 400;
  }
}
