import * as Phaser from "phaser";
import { useGameStore, type Reward } from "@/store/gameStore";
import { INTRO, type DialogueLine } from "@/game/data/dialogue";
import { addVignette, dropShadow, hudBar } from "./fx";

interface Building {
  label: string;
  x: number;
  y: number;
  wall: number;
  roof: number;
  labId?: string;
  reward: Reward;
  message: string;
}

export const BUILDINGS: Building[] = [
  { label: "Classroom", x: 110, y: 100, wall: 0xd6c7a1, roof: 0x3b6fd4, reward: { xp: 25, graduationPoints: 25 }, message: "+25 XP, +25 Graduation" },
  { label: "Electrical Lab", x: 320, y: 100, wall: 0xcfcfcf, roof: 0xe0a800, labId: "wiring-lab", reward: { xp: 50, contractorCredits: 20, money: 40, skill: "electrical", skillPoints: 2 }, message: "+50 XP, +20 Credits, +$40" },
  { label: "Refrigeration Lab", x: 530, y: 100, wall: 0xbfd9e6, roof: 0x1aa3b8, labId: "refrigeration-lab", reward: { xp: 75, contractorCredits: 25, money: 40, skill: "mechanical", skillPoints: 2 }, message: "+75 XP, +25 Credits, +$40" },
  { label: "Troubleshooting", x: 320, y: 300, wall: 0xc9a58a, roof: 0xc23b3b, labId: "electrical-diagnostics", reward: { xp: 100, contractorCredits: 50, money: 40, skill: "diagnostics", skillPoints: 2 }, message: "+100 XP, +50 Credits, +$40" },
];

const TREES: [number, number][] = [
  [30, 230], [60, 330], [28, 420], [600, 230], [585, 340], [610, 430], [180, 250], [460, 250], [150, 400], [500, 410],
];

const SPEED = 170;
const DOOR_OFFSET = 62;
const FONT = "monospace";

const shade = (c: number, amt: number) => Phaser.Display.Color.ValueToColor(c).darken(amt).color;
const tint = (c: number, amt: number) => Phaser.Display.Color.ValueToColor(c).lighten(amt).color;

