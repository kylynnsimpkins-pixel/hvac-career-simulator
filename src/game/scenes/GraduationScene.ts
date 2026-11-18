import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { DialogueBox } from "./DialogueBox";
import { addVignette } from "./fx";

const FONT = "monospace";

/** Graduation ceremony, shown once when the player reaches the required points. */
export class GraduationScene extends Phaser.Scene {
  private dialogue!: DialogueBox;
  private grad!: Phaser.GameObjects.Image;
  private done = false;

  constructor() {
    super("GraduationScene");
  }

  create() {
    const a = useGameStore.getState().active;
    if (!a || !this.textures.exists("player-0")) {
      this.scene.start("CampusScene");
      return;
    }
    this.done = false;
    this.add.rectangle(320, 240, 640, 480, 0x2b1f3a);
    this.add.rectangle(320, 90, 640, 180, 0x3a2a52);
    this.add.rectangle(320, 300, 640, 360, 0x7a1f2b);
    for (let y = 130; y < 480; y += 16) this.add.rectangle(320, y, 640, 1, 0x000000, 0.12);

    this.add.rectangle(320, 70, 400, 52, 0xfde047).setStrokeStyle(3, 0xb7791f);
    this.add.text(320, 70, "CONGRATULATIONS\nHVAC CLASS GRADUATES", { fontFamily: FONT, fontSize: "16px", color: "#3b2a07", align: "center", fontStyle: "bold" }).setOrigin(0.5);
    [60, 580].forEach((x) => {
      this.add.rectangle(x, 100, 6, 120, 0x9ca3af);
      this.add.rectangle(x, 60, 42, 28, 0x1a3a6b).setStrokeStyle(2, 0xfde047);
      this.add.text(x, 60, "HVAC", { fontFamily: FONT, fontSize: "10px", color: "#ffffff" }).setOrigin(0.5);
    });

    this.add.rectangle(320, 200, 90, 70, 0x6b4423).setStrokeStyle(2, 0x3b2a1a);
    this.add.rectangle(320, 168, 100, 8, 0x8a5a2b);
    this.add.rectangle(320, 160, 4, 20, 0x374151);
    this.add.circle(320, 148, 4, 0xfde047);
    this.add.image(320, 200, "teacher").setScale(1).setOrigin(0.5, 1).setDepth(5);
    this.add.rectangle(320, 214, 90, 40, 0x6b4423).setStrokeStyle(2, 0x3b2a1a).setDepth(6);
    this.add.text(320, 214, "HVAC", { fontFamily: FONT, fontSize: "11px", color: "#fde047" }).setOrigin(0.5).setDepth(7);

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 9; c++) {
        const x = 50 + c * 67;
        const y = 290 + r * 40;
        this.add.rectangle(x, y, 26, 22, 0x1f2937).setStrokeStyle(1, 0x0b1220);
        this.add.circle(x, y - 18, 7, [0xe0ac84, 0x8d5524, 0xf1c27d, 0xc68642][(r + c) % 4]).setDepth(y);
        this.add.rectangle(x, y - 6, 16, 10, [0x2563eb, 0xdc2626, 0x16a34a, 0xf59e0b][(r * 3 + c) % 4]).setDepth(y);
      }
    }
    this.add.rectangle(320, 250, 64, 330, 0xb91c1c, 0.0);

    this.grad = this.add.image(-40, 250, "player-0").setScale(0.8).setOrigin(0.5, 1).setDepth(300).setTint(0x1f2937);
    const cap = this.add.rectangle(-40, 215, 22, 5, 0x111827).setDepth(301);
    const tassel = this.add.rectangle(-31, 220, 2, 8, 0xfde047).setDepth(301);
    this.dialogue = new DialogueBox(this);
    this.input.keyboard!.on("keydown-SPACE", () => this.dialogue.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.dialogue.advance());
    this.input.on("pointerdown", () => this.dialogue.advance());
    addVignette(this);

    const pace = { v: 0 };
    this.tweens.add({
      targets: pace,
      v: 1,
      duration: 3000,
      onUpdate: () => {
        const x = -40 + pace.v * 340;
        this.grad.setX(x).setTexture(`player-${Math.floor(pace.v * 14) % 2}`);
        cap.setX(x);
        tassel.setX(x + 9);
      },
      onComplete: () => {
        this.grad.setTexture("player-0");
        this.confetti();
        this.dialogue.start(
          [
            { speaker: "Mr. Simpkins", text: `Ladies and gentlemen, ${a.playerName} has earned the HVAC Program diploma!` },
            { speaker: "Mr. Simpkins", text: "You have put in the hours, passed the labs and diagnosed the broken equipment. We are proud of you." },
            { speaker: "Mr. Simpkins", text: "Your next step is the EPA 608 certification. You cannot buy refrigerant or work on most systems without it." },
            { speaker: "Mr. Simpkins", text: "Visit the EPA 608 Test Center on campus when you are ready, or take it right now." },
          ],
          () => this.choose(),
        );
      },
    });
  }

  private confetti() {
    const colors = [0xfde047, 0xef4444, 0x3b82f6, 0x22c55e, 0xf472b6];
    for (let i = 0; i < 70; i++) {
      const p = this.add.rectangle(Phaser.Math.Between(0, 640), Phaser.Math.Between(-200, 0), 5, 8, colors[i % 5]).setDepth(900);
      this.tweens.add({
        targets: p,
        y: 500,
        x: p.x + Phaser.Math.Between(-60, 60),
        angle: Phaser.Math.Between(180, 720),
        duration: Phaser.Math.Between(2500, 5000),
        delay: Phaser.Math.Between(0, 1500),
        repeat: -1,
      });
    }
  }

  private choose() {
    if (this.done) return;
    this.done = true;
    useGameStore.getState().patch({ graduationSeen: true });
    this.add.rectangle(320, 400, 616, 112, 0x10162b, 0.95).setStrokeStyle(3, 0xfde047).setDepth(20000);
    this.add.text(320, 366, "Diploma earned! Take the EPA 608 exam now?", { fontFamily: FONT, fontSize: "14px", color: "#fde047" }).setOrigin(0.5).setDepth(20001);
    const btn = (x: number, label: string, color: string, scene: string) =>
      this.add
        .text(x, 412, label, { fontFamily: FONT, fontSize: "14px", color: "#ffffff", backgroundColor: color, padding: { x: 12, y: 8 } })
        .setOrigin(0.5)
        .setDepth(20001)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.scene.start(scene));
    btn(200, "Take EPA 608 exam", "#b91c1c", "ExamScene");
    btn(450, "Later", "#2f855a", "CampusScene");
  }
}
