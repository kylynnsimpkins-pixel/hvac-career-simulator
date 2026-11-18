import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { SITES, jobKey } from "@/game/data/jobsites";
import { addVignette, hudBar } from "./fx";

const FONT = "monospace";

/** Town map: pick a residential or commercial jobsite. Each site is its own scene. */
export class JobMapScene extends Phaser.Scene {
  constructor() {
    super("JobMapScene");
  }

  create() {
    if (!this.textures.exists("player-0")) {
      this.scene.start("CampusScene");
      return;
    }
    const done = useGameStore.getState().active?.completedQuests ?? [];
    this.add.rectangle(320, 240, 640, 480, 0x5fa55a);
    this.add.rectangle(320, 270, 640, 26, 0x555b66);
    this.add.rectangle(320, 270, 640, 3, 0xfde047);
    this.add.rectangle(320, 420, 640, 26, 0x555b66);
    this.add.rectangle(320, 420, 640, 3, 0xfde047);
    this.add.text(570, 130, "COMMERCIAL", { fontFamily: FONT, fontSize: "11px", color: "#ffffff" }).setOrigin(0.5).setAlpha(0.5);
    this.add.text(570, 300, "RESIDENTIAL", { fontFamily: FONT, fontSize: "11px", color: "#ffffff" }).setOrigin(0.5).setAlpha(0.5);

    SITES.forEach((s) => {
      const { x, y, w, h, wall, roof } = s.map;
      const complete = done.includes(jobKey(s.id));
      this.add.ellipse(x, y + h / 2 + 4, w + 10, 12, 0x000000, 0.2);
      this.add.rectangle(x, y, w, h, wall).setStrokeStyle(2, 0x333333);
      this.add.rectangle(x, y - h / 2 - 6, w + 10, 14, roof).setStrokeStyle(2, 0x333333);
      this.add.rectangle(x, y + h / 2 - 10, 14, 20, 0x5b3a1e);
      if (s.levels.length > 3) this.add.rectangle(x, y - h / 2 + 2, w * 0.5, 6, 0x87ceeb);
      const hit = this.add.rectangle(x, y - 4, w + 12, h + 28, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
      hit.on("pointerdown", () => this.scene.start("JobsiteScene", { site: s.id, level: 0 }));
      this.add
        .text(x, y + h / 2 + 18, `${s.name}${complete ? " ✔" : ""}`, {
          fontFamily: FONT,
          fontSize: "11px",
          color: complete ? "#bbf7d0" : "#ffffff",
          backgroundColor: s.kind === "Commercial" ? "#1e3a8aee" : "#7c2d12ee",
          padding: { x: 5, y: 2 },
        })
        .setOrigin(0.5);
    });

    hudBar(this, "Service Calls  -  tap a jobsite to drive there");
    addVignette(this);
    this.add
      .text(320, 460, " Back to campus ", { fontFamily: FONT, fontSize: "13px", color: "#ffffff", backgroundColor: "#2f855a", padding: { x: 10, y: 6 } })
      .setOrigin(0.5)
      .setDepth(9600)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }
}
