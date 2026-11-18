import * as Phaser from "phaser";
import type { MatchPair } from "@/game/data/matchPairs";

const FONT = "monospace";

/** Matching game: tap a term, then its definition. onDone receives the number of wrong guesses. */
export class MatchGame {
  private box: Phaser.GameObjects.Container;
  private header: Phaser.GameObjects.Text;
  private info: Phaser.GameObjects.Text;
  private items: Phaser.GameObjects.GameObject[] = [];
  private run: { terms: Phaser.GameObjects.Text[]; defs: Phaser.GameObjects.Text[]; pairs: MatchPair[]; sel: number | null; matched: number; mistakes: number; onDone: (m: number) => void } | null = null;

  constructor(private scene: Phaser.Scene) {
    const bg = scene.add.rectangle(320, 270, 600, 330, 0x10162b, 0.97).setStrokeStyle(3, 0x63b3ed).setInteractive();
    this.header = scene.add.text(40, 120, "MATCHING GAME", { fontFamily: FONT, fontSize: "12px", color: "#63b3ed", fontStyle: "bold" });
    this.info = scene.add.text(600, 428, "", { fontFamily: FONT, fontSize: "10px", color: "#8aa0d6" }).setOrigin(1, 1);
    this.box = scene.add.container(0, 0, [bg, this.header, this.info]).setDepth(20000).setVisible(false);
  }

  get active() {
    return this.run !== null;
  }

  start(pairs: MatchPair[], onDone: (mistakes: number) => void) {
    this.items.forEach((o) => o.destroy());
    this.items = [];
    const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
    const termOrder = shuffle(pairs.map((_, i) => i));
    const defOrder = shuffle(pairs.map((_, i) => i));
    const mk = (x: number, y: number, text: string, idx: number, side: "t" | "d") => {
      const t = this.scene.add
        .text(x, y, text, { fontFamily: FONT, fontSize: "12px", color: "#e6ecff", backgroundColor: "#24304f", padding: { x: 8, y: 6 }, fixedWidth: 270, wordWrap: { width: 254 } })
        .setInteractive({ useHandCursor: true })
        .setData("idx", idx);
      t.on("pointerdown", () => this.pick(side, t));
      this.items.push(t);
      this.box.add(t);
      return t;
    };
    const terms = termOrder.map((i, n) => mk(40, 146 + n * 44, pairs[i].term, i, "t"));
    const defs = defOrder.map((i, n) => mk(330, 146 + n * 44, pairs[i].def, i, "d"));
    this.run = { terms, defs, pairs, sel: null, matched: 0, mistakes: 0, onDone };
    this.header.setText(`MATCHING GAME  -  Match each term to its meaning (0/${pairs.length})`);
    this.info.setText("Tap a term, then its definition");
    this.box.setVisible(true);
  }

  private pick(side: "t" | "d", obj: Phaser.GameObjects.Text) {
    const r = this.run;
    if (!r || obj.getData("done")) return;
    if (side === "t") {
      r.terms.forEach((t) => !t.getData("done") && t.setBackgroundColor("#24304f"));
      obj.setBackgroundColor("#b7791f");
      r.sel = obj.getData("idx");
      return;
    }
    if (r.sel === null) {
      this.info.setText("Pick a term first");
      return;
    }
    if (obj.getData("idx") === r.sel) {
      const term = r.terms.find((t) => t.getData("idx") === r.sel)!;
      [term, obj].forEach((o) => o.setBackgroundColor("#2f855a").setData("done", true));
      r.sel = null;
      r.matched++;
      this.header.setText(`MATCHING GAME  -  Match each term to its meaning (${r.matched}/${r.pairs.length})`);
      if (r.matched === r.pairs.length) {
        this.info.setText("All matched! Tap to continue");
        this.scene.time.delayedCall(900, () => this.finish());
      }
    } else {
      r.mistakes++;
      obj.setBackgroundColor("#c53030");
      this.scene.time.delayedCall(350, () => !obj.getData("done") && obj.setBackgroundColor("#24304f"));
      this.info.setText(`Not a match (${r.mistakes} miss${r.mistakes === 1 ? "" : "es"})`);
    }
  }

  private finish() {
    const r = this.run;
    if (!r) return;
    this.run = null;
    this.box.setVisible(false);
    r.onDone(r.mistakes);
  }
}
