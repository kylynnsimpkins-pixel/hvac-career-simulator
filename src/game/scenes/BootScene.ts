import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("student", "/sprites/student.png");
    this.load.image("instructor", "/sprites/instructor.png");
    this.load.image("technician", "/sprites/technician.png");
    this.load.image("npc-recruiter", "/sprites/npc-recruiter.png");
  }

  create() {
    this.scene.start("MenuScene");
  }
}
