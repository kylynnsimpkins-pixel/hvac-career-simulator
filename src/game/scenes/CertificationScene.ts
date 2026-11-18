import * as Phaser from "phaser";

export class CertificationScene extends Phaser.Scene {
  constructor() {
    super("CertificationScene");
  }

  create() {
    this.add.text(40, 40, "Certification Center", { fontSize: "24px", color: "#ffffff" });
    this.add
      .text(40, 100, "Back to campus", { fontSize: "18px", color: "#7dd3fc" })
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CampusScene"));
  }
}
