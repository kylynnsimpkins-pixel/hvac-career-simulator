import * as Phaser from "phaser";

export class CampusScene extends Phaser.Scene {
  constructor() {
    super("CampusScene");
  }

  create() {
    this.add.text(40, 40, "Campus", { fontSize: "24px", color: "#ffffff" });
    const doors: [string, string][] = [
      ["Classroom", "ClassroomScene"],
      ["Electrical Lab", "ElectricalLabScene"],
      ["Refrigeration Lab", "RefrigerationScene"],
      ["Troubleshooting Center", "TroubleshootingScene"],
      ["Certification", "CertificationScene"],
      ["Placement Exam", "PlacementExamScene"],
    ];
    doors.forEach(([label, key], i) => {
      this.add
        .text(40, 100 + i * 36, label, { fontSize: "20px", color: "#7dd3fc" })
        .setInteractive()
        .on("pointerdown", () => this.scene.start(key));
    });
  }
}
