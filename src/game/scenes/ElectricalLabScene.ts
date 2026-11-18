import * as Phaser from "phaser";

export class ElectricalLabScene extends Phaser.Scene {
  constructor() {
    super("ElectricalLabScene");
  }

  create() {
    this.add.text(40, 40, "Electrical Lab", { fontSize: "24px", color: "#ffffff" });
    this.add
      .text(40, 100, "Back to campus", { fontSize: "18px", color: "#7dd3fc" })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }
}
