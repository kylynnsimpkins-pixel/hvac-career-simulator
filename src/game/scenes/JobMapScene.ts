import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { ADDRESSES, ROUNDS, SITES, assignedSite, roundsDone, type Site } from "@/game/data/jobsites";
import { addVignette, hudBar } from "./fx";
import { ensureBuilding, ensureTownTextures, type BuildingKind } from "./townArt";

const FONT = "monospace";
const H_ROADS = [
  { y: 118, name: "OAK STREET" },
  { y: 250, name: "MAIN STREET" },
  { y: 382, name: "MAPLE LANE" },
];
const V_ROAD = 330;
const SCALE = 0.62;
const BASE = { A: 96, B: 228, C: 360, D: 470 } as const;
type Row = keyof typeof BASE;

interface Lot {
  row: Row;
  x: number;
  kind: BuildingKind;
  wall: number;
  roof: number;
  number: string;
  site?: string;
}

const STREET: Record<Row, string> = { A: "Oak Street", B: "Main Street", C: "Maple Lane", D: "Pine Court" };

/** Every lot on the map. Only lots with a site id are real service calls. */
const LOTS: Lot[] = [
  { row: "A", x: 48, kind: "house", wall: 0xd9b99b, roof: 0x7a3b2e, number: "201" },
  { row: "A", x: 136, kind: "house2", wall: 0xa7c4d9, roof: 0x3f4a63, number: "215" },
  { row: "A", x: 224, kind: "shop", wall: 0xe2c9a0, roof: 0x2b6cb0, number: "229" },
  { row: "A", x: 436, kind: "house", wall: 0xc7d9a7, roof: 0x5b3a29, number: "244" },
  { row: "A", x: 524, kind: "shop", wall: 0xd7a5a5, roof: 0x7b2d4f, number: "258" },
  { row: "A", x: 612, kind: "house2", wall: 0xe9dcc3, roof: 0x4a5a78, number: "272" },
  { row: "B", x: 48, kind: "shop", wall: 0xf4a261, roof: 0x9d2c2c, number: "52", site: "restaurant" },
  { row: "B", x: 136, kind: "shop", wall: 0xd9d9d9, roof: 0x2f855a, number: "88", site: "grocery" },
  { row: "B", x: 224, kind: "shop", wall: 0xb9c6d4, roof: 0x6b46c1, number: "120" },
  { row: "B", x: 436, kind: "shop", wall: 0xc2410c, roof: 0x57534e, number: "300", site: "school" },
  { row: "B", x: 524, kind: "shop", wall: 0xe6d9b8, roof: 0x0e7490, number: "314" },
  { row: "B", x: 612, kind: "shop", wall: 0xcbd5e1, roof: 0xb45309, number: "326" },
  { row: "C", x: 48, kind: "house", wall: 0xe8d4b8, roof: 0x44546a, number: "398" },
  { row: "C", x: 136, kind: "house", wall: 0xe8c7a0, roof: 0x8b3a2f, number: "412", site: "ranch" },
  { row: "C", x: 224, kind: "house2", wall: 0xb7d0c0, roof: 0x4a5a78, number: "426", site: "twostory" },
  { row: "C", x: 436, kind: "house2", wall: 0xe9c9c9, roof: 0x6b3b3b, number: "440" },
  { row: "C", x: 524, kind: "house", wall: 0xc9d9e8, roof: 0x2f4a3a, number: "454" },
  { row: "C", x: 612, kind: "house", wall: 0xf0e0b0, roof: 0x7a4a2a, number: "468" },
  { row: "D", x: 436, kind: "house", wall: 0xd4c2e0, roof: 0x4a3a6a, number: "17" },
  { row: "D", x: 524, kind: "house2", wall: 0xdcd0b0, roof: 0x5a3a2a, number: "19" },
];

/** Town map: read the work order, then drive to the matching address. */
export class JobMapScene extends Phaser.Scene {
  constructor() {
    super("JobMapScene");
  }

