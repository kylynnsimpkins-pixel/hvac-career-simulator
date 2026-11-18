import * as Phaser from "phaser";

const FONT = "monospace";

export interface QuizQuestion {
  q: string;
  choices: string[];
  answer: number;
  why: string;
}

/** Multiple-choice quiz panel. Pick with 1-4 / click; any key or click continues after feedback. */
export class QuizBox {
  private box: Phaser.GameObjects.Container;
  private header: Phaser.GameObjects.Text;
  private question: Phaser.GameObjects.Text;
  private options: Phaser.GameObjects.Text[] = [];
  private feedback: Phaser.GameObjects.Text;
  private hint: Phaser.GameObjects.Text;
  private run: { qs: QuizQuestion[]; i: number; correct: number; answered: boolean; onDone: (correct: number) => void } | null = null;

  constructor(private scene: Phaser.Scene) {
    const bg = scene.add.rectangle(320, 270, 600, 330, 0x10162b, 0.97).setStrokeStyle(3, 0xfde047).setInteractive();
    this.header = scene.add.text(40, 120, "", { fontFamily: FONT, fontSize: "12px", color: "#fde047", fontStyle: "bold" });
    this.question = scene.add.text(40, 146, "", { fontFamily: FONT, fontSize: "14px", color: "#ffffff", wordWrap: { width: 560 } });
    this.feedback = scene.add.text(40, 190, "", { fontFamily: FONT, fontSize: "13px", color: "#9ae6b4", wordWrap: { width: 560 } }).setVisible(false);
    this.hint = scene.add.text(600, 428, "", { fontFamily: FONT, fontSize: "10px", color: "#8aa0d6" }).setOrigin(1, 1);
    const items: Phaser.GameObjects.GameObject[] = [bg, this.header, this.question, this.feedback, this.hint];
    for (let i = 0; i < 4; i++) {
      const t = scene.add
        .text(52, 214 + i * 38, "", { fontFamily: FONT, fontSize: "13px", color: "#e6ecff", backgroundColor: "#24304f", padding: { x: 8, y: 6 }, fixedWidth: 536, wordWrap: { width: 520 } })
        .setInteractive({ useHandCursor: true });
      t.on("pointerdown", () => this.pick(i));
      this.options.push(t);
      items.push(t);
    }
    bg.on("pointerdown", () => this.next());
    this.box = scene.add.container(0, 0, items).setDepth(20000).setVisible(false);
    scene.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      if (!this.run) return;
      if (!this.run.answered && e.key >= "1" && e.key <= "4") this.pick(Number(e.key) - 1);
      else if (this.run.answered && (e.key === " " || e.key === "Enter")) this.next();
    });
  }

  get active(): boolean {
    return this.run !== null;
  }

  start(qs: QuizQuestion[], onDone: (correct: number) => void) {
    this.run = { qs, i: 0, correct: 0, answered: false, onDone };
    this.box.setVisible(true);
    this.show();
  }

  private show() {
    const r = this.run!;
    const q = r.qs[r.i];
    r.answered = false;
    this.header.setText(`DAILY QUIZ  -  Question ${r.i + 1} of ${r.qs.length}`);
    this.question.setText(q.q);
    this.feedback.setVisible(false);
    this.options.forEach((o, i) => {
      o.setVisible(i < q.choices.length).setText(`${i + 1}. ${q.choices[i] ?? ""}`).setBackgroundColor("#24304f");
    });
    this.hint.setText("Press 1-4 or tap an answer");
  }

  private pick(i: number) {
    const r = this.run;
    if (!r || r.answered) return;
    const q = r.qs[r.i];
    r.answered = true;
    const ok = i === q.answer;
    if (ok) r.correct++;
    this.options.forEach((o, n) => {
      if (n === q.answer) o.setBackgroundColor("#2f855a");
      else if (n === i) o.setBackgroundColor("#c53030");
    });
    this.feedback.setText(`${ok ? "Correct!" : "Not quite."} ${q.why}`).setColor(ok ? "#9ae6b4" : "#feb2b2").setVisible(true).setY(214 + q.choices.length * 38 + 6);
    this.hint.setText("SPACE / tap to continue");
  }

  private next() {
    const r = this.run;
    if (!r || !r.answered) return;
    if (r.i + 1 < r.qs.length) {
      r.i++;
      this.show();
      return;
    }
    this.run = null;
    this.box.setVisible(false);
    r.onDone(r.correct);
  }
}
