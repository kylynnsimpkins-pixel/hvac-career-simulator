import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { SITES, jobKey, type Site } from "@/game/data/jobsites";
import { DialogueBox } from "./DialogueBox";
import { QuizBox } from "./QuizBox";
import { addVignette, hudBar } from "./fx";

const FONT = "monospace";
const SPEED = 170;

/** One jobsite floor per run: walk the stairs/ladders up to the roof and service the equipment. */
export class JobsiteScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private dialogue!: DialogueBox;
  private quiz!: QuizBox;
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

  create(data: { site: string; level?: number }) {
    if (!this.textures.exists("player-0") || !this.textures.exists("teacher")) {
      this.scene.start("CampusScene");
      return;
    }
    this.site = SITES.find((s) => s.id === data.site) ?? SITES[0];
    this.levelIndex = data.level ?? 0;
    this.target = null;
    this.busy = false;
    this.cooldownUntil = 0;
    const lv = this.site.levels[this.levelIndex];
    const fromAbove = (data as { fromAbove?: boolean }).fromAbove;

    // Backdrop: wall (or sky on the roof) above, floor below.
    this.add.rectangle(320, 75, 640, 150, lv.wall).setDepth(0);
    this.add.rectangle(320, 317, 640, 326, lv.floor).setDepth(0);
    if (lv.roof) {
      for (let y = 160; y < 480; y += 16) this.add.rectangle(320, y, 640, 2, 0x000000, 0.18).setDepth(1);
      this.add.circle(540, 50, 26, 0xfff3a3).setDepth(1);
      this.add.ellipse(120, 60, 90, 26, 0xffffff, 0.8).setDepth(1);
      this.add.rectangle(320, 152, 640, 8, 0x333b45).setDepth(1);
    } else {
      this.add.rectangle(320, 152, 640, 6, 0x4b3a2a).setDepth(1);
      for (let x = 0; x < 640; x += 64) this.add.rectangle(x, 300, 1, 330, 0x000000, 0.08).setDepth(1);
    }

    const solid = this.physics.add.staticGroup();
    const block = (x: number, y: number, w: number, h: number) => {
      const z = this.add.zone(x, y, w, h);
      this.physics.add.existing(z, true);
      solid.add(z);
    };

    lv.props.forEach(([x, y, w, h, color, label]) => {
      this.add.rectangle(x, y + 4, w, h, 0x000000, 0.2).setDepth(y);
      this.add.rectangle(x, y, w, h, color).setStrokeStyle(2, 0x222222).setDepth(y + 1);
      if (label) this.add.text(x, y, label, { fontFamily: FONT, fontSize: "9px", color: "#111111" }).setOrigin(0.5).setDepth(y + 2);
      block(x, y, w, h);
    });

    if (lv.unit) {
      const u = lv.unit;
      this.add.rectangle(u.x, u.y + 6, 96, 64, 0x000000, 0.25).setDepth(u.y);
      this.add.rectangle(u.x, u.y, 90, 60, 0xb8c2cc).setStrokeStyle(3, 0x4b5563).setDepth(u.y + 1);
      this.add.circle(u.x, u.y - 2, 22, 0x374151).setStrokeStyle(2, 0x111827).setDepth(u.y + 2);
      this.add.rectangle(u.x, u.y - 2, 40, 4, 0x9ca3af).setDepth(u.y + 3);
      this.add.rectangle(u.x, u.y - 2, 4, 40, 0x9ca3af).setDepth(u.y + 3);
      this.add.text(u.x, u.y - 42, u.label, { fontFamily: FONT, fontSize: "11px", color: "#fde047", backgroundColor: "#000000aa", padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(9000);
      block(u.x, u.y, 90, 60);
    }

    const stairs = (x: number, y: number, label: string, up: boolean) => {
      this.add.rectangle(x, y, 56, 44, 0x6b4a2b).setStrokeStyle(2, 0x2e1c0b).setDepth(2);
      for (let i = 0; i < 5; i++) this.add.rectangle(x, y - 18 + i * 9, 50, 3, up ? 0xc99560 : 0x8a5f33).setDepth(3);
      this.add.text(x, y - 36, `${up ? "▲" : "▼"} ${label}`, { fontFamily: FONT, fontSize: "11px", color: "#ffffff", backgroundColor: "#000000aa", padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(9000);
    };
    if (lv.up) stairs(lv.up.x, lv.up.y, lv.up.label, true);
    if (lv.down) stairs(lv.down.x, lv.down.y, lv.down.label, false);

    if (this.levelIndex === 0) {
      this.add.rectangle(320, 476, 44, 14, 0x5b3a1e).setStrokeStyle(2, 0x2e1c0b).setDepth(1);
      this.add.rectangle(320, 462, 52, 10, 0x8b2f2f).setDepth(1);
    }

    hudBar(this, `${this.site.name}  -  ${lv.name}${this.levelIndex === 0 ? "  (exit: bottom door)" : ""}`);
    addVignette(this);

    const spawn = this.levelIndex === 0 && !fromAbove ? { x: 320, y: 440 } : fromAbove && lv.up ? { x: lv.up.x, y: lv.up.y + 55 } : { x: lv.down!.x, y: lv.down!.y + 55 };
    this.shadow = this.add.ellipse(spawn.x, spawn.y, 18, 7, 0x000000, 0.35);
    this.player = this.physics.add.sprite(spawn.x, spawn.y, "player-0").setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(14, 10).setOffset(1, 22);
    this.physics.add.collider(this.player, solid);

    this.dialogue = new DialogueBox(this);
    this.quiz = new QuizBox(this);
    this.toast = this.add
      .text(320, 350, "", { fontFamily: FONT, fontSize: "14px", color: "#fde047", backgroundColor: "#000000cc", padding: { x: 8, y: 4 } })
      .setOrigin(0.5)
      .setDepth(10000)
      .setVisible(false);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.input.keyboard!.on("keydown-SPACE", () => this.dialogue.advance());
    this.input.keyboard!.on("keydown-ENTER", () => this.dialogue.advance());
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.quiz.active) return;
      if (this.dialogue.active) this.dialogue.advance();
      else this.target = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });
  }

  update(_time: number, delta: number) {
    if (!this.player) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.dialogue.active || this.quiz.active) {
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
      this.dialogue.start([{ speaker: "Customer", text: `The ${unit.label} is running great. Thanks for fixing it! Try another job.` }], () => {
        this.busy = false;
        this.cooldownUntil = this.time.now + 4000;
      });
      return;
    }
    this.dialogue.start(
      [
        { speaker: "Work order", text: this.site.complaint },
        { speaker: "You", text: `You made it up to the ${unit.label}. Time to diagnose.` },
      ],
      () =>
        this.quiz.start(
          [this.site.question],
          (correct) => {
            const s = useGameStore.getState();
            if (correct > 0) {
              s.reward(this.site.reward);
              s.patch({ completedQuests: [...(s.active?.completedQuests ?? []), key] });
              this.showToast(`Job complete: +${this.site.reward.xp} XP, +$${this.site.reward.money}`);
            } else {
              this.showToast("Not quite. Review the clues and try again.");
            }
            this.busy = false;
            this.cooldownUntil = this.time.now + 4000;
          },
          "SERVICE CALL",
        ),
    );
  }

  private showToast(text: string) {
    this.toast.setText(text).setVisible(true);
    this.time.delayedCall(2600, () => this.toast.setVisible(false));
  }
}
