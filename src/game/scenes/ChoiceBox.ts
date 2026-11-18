import * as Phaser from "phaser";

const FONT = "monospace";

/** Numbered menu panel. Pick with number keys (1-9) or by tapping an option. */
export class ChoiceBox {
  private box: Phaser.GameObjects.Container;
  private header: Phaser.GameObjects.Text;
  private sub: Phaser.GameObjects.Text;
  private rows: Phaser.GameObjects.Text[] = [];
  private onPick: ((i: number) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.rectangle(320, 270, 600, 330, 0x10162b, 0.97).setStrokeStyle(3, 0x68d391).setInteractive();
    this.header = scene.add.text(40, 118, "", { fontFamily: FONT, fontSize: "12px", color: "#68d391", fontStyle: "bold" });
    this.sub = scene.add.text(40, 136, "", { fontFamily: FONT, fontSize: "11px", color: "#a0aec0", wordWrap: { width: 560 } });
    const items: Phaser.GameObjects.GameObject[] = [bg, this.header, this.sub];
    for (let i = 0; i < 9; i++) {
      const t = scene.add
        .text(48, 158 + i * 29, "", { fontFamily: FONT, fontSize: "12px", color: "#e6ecff", backgroundColor: "#24304f", padding: { x: 8, y: 4 }, fixedWidth: 544, wordWrap: { width: 528 } })
        .setInteractive({ useHandCursor: true });
      t.on("pointerdown", () => this.pick(i));
      this.rows.push(t);
      items.push(t);
    }
    this.box = scene.add.container(0, 0, items).setDepth(20000).setVisible(false);
    scene.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      if (this.onPick && e.key >= "1" && e.key <= "9") this.pick(Number(e.key) - 1);
    });
  }

  get active() {
    return this.onPick !== null;
  }

  start(title: string, sub: string, options: string[], onPick: (i: number) => void) {
    this.header.setText(title);
    this.sub.setText(sub);
    this.rows.forEach((r, i) => r.setVisible(i < options.length).setText(`${i + 1}. ${options[i] ?? ""}`));
    this.onPick = onPick;
    this.box.setVisible(true);
  }

  private pick(i: number) {
    const cb = this.onPick;
    if (!cb || !this.rows[i]?.visible) return;
    this.onPick = null;
    this.box.setVisible(false);
    cb(i);
  }
}