  create() {
    if (!this.textures.exists("player-0") || !useGameStore.getState().active?.graduated) {
      this.scene.start("CampusScene");
      return;
    }
    ensureTownTextures(this);
    const done = useGameStore.getState().active?.completedQuests ?? [];
    this.add.tileSprite(320, 240, 640, 480, "grass").setTileScale(0.5).setDepth(0);
    H_ROADS.forEach((r) => this.drawRoad(r.y, r.name));
    this.drawVRoad();
    this.decorate();
    LOTS.slice().sort((a, b) => BASE[a.row] - BASE[b.row]).forEach((l) => this.drawLot(l, done));
    this.driveTraffic();
    this.drawWorkOrder(done);

    hudBar(this, "Service Calls  -  read your work order, then tap the matching address");
    addVignette(this);
    this.add
      .text(590, 452, " Campus ", { fontFamily: FONT, fontSize: "13px", color: "#ffffff", backgroundColor: "#2f855a", padding: { x: 10, y: 6 } })
      .setOrigin(0.5)
      .setDepth(9600)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }

  private drawRoad(y: number, name: string) {
    this.add.tileSprite(320, y - 17, 640, 10, "path").setTileScale(0.5).setDepth(2);
    this.add.tileSprite(320, y + 17, 640, 10, "path").setTileScale(0.5).setDepth(2);
    const g = this.add.graphics().setDepth(2);
    g.fillStyle(0x3d424d, 1).fillRect(0, y - 12, 640, 24);
    g.fillStyle(0x4a505c, 1).fillRect(0, y - 12, 640, 7);
    g.fillStyle(0x23272e, 1).fillRect(0, y - 12, 640, 1).fillRect(0, y + 11, 640, 1);
    g.fillStyle(0xf5d742, 1);
    for (let x = 4; x < 640; x += 30) g.fillRect(x, y - 1, 16, 2);
    g.fillStyle(0xa9a398, 1).fillRect(0, y - 12, 640, 1).fillRect(0, y + 12, 640, 1);
    this.add.text(500, y + 4, name, { fontFamily: FONT, fontSize: "8px", color: "#e5e7eb" }).setOrigin(0.5).setAlpha(0.7).setDepth(3);
    this.add.text(110, y + 4, name, { fontFamily: FONT, fontSize: "8px", color: "#e5e7eb" }).setOrigin(0.5).setAlpha(0.7).setDepth(3);
  }

  private drawVRoad() {
    const x = V_ROAD;
    this.add.tileSprite(x - 17, 260, 10, 300, "path").setTileScale(0.5).setDepth(2);
    this.add.tileSprite(x + 17, 260, 10, 300, "path").setTileScale(0.5).setDepth(2);
    const g = this.add.graphics().setDepth(2);
    g.fillStyle(0x3d424d, 1).fillRect(x - 12, 100, 24, 300);
    g.fillStyle(0x23272e, 1).fillRect(x - 12, 100, 1, 300).fillRect(x + 11, 100, 1, 300);
    g.fillStyle(0xf5d742, 1);
    for (let y = 102; y < 400; y += 30) g.fillRect(x - 1, y, 2, 16);
    g.fillStyle(0xf8fafc, 1);
    H_ROADS.forEach((r) => {
      for (let i = -10; i <= 10; i += 5) g.fillRect(x + i, r.y - 16, 3, 3);
    });
  }

  private decorate() {
    const treesTop = [[290, 100], [370, 100], [290, 232], [372, 232], [290, 364], [372, 364], [250, 470], [330, 470]];
    treesTop.forEach(([x, y]) => this.add.image(x, y, "tree").setScale(0.5).setOrigin(0.5, 1).setDepth(y));
    [[16, 118], [630, 118], [16, 250], [630, 250], [16, 382], [630, 382]].forEach(([x, y]) => {
      this.add.image(x, y - 14, "lamp").setScale(0.5).setOrigin(0.5, 1).setDepth(y);
    });
    [[90, 428], [180, 440], [300, 436], [380, 420]].forEach(([x, y]) => this.add.image(x, y, "bush").setScale(0.5).setOrigin(0.5, 1).setDepth(y));
  }

