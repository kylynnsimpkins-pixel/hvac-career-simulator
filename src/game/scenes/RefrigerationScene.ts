import * as Phaser from "phaser";

export class RefrigerationScene extends Phaser.Scene {
  constructor() {
    super("RefrigerationScene");
  }

  create() {
    this.add.text(40, 40, "Refrigeration Lab", { fontSize: "24px", color: "#ffffff" });
    this.add
      .text(40, 100, "Back to campus", { fontSize: "18px", color: "#7dd3fc" })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }
}
