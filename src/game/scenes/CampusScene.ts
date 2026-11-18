import * as Phaser from "phaser";
import { useGameStore, type Reward } from "@/store/gameStore";

interface Building {
  label: string;
  x: number;
  y: number;
  color: number;
  labId?: string;
  reward: Reward;
  message: string;
}

const BUILDINGS: Building[] = [
  { label: "Classroom", x: 110, y: 90, color: 0x3b82f6, reward: { xp: 25, graduationPoints: 25 }, message: "+25 XP, +25 Graduation" },
  { label: "Electrical Lab", x: 320, y: 90, color: 0xeab308, labId: "wiring-lab", reward: { xp: 50, contractorCredits: 20, money: 40, skill: "electrical", skillPoints: 2 }, message: "+50 XP, +20 Credits" },
  { label: "Refrigeration Lab", x: 530, y: 90, color: 0x06b6d4, labId: "refrigeration-lab", reward: { xp: 75, contractorCredits: 25, money: 40, skill: "mechanical", skillPoints: 2 }, message: "+75 XP, +25 Credits" },
  { label: "Troubleshooting", x: 320, y: 330, color: 0xef4444, labId: "electrical-diagnostics", reward: { xp: 100, contractorCredits: 50, money: 40, skill: "diagnostics", skillPoints: 2 }, message: "+100 XP, +50 Credits" },
];

const SPEED = 180;

export class CampusScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private toast!: Phaser.GameObjects.Text;
  private target: Phaser.Math.Vector2 | null = null;
  private cooldown = new Map<string, number>();

  constructor() {
    super("CampusScene");
  }

  create() {
    this.add.rectangle(320, 240, 640, 480, 0x14532d);
    this.add.text(12, 8, "Campus - walk into a building (arrow keys or tap)", { fontSize: "14px", color: "#ffffff" });

    BUILDINGS.forEach((b) => {
      this.add.rectangle(b.x, b.y, 120, 80, b.color);
      this.add.text(b.x, b.y, b.label, { fontSize: "13px", color: "#000000" }).setOrigin(0.5);
    });

    this.player = this.add.rectangle(320, 440, 20, 28, Phaser.Display.Color.HexStringToColor(useGameStore.getState().active?.avatarColor ?? "#ffffff").color);
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    this.toast = this.add.text(320, 230, "", { fontSize: "18px", color: "#fde047", backgroundColor: "#000000aa" }).setOrigin(0.5);
    this.cursors = this.input.keyboard!.createCursorKeys();

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.target = new Phaser.Math.Vector2(p.worldX, p.worldY);
    });
  }

  update(time: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    const { left, right, up, down } = this.cursors;
    if (left.isDown || right.isDown || up.isDown || down.isDown) {
      this.target = null;
      body.setVelocity(
        (right.isDown ? SPEED : 0) - (left.isDown ? SPEED : 0),
        (down.isDown ? SPEED : 0) - (up.isDown ? SPEED : 0),
      );
    } else if (this.target) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y);
      if (dist < 6) this.target = null;
      else this.physics.moveTo(this.player, this.target.x, this.target.y, SPEED);
    }

    for (const b of BUILDINGS) {
      const inside = Math.abs(this.player.x - b.x) < 70 && Math.abs(this.player.y - b.y) < 50;
      if (inside && time > (this.cooldown.get(b.label) ?? 0)) {
        this.cooldown.set(b.label, time + 3000);
        this.enter(b);
      }
    }
  }

  private enter(b: Building) {
    const store = useGameStore.getState();
    if (!store.active) {
      this.showToast("Create a profile first");
      return;
    }
    if (b.labId) store.completeLab(b.labId, b.reward);
    else store.reward(b.reward);
    this.showToast(`${b.label}: ${b.message}`);
  }

  private showToast(text: string) {
    this.toast.setText(text);
    this.time.delayedCall(2000, () => this.toast.setText(""));
  }
}
