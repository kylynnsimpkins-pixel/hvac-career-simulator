import * as Phaser from "phaser";
import { CRIB_ITEMS } from "@/game/data/labGames";
import type { Scenario } from "@/game/data/scenarios";
import { iconKey } from "./icons";

const FONT = "monospace";
const BTN = "#24304f";
const LOOK = "Look (inspect)";

type Btn = Phaser.GameObjects.Text;
type Tile = Phaser.GameObjects.Container & { setBackgroundColor(color: string): void };

/** Interactive diagnosis: pick a tool or part from the belt, then use it on a piece of the broken equipment. */
export class DiagnoseGame {
  private box: Phaser.GameObjects.Container;
  private title: Phaser.GameObjects.Text;
  private symptom: Phaser.GameObjects.Text;
  private readout: Phaser.GameObjects.Text;
  private dyn: Phaser.GameObjects.GameObject[] = [];
  private beltBtns = new Map<string, Tile>();
  private compBtns = new Map<string, Tile>();
  private choiceBtns: Btn[] = [];
  private running = false;
  private solved = false;
  private mistakes = 0;
  private lastUse = 0;
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

  private tile(x: number, y: number, w: number, h: number, name: string, size: number, onClick: () => void): Tile {
    const bg = this.scene.add.rectangle(0, 0, w, h, 0x24304f).setOrigin(0, 0);
    const pic = h - 4;
    const img = this.scene.add.image(2 + pic / 2, h / 2, iconKey(this.scene, name)).setDisplaySize(pic, pic);
    const label = this.scene.add
      .text(pic + 8, h / 2, name, { fontFamily: FONT, fontSize: `${size}px`, color: "#e6ecff", wordWrap: { width: w - pic - 12 } })
      .setOrigin(0, 0.5);
    const t = Object.assign(this.scene.add.container(x, y, [bg, img, label]), {
      setBackgroundColor: (c: string) => void bg.setFillStyle(parseInt(c.slice(1), 16)),
    });
    t.setSize(w, h);
    t.setInteractive(new Phaser.Geom.Rectangle(0, 0, w, h), Phaser.Geom.Rectangle.Contains);
    if (t.input) t.input.cursor = "pointer";
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
    this.lastUse = 0;
    this.solved = false;
    this.tested = new Set();
    this.notes = [];
    this.selected = LOOK;
    this.running = true;
    this.title.setText(sc.title);
    this.symptom.setText(`Problem: ${sc.symptom}\nDrag tools and parts from the belt onto the equipment.`);
    this.readout.setText("");
    this.box.setVisible(true);

    [LOOK, ...belt].forEach((name, i) => {
      const home = { x: 450, y: 168 + i * 28 };
      const b = this.tile(home.x, home.y, 160, 26, name, 11, () => this.select(name));
      this.beltBtns.set(name, b);
      this.scene.input.setDraggable(b);
      b.on("dragstart", () => {
        this.select(name);
        this.box.bringToTop(b);
      });
      b.on("drag", (p: Phaser.Input.Pointer) => {
        b.setPosition(p.worldX - 80, p.worldY - 13);
        const over = this.compAt(p.worldX, p.worldY);
        this.compBtns.forEach((cb, cid) => cb.setBackgroundColor(cid === over ? "#b7791f" : this.tested.has(cid) ? "#2c5282" : BTN));
      });
      b.on("dragend", (p: Phaser.Input.Pointer) => {
        const over = this.compAt(p.worldX, p.worldY);
        b.setPosition(home.x, home.y);
        this.compBtns.forEach((cb, cid) => cb.setBackgroundColor(this.tested.has(cid) ? "#2c5282" : BTN));
        if (over) this.use(over);
      });
    });
    this.select(LOOK);

    sc.comps.forEach((c, i) => {
      const b = this.tile(40 + (i % 2) * 205, 190 + Math.floor(i / 2) * 48, 195, 44, c.name, 12, () => this.use(c.id));
      this.compBtns.set(c.id, b);
    });
  }

  private compAt(x: number, y: number) {
    for (const [id, b] of this.compBtns) if (b.getBounds().contains(x, y)) return id;
    return null;
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
    this.choiceBtns = [];
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
    const now = this.scene.time.now;
    if (now - this.lastUse < 250) return;
    this.lastUse = now;

    if (item === sc.fix) {
      if (id !== sc.fault) {
        this.wrong(`${item} on the ${comp.name}: that isn't the problem.`, id);
        return;
      }
      this.solve(comp.name, !this.tested.has(id));
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
    const sc = this.sc!;
    this.solved = true;
    this.compBtns.forEach((c) => c.setVisible(false));
    this.readout.setText(`Placed: ${sc.fix} on the ${name}.${lucky ? " (Tip: measure or inspect first next time.)" : ""}`);
    const quiz = sc.quiz;
    this.symptom.setText(`Question: ${quiz.q}`);
    const choices = quiz.choices.map((text, i) => ({ text, i })).sort(() => Math.random() - 0.5);
    const wrongPicked = new Set<number>();
    choices.forEach((c, n) => {
      const b = this.button(40, 318 + n * 28, 400, c.text, 11, 5, () => {
        if (c.i === quiz.answer) {
          this.finish(sc.done);
        } else if (!wrongPicked.has(c.i)) {
          wrongPicked.add(c.i);
          this.mistakes++;
          this.readout.setText(`Not quite, try again. (mistakes: ${this.mistakes})`);
          b.setBackgroundColor("#c53030");
        }
      });
      this.choiceBtns.push(b);
    });
  }

  private finish(explain: string) {
    this.choiceBtns.forEach((b) => b.destroy());
    this.choiceBtns = [];
    this.readout.setText(`Correct! ${explain}\nMistakes: ${this.mistakes}`);
    this.button(40, 408, 120, "[ Continue ]", 12, 6, () => {
      const done = this.onDone;
      const m = this.mistakes;
      this.close();
      done?.(m);
    }).setBackgroundColor("#2f855a");
  }
}
