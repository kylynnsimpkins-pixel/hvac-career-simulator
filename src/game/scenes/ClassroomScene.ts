import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { HOMEWORK, LESSON_PLANS, classroomLines } from "@/game/data/dialogue";
import { DialogueBox } from "./DialogueBox";
import { addVignette, hudBar } from "./fx";

const FONT = "monospace";
const SPEED = 170;
const LESSON_REWARD = { xp: 25, graduationPoints: 25 };
const DESK_COLS = [100, 200, 440, 540];
const DESK_ROWS = [240, 320, 400];

export class ClassroomScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private dialogue!: DialogueBox;
  private toast!: Phaser.GameObjects.Text;
  private marker!: Phaser.GameObjects.Text;
  private target: Phaser.Math.Vector2 | null = null;
  private lastPos = new Phaser.Math.Vector2();
  private frameTick = 0;
  private lessonDone = false;

  constructor() {
    super("ClassroomScene");
  }

  create() {
    this.lessonDone = false;
    this.target = null;
    this.makeFloor();
    this.drawRoom();

    const a = useGameStore.getState().active;
    const day = a?.lessonDay ?? 0;
    this.drawChalkboard(day);

    const solid = this.physics.add.staticGroup();
    const block = (x: number, y: number, w: number, h: number) => {
      const z = this.add.zone(x, y, w, h);
      this.physics.add.existing(z, true);
      solid.add(z);
    };

    // Teacher and desk.
    this.add.image(320, 184, "teacher").setScale(1.5).setOrigin(0.5, 1).setDepth(166);
    this.add.rectangle(320, 194, 116, 26, 0x8a5a2b).setStrokeStyle(2, 0x4b2e12).setDepth(190);
    this.add.rectangle(320, 188, 116, 8, 0xb07a45).setDepth(191);
    this.add.rectangle(296, 184, 14, 5, 0xc23b3b).setDepth(192);
    this.add.circle(346, 183, 4, 0xd93a2b).setDepth(192);
    block(320, 194, 116, 26);
    this.marker = this.add.text(320, 142, "!", { fontFamily: FONT, fontSize: "18px", color: "#fde047", fontStyle: "bold" }).setOrigin(0.5).setDepth(9000);
    this.tweens.add({ targets: this.marker, y: 148, duration: 450, yoyo: true, repeat: -1 });

    // Student desks and chairs.
    DESK_ROWS.forEach((y) =>
      DESK_COLS.forEach((x) => {
        this.add.rectangle(x, y + 26, 24, 18, 0x3b6fd4).setStrokeStyle(2, 0x1f3f80).setDepth(y + 26);
        this.add.rectangle(x, y + 17, 24, 4, 0x274d9e).setDepth(y + 27);
        this.add.rectangle(x, y, 58, 28, 0xb07a45).setStrokeStyle(2, 0x6b4423).setDepth(y + 14);
        this.add.rectangle(x, y - 6, 58, 6, 0xc99560).setDepth(y + 15);
        this.add.rectangle(x - 12, y - 2, 16, 10, 0xffffff).setDepth(y + 16);
        block(x, y, 58, 28);
      }),
    );

    this.makePlayer();
    hudBar(this, "Classroom 101  -  talk to Mr. Rivera at the front, exit by the bottom door");
    addVignette(this);

    this.shadow = this.add.ellipse(320, 440, 18, 7, 0x000000, 0.35);
    this.player = this.physics.add.sprite(320, 440, "player-0").setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(14, 10).setOffset(1, 22);
    this.physics.add.collider(this.player, solid);

    this.dialogue = new DialogueBox(this);
    this.toast = this.add
      .text(320, 350, "", { fontFamily: FONT, fontSize: "14px", color: "#fde047", backgroundColor: "#000000cc", padding: { x: 8, y: 4 } })
      .setOrigin(0.5)
      .setDepth(10000)
      .setVisible(false);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.on("keydown-SPACE", () => this.dialogue.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.dialogue.advance());
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.dialogue.active) this.dialogue.advance();
      else this.target = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });
  }

  update(_time: number, delta: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.dialogue.active) {
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

    if (!this.lessonDone && Phaser.Math.Distance.Between(this.player.x, this.player.y, 320, 222) < 55) this.startLesson();
    if (this.player.y >= 472) this.scene.start("CampusScene", { from: "Classroom" });
  }

  private startLesson() {
    const store = useGameStore.getState();
    if (!store.active) {
      this.lessonDone = true;
      this.showToast("Create a profile first");
      return;
    }
    this.lessonDone = true;
    const { playerName, lessonDay } = store.active;
    this.dialogue.start(classroomLines(playerName, lessonDay), () => {
      const s = useGameStore.getState();
      s.reward(LESSON_REWARD);
      s.patch({ lessonDay: lessonDay + 1 });
      this.marker.setVisible(false);
      this.showToast("Class complete: +25 XP, +25 Graduation");
    });
  }

  private showToast(text: string) {
    this.toast.setText(text).setVisible(true);
    this.time.delayedCall(2600, () => this.toast.setVisible(false));
  }

  private makeFloor() {
    if (this.textures.exists("wood")) return;
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xb98550).fillRect(0, 0, 32, 32);
    g.lineStyle(1, 0x8a5f33);
    for (let y = 0; y < 32; y += 8) g.lineBetween(0, y, 32, y);
    g.lineBetween(10, 0, 10, 8).lineBetween(22, 8, 22, 16).lineBetween(6, 16, 6, 24).lineBetween(26, 24, 26, 32);
    g.fillStyle(0xa8743f).fillRect(14, 3, 3, 1).fillRect(3, 19, 4, 1);
    g.generateTexture("wood", 32, 32);
    g.destroy();
  }

  private drawRoom() {
    this.add.tileSprite(320, 317, 640, 326, "wood").setDepth(0);
    this.add.rectangle(320, 75, 640, 150, 0xa9bdd0).setDepth(0);
    this.add.rectangle(320, 130, 640, 40, 0x6f8aa3).setDepth(0);
    this.add.rectangle(320, 110, 640, 3, 0x4e657b).setDepth(0);
    this.add.rectangle(320, 152, 640, 6, 0x4b3a2a).setDepth(1);

    // Wall clock.
    this.add.circle(133, 40, 15, 0xf5f5f5).setStrokeStyle(3, 0x4b3a2a).setDepth(2);
    this.add.rectangle(133, 34, 2, 11, 0x222222).setDepth(3);
    this.add.rectangle(137, 40, 9, 2, 0x222222).setDepth(3);

    // HVAC posters.
    this.refrigerationPoster(70, 76);
    this.poster(522, 76, 60, 78, 0xe0a800, "OHM'S LAW", ["V", "=", "I x R"]);
    this.poster(590, 76, 56, 78, 0xc23b3b, "SAFETY", ["LOCKOUT", "TAGOUT", "ALWAYS"]);

    // Door and mat.
    this.add.rectangle(320, 476, 44, 14, 0x5b3a1e).setStrokeStyle(2, 0x2e1c0b).setDepth(1);
    this.add.rectangle(320, 462, 52, 10, 0x8b2f2f).setDepth(1);
  }

  private poster(x: number, y: number, w: number, h: number, color: number, title: string, lines: string[]) {
    this.add.rectangle(x, y, w + 4, h + 4, 0x3a2a1a).setDepth(2);
    this.add.rectangle(x, y, w, h, 0xf8f4e3).setDepth(3);
    this.add.rectangle(x, y - h / 2 + 8, w, 16, color).setDepth(4);
    this.add.text(x, y - h / 2 + 8, title, { fontFamily: FONT, fontSize: "8px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5).setDepth(5);
    this.add.text(x, y + 8, lines.join("\n"), { fontFamily: FONT, fontSize: "9px", color: "#222222", align: "center" }).setOrigin(0.5).setDepth(5);
  }

  private refrigerationPoster(x: number, y: number) {
    this.add.rectangle(x, y, 68, 88, 0x3a2a1a).setDepth(2);
    this.add.rectangle(x, y, 64, 84, 0xf8f4e3).setDepth(3);
    this.add.rectangle(x, y - 34, 64, 16, 0x1a73b8).setDepth(4);
    this.add.text(x, y - 34, "COOLING CYCLE", { fontFamily: FONT, fontSize: "7px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5).setDepth(5);
    const box = (bx: number, by: number, color: number, label: string) => {
      this.add.rectangle(bx, by, 24, 14, color).setStrokeStyle(1, 0x222222).setDepth(5);
      this.add.text(bx, by, label, { fontFamily: FONT, fontSize: "6px", color: "#ffffff" }).setOrigin(0.5).setDepth(6);
    };
    box(x - 16, y - 12, 0xc23b3b, "COMP");
    box(x + 16, y - 12, 0xe07b00, "COND");
    box(x + 16, y + 20, 0x4aa3df, "METER");
    box(x - 16, y + 20, 0x1a73b8, "EVAP");
    this.add.rectangle(x, y - 12, 8, 2, 0x222222).setDepth(5);
    this.add.rectangle(x + 16, y + 4, 2, 10, 0x222222).setDepth(5);
    this.add.rectangle(x, y + 20, 8, 2, 0x222222).setDepth(5);
    this.add.rectangle(x - 16, y + 4, 2, 10, 0x222222).setDepth(5);
  }

  private drawChalkboard(day: number) {
    this.add.rectangle(320, 78, 318, 118, 0x6b4423).setDepth(2);
    this.add.rectangle(320, 78, 304, 104, 0x2f4f3f).setStrokeStyle(2, 0x1d3328).setDepth(3);
    this.add.rectangle(320, 140, 304, 6, 0x8b6b3f).setDepth(3);
    this.add.rectangle(280, 137, 14, 3, 0xffffff).setDepth(4);

    const plan = LESSON_PLANS[day % LESSON_PLANS.length];
    const hw = HOMEWORK[day % HOMEWORK.length];
    const board = [
      `DAY ${day + 1}: ${plan.title.toUpperCase()}`,
      "PLAN",
      ...plan.agenda.map((a) => `- ${a}`),
      "ASSIGNMENTS",
      ...hw.map((h) => `* ${h}`),
    ].join("\n");
    this.add
      .text(174, 30, board, { fontFamily: FONT, fontSize: "9px", color: "#f0f5ea", lineSpacing: 1, wordWrap: { width: 292 } })
      .setDepth(5);
  }

  private makePlayer() {
    // Player textures are created by the campus scene; this guards against starting here first.
    if (this.textures.exists("player-0") && this.textures.exists("teacher")) return;
    this.scene.start("CampusScene");
  }
}
