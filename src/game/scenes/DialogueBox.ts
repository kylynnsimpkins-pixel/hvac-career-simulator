import * as Phaser from "phaser";
import type { DialogueLine } from "@/game/data/dialogue";

const FONT = "monospace";

/** Bottom-of-screen dialogue panel with typewriter text and a teacher portrait. */
export class DialogueBox {
  private box: Phaser.GameObjects.Container;
  private speaker: Phaser.GameObjects.Text;
  private body: Phaser.GameObjects.Text;
  private typing: Phaser.Time.TimerEvent | null = null;
  private current: { lines: DialogueLine[]; index: number; onDone: () => void } | null = null;

  constructor(private scene: Phaser.Scene) {
    const bg = scene.add.rectangle(320, 410, 616, 112, 0x10162b, 0.95).setStrokeStyle(3, 0xfde047);
    const portraitBg = scene.add.rectangle(66, 410, 84, 96, 0x24304f).setStrokeStyle(2, 0x8aa0d6);
    const portrait = scene.add.image(66, 440, "teacher").setScale(1.6).setOrigin(0.5, 1);
    this.speaker = scene.add.text(124, 366, "", { fontFamily: FONT, fontSize: "13px", color: "#fde047", fontStyle: "bold" });
    this.body = scene.add.text(124, 386, "", { fontFamily: FONT, fontSize: "13px", color: "#ffffff", wordWrap: { width: 480 } });
    const hint = scene.add.text(612, 458, "SPACE / tap ▶", { fontFamily: FONT, fontSize: "10px", color: "#8aa0d6" }).setOrigin(1, 1);
    this.box = scene.add.container(0, 0, [bg, portraitBg, portrait, this.speaker, this.body, hint]).setDepth(20000).setVisible(false);
  }

  get active(): boolean {
    return this.current !== null;
  }

  start(lines: DialogueLine[], onDone: () => void) {
    this.current = { lines, index: 0, onDone };
    this.box.setVisible(true);
    this.show();
  }

  advance() {
    const d = this.current;
    if (!d) return;
    const line = d.lines[d.index];
    if (this.typing && this.typing.getRepeatCount() > 0) {
      this.typing.remove();
      this.typing = null;
      this.body.setText(line.text);
      return;
    }
    if (d.index + 1 < d.lines.length) {
      d.index++;
      this.show();
      return;
    }
    this.current = null;
    this.box.setVisible(false);
    d.onDone();
  }

  private show() {
    const d = this.current!;
    const line = d.lines[d.index];
    this.speaker.setText(line.speaker);
    this.body.setText("");
    let i = 0;
    this.typing?.remove();
    this.typing = this.scene.time.addEvent({
      delay: 22,
      repeat: line.text.length - 1,
      callback: () => this.body.setText(line.text.slice(0, ++i)),
    });
  }
}