  private drawLot(l: Lot, done: string[]) {
    const site: Site | undefined = SITES.find((s) => s.id === l.site);
    const key = ensureBuilding(this, l.kind, site?.map.wall ?? l.wall, site?.map.roof ?? l.roof);
    const base = BASE[l.row];
    const w = 128 * SCALE;
    const h = 112 * SCALE;
    this.add.ellipse(l.x + 3, base, w * 0.95, 8, 0x000000, 0.25).setDepth(base - 1);
    this.add.image(l.x, base, key).setScale(SCALE).setOrigin(0.5, 1).setDepth(base);
    if (l.kind !== "shop") this.add.image(l.x - w * 0.45, base + 2, "bush").setScale(0.3).setOrigin(0.5, 1).setDepth(base + 1);
    this.add
      .text(l.x, base + 9, `${l.number} ${STREET[l.row]}`, { fontFamily: FONT, fontSize: "8px", color: "#0b1224", backgroundColor: "#f8fafc", padding: { x: 2, y: 1 } })
      .setOrigin(0.5)
      .setDepth(8000);
    if (!site) return;

    const hl = this.add.rectangle(l.x, base - h / 2, w + 10, h + 8, 0xfde047, 0).setStrokeStyle(2, 0xfde047, 0).setDepth(7000);
    const hit = this.add.rectangle(l.x, base - h / 2, w + 10, h + 8, 0xffffff, 0.001).setInteractive({ useHandCursor: true }).setDepth(7001);
    hit.on("pointerover", () => hl.setStrokeStyle(2, 0xfde047, 0.9));
    hit.on("pointerout", () => hl.setStrokeStyle(2, 0xfde047, 0));
    hit.on("pointerdown", () => this.scene.start("ArrivalScene", { site: site.id }));
    if (roundsDone(done, site.id) >= ROUNDS) {
      this.add.text(l.x, base - h - 4, "DONE", { fontFamily: FONT, fontSize: "9px", color: "#052e16", backgroundColor: "#86efac", padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(8000);
    }
  }

  private driveTraffic() {
    const colors = [0xc0392b, 0x2563eb, 0xf1c40f, 0x16a34a, 0xe5e7eb, 0x7c3aed];
    H_ROADS.forEach((r, i) => {
      [0, 1].forEach((lane) => {
        const dir = lane === 0 ? 1 : -1;
        const g = this.add.graphics().setDepth(4);
        const c = colors[(i * 2 + lane) % colors.length];
        g.fillStyle(0x000000, 0.3).fillRect(-15, 6, 32, 3);
        g.fillStyle(c, 1).fillRoundedRect(-16, -6, 32, 12, 4);
        g.fillStyle(0xffffff, 0.25).fillRoundedRect(-14, -5, 28, 4, 2);
        g.fillStyle(0x9fd3f2, 1).fillRect(dir > 0 ? -2 : -10, -4, 12, 6);
        g.fillStyle(0x111111, 1).fillRect(-11, 4, 6, 3).fillRect(6, 4, 6, 3);
        const y = r.y + (lane === 0 ? 6 : -6);
        g.setPosition(dir > 0 ? -40 : 680, y);
        this.tweens.add({ targets: g, x: dir > 0 ? 680 : -40, duration: 9000 + i * 2500 + lane * 1800, repeat: -1, delay: lane * 2500 + i * 900 });
      });
    });
  }

  private drawWorkOrder(done: string[]) {
    const job = assignedSite(done);
    const x = 8;
    const y = 406;
    const w = 340;
    const h = 68;
    const g = this.add.graphics().setDepth(9000);
    g.fillStyle(0x000000, 0.3).fillRoundedRect(x + 3, y + 3, w, h, 6);
    g.fillStyle(0x5b3a1e, 1).fillRoundedRect(x, y, w, h, 6);
    g.fillStyle(0xfdf8e8, 1).fillRect(x + 5, y + 10, w - 10, h - 14);
    g.fillStyle(0x9ca3af, 1).fillRoundedRect(x + w / 2 - 26, y + 2, 52, 11, 4);
    const t = (tx: number, ty: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle) => this.add.text(tx, ty, text, { fontFamily: FONT, ...style }).setDepth(9001);
    t(x + 12, y + 14, "SERVICE WORK ORDER", { fontSize: "9px", color: "#7c2d12", fontStyle: "bold" });
    if (!job) {
      t(x + 12, y + 32, "All calls complete. No open work orders.", { fontSize: "10px", color: "#1f2937" });
      return;
    }
    const a = ADDRESSES[job.id];
    const call = Math.min(ROUNDS, roundsDone(done, job.id) + 1);
    t(x + w - 12, y + 14, `#${1000 + SITES.indexOf(job) * 7 + call}`, { fontSize: "9px", color: "#475569" }).setOrigin(1, 0);
    t(x + 12, y + 26, `${a.street}  -  ${a.customer} (call ${call}/${ROUNDS})`, { fontSize: "10px", color: "#111827", fontStyle: "bold" });
    t(x + 12, y + 39, job.complaint, { fontSize: "9px", color: "#1f2937", wordWrap: { width: w - 24 } });
  }
}
