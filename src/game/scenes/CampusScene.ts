import * as Phaser from "phaser";
import { useGameStore, type Reward } from "@/store/gameStore";
import { INTRO, type DialogueLine } from "@/game/data/dialogue";
import { addVignette, dropShadow, hudBar, simsPanel } from "./fx";
import { CHAR_BODY, CHAR_SCALE, makeCharacterTextures, plumbob } from "./characters";
import type { Wardrobe } from "@/game/data/wardrobe";
import { makeCampusTextures } from "./campusArt";

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
const DOOR_OFFSET = 40;
const FONT = "monospace";


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
    this.target = null;
    this.dialogue = null;
    this.typing = null;
    this.makeTextures();
    this.drawGround();

    const walls = this.physics.add.staticGroup();
    BUILDINGS.forEach((b) => {
      dropShadow(this, b.x + 8, b.y + 54, 150, 26, b.y + 30);
      const img = this.add.image(b.x, b.y, `bld-${b.label}`).setScale(0.5).setDepth(b.y + 48);
      // Solid body covers the building but leaves the door row walkable.
      const wall = this.add.zone(b.x, b.y - 10, 124, 52);
      this.physics.add.existing(wall, true);
      walls.add(wall);

      const signW = b.label.length * 8 + 16;
      this.add.rectangle(b.x, b.y - 62, signW, 16, 0x5b3a1e).setStrokeStyle(2, 0x2e1c0b).setDepth(9000);
      this.add.text(b.x, b.y - 62, b.label, { fontFamily: FONT, fontSize: "11px", color: "#fff3c4" }).setOrigin(0.5).setDepth(9001);

      const marker = this.add.text(b.x, b.y + DOOR_OFFSET - 6, "▼", { fontFamily: FONT, fontSize: "14px", color: "#fde047" }).setOrigin(0.5).setDepth(9000);
      this.tweens.add({ targets: marker, y: marker.y + 6, duration: 500, yoyo: true, repeat: -1 });
      img.setData("b", b.label);
    });

    TREES.forEach(([x, y]) => {
      dropShadow(this, x, y + 18, 34, 12, y + 10);
      this.add.image(x, y, "tree").setScale(0.5).setDepth(y + 16);
    });

    this.makePlayerTextures(useGameStore.getState().active?.wardrobe);
    const from = BUILDINGS.find((b) => b.label === data?.from);
    const spawn = from ? { x: from.x, y: from.y + DOOR_OFFSET + 70 } : { x: 320, y: 430 };
    this.shadow = this.add.ellipse(320, 446, 18, 7, 0x000000, 0.35);
    this.player = this.physics.add.sprite(spawn.x, spawn.y, "player-0").setOrigin(0.5, 1).setScale(CHAR_SCALE);
    this.player.setCollideWorldBounds(true);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(CHAR_BODY.w, CHAR_BODY.h).setOffset(CHAR_BODY.ox, CHAR_BODY.oy);
    this.physics.add.collider(this.player, walls);

    hudBar(this, "HVAC Tech Academy  -  arrows / tap to walk, step on the ▼ doors");
    plumbob(this, this.player, 36);
    this.drawProps();
    simsPanel(this);
    addVignette(this);
    this.toast = this.add
      .text(320, 440, "", { fontFamily: FONT, fontSize: "14px", color: "#fde047", backgroundColor: "#000000cc", padding: { x: 8, y: 4 } })
      .setOrigin(0.5)
      .setDepth(10000)
      .setVisible(false);

    this.drawVan();
    this.drawTestCenter();
    this.buildDialogueBox();
    this.add.image(150, 196, "teacher").setScale(CHAR_SCALE).setOrigin(0.5, 1).setDepth(196);

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
      if (a.graduated && !a.graduationSeen) {
        this.scene.start("GraduationScene");
        return;
      }
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

    if (Phaser.Math.Distance.Between(this.player.x, this.player.y, 230, 440) < 40 && time > (this.cooldown.get("van") ?? 0)) {
      this.cooldown.set("van", time + 3000);
      const va = useGameStore.getState().active;
      if (!va) this.showToast("Create a profile first");
      else if (!va.graduated) this.showToast("Service calls are for graduates only: earn 1000 graduation points");
      else this.scene.start("JobMapScene");
    }

    if (Phaser.Math.Distance.Between(this.player.x, this.player.y, 530, 452) < 36 && time > (this.cooldown.get("exam") ?? 0)) {
      this.cooldown.set("exam", time + 3000);
      const ga = useGameStore.getState().active;
      if (!ga) this.showToast("Create a profile first");
      else if (!ga.graduated) this.showToast("Graduate first: earn 1000 graduation points");
      else this.scene.start("ExamScene");
    }

    for (const b of BUILDINGS) {
      const near = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y + DOOR_OFFSET) < 34;
      if (near && time > (this.cooldown.get(b.label) ?? 0)) {
        this.cooldown.set(b.label, time + 3000);
        this.enter(b);
      }
    }
  }

  private drawProps() {
    const lamps: [number, number][] = [[60, 214], [215, 214], [425, 214], [580, 214], [250, 400], [390, 400]];
    lamps.forEach(([x, y]) => {
      dropShadow(this, x, y + 2, 20, 8, y - 2);
      this.add.image(x, y - 24, "lamp").setScale(0.5).setDepth(y);
      this.add.image(x, y - 38, "glow").setScale(0.9).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.35).setDepth(9350);
    });
    [[200, 228], [450, 228], [300, 392]].forEach(([x, y]) => {
      dropShadow(this, x, y + 6, 46, 12, y);
      this.add.image(x, y, "bench").setScale(0.5).setDepth(y);
    });
    BUILDINGS.forEach((b) => {
      [-56, 56].forEach((dx) => this.add.image(b.x + dx, b.y + 60, "bush").setScale(0.5).setDepth(b.y + 70));
    });
  }

  private drawTestCenter() {
    this.add.ellipse(530, 470, 70, 8, 0x000000, 0.25).setDepth(440);
    this.add.rectangle(530, 450, 64, 34, 0xe2e8f0).setStrokeStyle(2, 0x1a3a6b).setDepth(450);
    this.add.rectangle(530, 440, 68, 8, 0x1a3a6b).setDepth(451);
    this.add.rectangle(530, 458, 14, 18, 0x7c4a03).setDepth(451);
    this.add.text(530, 421, "EPA 608 Test Center", { fontFamily: FONT, fontSize: "10px", color: "#ffffff", backgroundColor: "#000000aa", padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(9000);
  }

  private drawVan() {
    this.add.ellipse(230, 466, 86, 10, 0x000000, 0.25).setDepth(440);
    this.add.rectangle(230, 452, 80, 28, 0xf8fafc).setStrokeStyle(2, 0x1e3a8a).setDepth(450);
    this.add.rectangle(260, 456, 18, 20, 0xbfe3ff).setStrokeStyle(2, 0x1e3a8a).setDepth(451);
    this.add.circle(206, 468, 7, 0x111111).setDepth(452);
    this.add.circle(254, 468, 7, 0x111111).setDepth(452);
    this.add.text(224, 450, "HVAC", { fontFamily: FONT, fontSize: "10px", color: "#1e3a8a", fontStyle: "bold" }).setOrigin(0.5).setDepth(453);
    this.add.text(230, 420, useGameStore.getState().active?.graduated ? "Service calls" : "Service calls (graduates only)", { fontFamily: FONT, fontSize: "10px", color: "#ffffff", backgroundColor: "#000000aa", padding: { x: 3, y: 1 } }).setOrigin(0.5).setDepth(9000);
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
    const portrait = this.add.image(66, 440, "teacher").setScale(1.6).setOrigin(0.5, 1);
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
    this.add.tileSprite(320, 240, 640, 480, "grass").setTileScale(0.5).setDepth(0);
    // Stone paths: main avenue, the lab row, and the plaza.
    this.add.tileSprite(320, 190, 640, 36, "path").setTileScale(0.5).setDepth(1);
    this.add.tileSprite(320, 340, 48, 300, "path").setTileScale(0.5).setDepth(1);
    this.add.tileSprite(320, 360, 200, 40, "path").setTileScale(0.5).setDepth(1);
    [110, 530].forEach((x) => this.add.tileSprite(x, 160, 36, 60, "path").setDepth(1));
    this.add.tileSprite(320, 152, 40, 40, "path").setTileScale(0.5).setDepth(1);
    // Flower patches.
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(10, 630);
      const y = Phaser.Math.Between(220, 470);
      if (Math.abs(x - 320) < 40 || (y > 340 && y < 385 && Math.abs(x - 320) < 110)) continue;
      this.add.rectangle(x, y, 3, 3, Phaser.Utils.Array.GetRandom([0xff6b8a, 0xfff176, 0xffffff])).setDepth(2);
    }
  }

  private makeTextures() {
    makeCampusTextures(this, BUILDINGS);
  }

  private makePlayerTextures(wardrobe?: Wardrobe) {
    makeCharacterTextures(this, wardrobe);
  }
}