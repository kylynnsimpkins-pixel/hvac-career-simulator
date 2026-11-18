import { subcooling, superheat } from "@/utils/calculations";

export type ChargeStatus = "undercharged" | "ok" | "overcharged";

/** Lab: judge charge using superheat (fixed orifice) or subcooling (TXV). */
export class RefrigerantLab {
  checkTxv(satTemp: number, liquidTemp: number, target = 10): ChargeStatus {
    const sc = subcooling(satTemp, liquidTemp);
    if (sc < target - 2) return "undercharged";
    return sc > target + 2 ? "overcharged" : "ok";
  }

  checkFixedOrifice(suctionTemp: number, satTemp: number, target = 12): ChargeStatus {
    const sh = superheat(suctionTemp, satTemp);
    if (sh > target + 3) return "undercharged";
    return sh < target - 3 ? "overcharged" : "ok";
  }
}
