import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { EXAM_MINUTES, EXAM_SECTIONS, PASS_MARK, type ExamSection } from "@/game/data/epaExam";
import { addCertification } from "@/game/systems/certificationSystem";
import type { QuizQuestion } from "./QuizBox";

const FONT = "monospace";
const LETTERS = ["A", "B", "C", "D"];

interface Item {
  section: ExamSection;
  q: QuizQuestion;
}

/** Proctored EPA 608 exam: no feedback until submit, 70% needed in each section. */
export class ExamScene extends Phaser.Scene {
  private items: Item[] = [];
  private sections: ExamSection[] = [];
  private answers: number[] = [];
  private index = 0;
  private secondsLeft = EXAM_MINUTES * 60;
  private submitted = false;
  private warned = false;
  private ui: Phaser.GameObjects.GameObject[] = [];
  private header!: Phaser.GameObjects.Text;
  private timer!: Phaser.GameObjects.Text;
  private qText!: Phaser.GameObjects.Text;
  private opts: Phaser.GameObjects.Text[] = [];
  private grid: Phaser.GameObjects.Rectangle[] = [];
  private tabs: Phaser.GameObjects.Text[] = [];
  private note!: Phaser.GameObjects.Text;
  private tick = 0;

  constructor() {
    super("ExamScene");
  }

  create() {
    const a = useGameStore.getState().active;
    if (!a || !a.graduated) {
      this.scene.start("CampusScene");
      return;
    }
    this.sections = EXAM_SECTIONS.filter((s) => !a.epaSections.includes(s.id));
    this.items = this.sections.flatMap((section) => section.questions.map((q) => ({ section, q })));
    this.answers = this.items.map(() => -1);
    this.index = 0;
    this.secondsLeft = EXAM_MINUTES * 60;
    this.submitted = false;
    this.warned = false;
    this.opts = [];
    this.grid = [];
    this.tabs = [];

    this.add.rectangle(320, 240, 640, 480, 0x3b2a1a);
    for (let y = 0; y < 480; y += 24) this.add.rectangle(320, y, 640, 1, 0x000000, 0.2);
    if (this.items.length === 0) {
      this.showDone(a.playerName);
      return;
    }

    this.add.rectangle(322, 258, 612, 424, 0x000000, 0.3);
    this.add.rectangle(320, 255, 612, 424, 0xf8f4e3).setStrokeStyle(2, 0xb8a78a);
    this.add.rectangle(320, 56, 612, 38, 0x1a3a6b);
    this.header = this.add.text(18, 40, "U.S. EPA SECTION 608 TECHNICIAN CERTIFICATION", { fontFamily: FONT, fontSize: "13px", color: "#ffffff", fontStyle: "bold" });
    this.add.text(18, 58, `Candidate: ${a.playerName}   Proctor: Mr. Simpkins   Pass mark: ${PASS_MARK * 100}% per section`, { fontFamily: FONT, fontSize: "9px", color: "#bcd0f5" });
    this.timer = this.add.text(622, 48, "", { fontFamily: FONT, fontSize: "14px", color: "#fde047", fontStyle: "bold" }).setOrigin(1, 0);

    this.sections.forEach((s, i) => {
      const t = this.add
        .text(18 + i * 92, 84, ` ${s.name} `, { fontFamily: FONT, fontSize: "11px", color: "#1f2937", backgroundColor: "#d6cdb5", padding: { x: 4, y: 3 } })
        .setInteractive({ useHandCursor: true });
      t.on("pointerdown", () => this.goto(this.items.findIndex((it) => it.section.id === s.id)));
      this.tabs.push(t);
    });
    this.add
      .text(622, 84, "[ Leave exam ]", { fontFamily: FONT, fontSize: "10px", color: "#b91c1c" })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("CampusScene"));

