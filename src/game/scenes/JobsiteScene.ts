import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { SCENARIOS } from "@/game/data/scenarios";
import { REQUIRED_ITEMS } from "@/game/data/labGames";
import { SITES, jobKey, type Prop, type Site } from "@/game/data/jobsites";
import type { Reward } from "@/store/gameStore";
import { DialogueBox } from "./DialogueBox";
import { DiagnoseGame } from "./DiagnoseGame";
import { QuizBox } from "./QuizBox";
import { doorMat, floorLamp, floorMat, furnitureBody, hvacUnit, picture, plant, sign, stairsArt, windowPane } from "./decor";
import { CHAR_BODY, CHAR_SCALE, plumbob } from "./characters";
import { addVignette, hudBar } from "./fx";

const FONT = "monospace";
const SPEED = 170;

/** Extra furniture per level. A leading "~" means walk-over decoration instead of a solid prop. */
const EXTRAS: Record<string, Prop[]> = {
  "ranch:0": [[320, 330, 180, 110, 0x8e5a5a, "~Rug"], [140, 168, 80, 14, 0x111827, "TV"], [400, 172, 34, 34, 0xe5e7eb, "Fridge"], [30, 230, 30, 60, 0x8a5a2b, "Books"], [40, 330, 0, 0, 0, "~Plant"], [230, 205, 0, 0, 0, "~Lamp"]],
  "ranch:1": [[300, 370, 420, 18, 0xb98550, "~Walkway"], [570, 300, 50, 40, 0x7c5a2e, "Trunk"], [80, 330, 40, 40, 0x9ca3af, "Fan"]],
  "ranch:2": [[300, 200, 14, 26, 0x374151], [560, 200, 26, 26, 0xd1d5db, "Dish"], [310, 350, 60, 40, 0x93c5fd, "Skylight"]],
  "twostory:0": [[330, 340, 170, 100, 0x5e7e8e, "~Rug"], [150, 175, 80, 14, 0x111827, "TV"], [405, 175, 34, 34, 0xe5e7eb, "Fridge"], [30, 230, 30, 60, 0x8a5a2b, "Books"], [40, 420, 0, 0, 0, "~Plant"], [235, 215, 0, 0, 0, "~Lamp"]],
  "twostory:1": [[235, 215, 24, 24, 0x8a5a2b], [330, 180, 70, 40, 0x6b4423, "Closet"], [590, 420, 0, 0, 0, "~Plant"], [60, 300, 0, 0, 0, "~Lamp"]],
  "twostory:2": [[300, 370, 400, 18, 0xb98550, "~Walkway"], [570, 300, 50, 40, 0x7c5a2e, "Trunk"], [570, 230, 34, 50, 0xcbd5e1, "WH"]],
  "twostory:3": [[300, 200, 14, 26, 0x374151], [570, 200, 26, 26, 0xd1d5db, "Dish"], [310, 350, 60, 40, 0x93c5fd, "Skylight"]],
  "grocery:0": [[60, 420, 40, 30, 0x9ca3af, "Carts"], [340, 340, 90, 28, 0xa78bfa, "Aisle"], [580, 300, 24, 50, 0xf472b6], [600, 430, 0, 0, 0, "~Plant"]],
  "grocery:1": [[580, 250, 40, 40, 0xb45309, "Boxes"], [60, 330, 40, 30, 0xcbd5e1, "Sink"], [200, 380, 24, 40, 0x1d4ed8], [320, 440, 300, 6, 0xfde047, "~Hazard"]],
  "grocery:2": [[250, 380, 100, 12, 0x9ca3af], [560, 350, 12, 100, 0xeab308]],
  "school:0": [[380, 172, 26, 26, 0x93c5fd, "H2O"], [100, 400, 100, 20, 0x8a5a2b, "Bench"], [580, 420, 0, 0, 0, "~Plant"]],
  "school:1": [[470, 300, 90, 30, 0x8a5a2b, "Teacher"], [560, 360, 26, 26, 0x38bdf8, "Globe"], [350, 175, 80, 24, 0x6b4423, "Books"], [40, 430, 0, 0, 0, "~Plant"]],
  "school:2": [[250, 390, 100, 12, 0x9ca3af], [570, 200, 10, 40, 0x9ca3af], [300, 230, 60, 40, 0x93c5fd, "Skylight"]],
  "restaurant:0": [[470, 230, 110, 30, 0x86efac, "Salad bar"], [390, 300, 50, 50, 0x8a5a2b, "Table"], [40, 430, 0, 0, 0, "~Plant"]],
  "restaurant:1": [[570, 260, 40, 60, 0x93c5fd, "Cooler"], [180, 350, 60, 30, 0xf59e0b, "Fryers"]],
  "restaurant:2": [[300, 330, 120, 20, 0x9ca3af], [570, 200, 30, 30, 0x6b7280]],
};

