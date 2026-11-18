import * as Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.add.text(40, 40, "HVAC Career Simulator", { fontSize: "28px", color: "#ffffff" });
    this.add
      .text(40, 100, "Start", { fontSize: "22px", color: "#7dd3fc" })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }
}
