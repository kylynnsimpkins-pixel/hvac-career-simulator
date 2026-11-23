import * as Phaser from "phaser";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("student", `${BASE}/sprites/student.png`);
    this.load.image("instructor", `${BASE}/sprites/instructor.png`);
    this.load.image("technician", `${BASE}/sprites/technician.png`);
    this.load.image("npc-recruiter", `${BASE}/sprites/npc-recruiter.png`);
  }

  create() {
    this.scene.start("MenuScene");
  }
}
