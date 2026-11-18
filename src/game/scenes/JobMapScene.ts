import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { ADDRESSES, ROUNDS, SITES, assignedSite, roundsDone, type Site } from "@/game/data/jobsites";
import { addVignette, hudBar } from "./fx";

const FONT = "monospace";
const ROAD_Y = [270, 420];

/** Town map: read the work order, then drive to the matching address. Each site is its own scene. */
export class JobMapScene extends Phaser.Scene {
  constructor() {
    super("JobMapScene");
  }

  create() {
    if (!this.textures.exists("player-0") || !useGameStore.getState().active?.graduated) {
      this.scene.start("CampusScene");
      return;
    }
    const done = useGameStore.getState().active?.completedQuests ?? [];
    this.drawGround();
    ROAD_Y.forEach((y) => this.drawRoad(y));
    this.drawTrees();
    this.drawCars();
    SITES.forEach((s) => this.drawSite(s, done));
    this.drawWorkOrder(done);

    hudBar(this, "Service Calls  -  read your work order, then tap the matching address");
    addVignette(this);
    this.add
      .text(320, 460, " Back to campus ", { fontFamily: FONT, fontSize: "13px", color: "#ffffff", backgroundColor: "#2f855a", padding: { x: 10, y: 6 } })
      .setOrigin(0.5)
      .setDepth(9600)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }

  private drawGround() {
    const g = this.add.graphics();
    g.fillGradientStyle(0x6bb765, 0x6bb765, 0x4f9a52, 0x4f9a52, 1).fillRect(0, 0, 640, 480);
    const rnd = new Phaser.Math.RandomDataGenerator(["town"]);
    for (let i = 0; i < 420; i++) {
      const x = rnd.between(0, 640);
      const y = rnd.between(0, 480);
      g.fillStyle(rnd.pick([0x7cc974, 0x439046, 0x5aa85b]), 0.45).fillRect(x, y, rnd.between(2, 5), 1);
    }
    g.fillStyle(0x000000, 0.06);
    for (let y = 0; y < 480; y += 24) g.fillRect(0, y, 640, 12);
  }

  private drawRoad(y: number) {
    const g = this.add.graphics().setDepth(2);
    g.fillStyle(0xc9c4b8, 1).fillRect(0, y - 20, 640, 40);
    g.fillStyle(0x3d424d, 1).fillRect(0, y - 14, 640, 28);
    g.fillStyle(0x4a505c, 1).fillRect(0, y - 14, 640, 8);
    g.fillStyle(0x23272e, 1).fillRect(0, y - 15, 640, 1).fillRect(0, y + 13, 640, 1);
    g.fillStyle(0xf5d742, 1);
    for (let x = 6; x < 640; x += 34) g.fillRect(x, y - 1, 18, 3);
    g.fillStyle(0xffffff, 0.35);
    for (let x = 0; x < 640; x += 12) g.fillRect(x, y - 20, 1, 5).fillRect(x, y + 15, 1, 5);
  }

  private tree(x: number, y: number, r: number) {
    const g = this.add.graphics().setDepth(y);
    g.fillStyle(0x000000, 0.22).fillEllipse(x + 4, y + r * 0.8, r * 2, r * 0.8);
    g.fillStyle(0x6b4423, 1).fillRect(x - 2, y, 4, r * 0.8);
    g.fillStyle(0x2f7d3b, 1).fillCircle(x, y - r * 0.4, r);
    g.fillStyle(0x3f9a4a, 1).fillCircle(x - r * 0.25, y - r * 0.65, r * 0.7);
    g.fillStyle(0x6bc46a, 0.8).fillCircle(x - r * 0.4, y - r * 0.85, r * 0.3);
  }

  private drawTrees() {
    [[20, 238, 12], [168, 240, 10], [350, 240, 11], [600, 240, 13], [20, 368, 12], [180, 372, 10], [350, 372, 11], [405, 372, 13], [620, 376, 12], [20, 458, 11], [610, 455, 12], [550, 80, 13], [610, 100, 11]].forEach(([x, y, r]) => this.tree(x, y, r));
  }

