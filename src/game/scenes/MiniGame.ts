import * as Phaser from "phaser";

const FONT = "monospace";
const BTN = "#24304f";

type Btn = Phaser.GameObjects.Text;

/** Overlay for the sequence and match station mini games. Reports mistakes when finished. */
export class MiniGame {
  private box: Phaser.GameObjects.Container;
  private title: Phaser.GameObjects.Text;
  private prompt: Phaser.GameObjects.Text;
  private status: Phaser.GameObjects.Text;
  private dyn: Phaser.GameObjects.GameObject[] = [];
  private running = false;
  private mistakes = 0;
  private onDone: ((mistakes: number) => void) | null = null;

  constructor(private scene: Phaser.Scene) {
    const bg = scene.add.rectangle(320, 270, 600, 330, 0x10162b, 0.97).setStrokeStyle(3, 0x63b3ed).setInteractive();
    this.title = scene.add.text(40, 120, "", { fontFamily: FONT, fontSize: "12px", color: "#63b3ed", fontStyle: "bold" });
    this.prompt = scene.add.text(40, 142, "", { fontFamily: FONT, fontSize: "13px", color: "#ffffff", wordWrap: { width: 460 } });
    this.status = scene.add.text(40, 412, "", { fontFamily: FONT, fontSize: "12px", color: "#feb2b2" });
    const leave = scene.add
      .text(600, 118, "[ Leave ]", { fontFamily: FONT, fontSize: "11px", color: "#feb2b2" })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    leave.on("pointerdown", () => this.close());
    this.box = scene.add.container(0, 0, [bg, this.title, this.prompt, this.status, leave]).setDepth(20000).setVisible(false);
  }

  get active() {
    return this.running;
  }

  private button(x: number, y: number, w: number, label: string, onClick: () => void): Btn {
    const t = this.scene.add
      .text(x, y, label, { fontFamily: FONT, fontSize: "13px", color: "#e6ecff", backgroundColor: BTN, padding: { x: 8, y: 7 }, fixedWidth: w })
      .setInteractive({ useHandCursor: true });
    t.on("pointerdown", onClick);
    this.box.add(t);
    this.dyn.push(t);
    return t;
  }

  private begin(title: string, prompt: string, onDone: (mistakes: number) => void) {
    this.dyn.forEach((o) => o.destroy());
    this.dyn = [];
    this.mistakes = 0;
    this.onDone = onDone;
    this.running = true;
    this.title.setText(title);
    this.prompt.setText(prompt);
    this.status.setText("");
    this.box.setVisible(true);
  }

  private close() {
    this.running = false;
    this.onDone = null;
    this.box.setVisible(false);
  }

  private finish() {
    const done = this.onDone;
    const m = this.mistakes;
    this.scene.time.delayedCall(450, () => {
      if (!this.running) return;
      this.close();
      done?.(m);
    });
  }

  private flashWrong(btn: Btn) {
    this.mistakes++;
    this.status.setText(`Not quite. Mistakes: ${this.mistakes}`);
    btn.setBackgroundColor("#c53030");
    this.scene.time.delayedCall(350, () => btn.active && btn.setBackgroundColor(BTN));
  }

  startSequence(title: string, prompt: string, steps: string[], onDone: (mistakes: number) => void) {
    this.begin(title, prompt, onDone);
    let next = 0;
    const order = steps.map((s, i) => ({ s, i })).sort(() => Math.random() - 0.5);
    order.forEach((o, n) => {
      const b = this.button(50, 190 + n * 40, 500, o.s, () => {
        if (b.getData("done")) return;
        if (o.i === next) {
          b.setData("done", true).setBackgroundColor("#2f855a").setText(`${next + 1}. ${o.s}`);
          next++;
          if (next === steps.length) this.finish();
        } else this.flashWrong(b);
      });
    });
  }

  startMatch(title: string, prompt: string, pairs: [string, string][], onDone: (mistakes: number) => void) {
    this.begin(title, prompt, onDone);
    let selected: { btn: Btn; i: number } | null = null;
    let solved = 0;
    pairs.forEach(([left], i) => {
      const b = this.button(50, 190 + i * 46, 240, left, () => {
        if (b.getData("done")) return;
        selected?.btn.setBackgroundColor(BTN);
        selected = { btn: b, i };
        b.setBackgroundColor("#b7791f");
      });
    });
    pairs
      .map(([, right], i) => ({ right, i }))
      .sort(() => Math.random() - 0.5)
      .forEach((o, n) => {
        const b = this.button(340, 190 + n * 46, 240, o.right, () => {
          if (b.getData("done") || !selected) return;
          if (selected.i === o.i) {
            selected.btn.setData("done", true).setBackgroundColor("#2f855a");
            b.setData("done", true).setBackgroundColor("#2f855a");
            selected = null;
            if (++solved === pairs.length) this.finish();
          } else {
            this.flashWrong(b);
          }
        });
      });
  }
}
