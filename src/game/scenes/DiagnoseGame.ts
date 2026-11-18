import * as Phaser from "phaser";
import { CRIB_ITEMS } from "@/game/data/labGames";
import type { Scenario } from "@/game/data/scenarios";

const FONT = "monospace";
const BTN = "#24304f";
const LOOK = "Look (inspect)";

type Btn = Phaser.GameObjects.Text;

/** Interactive diagnosis: pick a tool or part from the belt, then use it on a piece of the broken equipment. */
export class DiagnoseGame {
  private box: Phaser.GameObjects.Container;
  private title: Phaser.GameObjects.Text;
  private symptom: Phaser.GameObjects.Text;
  private readout: Phaser.GameObjects.Text;
  private dyn: Phaser.GameObjects.GameObject[] = [];
  private beltBtns = new Map<string, Btn>();
  private compBtns = new Map<string, Btn>();
  private running = false;
  private solved = false;
  private mistakes = 0;
  private selected = LOOK;
  private tested = new Set<string>();
  private notes: string[] = [];
  private sc: Scenario | null = null;
  private onDone: ((mistakes: number) => void) | null = null;

  constructor(private scene: Phaser.Scene) {
    const bg = scene.add.rectangle(320, 270, 600, 330, 0x10162b, 0.97).setStrokeStyle(3, 0xf6ad55).setInteractive();
    this.title = scene.add.text(40, 114, "", { fontFamily: FONT, fontSize: "12px", color: "#f6ad55", fontStyle: "bold" });
    this.symptom = scene.add.text(40, 134, "", { fontFamily: FONT, fontSize: "12px", color: "#ffffff", wordWrap: { width: 400 } });
    this.readout = scene.add.text(40, 282, "", { fontFamily: FONT, fontSize: "11px", color: "#9ae6b4", wordWrap: { width: 400 }, lineSpacing: 3 });
    const leave = scene.add
      .text(600, 114, "[ Leave ]", { fontFamily: FONT, fontSize: "11px", color: "#feb2b2" })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    leave.on("pointerdown", () => this.close());
    const belt = scene.add.text(450, 150, "TOOLBELT", { fontFamily: FONT, fontSize: "11px", color: "#f6ad55", fontStyle: "bold" });
    this.box = scene.add.container(0, 0, [bg, this.title, this.symptom, this.readout, belt, leave]).setDepth(20000).setVisible(false);
  }

  get active() {
    return this.running;
  }

  private button(x: number, y: number, w: number, label: string, size: number, padY: number, onClick: () => void): Btn {
    const t = this.scene.add
      .text(x, y, label, { fontFamily: FONT, fontSize: `${size}px`, color: "#e6ecff", backgroundColor: BTN, padding: { x: 6, y: padY }, fixedWidth: w })
      .setInteractive({ useHandCursor: true });
    t.on("pointerdown", onClick);
    this.box.add(t);
    this.dyn.push(t);
    return t;
  }

  start(sc: Scenario, belt: string[], onDone: (mistakes: number) => void) {
    this.close();
    this.sc = sc;
    this.onDone = onDone;
    this.mistakes = 0;
    this.solved = false;
    this.tested = new Set();
    this.notes = [];
    this.selected = LOOK;
    this.running = true;
    this.title.setText(sc.title);
    this.symptom.setText(`Problem: ${sc.symptom}\nPick from your toolbelt, then tap the equipment.`);
    this.readout.setText("");
    this.box.setVisible(true);

    [LOOK, ...belt].forEach((name, i) => {
      const b = this.button(450, 168 + i * 23, 160, name, 11, 3, () => this.select(name));
      this.beltBtns.set(name, b);
    });
    this.select(LOOK);

    sc.comps.forEach((c, i) => {
      const b = this.button(40 + (i % 2) * 205, 190 + Math.floor(i / 2) * 48, 195, c.name, 12, 12, () => this.use(c.id));
      this.compBtns.set(c.id, b);
    });
  }

  private select(name: string) {
    this.selected = name;
    this.beltBtns.forEach((b, n) => b.setBackgroundColor(n === name ? "#b7791f" : BTN));
  }

  private close() {
    this.running = false;
    this.onDone = null;
    this.dyn.forEach((o) => o.destroy());
    this.dyn = [];
    this.beltBtns.clear();
    this.compBtns.clear();
    this.box.setVisible(false);
  }

  private show(text: string) {
    this.notes.push(text);
    this.readout.setText(this.notes.slice(-3).join("\n"));
  }

  private wrong(msg: string, id: string) {
    this.mistakes++;
    this.show(`${msg} (mistakes: ${this.mistakes})`);
    const b = this.compBtns.get(id);
    b?.setBackgroundColor("#c53030");
    this.scene.time.delayedCall(350, () => b?.active && b.setBackgroundColor(this.tested.has(id) ? "#2c5282" : BTN));
  }

  private use(id: string) {
    const sc = this.sc;
    if (!sc || this.solved) return;
    const comp = sc.comps.find((c) => c.id === id)!;
    const item = this.selected;

    if (item === sc.fix) {
      if (id !== sc.fault) {
        this.wrong(`${item} on the ${comp.name}: that isn't the problem.`, id);
        return;
      }
      let lucky = false;
      if (!this.tested.has(id)) {
        this.mistakes++;
        lucky = true;
      }
      this.solve(comp.name, lucky);
      return;
    }

    if (item === LOOK) {
      this.show(`${comp.name}: ${comp.look}`);
    } else if (CRIB_ITEMS.find((i) => i.name === item)?.type === "part") {
      this.wrong(`The ${item} doesn't fix the ${comp.name}.`, id);
      return;
    } else {
      this.show(`${comp.name} [${item}]: ${comp.tests[item] ?? `no useful reading with the ${item}.`}`);
    }
    this.tested.add(id);
    this.compBtns.get(id)?.setBackgroundColor("#2c5282");
  }

  private solve(name: string, lucky: boolean) {
    this.solved = true;
    this.readout.setText(`FIXED! ${this.sc!.fix} on the ${name}.\n${this.sc!.done}${lucky ? "\nLucky guess! Measure or inspect first next time." : ""}\nMistakes: ${this.mistakes}`);
    this.button(40, 408, 120, "[ Continue ]", 12, 6, () => {
      const done = this.onDone;
      const m = this.mistakes;
      this.close();
      done?.(m);
    }).setBackgroundColor("#2f855a");
  }
}
