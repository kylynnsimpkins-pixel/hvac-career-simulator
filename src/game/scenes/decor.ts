import * as Phaser from "phaser";

const FONT = "monospace";

/** Potted plant, depth-sorted so the player can walk behind it. */
export function plant(scene: Phaser.Scene, x: number, y: number) {
  scene.add.ellipse(x, y + 2, 26, 8, 0x000000, 0.2).setDepth(y);
  scene.add.rectangle(x, y - 8, 16, 14, 0xb45309).setStrokeStyle(1, 0x78350f).setDepth(y + 1);
  scene.add.circle(x, y - 22, 11, 0x2f855a).setDepth(y + 2);
  scene.add.circle(x - 8, y - 16, 7, 0x38a169).setDepth(y + 2);
  scene.add.circle(x + 8, y - 17, 7, 0x276749).setDepth(y + 2);
}

export function floorLamp(scene: Phaser.Scene, x: number, y: number) {
  scene.add.ellipse(x, y + 2, 16, 6, 0x000000, 0.2).setDepth(y);
  scene.add.rectangle(x, y - 14, 3, 28, 0x4b5563).setDepth(y + 1);
  scene.add.triangle(x, y - 34, -9, 10, 9, 10, 0, -8, 0xfde68a).setStrokeStyle(1, 0x92400e).setDepth(y + 2);
}

export function rug(scene: Phaser.Scene, x: number, y: number, w: number, h: number, color: number) {
  scene.add.rectangle(x, y, w, h, color).setDepth(1);
  scene.add.rectangle(x, y, w - 8, h - 8, 0x000000, 0).setStrokeStyle(2, 0xffffff, 0.45).setDepth(1);
}

export function windowPane(scene: Phaser.Scene, x: number, y: number, w = 70, h = 50, sky = 0xa9dcf5) {
  scene.add.rectangle(x, y, w + 8, h + 8, 0x3a4458).setDepth(2);
  scene.add.rectangle(x, y, w, h, sky).setDepth(3);
  scene.add.rectangle(x - w / 4, y - h / 4, w / 5, 4, 0xffffff, 0.55).setDepth(4);
  scene.add.rectangle(x, y, 2, h, 0x3a4458).setDepth(4);
  scene.add.rectangle(x, y, w, 2, 0x3a4458).setDepth(4);
  scene.add.rectangle(x, y + h / 2 + 6, w + 14, 5, 0xe5e7eb).setDepth(4);
}

export function picture(scene: Phaser.Scene, x: number, y: number, w = 44, h = 32, color = 0x60a5fa) {
  scene.add.rectangle(x, y, w + 6, h + 6, 0x5b3a1e).setDepth(2);
  scene.add.rectangle(x, y, w, h, color).setDepth(3);
  scene.add.triangle(x, y + 4, -w / 3, h / 3, w / 3, h / 3, 0, -h / 4, 0x2f855a).setDepth(4);
  scene.add.circle(x + w / 4, y - h / 4, 4, 0xfde047).setDepth(4);
}

export function extinguisher(scene: Phaser.Scene, x: number, y: number) {
  scene.add.rectangle(x, y, 12, 26, 0xdc2626).setStrokeStyle(1, 0x7f1d1d).setDepth(3);
  scene.add.rectangle(x, y - 15, 6, 5, 0x111827).setDepth(3);
  scene.add.rectangle(x, y + 2, 8, 6, 0xffffff).setDepth(4);
}

export function bulletinBoard(scene: Phaser.Scene, x: number, y: number, w = 90, h = 44) {
  scene.add.rectangle(x, y, w + 6, h + 6, 0x5b3a1e).setDepth(2);
  scene.add.rectangle(x, y, w, h, 0xc99560).setDepth(3);
  const notes = [0xfef08a, 0xbbf7d0, 0xbfdbfe, 0xfecaca];
  notes.forEach((c, i) => {
    scene.add.rectangle(x - w / 2 + 14 + i * (w / 4.2), y - 6 + (i % 2) * 10, 16, 18, c).setDepth(4);
    scene.add.circle(x - w / 2 + 14 + i * (w / 4.2), y - 14 + (i % 2) * 10, 2, 0xdc2626).setDepth(5);
  });
}

export function wallClock(scene: Phaser.Scene, x: number, y: number) {
  scene.add.circle(x, y, 13, 0xf5f5f5).setStrokeStyle(3, 0x4b3a2a).setDepth(2);
  scene.add.rectangle(x, y - 4, 2, 9, 0x222222).setDepth(3);
  scene.add.rectangle(x + 3, y, 7, 2, 0x222222).setDepth(3);
}

export function trashCan(scene: Phaser.Scene, x: number, y: number) {
  scene.add.ellipse(x, y + 2, 20, 6, 0x000000, 0.2).setDepth(y);
  scene.add.rectangle(x, y - 8, 14, 18, 0x6b7280).setStrokeStyle(1, 0x374151).setDepth(y + 1);
  scene.add.rectangle(x, y - 18, 16, 3, 0x9ca3af).setDepth(y + 2);
}

/** Wall-hung sign, used for labels like "EXIT". */
export function sign(scene: Phaser.Scene, x: number, y: number, text: string, bg = "#166534") {
  scene.add.text(x, y, text, { fontFamily: FONT, fontSize: "9px", color: "#ffffff", backgroundColor: bg, padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(5);
}