export class CampusScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private toast!: Phaser.GameObjects.Text;
  private target: Phaser.Math.Vector2 | null = null;
  private cooldown = new Map<string, number>();
  private frameTick = 0;
  private lastPos = new Phaser.Math.Vector2();
  private box!: Phaser.GameObjects.Container;
  private speakerText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private dialogue: { lines: DialogueLine[]; index: number; onDone: () => void } | null = null;
  private typing: Phaser.Time.TimerEvent | null = null;
  private introChecked = false;

  constructor() {
    super("CampusScene");
  }

  create(data?: { from?: string }) {
    this.makeTextures();
    this.drawGround();

    const walls = this.physics.add.staticGroup();
    BUILDINGS.forEach((b) => {
      dropShadow(this, b.x + 6, b.y + 52, 140, 22, b.y + 30);
      const img = this.add.image(b.x, b.y, `bld-${b.label}`).setDepth(b.y + 48);
      // Solid body covers the building but leaves the door row walkable.
      const wall = this.add.zone(b.x, b.y - 8, 124, 76);
      this.physics.add.existing(wall, true);
      walls.add(wall);

      const signW = b.label.length * 8 + 16;
      this.add.rectangle(b.x, b.y - 62, signW, 16, 0x5b3a1e).setStrokeStyle(2, 0x2e1c0b).setDepth(9000);
      this.add.text(b.x, b.y - 62, b.label, { fontFamily: FONT, fontSize: "11px", color: "#fff3c4" }).setOrigin(0.5).setDepth(9001);

      const marker = this.add.text(b.x, b.y + DOOR_OFFSET - 26, "▼", { fontFamily: FONT, fontSize: "14px", color: "#fde047" }).setOrigin(0.5).setDepth(9000);
      this.tweens.add({ targets: marker, y: marker.y + 6, duration: 500, yoyo: true, repeat: -1 });
      img.setData("b", b.label);
    });

    TREES.forEach(([x, y]) => {
      dropShadow(this, x, y + 16, 30, 10, y + 10);
      this.add.image(x, y, "tree").setDepth(y + 16);
    });

    const color = useGameStore.getState().active?.avatarColor ?? "#38bdf8";
    this.makePlayerTextures(Phaser.Display.Color.HexStringToColor(color).color);
    const from = BUILDINGS.find((b) => b.label === data?.from);
    const spawn = from ? { x: from.x, y: from.y + DOOR_OFFSET + 50 } : { x: 320, y: 430 };
    this.shadow = this.add.ellipse(320, 446, 18, 7, 0x000000, 0.35);
    this.player = this.physics.add.sprite(spawn.x, spawn.y, "player-0").setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(14, 10).setOffset(1, 22);
    this.physics.add.collider(this.player, walls);

    hudBar(this, "HVAC Tech Academy  -  arrows / tap to walk, step on the ▼ doors");
    addVignette(this);
    this.toast = this.add
      .text(320, 440, "", { fontFamily: FONT, fontSize: "14px", color: "#fde047", backgroundColor: "#000000cc", padding: { x: 8, y: 4 } })
      .setOrigin(0.5)
      .setDepth(10000)
      .setVisible(false);

    this.drawVan();
    this.buildDialogueBox();
    this.add.image(150, 196, "teacher").setScale(1.5).setOrigin(0.5, 1).setDepth(196);

    this.input.keyboard!.on("keydown-SPACE", () => this.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.advance());
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.dialogue) {
        this.advance();
        return;
      }
      this.target = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });
  }

  update(time: number, delta: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (!this.introChecked && useGameStore.getState().active) {
      this.introChecked = true;
      const a = useGameStore.getState().active!;
      if (!a.seenIntro) {
        this.startDialogue(INTRO.map((l) => ({ ...l, text: l.text.replace("{name}", a.playerName) })), () =>
          useGameStore.getState().patch({ seenIntro: true }),
        );
      }
    }
    if (this.dialogue) {
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

    const moving = body.velocity.length() > 1;
    if (moving) {
      this.frameTick += delta;
      this.player.setTexture(`player-${Math.floor(this.frameTick / 140) % 2}`);
      if (body.velocity.x !== 0) this.player.setFlipX(body.velocity.x < 0);
    } else {
      this.player.setTexture("player-0");
    }
    this.player.setDepth(this.player.y);
    this.shadow.setPosition(this.player.x, this.player.y - 2).setDepth(this.player.y - 1);

    if (Phaser.Math.Distance.Between(this.player.x, this.player.y, 110, 440) < 40 && time > (this.cooldown.get("van") ?? 0)) {
      this.cooldown.set("van", time + 3000);
      if (useGameStore.getState().active) this.scene.start("JobMapScene");
      else this.showToast("Create a profile first");
    }

    for (const b of BUILDINGS) {
      const near = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y + DOOR_OFFSET) < 34;
      if (near && time > (this.cooldown.get(b.label) ?? 0)) {
        this.cooldown.set(b.label, time + 3000);
        this.enter(b);
      }
    }
  }

  private drawVan() {
    this.add.ellipse(110, 466, 86, 10, 0x000000, 0.25).setDepth(440);
    this.add.rectangle(110, 452, 80, 28, 0xf8fafc).setStrokeStyle(2, 0x1e3a8a).setDepth(450);
    this.add.rectangle(140, 456, 18, 20, 0xbfe3ff).setStrokeStyle(2, 0x1e3a8a).setDepth(451);
    this.add.circle(86, 468, 7, 0x111111).setDepth(452);
    this.add.circle(134, 468, 7, 0x111111).setDepth(452);
    this.add.text(104, 450, "HVAC", { fontFamily: FONT, fontSize: "10px", color: "#1e3a8a", fontStyle: "bold" }).setOrigin(0.5).setDepth(453);
    this.add.text(110, 420, "Service calls", { fontFamily: FONT, fontSize: "10px", color: "#ffffff", backgroundColor: "#000000aa", padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(9000);
  }

  private enter(b: Building) {
    const store = useGameStore.getState();
    if (!store.active) {
      this.showToast("Create a profile first");
      return;
    }
    if (b.label === "Classroom") {
      this.scene.start("ClassroomScene");
      return;
    }
    this.scene.start("LabScene", { building: b.label });
  }

  private buildDialogueBox() {
    const bg = this.add.rectangle(320, 410, 616, 112, 0x10162b, 0.95).setStrokeStyle(3, 0xfde047);
    const portraitBg = this.add.rectangle(66, 410, 84, 96, 0x24304f).setStrokeStyle(2, 0x8aa0d6);
    const portrait = this.add.image(66, 440, "teacher").setScale(3.2).setOrigin(0.5, 1);
    this.speakerText = this.add.text(124, 366, "", { fontFamily: FONT, fontSize: "13px", color: "#fde047", fontStyle: "bold" });
    this.bodyText = this.add.text(124, 386, "", { fontFamily: FONT, fontSize: "13px", color: "#ffffff", wordWrap: { width: 480 } });
    const hint = this.add.text(612, 458, "SPACE / tap ▶", { fontFamily: FONT, fontSize: "10px", color: "#8aa0d6" }).setOrigin(1, 1);
    this.box = this.add.container(0, 0, [bg, portraitBg, portrait, this.speakerText, this.bodyText, hint]).setDepth(20000).setVisible(false);
  }

  private startDialogue(lines: DialogueLine[], onDone: () => void) {
    this.dialogue = { lines, index: 0, onDone };
    this.box.setVisible(true);
    this.showLine();
  }

  private showLine() {
    const d = this.dialogue!;
    const line = d.lines[d.index];
    this.speakerText.setText(line.speaker);
    this.bodyText.setText("");
    let i = 0;
    this.typing?.remove();
    this.typing = this.time.addEvent({
      delay: 22,
      repeat: line.text.length - 1,
      callback: () => this.bodyText.setText(line.text.slice(0, ++i)),
      callbackScope: this,
    });
  }

  private advance() {
    const d = this.dialogue;
    if (!d) return;
    const line = d.lines[d.index];
    if (this.typing && this.typing.getRepeatCount() > 0) {
      this.typing.remove();
      this.typing = null;
      this.bodyText.setText(line.text);
      return;
    }
    if (d.index + 1 < d.lines.length) {
      d.index++;
      this.showLine();
      return;
    }
    this.dialogue = null;
    this.box.setVisible(false);
    d.onDone();
  }

  private showToast(text: string) {
    this.toast.setText(text).setVisible(true);
    this.time.delayedCall(2200, () => this.toast.setVisible(false));
  }

  private drawHud() {
    this.add.rectangle(320, 12, 640, 24, 0x000000, 0.55).setDepth(9500);
    this.add.text(8, 5, "HVAC Tech Academy  -  arrows / tap to walk, step on the ▼ doors", { fontFamily: FONT, fontSize: "11px", color: "#ffffff" }).setDepth(9501);
  }

  private drawGround() {
    this.add.tileSprite(320, 240, 640, 480, "grass").setDepth(0);
    // Stone paths: main avenue, the lab row, and the plaza.
    this.add.tileSprite(320, 190, 640, 36, "path").setDepth(1);
    this.add.tileSprite(320, 340, 48, 300, "path").setDepth(1);
    this.add.tileSprite(320, 360, 200, 40, "path").setDepth(1);
    [110, 530].forEach((x) => this.add.tileSprite(x, 160, 36, 60, "path").setDepth(1));
    this.add.tileSprite(320, 152, 40, 40, "path").setDepth(1);
    // Flower patches.
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(10, 630);
      const y = Phaser.Math.Between(220, 470);
      if (Math.abs(x - 320) < 40 || (y > 340 && y < 385 && Math.abs(x - 320) < 110)) continue;
      this.add.rectangle(x, y, 3, 3, Phaser.Utils.Array.GetRandom([0xff6b8a, 0xfff176, 0xffffff])).setDepth(2);
    }
  }

  private makeTextures() {
    if (this.textures.exists("grass")) return;
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    const gen = (key: string, w: number, h: number) => {
      g.generateTexture(key, w, h);
      g.clear();
    };

    // Grass: base + deterministic speckles.
    g.fillStyle(0x4f9d46).fillRect(0, 0, 32, 32);
    for (let i = 0; i < 26; i++) {
      g.fillStyle(i % 3 === 0 ? 0x3f8a3a : 0x66b25a).fillRect((i * 11) % 32, (i * 17) % 32, 2, 2);
    }
    gen("grass", 32, 32);

    // Cobblestone path.
    g.fillStyle(0xb8a98a).fillRect(0, 0, 32, 32);
    g.lineStyle(1, 0x8f8168);
    for (let y = 0; y < 32; y += 8) {
      g.lineBetween(0, y, 32, y);
      for (let x = (y / 8) % 2 ? 8 : 0; x < 32; x += 16) g.lineBetween(x, y, x, y + 8);
    }
    gen("path", 32, 32);

    BUILDINGS.forEach((b) => {
      const w = 128;
      const h = 112;
      // Wall with brick courses.
      g.fillStyle(b.wall).fillRect(4, 34, w - 8, h - 34);
      g.lineStyle(1, shade(b.wall, 12));
      for (let y = 44; y < h; y += 8) g.lineBetween(4, y, w - 4, y);
      g.fillStyle(shade(b.wall, 25)).fillRect(4, h - 8, w - 8, 8);
      // Roof with shingle rows and overhang.
      g.fillStyle(shade(b.roof, 30)).fillRect(0, 30, w, 6);
      g.fillStyle(b.roof).fillRect(2, 0, w - 4, 30);
      g.lineStyle(1, shade(b.roof, 20));
      for (let y = 6; y < 30; y += 6) g.lineBetween(2, y, w - 2, y);
      g.fillStyle(tint(b.roof, 15)).fillRect(2, 0, w - 4, 3);
      // Windows.
      [16, 88].forEach((wx) => {
        g.fillStyle(0x5a3a1c).fillRect(wx - 2, 46, 28, 26);
        g.fillStyle(0x9fd8f5).fillRect(wx, 48, 24, 22);
        g.fillStyle(0xffffff).fillRect(wx + 2, 50, 6, 3);
        g.lineStyle(2, 0x5a3a1c).lineBetween(wx + 12, 48, wx + 12, 70).lineBetween(wx, 59, wx + 24, 59);
      });
      // Door with step.
      g.fillStyle(0x3b2410).fillRect(50, 62, 28, 50);
      g.fillStyle(0x7a4a22).fillRect(52, 64, 24, 48);
      g.fillStyle(0x5b3515).fillRect(62, 64, 2, 48);
      g.fillStyle(0xffd34d).fillRect(70, 90, 3, 3);
      g.fillStyle(0x8a8a8a).fillRect(46, 108, 36, 4);
      gen(`bld-${b.label}`, w, h);
    });

    // Tree.
    g.fillStyle(0x6b4423).fillRect(13, 24, 6, 16);
    g.fillStyle(0x2f7a32).fillCircle(16, 16, 14);
    g.fillStyle(0x3f9a41).fillCircle(11, 12, 8).fillCircle(21, 14, 8);
    g.fillStyle(0x62bd5a).fillCircle(12, 9, 4);
    gen("tree", 32, 40);

    // Teacher: gray hair, glasses, tie.
    g.fillStyle(0x3a3a3a).fillRect(4, 17, 3, 6).fillRect(9, 17, 3, 6);
    g.fillStyle(0xf5f5f5).fillRect(3, 9, 10, 9);
    g.fillStyle(0xb02a2a).fillRect(7, 10, 2, 7);
    g.fillStyle(0xf5f5f5).fillRect(1, 10, 2, 6).fillRect(13, 10, 2, 6);
    g.fillStyle(0xf1c27d).fillRect(4, 3, 8, 7).fillRect(1, 16, 2, 2).fillRect(13, 16, 2, 2);
    g.fillStyle(0xbdbdbd).fillRect(3, 0, 10, 4).fillRect(3, 3, 1, 4).fillRect(12, 3, 1, 4);
    g.fillStyle(0x222222).fillRect(5, 6, 3, 2).fillRect(9, 6, 3, 2);
    g.fillStyle(0x9fd8f5).fillRect(6, 6, 1, 1).fillRect(10, 6, 1, 1);
    gen("teacher", 16, 24);

    g.destroy();
  }

  private makePlayerTextures(shirt: number) {
    for (let f = 0; f < 2; f++) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      // Boots/legs (alternate stride).
      g.fillStyle(0x2b3a67).fillRect(4, 17, 3, 5 + (f ? 1 : 0)).fillRect(9, 17, 3, 5 + (f ? 0 : 1));
      g.fillStyle(0x3a2a1a).fillRect(3, 22, 4, 2).fillRect(9, 22, 4, 2);
      // Torso with tool belt.
      g.fillStyle(shirt).fillRect(3, 9, 10, 9);
      g.fillStyle(shade(shirt, 30)).fillRect(3, 9, 2, 9).fillRect(3, 15, 10, 2);
      g.fillStyle(0xc9a227).fillRect(7, 15, 2, 2);
      // Arms.
      g.fillStyle(shirt).fillRect(1, 10, 2, 6).fillRect(13, 10, 2, 6);
      g.fillStyle(0xf1c27d).fillRect(1, 16, 2, 2).fillRect(13, 16, 2, 2);
      // Head + hard hat.
      g.fillStyle(0xf1c27d).fillRect(4, 3, 8, 7);
      g.fillStyle(0x222222).fillRect(6, 6, 1, 2).fillRect(9, 6, 1, 2);
      g.fillStyle(0xffd400).fillRect(3, 0, 10, 4).fillRect(2, 3, 12, 2);
      g.generateTexture(`player-${f}`, 16, 24);
      g.destroy();
    }
  }
}