    this.qText = this.add.text(24, 116, "", { fontFamily: FONT, fontSize: "14px", color: "#111827", wordWrap: { width: 590 }, lineSpacing: 3 });
    for (let i = 0; i < 4; i++) {
      const o = this.add
        .text(30, 176 + i * 46, "", { fontFamily: FONT, fontSize: "13px", color: "#111827", backgroundColor: "#ece5cf", padding: { x: 8, y: 8 }, fixedWidth: 576, wordWrap: { width: 556 } })
        .setInteractive({ useHandCursor: true });
      o.on("pointerdown", () => this.pick(i));
      this.opts.push(o);
    }

    this.items.forEach((_, i) => {
      const r = this.add
        .rectangle(32 + (i % 27) * 21, 380 + Math.floor(i / 27) * 20, 17, 17, 0xd6cdb5)
        .setStrokeStyle(1, 0x7c6f55)
        .setInteractive({ useHandCursor: true });
      r.on("pointerdown", () => this.goto(i));
      this.grid.push(r);
    });
    this.note = this.add.text(24, 408, "", { fontFamily: FONT, fontSize: "10px", color: "#b45309" });

    const btn = (x: number, label: string, color: string, go: () => void) =>
      this.add
        .text(x, 446, label, { fontFamily: FONT, fontSize: "13px", color: "#ffffff", backgroundColor: color, padding: { x: 10, y: 6 } })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", go);
    btn(90, "< Previous", "#475569", () => this.goto(this.index - 1));
    btn(210, "Next >", "#475569", () => this.goto(this.index + 1));
    btn(540, "Submit exam", "#b91c1c", () => this.submit());

    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      if (this.submitted) return;
      const k = e.key.toLowerCase();
      if ("abcd".includes(k) && k.length === 1) this.pick("abcd".indexOf(k));
      else if (e.key >= "1" && e.key <= "4") this.pick(Number(e.key) - 1);
      else if (e.key === "ArrowRight") this.goto(this.index + 1);
      else if (e.key === "ArrowLeft") this.goto(this.index - 1);
    });
    this.render();
  }

  update(_t: number, delta: number) {
    if (!this.timer || this.submitted) return;
    this.tick += delta;
    if (this.tick < 1000) return;
    this.tick = 0;
    this.secondsLeft = Math.max(0, this.secondsLeft - 1);
    if (this.secondsLeft === 0) this.finish();
    this.timer.setText(`${String(Math.floor(this.secondsLeft / 60)).padStart(2, "0")}:${String(this.secondsLeft % 60).padStart(2, "0")}`);
  }

  private goto(i: number) {
    if (i < 0 || i >= this.items.length) return;
    this.index = i;
    this.render();
  }

  private pick(i: number) {
    if (i >= this.items[this.index].q.choices.length) return;
    this.answers[this.index] = i;
    this.render();
  }

  private render() {
    const it = this.items[this.index];
    const inSection = this.items.filter((x) => x.section.id === it.section.id);
    const n = inSection.indexOf(it) + 1;
    this.qText.setText(`${it.section.name} ${n}/${inSection.length}.  ${it.q.q}`);
    this.opts.forEach((o, i) => {
      const on = this.answers[this.index] === i;
      o.setVisible(i < it.q.choices.length)
        .setText(`(${on ? "●" : " "}) ${LETTERS[i]}.  ${it.q.choices[i] ?? ""}`)
        .setBackgroundColor(on ? "#bfdbfe" : "#ece5cf");
    });
    this.grid.forEach((r, i) => r.setFillStyle(i === this.index ? 0xfde047 : this.answers[i] >= 0 ? 0x93c5fd : 0xd6cdb5));
    this.tabs.forEach((t, i) => t.setBackgroundColor(this.sections[i].id === it.section.id ? "#fde047" : "#d6cdb5"));
    const open = this.answers.filter((a) => a < 0).length;
    this.note.setText(`${this.answers.length - open}/${this.answers.length} answered. Press A-D or tap to answer, arrows to move.${this.warned ? `  ${open} unanswered - press Submit again to confirm.` : ""}`);
  }

  private submit() {
    const open = this.answers.filter((a) => a < 0).length;
    if (open > 0 && !this.warned) {
      this.warned = true;
      this.render();
      return;
    }
    this.finish();
  }

  private finish() {
    if (this.submitted) return;
    this.submitted = true;
    this.children.removeAll();
    this.add.rectangle(320, 240, 640, 480, 0x3b2a1a);
    this.add.rectangle(320, 245, 560, 430, 0xf8f4e3).setStrokeStyle(3, 0xb8a78a);
    this.add.text(320, 52, "EXAM RESULTS", { fontFamily: FONT, fontSize: "20px", color: "#1a3a6b", fontStyle: "bold" }).setOrigin(0.5);

    const store = useGameStore.getState();
    const a = store.active!;
    const rows = this.sections.map((s) => {
      const picks = this.items.map((it, i) => ({ it, a: this.answers[i] })).filter((x) => x.it.section.id === s.id);
      const score = picks.filter((x) => x.a === x.it.q.answer).length;
      return { s, score, total: picks.length, pass: score / picks.length >= PASS_MARK };
    });
    rows.forEach((r, i) => {
      const y = 92 + i * 34;
      this.add.text(70, y, `${r.s.name.padEnd(8)} ${r.score}/${r.total}  (${Math.round((r.score / r.total) * 100)}%)`, { fontFamily: FONT, fontSize: "14px", color: "#111827" });
      this.add.text(560, y, r.pass ? "PASS" : "FAIL", { fontFamily: FONT, fontSize: "14px", color: r.pass ? "#15803d" : "#b91c1c", fontStyle: "bold" }).setOrigin(1, 0);
    });

    const passed = [...new Set([...a.epaSections, ...rows.filter((r) => r.pass).map((r) => r.s.id)])];
    const hadCert = a.certifications.includes("EPA 608");
    const certified = passed.includes("core") && ["type1", "type2", "type3"].some((t) => passed.includes(t));
    let message: string;
    if (certified) {
      const universal = ["type1", "type2", "type3"].every((t) => passed.includes(t));
      const types = ["type1", "type2", "type3"].filter((t) => passed.includes(t)).map((t) => t.replace("type", "Type "));
      message = `CERTIFIED: EPA 608 ${universal ? "Universal" : types.join(" + ")}`;
      if (!hadCert) {
        store.reward({ xp: 150, graduationPoints: 0, skill: "safety", skillPoints: 3 });
        message += "\n+150 XP, +3 Safety skill points";
      }
      const s2 = useGameStore.getState();
      s2.patch({ epaSections: passed, certifications: addCertification(s2.active!, "epa608") });
      this.add.rectangle(320, 330, 440, 90, 0xfffbe6).setStrokeStyle(4, 0xb7791f);
      this.add.text(320, 330, `${message}\nCandidate: ${a.playerName}`, { fontFamily: FONT, fontSize: "14px", color: "#7c4a03", align: "center", fontStyle: "bold" }).setOrigin(0.5);
    } else {
      store.patch({ epaSections: passed });
      const missing = rows.filter((r) => !r.pass).map((r) => r.s.name).join(", ");
      this.add.text(320, 330, `Not certified yet. Retake: ${missing}.\nPassed sections are saved, so you only retake the rest.`, { fontFamily: FONT, fontSize: "13px", color: "#b91c1c", align: "center" }).setOrigin(0.5);
    }
    this.add
      .text(320, 438, "  Return to campus  ", { fontFamily: FONT, fontSize: "14px", color: "#ffffff", backgroundColor: "#2f855a", padding: { x: 12, y: 8 } })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }

  private showDone(name: string) {
    this.add.rectangle(320, 240, 520, 220, 0xf8f4e3).setStrokeStyle(3, 0xb8a78a);
    this.add.text(320, 210, `${name}, you have passed every section of the EPA 608 exam.\nYou are Universal certified!`, { fontFamily: FONT, fontSize: "14px", color: "#15803d", align: "center", fontStyle: "bold" }).setOrigin(0.5);
    this.add
      .text(320, 290, "  Return to campus  ", { fontFamily: FONT, fontSize: "14px", color: "#ffffff", backgroundColor: "#2f855a", padding: { x: 12, y: 8 } })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }
}
