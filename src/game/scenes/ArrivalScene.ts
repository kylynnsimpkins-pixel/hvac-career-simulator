import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";
import { ADDRESSES, SITES, assignedSite } from "@/game/data/jobsites";
import { addVignette } from "./fx";
import { ensureBuilding, ensureTownTextures } from "./townArt";

const FONT = "monospace";
const BSCALE = 1.5;
const DOOR_X = 440;
const BASE_Y = 318;

/** Cutscene: the service van pulls up and the tech talks to the owner. */
export class ArrivalScene extends Phaser.Scene {
  private site!: (typeof SITES)[number];
  private lines: { who: string; text: string }[] = [];
  private idx = 0;
  private speaker!: Phaser.GameObjects.Text;
  private body!: Phaser.GameObjects.Text;
  private box!: Phaser.GameObjects.Container;
  private onTap: (() => void) | null = null;
  private tech!: Phaser.GameObjects.Image;
  private van!: Phaser.GameObjects.Image;
  private walkTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super("ArrivalScene");
  }

  create(data: { site: string }) {
    const site = SITES.find((s) => s.id === data.site);
    if (!site || !this.textures.exists("player-0") || !this.textures.exists("customer") || !useGameStore.getState().active?.graduated) {
      this.scene.start("JobMapScene");
      return;
    }
    this.site = site;
    this.idx = 0;
    this.onTap = null;
    ensureTownTextures(this);
    const key = ensureBuilding(this, (site.id === "ranch" ? "house" : site.id === "twostory" ? "house2" : "shop"), site.map.wall, site.map.roof);

    const sky = this.add.graphics().setDepth(0);
    sky.fillGradientStyle(0x7ec8f2, 0x7ec8f2, 0xd8f0ff, 0xd8f0ff, 1).fillRect(0, 0, 640, 200);
    this.add.tileSprite(320, 270, 640, 140, "grass").setTileScale(0.5).setDepth(1);
    const g = this.add.graphics().setDepth(2);
    g.fillStyle(0xcfc8b8, 1).fillRect(0, 322, 640, 26);
    g.fillStyle(0xa9a398, 1).fillRect(0, 346, 640, 3);
    g.fillStyle(0x3d424d, 1).fillRect(0, 349, 640, 131);
    g.fillStyle(0xf5d742, 1);
    for (let x = 10; x < 640; x += 60) g.fillRect(x, 428, 34, 4);
    g.fillStyle(0xb9b3a4, 1).fillRect(DOOR_X - 20, 318, 40, 10);
    this.add.image(60, 316, "tree").setScale(0.9).setOrigin(0.5, 1).setDepth(316);
    this.add.image(600, 318, "tree").setScale(0.8).setOrigin(0.5, 1).setDepth(318);
    this.add.image(250, 326, "lamp").setScale(0.8).setOrigin(0.5, 1).setDepth(326);
    this.add.ellipse(DOOR_X + 4, BASE_Y, 150, 12, 0x000000, 0.25).setDepth(BASE_Y - 1);
    this.add.image(DOOR_X, BASE_Y, key).setScale(BSCALE).setOrigin(0.5, 1).setDepth(BASE_Y);
    this.add
      .text(DOOR_X, 20, `${ADDRESSES[site.id].street}`, { fontFamily: FONT, fontSize: "12px", color: "#0b1224", backgroundColor: "#f8fafc", padding: { x: 6, y: 3 } })
      .setOrigin(0.5)
      .setDepth(9000);

    this.add.image(DOOR_X, 336, "customer").setOrigin(0.5, 1).setScale(0.9).setDepth(340).setName("owner");

    this.van = this.add.image(-90, 392, "van").setScale(0.5).setOrigin(0.5, 1).setDepth(392);
    this.tech = this.add.image(250, 392, "player-0").setOrigin(0.5, 1).setScale(0.9).setDepth(392).setVisible(false);

    this.buildBox();
    addVignette(this);
    this.input.keyboard?.on("keydown-SPACE", () => this.tap());
    this.input.keyboard?.on("keydown-ENTER", () => this.tap());
    this.input.on("pointerdown", () => this.tap());

    this.tweens.add({
      targets: this.van,
      x: 250,
      duration: 2200,
      ease: "Cubic.easeOut",
      onUpdate: () => this.van.setY(392 + Math.sin(this.time.now / 60) * 0.6),
      onComplete: () => this.stepOut(),
    });
  }

  private buildBox() {
    const bg = this.add.rectangle(320, 428, 616, 80, 0x10162b, 0.95).setStrokeStyle(3, 0xfde047);
    this.speaker = this.add.text(24, 396, "", { fontFamily: FONT, fontSize: "13px", color: "#fde047", fontStyle: "bold" });
    this.body = this.add.text(24, 414, "", { fontFamily: FONT, fontSize: "13px", color: "#ffffff", wordWrap: { width: 580 } });
    const hint = this.add.text(612, 462, "SPACE / tap ▶", { fontFamily: FONT, fontSize: "10px", color: "#8aa0d6" }).setOrigin(1, 1);
    this.box = this.add.container(0, 0, [bg, this.speaker, this.body, hint]).setDepth(20000).setVisible(false);
  }

  private walk(to: number, ms: number, done: () => void) {
    this.walkTimer?.remove();
    this.walkTimer = this.time.addEvent({ delay: 140, loop: true, callback: () => this.tech.setTexture(`player-${Math.floor(this.time.now / 140) % 2}`) });
    this.tweens.add({
      targets: this.tech,
      x: to,
      duration: ms,
      onComplete: () => {
        this.walkTimer?.remove();
        this.tech.setTexture("player-0");
        done();
      },
    });
  }

  private stepOut() {
    this.tech.setVisible(true).setX(262);
    this.tweens.add({ targets: this.tech, y: 336, duration: 400 });
    this.time.delayedCall(420, () => this.walk(DOOR_X - 40, 1800, () => this.talk()));
  }

  private talk() {
    const job = assignedSite(useGameStore.getState().active?.completedQuests ?? []);
    const correct = !job || job.id === this.site.id;
    const a = ADDRESSES[this.site.id];
    const name = a.customer;
    if (correct) {
      this.lines = [
        { who: "You", text: `Hello, I'm with the HVAC service company. Are you ${name}?` },
        { who: name, text: `Yes, that's me! Thanks for coming. ${a.note}` },
        { who: "You", text: "Let me take a look at the system. I'll have a few questions for you first." },
        { who: name, text: "Of course, come right in." },
      ];
      this.run(() => this.walk(DOOR_X, 500, () => this.cameras.main.fadeOut(350, 0, 0, 0, (_c: unknown, p: number) => p === 1 && this.scene.start("JobsiteScene", { site: this.site, level: 0 }))));
    } else {
      this.lines = [
        { who: "You", text: `Hi, I'm here for the service call at ${a.street}.` },
        { who: name, text: "A service call? I'm sorry, I wasn't expecting anyone today." },
        { who: name, text: "You may have the wrong address. Better check your work order." },
        { who: "You", text: "Sorry about that! I'll double-check the work order." },
      ];
      this.run(() =>
        this.walk(262, 1500, () => {
          this.tech.setVisible(false);
          this.tweens.add({
            targets: this.van,
            x: 760,
            duration: 1800,
            ease: "Cubic.easeIn",
            onComplete: () => this.scene.start("JobMapScene"),
          });
        }),
      );
    }
  }

  private run(done: () => void) {
    this.idx = 0;
    this.box.setVisible(true);
    this.showLine();
    this.onTap = () => {
      if (++this.idx < this.lines.length) return this.showLine();
      this.box.setVisible(false);
      this.onTap = null;
      done();
    };
  }

  private showLine() {
    const l = this.lines[this.idx];
    this.speaker.setText(l.who);
    this.body.setText(l.text);
  }

  private tap() {
    this.onTap?.();
  }
}
