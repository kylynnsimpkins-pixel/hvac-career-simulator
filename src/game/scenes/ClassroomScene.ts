import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { dayProgress, focusFor } from "@/game/data/labGames";
import { dailyQuiz, isReviewDay, HOMEWORK, LESSON_PLANS, classroomLines, lessonContent, quizGrade, quizReward } from "@/game/data/dialogue";
import { DialogueBox } from "./DialogueBox";
import { QuizBox } from "./QuizBox";
import { floorTexture, lightShafts, wallPanel } from "./fx";
import { CHAR_BODY, CHAR_SCALE, plumbob } from "./characters";
import { addVignette, hudBar } from "./fx";
import { canvasTexture } from "./fx";
import { bulletinBoard, doorMat, extinguisher, plant, rug, schoolDesk, sign, teacherDesk, trashCan, wallClock } from "./decor";

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
  private quiz!: QuizBox;
  private toast!: Phaser.GameObjects.Text;
  private marker!: Phaser.GameObjects.Text;
  private target: Phaser.Math.Vector2 | null = null;
  private lastPos = new Phaser.Math.Vector2();
  private frameTick = 0;
  private lessonDone = false;
  private classEnded = false;

  constructor() {
    super("ClassroomScene");
  }

  create() {
    this.lessonDone = false;
    this.classEnded = false;
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
    this.add.image(320, 184, "teacher").setScale(0.75).setOrigin(0.5, 1).setDepth(166);
    teacherDesk(this, 320, 198);
    block(320, 194, 116, 26);
    this.marker = this.add.text(320, 142, "!", { fontFamily: FONT, fontSize: "18px", color: "#fde047", fontStyle: "bold" }).setOrigin(0.5).setDepth(9000);
    this.tweens.add({ targets: this.marker, y: 148, duration: 450, yoyo: true, repeat: -1 });

    // Student desks and chairs.
    DESK_ROWS.forEach((y) =>
      DESK_COLS.forEach((x) => {
        schoolDesk(this, x, y);
        block(x, y, 58, 28);
      }),
    );

    this.makePlayer();
    hudBar(this, "Classroom 101  -  talk to Mr. Simpkins at the front, exit by the bottom door");
    addVignette(this);

    this.shadow = this.add.ellipse(320, 440, 18, 7, 0x000000, 0.35);
    this.player = this.physics.add.sprite(320, 440, "player-0").setOrigin(0.5, 1).setScale(CHAR_SCALE);
    this.player.setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(CHAR_BODY.w, CHAR_BODY.h).setOffset(CHAR_BODY.ox, CHAR_BODY.oy);
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

    if (this.gated && Phaser.Math.Distance.Between(this.player.x, this.player.y, 320, 222) > 100) {
      this.gated = false;
      this.lessonDone = false;
    }
    if (!this.lessonDone && Phaser.Math.Distance.Between(this.player.x, this.player.y, 320, 222) < 55) this.startLesson();
    if (this.player.y >= 472) {
      if (this.classEnded) this.scene.start("DriveHomeScene");
      else this.scene.start("CampusScene", { from: "Classroom" });
    }
  }

  private gated = false;

  private startLesson() {
    const store = useGameStore.getState();
    if (!store.active) {
      this.lessonDone = true;
      this.showToast("Create a profile first");
      return;
    }
    this.lessonDone = true;
    const { playerName, lessonDay } = store.active;
    if (lessonDay > 0) {
      const p = dayProgress(store.active.stationsDone, lessonDay - 1);
      if (p.done < p.need) {
        this.dialogue.start(
          [{ speaker: "Mr. Simpkins", text: `Finish yesterday's lab assignments first (${p.done}/${p.need} stations in the ${focusFor(lessonDay - 1).lab}). Then come back for the next lesson.` }],
          () => { this.gated = true; },
        );
        return;
      }
    }
    this.dialogue.start(classroomLines(playerName, lessonDay), () => {
      const quiz = dailyQuiz(lessonDay);
      this.quiz.start(quiz, (correct) => {
        const reward = quizReward(correct, quiz.length);
        const s = useGameStore.getState();
        s.reward(reward);
        s.patch({ lessonDay: lessonDay + 1 });
        this.marker.setVisible(false);
        this.classEnded = true;
        this.dialogue.start(
          [
            { speaker: "Mr. Simpkins", text: `${isReviewDay(lessonDay) ? "Weekly review: y" : "Y"}ou got ${correct} of ${quiz.length} correct. ${quizGrade(correct, quiz.length)}` },
            { speaker: "Mr. Simpkins", text: `Today you earn +${reward.xp} XP and +${reward.graduationPoints} Graduation points.` },
          ],
          () => this.showToast(`Class complete: +${reward.xp} XP, +${reward.graduationPoints} Graduation`),
        );
      });
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
    if (!this.textures.exists("floor-class")) floorTexture(this, "floor-class", "wood", 0xb98550, 0x8a5f33);
    this.add.tileSprite(320, 317, 640, 326, "floor-class").setTileScale(0.5).setDepth(0);
    wallPanel(this, 0xa9bdd0, 0x4b3a2a);
    lightShafts(this, [120, 320, 520], 156);

    // Wall clock.
    wallClock(this, 133, 40);

    // HVAC posters.
    this.refrigerationPoster(70, 76);
    this.poster(522, 76, 60, 78, 0xe0a800, "OHM'S LAW", ["V", "=", "I x R"]);
    this.poster(590, 76, 56, 78, 0xc23b3b, "SAFETY", ["LOCKOUT", "TAGOUT", "ALWAYS"]);

    // Details: bulletin board, extinguisher, exit sign, rugs, plants and bins.
    bulletinBoard(this, 40, 112, 56, 30);
    extinguisher(this, 14, 120);
    sign(this, 320, 462 - 30, "EXIT", "#166534");
    rug(this, 320, 206, 190, 40, 0x6d4c8c);
    rug(this, 320, 350, 110, 190, 0x7a3b3b);
    plant(this, 28, 200);
    plant(this, 612, 200);
    trashCan(this, 28, 300);
    trashCan(this, 612, 300);

    // Door and mat.
    doorMat(this, 320, 470, 0x8b2f2f);
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
    const bkey = canvasTexture(this, "d-chalk", 330, 130, (c) => {
      c.fillStyle = "rgba(0,0,0,0.3)"; c.fillRect(6, 8, 322, 118);
      const fr = c.createLinearGradient(0, 0, 0, 120); fr.addColorStop(0, "#8b5a2b"); fr.addColorStop(1, "#4b2e12");
      c.fillStyle = fr; c.fillRect(2, 2, 322, 118);
      const bd = c.createLinearGradient(0, 12, 330, 108); bd.addColorStop(0, "#2f5a47"); bd.addColorStop(1, "#1f3d31");
      c.fillStyle = bd; c.fillRect(10, 10, 306, 104);
      c.fillStyle = "rgba(255,255,255,0.05)"; for (let i = 0; i < 8; i++) c.fillRect(14 + i * 38, 14 + (i % 3) * 30, 30, 16);
      c.fillStyle = "#a07a45"; c.fillRect(10, 110, 306, 8);
      c.fillStyle = "#f8fafc"; c.fillRect(40, 108, 24, 5); c.fillStyle = "#fde68a"; c.fillRect(70, 109, 18, 4);
      c.fillStyle = "#1f2937"; c.fillRect(240, 106, 30, 8);
    });
    this.add.image(320, 78, bkey).setScale(0.5).setDepth(2).setScale(0.96, 1);

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
      .text(174, 38, board, { fontFamily: FONT, fontSize: "9px", color: "#f0f5ea", lineSpacing: 1, wordWrap: { width: 292 } })
      .setDepth(5);
  }

  private makePlayer() {
    // Player textures are created by the campus scene; this guards against starting here first.
    if (this.textures.exists("player-0") && this.textures.exists("teacher")) return;
    this.scene.start("CampusScene");
  }
}
