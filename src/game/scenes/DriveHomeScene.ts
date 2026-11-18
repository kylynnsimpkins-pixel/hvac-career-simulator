import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { addVignette } from "./fx";

const FONT = "monospace";

/** End-of-class cutscene: the student drives home, then picks what to do next. */
export class DriveHomeScene extends Phaser.Scene {
  constructor() {
    super("DriveHomeScene");
  }

  create() {
    const a = useGameStore.getState().active;
    this.cameras.main.fadeIn(500);

    this.add.rectangle(320, 120, 640, 240, 0xf59e6b);
    this.add.rectangle(320, 190, 640, 100, 0xfcd29a);
    this.add.circle(470, 170, 46, 0xfff1b8);
    const hills = this.add.graphics();
    hills.fillStyle(0x6b5b95).fillTriangle(-40, 250, 120, 140, 280, 250).fillTriangle(180, 250, 360, 120, 540, 250);
    hills.fillStyle(0x4a3f6b).fillTriangle(380, 250, 560, 150, 700, 250);

    const skyline = this.add.container(0, 0);
    for (let i = 0; i < 14; i++) {
      const h = 40 + ((i * 37) % 50);
      skyline.add(this.add.rectangle(i * 52, 250 - h / 2, 36, h, 0x2d2a4a));
      skyline.add(this.add.rectangle(i * 52, 250 - h + 6, 8, 5, 0xffe08a));
    }
    this.tweens.add({ targets: skyline, x: -104, duration: 3200, repeat: -1 });

    this.add.rectangle(320, 300, 640, 120, 0x3b3f4a);
    this.add.rectangle(320, 250, 640, 20, 0x4f8a4b);
    this.add.rectangle(320, 362, 640, 12, 0x6b6f7a);
    const dashes = this.add.container(0, 0);
    for (let i = 0; i < 14; i++) dashes.add(this.add.rectangle(i * 70, 306, 36, 5, 0xfde047));
    this.tweens.add({ targets: dashes, x: -140, duration: 700, repeat: -1 });

    const poles = this.add.container(0, 0);
    for (let i = 0; i < 6; i++) {
      poles.add(this.add.rectangle(i * 160, 214, 6, 70, 0x5b3a1e));
      poles.add(this.add.rectangle(i * 160, 182, 36, 5, 0x5b3a1e));
    }
    this.tweens.add({ targets: poles, x: -320, duration: 1800, repeat: -1 });

    const car = this.add.container(150, 318);
    car.add(this.add.rectangle(0, 0, 96, 26, 0x2563eb).setStrokeStyle(2, 0x1e3a8a));
    car.add(this.add.rectangle(-4, -20, 52, 20, 0x3b82f6).setStrokeStyle(2, 0x1e3a8a));
    car.add(this.add.rectangle(-4, -20, 40, 12, 0xbfe3ff));
    car.add(this.add.circle(-5, -22, 5, parseInt((a?.avatarColor ?? "#38bdf8").slice(1), 16)));
    car.add(this.add.rectangle(46, -2, 6, 8, 0xfff3a3));
    car.add(this.add.circle(-28, 14, 10, 0x111111).setStrokeStyle(2, 0x777777));
    car.add(this.add.circle(28, 14, 10, 0x111111).setStrokeStyle(2, 0x777777));
    this.tweens.add({ targets: car, y: 320, duration: 160, yoyo: true, repeat: -1 });

    const stats = a
      ? `Day ${a.lessonDay} done  -  XP ${a.xp}  -  Graduation ${a.graduationPoints}  -  $${a.money}`
      : "Day complete";
    this.add.text(320, 40, "Driving home...", { fontFamily: FONT, fontSize: "22px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(320, 70, stats, { fontFamily: FONT, fontSize: "12px", color: "#fde68a" }).setOrigin(0.5);
    addVignette(this);

    this.time.delayedCall(4500, () => this.showChoices());
  }

  private showChoices() {
    const panel = this.add.rectangle(320, 424, 600, 90, 0x10162b, 0.95).setStrokeStyle(3, 0xfde047);
    this.add.text(320, 392, "You pull into the driveway. Your phone buzzes: a service call.", { fontFamily: FONT, fontSize: "13px", color: "#ffffff" }).setOrigin(0.5);
    const btn = (x: number, label: string, color: string, go: () => void) =>
      this.add
        .text(x, 430, label, { fontFamily: FONT, fontSize: "13px", color: "#ffffff", backgroundColor: color, padding: { x: 10, y: 8 } })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", go);
    btn(180, "Take a service call", "#2563eb", () => this.scene.start("JobMapScene"));
    btn(430, "Rest up - back to campus", "#2f855a", () => this.scene.start("CampusScene"));
    panel.setDepth(0);
  }
}
