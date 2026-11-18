import * as Phaser from "phaser";
import { canvasTexture, dropShadow } from "./fx";

const FONT = "monospace";

/** Potted plant, depth-sorted so the player can walk behind it. */
export function plant(scene: Phaser.Scene, x: number, y: number) {
  const key = canvasTexture(scene, "d-plant", 44, 56, (c) => {
    const pot = c.createLinearGradient(14, 36, 30, 36);
    pot.addColorStop(0, "#d97706"); pot.addColorStop(0.5, "#b45309"); pot.addColorStop(1, "#7c3a0a");
    c.fillStyle = pot;
    c.beginPath(); c.moveTo(12, 36); c.lineTo(32, 36); c.lineTo(29, 54); c.lineTo(15, 54); c.closePath(); c.fill();
    c.fillStyle = "#92400e"; c.fillRect(11, 34, 22, 4);
    const leaf = (cx: number, cy: number, r: number, a: string, b: string) => {
      const g = c.createRadialGradient(cx - r / 3, cy - r / 3, 1, cx, cy, r);
      g.addColorStop(0, a); g.addColorStop(1, b);
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill();
    };
    leaf(14, 28, 9, "#4ade80", "#166534"); leaf(30, 27, 9, "#4ade80", "#14532d"); leaf(22, 16, 12, "#86efac", "#15803d"); leaf(22, 30, 8, "#34d399", "#166534");
  });
  dropShadow(scene, x, y + 2, 30, 10, y);
  scene.add.image(x, y - 26, key).setScale(0.5).setDepth(y + 1);
}
export function floorLamp(scene: Phaser.Scene, x: number, y: number) {
  const key = canvasTexture(scene, "d-flamp", 30, 56, (c) => {
    c.fillStyle = "#374151"; c.fillRect(14, 20, 2, 32);
    c.beginPath(); c.ellipse(15, 52, 8, 2.5, 0, 0, Math.PI * 2); c.fill();
    const g = c.createLinearGradient(5, 0, 25, 0);
    g.addColorStop(0, "#fde68a"); g.addColorStop(0.5, "#fff7cc"); g.addColorStop(1, "#d6a935");
    c.fillStyle = g; c.beginPath(); c.moveTo(8, 20); c.lineTo(22, 20); c.lineTo(26, 4); c.lineTo(4, 4); c.closePath(); c.fill();
  });
  dropShadow(scene, x, y + 2, 20, 8, y);
  scene.add.image(x, y - 26, key).setScale(0.5).setDepth(y + 1);
  if (scene.textures.exists("glow")) scene.add.image(x, y - 38, "glow").setScale(0.7).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.3).setDepth(9350);
}
export function rug(scene: Phaser.Scene, x: number, y: number, w: number, h: number, color: number) {
  const key = canvasTexture(scene, `d-rug-${w}-${h}-${color}`, w, h, (c) => {
    const hex = "#" + color.toString(16).padStart(6, "0");
    c.fillStyle = hex; c.fillRect(0, 0, w, h);
    const g = c.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "rgba(255,255,255,0.18)"); g.addColorStop(1, "rgba(0,0,0,0.22)");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(255,255,255,0.55)"; c.lineWidth = 2; c.strokeRect(5, 5, w - 10, h - 10);
    c.strokeStyle = "rgba(255,255,255,0.25)"; c.lineWidth = 1; c.strokeRect(10, 10, w - 20, h - 20);
    c.fillStyle = "rgba(255,255,255,0.12)";
    for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w / 2, h / 2, 4 + i * Math.min(w, h) / 14, 0, Math.PI * 2); c.stroke(); }
    c.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i < h; i += 4) { c.fillRect(-2, i, 3, 2); c.fillRect(w - 1, i, 3, 2); }
  });
  scene.add.image(x, y, key).setScale(0.5).setDepth(1);
}
export function windowPane(scene: Phaser.Scene, x: number, y: number, w = 70, h = 50, sky = 0xa9dcf5) {
  const key = canvasTexture(scene, `d-win-${w}-${h}-${sky}`, w + 16, h + 20, (c) => {
    c.fillStyle = "#3a4458"; c.fillRect(4, 4, w + 8, h + 8);
    const g = c.createLinearGradient(0, 8, 0, h + 8);
    g.addColorStop(0, "#" + sky.toString(16).padStart(6, "0")); g.addColorStop(1, "#e8f6ff");
    c.fillStyle = g; c.fillRect(8, 8, w, h);
    c.fillStyle = "rgba(255,255,255,0.4)"; c.beginPath(); c.moveTo(8, 8); c.lineTo(8 + w * 0.5, 8); c.lineTo(8, 8 + h * 0.6); c.closePath(); c.fill();
    c.fillStyle = "#3a4458"; c.fillRect(7 + w / 2, 8, 2, h); c.fillRect(8, 7 + h / 2, w, 2);
    c.fillStyle = "#f3f4f6"; c.fillRect(1, h + 12, w + 14, 5);
    c.fillStyle = "rgba(0,0,0,0.2)"; c.fillRect(1, h + 17, w + 14, 2);
  });
  scene.add.image(x, y + 5, key).setScale(0.5).setDepth(3);
}
export function picture(scene: Phaser.Scene, x: number, y: number, w = 44, h = 32, color = 0x60a5fa) {
  scene.add.rectangle(x, y, w + 6, h + 6, 0x5b3a1e).setDepth(2);
  scene.add.rectangle(x, y, w, h, color).setDepth(3);
  scene.add.triangle(x, y + 4, -w / 3, h / 3, w / 3, h / 3, 0, -h / 4, 0x2f855a).setDepth(4);
  scene.add.circle(x + w / 4, y - h / 4, 4, 0xfde047).setDepth(4);
}

