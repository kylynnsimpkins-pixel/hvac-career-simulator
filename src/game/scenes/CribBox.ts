import * as Phaser from "phaser";
import { CRIB_ITEMS } from "@/game/data/labGames";
import { iconKey } from "./icons";
import { roundRect } from "./fx";

const FONT = "monospace";

type Card = { name: string; bg: Phaser.GameObjects.Graphics; tag: Phaser.GameObjects.Text; x: number; y: number };

/** Tool crib / parts store: shelves of item pictures; tap one to check it out or return it. */
export class CribBox {
  private box: Phaser.GameObjects.Container;
  private cards: Card[] = [];
  private checked = new Set<string>();
  private running = false;
  private onClose: ((items: string[]) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    const panel = scene.add.graphics();
    panel.fillStyle(0x10162b, 0.97).fillRoundedRect(20, 100, 600, 350, 14);
    panel.lineStyle(3, 0x9ae6b4).strokeRoundedRect(20, 100, 600, 350, 14);
    const hit = scene.add.rectangle(320, 275, 600, 350, 0xffffff, 0.001).setInteractive();
    const title = scene.add.text(36, 110, "TOOL CRIB & PARTS STORE  -  tap an item to check it out or return it", { fontFamily: FONT, fontSize: "12px", color: "#9ae6b4", fontStyle: "bold" });
    const items: Phaser.GameObjects.GameObject[] = [panel, hit, title];
    const perRow = 5;
    CRIB_ITEMS.forEach((it, i) => {
      const x = 36 + (i % perRow) * 116;
      const y = 138 + Math.floor(i / perRow) * 140;
      const bg = scene.add.graphics();
      const icon = scene.add.image(x + 54, y + 48, iconKey(scene, it.name)).setScale(2.4);
      const label = scene.add.text(x + 54, y + 92, it.name, { fontFamily: FONT, fontSize: "10px", color: "#e6ecff", align: "center", wordWrap: { width: 104 } }).setOrigin(0.5, 0);
      const tag = scene.add.text(x + 54, y + 118, "", { fontFamily: FONT, fontSize: "10px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5, 0);
      const zone = scene.add.rectangle(x + 54, y + 62, 108, 128, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
      zone.on("pointerdown", () => {
        if (this.checked.has(it.name)) this.checked.delete(it.name);
        else this.checked.add(it.name);
        this.refresh();
      });
      this.cards.push({ name: it.name, bg, tag, x, y });
      items.push(bg, icon, label, tag, zone);
    });
    const done = scene.add
      .text(320, 428, "  Done  ", { fontFamily: FONT, fontSize: "14px", color: "#ffffff", backgroundColor: "#2f855a", padding: { x: 14, y: 6 } })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    done.on("pointerdown", () => this.close());
    items.push(done);
    this.box = scene.add.container(0, 0, items).setDepth(20000).setVisible(false);
    void roundRect;
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
    this.cards.forEach(({ name, bg, tag, x, y }) => {
      const out = this.checked.has(name);
      const type = CRIB_ITEMS.find((i) => i.name === name)!.type;
      bg.clear();
      bg.fillStyle(out ? 0x1f6b47 : 0x24304f, 1).fillRoundedRect(x, y, 108, 128, 10);
      bg.lineStyle(2, out ? 0x9ae6b4 : 0x3d4d78).strokeRoundedRect(x, y, 108, 128, 10);
      tag.setText(out ? `CHECKED OUT (${type})` : `on shelf (${type})`);
    });
  }

  private close() {
    this.running = false;
    this.box.setVisible(false);
    this.onClose?.([...this.checked]);
  }
}
