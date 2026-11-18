import * as Phaser from "phaser";
import { CRIB_ITEMS } from "@/game/data/labGames";

const FONT = "monospace";

/** Tool crib / parts store: toggle items checked out to the student. */
export class CribBox {
  private box: Phaser.GameObjects.Container;
  private rows: { name: string; text: Phaser.GameObjects.Text }[] = [];
  private checked = new Set<string>();
  private running = false;
  private onClose: ((items: string[]) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.rectangle(320, 270, 600, 340, 0x10162b, 0.97).setStrokeStyle(3, 0x9ae6b4).setInteractive();
    const title = scene.add.text(40, 108, "TOOL CRIB  -  tap an item to check it out or return it", { fontFamily: FONT, fontSize: "12px", color: "#9ae6b4", fontStyle: "bold" });
    const items: Phaser.GameObjects.GameObject[] = [bg, title];
    CRIB_ITEMS.forEach((it, i) => {
      const col = i < 5 ? 0 : 1;
      const row = i % 5;
      const t = scene.add
        .text(46 + col * 290, 140 + row * 44, "", { fontFamily: FONT, fontSize: "13px", color: "#e6ecff", backgroundColor: "#24304f", padding: { x: 8, y: 7 }, fixedWidth: 270 })
        .setInteractive({ useHandCursor: true });
      t.on("pointerdown", () => {
        if (this.checked.has(it.name)) this.checked.delete(it.name);
        else this.checked.add(it.name);
        this.refresh();
      });
      this.rows.push({ name: it.name, text: t });
      items.push(t);
    });
    const done = scene.add
      .text(320, 400, "  Done  ", { fontFamily: FONT, fontSize: "14px", color: "#ffffff", backgroundColor: "#2f855a", padding: { x: 14, y: 8 } })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    done.on("pointerdown", () => this.close());
    items.push(done);
    this.box = scene.add.container(0, 0, items).setDepth(20000).setVisible(false);
  }

  get active() {
    return this.running;
  }

  open(current: string[], onClose: (items: string[]) => void) {
    this.checked = new Set(current);
    this.onClose = onClose;
    this.running = true;
    this.refresh();
    this.box.setVisible(true);
  }

  private refresh() {
    this.rows.forEach(({ name, text }) => {
      const it = CRIB_ITEMS.find((i) => i.name === name)!;
      const out = this.checked.has(name);
      text.setText(`${out ? "[OUT] " : "[ in] "}${name} (${it.type})`).setBackgroundColor(out ? "#2f855a" : "#24304f");
    });
  }

  private close() {
    this.running = false;
    this.box.setVisible(false);
    this.onClose?.([...this.checked]);
  }
}
