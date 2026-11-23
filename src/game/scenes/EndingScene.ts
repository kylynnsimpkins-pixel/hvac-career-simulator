import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { SITES, roundsDone } from "@/game/data/jobsites";
import { makeCharacterTextures } from "./characters";
import { addVignette } from "./fx";
import { ensureBuilding, ensureTownTextures } from "./townArt";

const FONT = "monospace";
const LEVELS: [string, number][] = [
  ["Apprentice", 0],
  ["Junior Technician", 800],
  ["Technician", 2500],
  ["Senior Technician", 4500],
  ["Master Technician", 6500],
];
const SKILLS = ["electrical", "mechanical", "diagnostics", "safety", "customerService", "leadership", "sales"] as const;

/** Finale: the contractor's own HQ, the crew heads out in company vans, then the career legend and THE END. */
export class EndingScene extends Phaser.Scene {
  private done = false;

  constructor() {
    super("EndingScene");
  }

  create() {
    const st = useGameStore.getState();
    const p = st.active;
    if (p && !this.textures.exists("worker-0")) makeCharacterTextures(this, p.wardrobe);
    if (!p || !p.graduated) {
      this.scene.start("CampusScene");
      return;
    }
    this.done = false;
    ensureTownTextures(this);
    const company = `${p.playerName} Heating & Air`;
    const bkey = ensureBuilding(this, "shop", 0xe8e2d4, 0x1e3a8a);

    const sky = this.add.graphics().setDepth(0);
    sky.fillGradientStyle(0xf59e5b, 0xf59e5b, 0xfde7b0, 0xfde7b0, 1).fillRect(0, 0, 640, 200);
    this.add.circle(520, 110, 34, 0xfff3c4, 0.9).setDepth(0);
    this.add.tileSprite(320, 270, 640, 140, "grass").setTileScale(0.5).setDepth(1);
    const g = this.add.graphics().setDepth(2);
    g.fillStyle(0x3d424d, 1).fillRect(0, 330, 640, 150);
    g.fillStyle(0xf5d742, 1);
    for (let x = 10; x < 640; x += 60) g.fillRect(x, 452, 34, 4);
    g.fillStyle(0xffffff, 0.5);
    for (let x = 60; x < 400; x += 90) g.fillRect(x, 340, 3, 70);

    this.add.ellipse(320, 322, 280, 14, 0x000000, 0.25).setDepth(321);
    this.add.image(320, 322, bkey).setScale(2.2).setOrigin(0.5, 1).setDepth(322);
    this.add.rectangle(320, 108, 230, 26, 0x1e3a8a).setStrokeStyle(2, 0xf5d742).setDepth(500);
    this.add.text(320, 108, company.toUpperCase(), { fontFamily: FONT, fontSize: "12px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5).setDepth(501);
    this.add.image(60, 322, "tree").setScale(0.9).setOrigin(0.5, 1).setDepth(322);
    this.add.image(600, 322, "tree").setScale(0.9).setOrigin(0.5, 1).setDepth(322);

    const vans = [0, 1, 2].map((i) => this.add.image(110 + i * 150, 392 + i * 22, "van").setScale(0.5).setOrigin(0.5, 1).setDepth(392 + i * 22));
    vans.forEach((v, i) => {
      this.add.text(v.x, v.y - 16, "HQ", { fontFamily: FONT, fontSize: "7px", color: "#1e3a8a", fontStyle: "bold" }).setOrigin(0.5).setDepth(700 + i).setName(`vl${i}`);
    });

    const owner = this.add.image(330, 335, "player-0").setOrigin(0.5, 1).setScale(0.9).setDepth(340);
    const workers = [0, 1, 2].map((i) => this.add.image(290 + i * 30, 330, `worker-${i}`).setOrigin(0.5, 1).setScale(0.9).setVisible(false).setDepth(335));

    const say = this.add
      .text(320, 40, "", { fontFamily: FONT, fontSize: "11px", color: "#0b1224", backgroundColor: "#f8fafc", padding: { x: 8, y: 5 }, align: "center" })
      .setOrigin(0.5)
      .setDepth(9000);
    addVignette(this);

    const t = (ms: number, fn: () => void) => this.time.delayedCall(ms, fn);
    t(600, () => say.setText("Your own company. Your own trucks.\nTime to send the crew out!"));
    workers.forEach((w, i) => {
      t(2200 + i * 700, () => {
        w.setVisible(true);
        say.setText(["Crew 1: heading to a no-cool call.", "Crew 2: furnace tune-ups today.", "Crew 3: new install across town."][i]);
        const v = vans[i];
        this.tweens.add({ targets: w, x: v.x + 20, y: v.y - 2, duration: 900, onUpdate: () => w.setTexture(`worker-${i}`), onComplete: () => w.setVisible(false) });
      });
    });
    t(5600, () => say.setText("Safe travels, team!"));
    vans.forEach((v, i) => {
      t(6200 + i * 500, () => {
        this.children.getByName(`vl${i}`) && this.tweens.add({ targets: this.children.getByName(`vl${i}`), x: 760 + i * 20, duration: 2400, ease: "Quad.easeIn" });
        this.tweens.add({ targets: v, x: 760, duration: 2400, ease: "Quad.easeIn" });
      });
    });
    this.tweens.add({ targets: owner, y: 337, duration: 400, yoyo: true, repeat: 12 });
    t(9800, () => this.cameras.main.fadeOut(600, 0, 0, 0, (_c: unknown, pr: number) => pr === 1 && this.legend(company)));
  }

  private legend(company: string) {
    const st = useGameStore.getState();
    const p = st.active!;
    if (!p.companyOpened) st.patch({ companyOpened: true });
    this.children.removeAll(true);
    this.cameras.main.resetFX();
    this.add.rectangle(320, 240, 640, 480, 0x0b1224).setDepth(0);
    this.add.text(320, 22, "CAREER PATH LEGEND", { fontFamily: FONT, fontSize: "16px", color: "#f5d742", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(320, 42, `${p.playerName}, Owner of ${company}`, { fontFamily: FONT, fontSize: "10px", color: "#cbd5e1" }).setOrigin(0.5);

    // Level ladder
    LEVELS.forEach(([name, xp], i) => {
      const reached = p.xp >= xp;
      const y = 74 + i * 22;
      this.add.rectangle(110, y, 150, 18, reached ? 0x14532d : 0x1f2937).setStrokeStyle(1, reached ? 0x4ade80 : 0x374151);
      this.add.text(110, y, `${reached ? "✓" : "·"} ${name}`, { fontFamily: FONT, fontSize: "9px", color: reached ? "#bbf7d0" : "#6b7280" }).setOrigin(0.5);
    });

    // Skill bars
    SKILLS.forEach((k, i) => {
      const y = 70 + i * 16;
      const v = Math.min(100, Number((p as unknown as Record<string, number>)[k] ?? 0));
      this.add.text(210, y, k.slice(0, 10).padEnd(10), { fontFamily: FONT, fontSize: "8px", color: "#94a3b8" });
      this.add.rectangle(285, y + 4, 100, 7, 0x1f2937).setOrigin(0, 0.5);
      this.add.rectangle(285, y + 4, Math.max(1, v), 7, 0x38bdf8).setOrigin(0, 0.5);
    });

    const jobs = SITES.reduce((n, s) => n + roundsDone(p.completedQuests, s.id), 0);
    const stats = [
      `Rank: ${p.level}`,
      `XP: ${p.xp}   Credits: ${p.contractorCredits}`,
      `Cash: $${p.money}`,
      `Certifications: ${p.certifications.join(", ") || "none"}`,
      `Service calls: ${jobs}   Labs: ${p.completedLabs.length}`,
      `Specialty: ${p.specialty ?? "General"}`,
      `Career path: ${p.careerPath ?? "Residential"}`,
      `Time in program: ${(p.playSeconds / 3600).toFixed(1)} hrs`,
    ];
    this.add.rectangle(320, 300, 580, 132, 0x111827).setStrokeStyle(1, 0x374151);
    stats.forEach((s, i) => this.add.text(50 + (i % 2) * 290, 250 + Math.floor(i / 2) * 28, s, { fontFamily: FONT, fontSize: "9px", color: "#e2e8f0", wordWrap: { width: 280 } }));

    this.add.text(320, 420, "★  THE END  ★", { fontFamily: FONT, fontSize: "26px", color: "#f5d742", fontStyle: "bold" }).setOrigin(0.5);
    const hint = this.add.text(320, 456, "Tap or press any key to return to campus", { fontFamily: FONT, fontSize: "9px", color: "#94a3b8" }).setOrigin(0.5);
    this.tweens.add({ targets: hint, alpha: 0.3, yoyo: true, repeat: -1, duration: 800 });
    this.cameras.main.fadeIn(600, 0, 0, 0);
    this.time.delayedCall(800, () => {
      this.done = true;
    });
    const leave = () => this.done && this.scene.start("CampusScene");
    this.input.keyboard?.on("keydown", leave);
    this.input.on("pointerdown", leave);
  }
}