export function extinguisher(scene: Phaser.Scene, x: number, y: number) {
  const key = canvasTexture(scene, "d-ext", 16, 34, (c) => {
    const g = c.createLinearGradient(3, 0, 13, 0);
    g.addColorStop(0, "#ef4444"); g.addColorStop(0.4, "#dc2626"); g.addColorStop(1, "#7f1d1d");
    c.fillStyle = g; c.beginPath(); c.roundRect ? c.roundRect(3, 8, 10, 24, 4) : c.rect(3, 8, 10, 24); c.fill();
    c.fillStyle = "#111827"; c.fillRect(6, 2, 5, 7); c.fillRect(8, 2, 6, 2);
    c.fillStyle = "#f9fafb"; c.fillRect(4, 18, 8, 7);
    c.fillStyle = "rgba(255,255,255,0.4)"; c.fillRect(5, 10, 2, 20);
  });
  scene.add.image(x, y, key).setScale(0.5).setDepth(3);
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
  const key = canvasTexture(scene, "d-bin", 22, 30, (c) => {
    const g = c.createLinearGradient(3, 0, 19, 0);
    g.addColorStop(0, "#9ca3af"); g.addColorStop(0.5, "#6b7280"); g.addColorStop(1, "#374151");
    c.fillStyle = g; c.beginPath(); c.moveTo(3, 8); c.lineTo(19, 8); c.lineTo(17, 29); c.lineTo(5, 29); c.closePath(); c.fill();
    c.fillStyle = "#d1d5db"; c.fillRect(2, 5, 18, 4);
    c.strokeStyle = "rgba(0,0,0,0.25)"; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(7 + i * 3, 11); c.lineTo(7 + i * 2.6, 27); c.stroke(); }
  });
  dropShadow(scene, x, y + 2, 22, 8, y);
  scene.add.image(x, y - 12, key).setScale(0.5).setDepth(y + 1);
}
export function sign(scene: Phaser.Scene, x: number, y: number, text: string, bg = "#166534") {
  scene.add.text(x, y, text, { fontFamily: FONT, fontSize: "9px", color: "#ffffff", backgroundColor: bg, padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(5);
}