  private car(x: number, y: number, color: number, flip = false) {
    const g = this.add.graphics().setDepth(5);
    g.fillStyle(0x000000, 0.3).fillRect(x - 15, y + 7, 32, 3);
    g.fillStyle(color, 1).fillRoundedRect(x - 16, y - 6, 32, 13, 4);
    g.fillStyle(0xffffff, 0.2).fillRoundedRect(x - 14, y - 5, 28, 4, 2);
    g.fillStyle(0x9fd3f2, 1).fillRect(x + (flip ? -9 : -3), y - 4, 12, 6);
    g.fillStyle(0x111111, 1).fillRect(x - 11, y + 5, 6, 3).fillRect(x + 6, y + 5, 6, 3);
  }

  private drawCars() {
    this.car(120, 276, 0xc0392b);
    this.car(350, 264, 0x2563eb, true);
    this.car(520, 276, 0xf1c40f);
    this.car(200, 426, 0x16a34a, true);
    this.car(470, 414, 0xe5e7eb);
  }

  private plate(x: number, y: number, text: string) {
    this.add.text(x, y, text, { fontFamily: FONT, fontSize: "9px", color: "#0b1224", backgroundColor: "#f8fafc", padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(8000);
  }

  private drawSite(s: Site, done: string[]) {
    const { x, y, w, h, wall, roof } = s.map;
    const n = roundsDone(done, s.id);
    const complete = n >= ROUNDS;
    const res = s.kind === "Residential";
    const g = this.add.graphics().setDepth(y + h / 2);
    const left = x - w / 2;
    const top = y - h / 2;
    const bottom = y + h / 2;

    if (res) {
      g.fillStyle(0x58a85a, 1).fillRoundedRect(left - 16, top - 22, w + 32, h + 64, 6);
      g.fillStyle(0x8f877a, 1).fillRect(x + w / 2 - 22, bottom, 20, 407 - bottom);
      g.fillStyle(0xbfae8c, 1).fillRect(x - 6, bottom, 12, 14);
      g.lineStyle(1, 0xf5f5f4, 1);
      for (let fx = left - 14; fx < left + w + 16; fx += 6) g.lineBetween(fx, bottom + 24, fx, bottom + 30);
      g.lineBetween(left - 14, bottom + 26, left + w + 16, bottom + 26);
    } else {
      g.fillStyle(0x4b515d, 1).fillRect(left - 10, bottom + 8, w + 20, 262 - bottom - 8 + 2);
      g.lineStyle(1, 0xf1f5f9, 0.8);
      for (let px = left; px <= left + w; px += 14) g.lineBetween(px, bottom + 18, px, 258);
    }

    g.fillStyle(0x000000, 0.22).fillEllipse(x + 6, bottom + 3, w + 14, 12);
    g.fillStyle(wall, 1).fillRect(left, top, w, h);
    g.fillStyle(0x000000, 0.14).fillRect(left, top, 5, h);
    g.fillStyle(0xffffff, 0.14).fillRect(left + w - 4, top, 4, h);
    g.fillStyle(0x000000, 0.12).fillRect(left, bottom - 6, w, 6);

    if (res) {
      g.fillStyle(roof, 1).fillTriangle(left - 8, top, x, top - 26, left + w + 8, top);
      g.fillStyle(0xffffff, 0.12).fillTriangle(x, top - 26, left + w + 8, top, x, top);
      g.fillStyle(0x6b3b2a, 1).fillRect(left + 8, top - 24, 8, 16);
    } else {
      g.fillStyle(roof, 1).fillRect(left - 4, top - 10, w + 8, 12);
      g.fillStyle(0xffffff, 0.2).fillRect(left - 4, top - 10, w + 8, 3);
      g.fillStyle(0x9ca3af, 1).fillRect(x + 8, top - 16, 18, 8);
      g.fillStyle(0x6b7280, 1).fillCircle(x + 17, top - 12, 3);
    }

    const cols = Math.max(2, Math.floor((w - 24) / 26));
    const rows = h > 64 ? 2 : 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = left + 12 + c * ((w - 24 - 14) / Math.max(1, cols - 1));
        const wy = top + 8 + r * 28;
        if (res && r === rows - 1 && Math.abs(wx + 7 - x) < 10) continue;
        g.fillStyle(0xf8fafc, 1).fillRect(wx - 1, wy - 1, 16, 16);
        g.fillGradientStyle(0xbfe3f6, 0xbfe3f6, 0x6aa8cf, 0x6aa8cf, 1).fillRect(wx, wy, 14, 14);
        g.fillStyle(0xffffff, 0.5).fillTriangle(wx, wy + 8, wx + 8, wy, wx, wy);
        g.fillStyle(0xf8fafc, 1).fillRect(wx + 6, wy, 2, 14).fillRect(wx, wy + 6, 14, 2);
      }
    }

    g.fillStyle(0x4a2c17, 1).fillRect(x - 8, bottom - 22, 16, 22);
    g.fillStyle(0x70431f, 1).fillRect(x - 6, bottom - 20, 12, 20);
    g.fillStyle(0xfacc15, 1).fillCircle(x + 3, bottom - 10, 1.5);
    if (!res) {
      g.fillStyle(s.map.roof, 1).fillRect(x - 16, bottom - 28, 32, 6);
      g.fillStyle(0xffffff, 0.35).fillRect(x - 16, bottom - 28, 32, 2);
    }

    this.plate(x, bottom + (res ? 12 : 6), `${ADDRESSES[s.id].street}`);
    const hl = this.add.rectangle(x, y - 4, w + 20, h + 40, 0xfde047, 0).setStrokeStyle(2, 0xfde047, 0).setDepth(7000);
    const hit = this.add.rectangle(x, y - 4, w + 20, h + 40, 0xffffff, 0.001).setInteractive({ useHandCursor: true }).setDepth(7001);
    hit.on("pointerover", () => hl.setStrokeStyle(2, 0xfde047, 0.9));
    hit.on("pointerout", () => hl.setStrokeStyle(2, 0xfde047, 0));
    hit.on("pointerdown", () => this.scene.start("JobsiteScene", { site: s.id, level: 0 }));
    if (complete) this.add.text(x + w / 2, top - 10, "DONE", { fontFamily: FONT, fontSize: "9px", color: "#052e16", backgroundColor: "#86efac", padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(8000);
  }

  private drawWorkOrder(done: string[]) {
    const job = assignedSite(done);
    const x = 352;
    const y = 296;
    const w = 280;
    const h = 108;
    const g = this.add.graphics().setDepth(9000);
    g.fillStyle(0x000000, 0.3).fillRoundedRect(x + 3, y + 4, w, h, 6);
    g.fillStyle(0x5b3a1e, 1).fillRoundedRect(x, y, w, h, 6);
    g.fillStyle(0xfdf8e8, 1).fillRect(x + 6, y + 14, w - 12, h - 20);
    g.fillStyle(0x9ca3af, 1).fillRoundedRect(x + w / 2 - 28, y + 4, 56, 14, 4);
    g.lineStyle(1, 0xcbd5e1, 1);
    for (let ly = y + 40; ly < y + h - 8; ly += 12) g.lineBetween(x + 10, ly, x + w - 10, ly);
    const t = (tx: number, ty: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) => this.add.text(tx, ty, text, { fontFamily: FONT, ...style }).setDepth(9001);
    t(x + 12, y + 20, "SERVICE WORK ORDER", { fontSize: "10px", color: "#7c2d12", fontStyle: "bold" });
    if (!job) {
      t(x + 12, y + 40, "All calls complete.\nNo open work orders.", { fontSize: "11px", color: "#1f2937" });
      return;
    }
    const a = ADDRESSES[job.id];
    const call = Math.min(ROUNDS, roundsDone(done, job.id) + 1);
    t(x + w - 12, y + 20, `#${1000 + SITES.indexOf(job) * 7 + call}`, { fontSize: "10px", color: "#475569" }).setOrigin(1, 0);
    t(x + 12, y + 33, `Address: ${a.street}`, { fontSize: "10px", color: "#111827", fontStyle: "bold" });
    t(x + 12, y + 46, `Customer: ${a.customer}   (call ${call}/${ROUNDS})`, { fontSize: "9px", color: "#1f2937" });
    t(x + 12, y + 59, `Complaint: ${job.complaint}`, { fontSize: "9px", color: "#1f2937", wordWrap: { width: w - 24 } });
  }
}