/** Scale the money/xp-style numbers in a reward. */
const scaled = (r: Reward, f: number): Reward => ({
  ...r,
  xp: r.xp ? Math.round(r.xp * f) : r.xp,
  money: r.money ? Math.round(r.money * f) : r.money,
  contractorCredits: r.contractorCredits ? Math.round(r.contractorCredits * f) : r.contractorCredits,
});

/** One jobsite floor per run: walk the stairs/ladders up to the roof and service the equipment. */
export class JobsiteScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private dialogue!: DialogueBox;
  private quiz!: QuizBox;
  private mini!: DiagnoseGame;
  private toast!: Phaser.GameObjects.Text;
  private site!: Site;
  private levelIndex = 0;
  private target: Phaser.Math.Vector2 | null = null;
  private lastPos = new Phaser.Math.Vector2();
  private frameTick = 0;
  private busy = false;
  private cooldownUntil = 0;

  constructor() {
    super("JobsiteScene");
  }

  create(data: { site: string; level?: number; fromAbove?: boolean }) {
    if (!this.textures.exists("player-0") || !this.textures.exists("teacher") || !useGameStore.getState().active?.graduated) {
      this.scene.start("CampusScene");
      return;
    }
    this.site = SITES.find((s) => s.id === data.site) ?? SITES[0];
    this.levelIndex = data.level ?? 0;
    this.target = null;
    this.busy = false;
    this.cooldownUntil = 0;
    const lv = this.site.levels[this.levelIndex];
    const fromAbove = data.fromAbove;
    const attic = lv.name === "Attic";

    this.add.rectangle(320, 75, 640, 150, lv.wall).setDepth(0);
    this.add.rectangle(320, 317, 640, 326, lv.floor).setDepth(0);
    if (lv.roof) this.drawRoofBackdrop();
    else this.drawInteriorBackdrop(attic);

    const solid = this.physics.add.staticGroup();
    const block = (x: number, y: number, w: number, h: number) => {
      const z = this.add.zone(x, y, w, h);
      this.physics.add.existing(z, true);
      solid.add(z);
    };

    const extras = EXTRAS[`${this.site.id}:${this.levelIndex}`] ?? [];
    [...lv.props, ...extras].forEach((p) => this.drawProp(p, block));

    if (lv.unit) {
      const u = lv.unit;
      hvacUnit(this, u.x, u.y);
      this.add.text(u.x, u.y - 42, u.label, { fontFamily: FONT, fontSize: "11px", color: "#fde047", backgroundColor: "#000000aa", padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(9000);
      block(u.x, u.y, 90, 60);
    }

    const stairs = (x: number, y: number, label: string, up: boolean) => {
      stairsArt(this, x, y, up);
      this.add.text(x, y - 36, `${up ? "▲" : "▼"} ${label}`, { fontFamily: FONT, fontSize: "11px", color: "#ffffff", backgroundColor: "#000000aa", padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(9000);
    };
    if (lv.up) stairs(lv.up.x, lv.up.y, lv.up.label, true);
    if (lv.down) stairs(lv.down.x, lv.down.y, lv.down.label, false);

    if (this.levelIndex === 0) {
      doorMat(this, 320, 470, 0x8b2f2f);
      sign(this, 320, 446, "EXIT", "#166534");
    }

    hudBar(this, `${this.site.name}  -  ${lv.name}${this.levelIndex === 0 ? "  (exit: bottom door)" : ""}`);
    addVignette(this);

    const spawn =
      this.levelIndex === 0 && !fromAbove ? { x: 320, y: 440 } : fromAbove && lv.up ? { x: lv.up.x, y: lv.up.y + 55 } : { x: lv.down!.x, y: lv.down!.y + 55 };
    this.shadow = this.add.ellipse(spawn.x, spawn.y, 18, 7, 0x000000, 0.35);
    this.player = this.physics.add.sprite(spawn.x, spawn.y, "player-0").setOrigin(0.5, 1).setScale(CHAR_SCALE);
    this.player.setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(CHAR_BODY.w, CHAR_BODY.h).setOffset(CHAR_BODY.ox, CHAR_BODY.oy);
    this.physics.add.collider(this.player, solid);

    this.dialogue = new DialogueBox(this);
    this.quiz = new QuizBox(this);
    this.mini = new DiagnoseGame(this);
    this.toast = this.add
      .text(320, 350, "", { fontFamily: FONT, fontSize: "14px", color: "#fde047", backgroundColor: "#000000cc", padding: { x: 8, y: 4 } })
      .setOrigin(0.5)
      .setDepth(10000)
      .setVisible(false);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.on("keydown-SPACE", () => this.dialogue.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.dialogue.advance());
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.quiz.active || this.mini.active) return;
      if (this.dialogue.active) this.dialogue.advance();
      else this.target = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });
  }

  private drawInteriorBackdrop(attic: boolean) {
    this.add.rectangle(320, 152, 640, 6, 0x4b3a2a).setDepth(1);
    this.add.rectangle(320, 140, 640, 8, 0x000000, 0.12).setDepth(1);
    if (attic) {
      const g = this.add.graphics().setDepth(2);
      g.lineStyle(6, 0x3b2a1a);
      for (let x = -40; x <= 680; x += 120) g.lineBetween(x, 150, 320 + (x - 320) * 0.35, 0);
      g.lineStyle(3, 0x3b2a1a).lineBetween(0, 70, 640, 70);
      this.add.circle(320, 56, 7, 0xfff3a3).setDepth(3);
      this.add.circle(320, 56, 28, 0xfff3a3, 0.18).setDepth(3);
      this.add.circle(580, 90, 16, 0x374151).setStrokeStyle(3, 0x1f2937).setDepth(3);
      for (let x = 0; x < 640; x += 40) this.add.rectangle(x, 318, 2, 326, 0x000000, 0.12).setDepth(1);
      return;
    }
    windowPane(this, 200, 76);
    windowPane(this, 440, 76);
    picture(this, 320, 76, 54, 38, this.site.kind === "Commercial" ? 0xfbbf24 : 0x93c5fd);
    this.add.rectangle(320, 146, 640, 5, 0xf3f4f6, 0.8).setDepth(2);
    [120, 520].forEach((x) => this.add.rectangle(x, 138, 8, 10, 0xe5e7eb).setStrokeStyle(1, 0x6b7280).setDepth(2));
    for (let x = 0; x < 640; x += 64) this.add.rectangle(x, 300, 1, 330, 0x000000, 0.08).setDepth(1);
  }

  private drawRoofBackdrop() {
    const sky = this.add.graphics().setDepth(0);
    sky.fillGradientStyle(0x5aa9e6, 0x5aa9e6, 0xcdeaff, 0xcdeaff, 1).fillRect(0, 0, 640, 150);
    this.add.circle(540, 50, 26, 0xfff3a3).setDepth(1);
    [[120, 60, 90], [330, 40, 70], [440, 80, 60]].forEach(([x, y, w]) => this.add.ellipse(x, y, w, 24, 0xffffff, 0.85).setDepth(1));
    // Neighboring rooftops and trees on the horizon.
    for (let i = 0; i < 9; i++) {
      const h = 22 + ((i * 13) % 24);
      this.add.rectangle(i * 80 + 20, 140 - h / 2, 56, h, 0x94a3b8).setDepth(1);
      this.add.triangle(i * 80 + 20, 140 - h - 7, -32, 8, 32, 8, 0, -8, 0x64748b).setDepth(1);
      this.add.circle(i * 80 + 62, 130, 11, 0x2f855a).setDepth(1);
    }
    [[250, 30], [270, 38], [300, 24]].forEach(([x, y]) => this.add.text(x, y, "v", { fontFamily: FONT, fontSize: "10px", color: "#1f2937" }).setDepth(2));
    this.add.rectangle(320, 152, 640, 8, 0x333b45).setDepth(1);
    for (let y = 160; y < 480; y += 16) this.add.rectangle(320, y, 640, 2, 0x000000, 0.18).setDepth(1);
    for (let y = 168; y < 480; y += 16) for (let x = (y / 16) % 2 ? 0 : 20; x < 640; x += 40) this.add.rectangle(x, y, 1, 14, 0x000000, 0.12).setDepth(1);
    this.add.rectangle(320, 476, 640, 8, 0xe5e7eb).setDepth(1);
    for (let x = 0; x < 640; x += 60) this.add.rectangle(x + 10, 460, 4, 26, 0xe5e7eb).setDepth(1);
  }

  private drawProp(p: Prop, block: (x: number, y: number, w: number, h: number) => void) {
    const [x, y, w, h, color, raw] = p;
    if (raw === "~Plant") return plant(this, x, y);
    if (raw === "~Lamp") return floorLamp(this, x, y);
    if (raw?.startsWith("~")) {
      floorMat(this, x, y, w, h, color);
      return;
    }
    const label = raw;
    furnitureBody(this, x, y, w, h, color);
    this.detail(label, x, y, w, h);
    if (label) this.add.text(x, y + h / 2 - 7, label, { fontFamily: FONT, fontSize: "9px", color: "#111111" }).setOrigin(0.5).setDepth(y + 4);
    block(x, y, w, h);
  }

  /** Small illustrative touches for common furniture and equipment. */
  private detail(label: string | undefined, x: number, y: number, w: number, h: number) {
    const d = y + 3;
    const r = (dx: number, dy: number, rw: number, rh: number, c: number, a = 1) => this.add.rectangle(x + dx, y + dy, rw, rh, c, a).setDepth(d);
    switch (label) {
      case "Sofa":
        r(0, -h / 2 + 8, w - 6, 8, 0x000000, 0.2);
        r(-w / 4, 4, w / 2 - 8, h - 18, 0xffffff, 0.15);
        r(w / 4, 4, w / 2 - 8, h - 18, 0xffffff, 0.15);
        break;
      case "Bed":
        r(-w / 2 + 16, -4, 20, 16, 0xffffff);
        r(-w / 2 + 16, 14, 20, 12, 0xffffff);
        r(12, 0, w - 50, h - 8, 0x7c3aed, 0.35);
        break;
      case "Kitchen":
        [-30, -10, 10].forEach((dx) => this.add.circle(x + dx, y - 12, 6, 0x111827).setStrokeStyle(1, 0xef4444).setDepth(d));
        r(30, 8, 26, 16, 0xcbd5e1);
        break;
      case "Table":
        [-18, 18].forEach((dx) => this.add.circle(x + dx, y, 7, 0xffffff).setStrokeStyle(1, 0x6b7280).setDepth(d));
        break;
      case "TV":
        r(0, 0, w - 8, h - 4, 0x0ea5e9, 0.6);
        break;
      case "Air handler":
        r(0, 0, w - 16, h - 16, 0x6b7280, 0.5);
        this.add.circle(x - 30, y, 8, 0x374151).setDepth(d);
        r(30, 0, 24, 6, 0x10b981);
        break;
      case "Insulation":
        for (let i = -3; i <= 3; i++) r(i * 12, 0, 8, h - 8, 0xf9a8d4, 0.55);
        break;
      case "Produce":
      case "Dairy":
      case "Bakery":
      case "Aisle":
        for (let i = -w / 2 + 12; i < w / 2 - 6; i += 14) this.add.circle(x + i, y - 2, 4, [0xef4444, 0xfde047, 0x22c55e, 0xffffff][Math.abs(Math.round(i)) % 4]).setDepth(d);
        break;
      case "Lockers":
        for (let i = -1; i <= 1; i++) r(i * 18, 0, 2, h - 6, 0x1e3a8a);
        break;
      case "Booth":
        r(0, 4, w - 20, h - 22, 0xf5deb3);
        break;
      case "Desks":
        r(-8, -2, 14, 8, 0xffffff);
        break;
      case "Walk-in cooler":
        r(w / 2 - 12, 0, 4, 16, 0xe5e7eb);
        r(0, 0, w - 16, h - 10, 0xbfdbfe, 0.4);
        break;
      case "Range hood":
        r(0, 4, w - 20, h - 18, 0x94a3b8);
        break;
      case "Pallets":
        for (let i = -2; i <= 2; i++) r(i * 20, 0, 4, h - 6, 0x7c4a1e);
        break;
    }
  }

  update(_time: number, delta: number) {
    if (!this.player) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    const ui = this.dialogue.active || this.quiz.active || this.mini.active;
    if (this.busy && !ui) {
      this.busy = false;
      this.cooldownUntil = this.time.now + 4000;
    }
    if (ui) {
      this.target = null;
      this.player.setTexture("player-0");
      return;
    }

    const { left, right, up, down } = this.cursors;
    if (left.isDown || right.isDown || up.isDown || down.isDown) {
      this.target = null;
      body.setVelocity((right.isDown ? SPEED : 0) - (left.isDown ? SPEED : 0), (down.isDown ? SPEED : 0) - (up.isDown ? SPEED : 0));
    } else if (this.target) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y);
      const stuck = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.lastPos.x, this.lastPos.y) < 0.2;
      if (dist < 6 || (stuck && !body.blocked.none)) this.target = null;
      else this.physics.moveTo(this.player, this.target.x, this.target.y, SPEED);
    }
    this.lastPos.set(this.player.x, this.player.y);

    if (body.velocity.length() > 1) {
      this.frameTick += delta;
      this.player.setTexture(`player-${Math.floor(this.frameTick / 140) % 2}`);
      if (body.velocity.x !== 0) this.player.setFlipX(body.velocity.x < 0);
    } else {
      this.player.setTexture("player-0");
    }
    this.player.setDepth(this.player.y);
    this.shadow.setPosition(this.player.x, this.player.y - 2).setDepth(this.player.y - 1);

    const lv = this.site.levels[this.levelIndex];
    const near = (p: { x: number; y: number }, r: number) => Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y) < r;
    if (lv.up && near(lv.up, 30)) {
      this.scene.restart({ site: this.site.id, level: this.levelIndex + 1 });
    } else if (lv.down && near(lv.down, 30)) {
      this.scene.restart({ site: this.site.id, level: this.levelIndex - 1, fromAbove: true });
    } else if (lv.unit && !this.busy && this.time.now > this.cooldownUntil && near({ x: lv.unit.x, y: lv.unit.y + 20 }, 70)) {
      this.service();
    } else if (this.levelIndex === 0 && this.player.y >= 472) {
      this.scene.start("JobMapScene");
    }
  }

  private service() {
    const store = useGameStore.getState();
    if (!store.active) {
      this.showToast("Create a profile first");
      this.cooldownUntil = this.time.now + 3000;
      return;
    }
    this.busy = true;
    const key = jobKey(this.site.id);
    const unit = this.site.levels[this.levelIndex].unit!;
    if (store.active.completedQuests.includes(key)) {
      this.dialogue.start([{ speaker: "Customer", text: `The ${unit.label} is running great. Thanks for fixing it! Try another job.` }], () => undefined);
      return;
    }
    this.dialogue.start(
      [
        { speaker: "Work order", text: this.site.complaint },
        { speaker: "You", text: `You made it up to the ${unit.label}. Pull the right tools and parts off your belt and diagnose it.` },
      ],
      () => this.startRepair(),
    );
  }

  private startRepair() {
    const make = SCENARIOS[this.site.scenario];
    if (!make) return;
    const belt = [...new Set([...(REQUIRED_ITEMS[this.site.scenario] ?? []), "Multimeter", "Screwdriver set"])];
    this.mini.start(make(), belt, (mistakes) => this.followUp(Math.max(1, 3 - mistakes)));
  }

  /** The customer checks the work and asks a follow-up question once the repair is finished. */
  private followUp(stars: number) {
    const unit = this.site.levels[this.levelIndex].unit!;
    this.dialogue.start(
      [
        { speaker: "Customer", text: `The ${unit.label} is humming again. Before you pack up, I have a quick question.` },
      ],
      () =>
        this.quiz.start(
          [this.site.question],
          (correct) => {
            const s = useGameStore.getState();
            if (correct > 0) {
              const r = scaled(this.site.reward, [0.6, 0.8, 1][stars - 1]);
              s.reward(r);
              s.patch({ completedQuests: [...(s.active?.completedQuests ?? []), jobKey(this.site.id)] });
              this.showToast(`Job complete (${"★".repeat(stars)}): +${r.xp} XP, +$${r.money}`);
            } else {
              this.showToast("The customer wasn't satisfied. Review and try again.");
            }
          },
          "CUSTOMER FOLLOW-UP",
        ),
    );
  }

  private showToast(text: string) {
    this.toast.setText(text).setVisible(true);
    this.time.delayedCall(2600, () => this.toast.setVisible(false));
  }
}
