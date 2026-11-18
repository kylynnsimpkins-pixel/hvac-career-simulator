import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { consumedParts, labGreeting, missingItemLines, redirectLines, REQUIRED_ITEMS, focusFor, planFor, stationKey, INSTRUCTOR } from "@/game/data/labGames";
import { LAB_LAYOUTS, type LabLayout, type Station } from "@/game/data/labLayouts";
import { BUILDINGS } from "./CampusScene";
import { DialogueBox } from "./DialogueBox";
import { SCENARIOS } from "@/game/data/scenarios";
import { DiagnoseGame } from "./DiagnoseGame";
import { CribBox } from "./CribBox";
import { CHAR_BODY, CHAR_SCALE, plumbob } from "./characters";
import { addVignette, dropShadow, hudBar } from "./fx";
import { bulletinBoard, extinguisher, plant, sign, trashCan, wallClock } from "./decor";

const FONT = "monospace";
const SPEED = 170;
const BENCH_H = 50;

/** Generic building interior: a bench/station per function, an instructor, and a door back to campus. */
export class LabScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private dialogue!: DialogueBox;
  
  private mini!: DiagnoseGame;
  private crib!: CribBox;
  private inside = new Set<string>();
  private toast!: Phaser.GameObjects.Text;
  private progress!: Phaser.GameObjects.Text;
  private target: Phaser.Math.Vector2 | null = null;
  private lastPos = new Phaser.Math.Vector2();
  private frameTick = 0;
  private label = "";
  private layout!: LabLayout;

  constructor() {
    super("LabScene");
  }

  create(data: { building: string }) {
    if (!this.textures.exists("player-0") || !LAB_LAYOUTS[data.building]) {
      this.scene.start("CampusScene");
      return;
    }
    this.label = data.building;
    this.inside = new Set();
    this.layout = LAB_LAYOUTS[this.label];
    this.target = null;
    this.drawRoom();

    const solid = this.physics.add.staticGroup();
    const block = (x: number, y: number, w: number, h: number) => {
      const z = this.add.zone(x, y, w, h);
      this.physics.add.existing(z, true);
      solid.add(z);
    };

    this.layout.stations.forEach((s) => {
      this.drawStation(s);
      block(s.x, s.y, s.w, BENCH_H);
    });

    this.add.image(420, 300, "teacher").setScale(0.75).setOrigin(0.5, 1).setDepth(300);
    dropShadow(this, 420, 298, 26, 8, 299);
    block(420, 290, 22, 12);

    hudBar(this, `${this.layout.title}  -  walk up to each station, exit by the bottom door`);
    this.progress = this.add
      .text(620, 40, "", { fontFamily: FONT, fontSize: "11px", color: "#fde047", backgroundColor: "#0b1224cc", padding: { x: 6, y: 3 } })
      .setOrigin(1, 0)
      .setDepth(9501);
    this.updateProgress();

    this.shadow = this.add.ellipse(320, 440, 18, 7, 0x000000, 0.35);
    this.player = this.physics.add.sprite(320, 440, "player-0").setOrigin(0.5, 1).setScale(CHAR_SCALE);
    this.player.setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(CHAR_BODY.w, CHAR_BODY.h).setOffset(CHAR_BODY.ox, CHAR_BODY.oy);
    this.physics.add.collider(this.player, solid);

    this.dialogue = new DialogueBox(this);
    this.mini = new DiagnoseGame(this);
    this.crib = new CribBox(this);
    this.toast = this.add
      .text(320, 350, "", { fontFamily: FONT, fontSize: "14px", color: "#fde047", backgroundColor: "#000000cc", padding: { x: 8, y: 4 } })
      .setOrigin(0.5)
      .setDepth(10000)
      .setVisible(false);
    addVignette(this);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.on("keydown-SPACE", () => this.dialogue.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.dialogue.advance());
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.overlay) return;
      if (this.dialogue.active) this.dialogue.advance();
      else this.target = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });

    const lessonDay = useGameStore.getState().active?.lessonDay ?? 0;
    this.time.delayedCall(300, () => this.dialogue.start(labGreeting(this.label, lessonDay), () => {}));
  }

  update(_time: number, delta: number) {
    if (!this.player) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.dialogue.active || this.overlay) {
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

    for (const s of this.layout.stations) {
      const near = Phaser.Math.Distance.Between(this.player.x, this.player.y, s.x, s.y + BENCH_H / 2 + 14) < 44;
      if (!near) this.inside.delete(s.id);
      else if (!this.inside.has(s.id)) {
        this.inside.add(s.id);
        this.useStation(s);
        break;
      }
    }
    if (this.player.y >= 472) this.scene.start("CampusScene", { from: this.label });
  }

  private get overlay() {
    return this.mini.active || this.crib.active;
  }

  private say(text: string, onDone: () => void = () => {}) {
    this.dialogue.start([{ speaker: INSTRUCTOR, text }], onDone);
  }

  private useStation(s: Station) {
    const store = useGameStore.getState();
    const a = store.active;
    if (!a) {
      this.showToast("Create a profile first");
      return;
    }
    if (s.kind === "crib") {
      this.crib.open(a.checkedOut, (items) => useGameStore.getState().patch({ checkedOut: items }));
      return;
    }
    if (a.lessonDay <= 0) {
      this.dialogue.start(labGreeting(this.label, 0), () => {});
      return;
    }
    const lesson = a.lessonDay - 1;
    if (!focusFor(lesson).kinds.includes(s.kind)) {
      this.dialogue.start(redirectLines(this.label, lesson, s), () => {});
      return;
    }
    if (a.stationsDone.includes(stationKey(lesson, this.label, s.id))) {
      this.say(`You've already finished the ${s.name} for ${planFor(lesson).title}. Check the other stations or head back to class.`);
      return;
    }
    const missing = (REQUIRED_ITEMS[s.kind] ?? []).filter((i) => !a.checkedOut.includes(i));
    if (missing.length) {
      this.dialogue.start(missingItemLines(missing), () => {});
      return;
    }
    this.dialogue.start(
      s.lines.map((text) => ({ speaker: s.name, text })),
      () => this.playGame(s, lesson),
    );
  }

  private playGame(s: Station, lesson: number) {
    const make = SCENARIOS[s.kind];
    if (!make) return;
    const belt = useGameStore.getState().active?.checkedOut ?? [];
    this.mini.start(make(), belt, (m) => this.completeStation(s, lesson, Math.max(1, 3 - m)));
  }

  private completeStation(s: Station, lesson: number, stars: number) {
    const store = useGameStore.getState();
    const a = store.active;
    if (!a) return;
    const reward = { xp: 20 + stars * 15, graduationPoints: stars * 5, money: stars * 5 };
    const used = consumedParts(s.kind);
    const stationsDone = [...a.stationsDone, stationKey(lesson, this.label, s.id)];
    store.reward(reward);
    store.patch({ stationsDone, checkedOut: a.checkedOut.filter((i) => !used.includes(i)) });
    this.updateProgress();
    this.showToast(`${s.name}: ${"*".repeat(stars)} +${reward.xp} XP, +${reward.graduationPoints} Grad, +$${reward.money}`);

    const focus = focusFor(lesson);
    const here = this.layout.stations.filter((x) => focus.kinds.includes(x.kind));
    const allDone = here.every((x) => stationsDone.includes(stationKey(lesson, this.label, x.id)));
    const bonusKey = stationKey(lesson, this.label, "lab");
    const b = BUILDINGS.find((x) => x.label === this.label);
    if (allDone && b && !stationsDone.includes(bonusKey)) {
      const s2 = useGameStore.getState();
      if (b.labId) s2.completeLab(b.labId, b.reward);
      else s2.reward(b.reward);
      s2.patch({ stationsDone: [...stationsDone, bonusKey] });
      this.time.delayedCall(1200, () => this.say(`All of today's stations here are done. Lab bonus: ${b.message}. Nice work, and don't forget your assignments!`));
    }
  }

  private updateProgress() {
    const a = useGameStore.getState().active;
    if (!a || a.lessonDay <= 0) {
      this.progress.setText("Attend class first");
      return;
    }
    const lesson = a.lessonDay - 1;
    const here = this.layout.stations.filter((x) => focusFor(lesson).kinds.includes(x.kind));
    const n = here.filter((x) => a.stationsDone.includes(stationKey(lesson, this.label, x.id))).length;
    this.progress.setText(here.length ? `Today's stations ${n}/${here.length}` : "No stations for today's lesson");
  }
  private showToast(text: string) {
    this.toast.setText(text).setVisible(true);
    this.time.delayedCall(2600, () => this.toast.setVisible(false));
  }

  private drawRoom() {
    const { floor, floorLine, wall, trim } = this.layout;
    const key = `floor-${this.label}`;
    if (!this.textures.exists(key)) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(floor).fillRect(0, 0, 40, 40);
      g.lineStyle(1, floorLine).strokeRect(0, 0, 40, 40);
      g.fillStyle(Phaser.Display.Color.ValueToColor(floor).lighten(6).color).fillRect(2, 2, 14, 2);
      g.generateTexture(key, 40, 40);
      g.destroy();
    }
    this.add.tileSprite(320, 317, 640, 326, key).setDepth(0);
    this.add.rectangle(320, 75, 640, 150, wall).setDepth(0);
    this.add.rectangle(320, 130, 640, 40, Phaser.Display.Color.ValueToColor(wall).darken(14).color).setDepth(0);
    this.add.rectangle(320, 150, 640, 6, trim).setDepth(1);

    // Wall sign and windows.
    this.add.rectangle(320, 40, 280, 30, 0x1b2236).setStrokeStyle(2, trim).setDepth(2);
    this.add.text(320, 40, this.layout.title, { fontFamily: FONT, fontSize: "14px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5).setDepth(3);
    [90, 550].forEach((x) => {
      this.add.rectangle(x, 70, 70, 50, 0x3a4458).setDepth(2);
      this.add.rectangle(x, 70, 62, 42, 0xa9dcf5).setDepth(3);
      this.add.rectangle(x - 12, 62, 18, 4, 0xffffff, 0.5).setDepth(4);
      this.add.rectangle(x, 70, 2, 42, 0x3a4458).setDepth(4);
    });

    wallClock(this, 190, 80);
    extinguisher(this, 450, 100);
    bulletinBoard(this, 320, 100, 90, 34);
    sign(this, 320, 140, "SAFETY GLASSES REQUIRED", "#b45309");
    this.add.rectangle(320, 272, 600, 4, 0xfde047, 0.55).setDepth(1);
    plant(this, 28, 430);
    trashCan(this, 612, 430);
    trashCan(this, 28, 300);

    // Door and mat.
    this.add.rectangle(320, 476, 44, 14, 0x5b3a1e).setStrokeStyle(2, 0x2e1c0b).setDepth(1);
    this.add.rectangle(320, 462, 52, 10, trim).setDepth(1);
  }

  private drawStation(s: Station) {
    const d = s.y + BENCH_H / 2;
    dropShadow(this, s.x, d + 3, s.w + 10, 12, d - 1);
    this.add.rectangle(s.x, s.y + 6, s.w, BENCH_H - 12, 0x4a5568).setStrokeStyle(2, 0x2d3748).setDepth(d);
    this.add.rectangle(s.x, s.y + 20, s.w - 6, 4, 0x2d3748).setDepth(d + 1);
    this.add.rectangle(s.x, s.y - 8, s.w + 4, 8, 0xcbd5e0).setStrokeStyle(1, 0x718096).setDepth(d + 1);
    this.drawIcon(s, d + 2);
    this.add
      .text(s.x, s.y + 33, s.name, { fontFamily: FONT, fontSize: "9px", color: "#ffffff", backgroundColor: "#0b1224cc", padding: { x: 3, y: 1 } })
      .setOrigin(0.5)
      .setDepth(d + 3);
  }

  private drawIcon(s: Station, depth: number) {
    const r = (x: number, y: number, w: number, h: number, c: number, stroke?: number) => {
      const o = this.add.rectangle(s.x + x, s.y + y, w, h, c).setDepth(depth);
      if (stroke !== undefined) o.setStrokeStyle(1, stroke);
      return o;
    };
    const c = (x: number, y: number, rad: number, col: number, stroke = 0x1a202c) =>
      this.add.circle(s.x + x, s.y + y, rad, col).setStrokeStyle(1, stroke).setDepth(depth);

    switch (s.kind) {
      case "crib":
        r(0, -26, 44, 32, 0x2f855a, 0x1c4532);
        for (let i = -1; i <= 1; i++) r(i * 13, -26, 2, 30, 0x1c4532);
        r(0, -40, 36, 5, 0xf7fafc);
        break;
      case "wiring":
        r(0, -26, 80, 26, 0xf7fafc, 0x4a5568);
        [0xe53e3e, 0x3182ce, 0x38a169, 0xecc94b].forEach((col, i) => {
          r(-27 + i * 18, -26, 4, 22, col);
          c(-27 + i * 18, -38, 3, 0xcbd5e0);
        });
        break;
      case "meter":
        r(0, -26, 34, 28, 0xecc94b, 0x744210);
        r(0, -32, 24, 10, 0x9ae6b4, 0x22543d);
        c(0, -17, 6, 0x2d3748);
        c(-30, -22, 5, 0xe53e3e);
        c(30, -22, 5, 0x1a202c);
        break;
      case "panel":
        r(0, -28, 56, 34, 0x718096, 0x2d3748);
        for (let i = 0; i < 6; i++) r(-20 + (i % 3) * 20, -36 + Math.floor(i / 3) * 16, 8, 10, i % 2 ? 0xe53e3e : 0xf7fafc);
        break;
      case "parts":
        r(0, -28, 84, 30, 0x975a16, 0x5b3a1e);
        [0xe53e3e, 0x3182ce, 0xecc94b, 0x38a169].forEach((col, i) => r(-30 + i * 20, -34, 14, 10, col, 0x1a202c));
        [0x3182ce, 0xe53e3e, 0x38a169, 0xecc94b].forEach((col, i) => r(-30 + i * 20, -20, 14, 10, col, 0x1a202c));
        break;
      case "compressor":
        r(0, -26, 36, 32, 0x2d3748, 0x1a202c);
        r(0, -44, 14, 6, 0xe53e3e);
        r(-24, -22, 12, 4, 0xcbd5e0);
        r(24, -22, 12, 4, 0xcbd5e0);
        c(0, -26, 8, 0x4a5568);
        break;
      case "gauges":
        c(-22, -30, 14, 0xf7fafc);
        c(22, -30, 14, 0xf7fafc);
        r(-22, -34, 2, 10, 0x3182ce);
        r(22, -34, 2, 10, 0xe53e3e);
        r(-22, -14, 4, 8, 0x3182ce);
        r(22, -14, 4, 8, 0xe53e3e);
        break;
      case "recovery":
        r(-18, -26, 36, 28, 0x38a169, 0x22543d);
        r(26, -24, 18, 30, 0xcbd5e0, 0x4a5568);
        c(-18, -26, 7, 0xf7fafc);
        break;
      case "coil":
        r(0, -26, 76, 30, 0xdd6b20, 0x7b341e);
        for (let i = -34; i <= 34; i += 8) r(i, -26, 2, 28, 0xfbd38d);
        break;
      case "furnace":
        r(0, -28, 52, 36, 0x718096, 0x2d3748);
        r(0, -20, 28, 14, 0x1a202c);
        r(0, -18, 8, 8, 0xf6ad55);
        r(0, -20, 4, 5, 0xfaf089);
        break;
      case "thermostat":
        [-26, 0, 26].forEach((x) => {
          r(x, -28, 20, 26, 0xf7fafc, 0x718096);
          r(x, -32, 12, 8, 0x9ae6b4, 0x22543d);
          c(x, -18, 3, 0xa0aec0);
        });
        break;
      case "airflow":
        c(0, -28, 17, 0x4a5568);
        for (let a = 0; a < 4; a++) {
          const ang = (a * Math.PI) / 2;
          this.add.ellipse(s.x + Math.cos(ang) * 8, s.y - 28 + Math.sin(ang) * 8, 14, 7, 0xcbd5e0).setRotation(ang).setDepth(depth);
        }
        c(0, -28, 3, 0x1a202c);
        break;
      case "workorder":
        r(-20, -30, 28, 22, 0x2d3748, 0x1a202c);
        r(-20, -31, 22, 14, 0x63b3ed);
        r(24, -22, 22, 14, 0xf7fafc, 0x718096);
        r(24, -22, 14, 2, 0x718096);
        break;
    }
  }
}
