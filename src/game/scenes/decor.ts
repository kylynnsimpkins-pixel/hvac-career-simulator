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
export function picture(scene: Phaser.Scene, x: number, y: number, w = 44, h = 32, color = 0x60a5fa) {
  const key = canvasTexture(scene, `d-pic-${w}-${h}-${color}`, w + 10, h + 10, (c) => {
    c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(4, 5, w + 6, h + 6);
    const fr = c.createLinearGradient(0, 0, w, h); fr.addColorStop(0, "#8b5a2b"); fr.addColorStop(1, "#4b2e12");
    c.fillStyle = fr; c.fillRect(2, 2, w + 6, h + 6);
    const sky = c.createLinearGradient(0, 5, 0, h + 5);
    sky.addColorStop(0, "#" + color.toString(16).padStart(6, "0")); sky.addColorStop(1, "#dbeafe");
    c.fillStyle = sky; c.fillRect(5, 5, w, h);
    c.fillStyle = "#2f855a"; c.beginPath(); c.moveTo(5, h + 5); c.lineTo(5 + w * 0.35, h * 0.45 + 5); c.lineTo(5 + w * 0.7, h + 5); c.fill();
    c.fillStyle = "#276749"; c.beginPath(); c.moveTo(5 + w * 0.4, h + 5); c.lineTo(5 + w * 0.75, h * 0.55 + 5); c.lineTo(5 + w, h + 5); c.fill();
    c.fillStyle = "#fde047"; c.beginPath(); c.arc(5 + w * 0.78, 5 + h * 0.25, 4, 0, Math.PI * 2); c.fill();
  });
  scene.add.image(x, y, key).setScale(0.5).setDepth(3);
}
export function bulletinBoard(scene: Phaser.Scene, x: number, y: number, w = 90, h = 44) {
  const notes = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca"];
  const key = canvasTexture(scene, `d-bb-${w}-${h}`, w + 10, h + 10, (c) => {
    c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(4, 5, w + 6, h + 6);
    c.fillStyle = "#5b3a1e"; c.fillRect(2, 2, w + 6, h + 6);
    const cork = c.createLinearGradient(0, 5, w, h + 5); cork.addColorStop(0, "#d9a76a"); cork.addColorStop(1, "#b9824a");
    c.fillStyle = cork; c.fillRect(5, 5, w, h);
    c.fillStyle = "rgba(90,55,20,0.25)"; for (let i = 0; i < 40; i++) c.fillRect(5 + ((i * 37) % w), 5 + ((i * 53) % h), 2, 1);
    notes.forEach((col, i) => {
      const nx = 9 + i * (w / 4.2), ny = 10 + (i % 2) * (h / 3.5);
      c.fillStyle = "rgba(0,0,0,0.2)"; c.fillRect(nx + 1, ny + 2, 16, 18);
      c.fillStyle = col; c.fillRect(nx, ny, 16, 18);
      c.fillStyle = "rgba(0,0,0,0.25)"; for (let l = 0; l < 3; l++) c.fillRect(nx + 3, ny + 6 + l * 4, 10, 1);
      c.fillStyle = "#dc2626"; c.beginPath(); c.arc(nx + 8, ny + 2, 2, 0, Math.PI * 2); c.fill();
    });
  });
  scene.add.image(x, y, key).setScale(0.5).setDepth(3);
}

export function wallClock(scene: Phaser.Scene, x: number, y: number) {
  const key = canvasTexture(scene, "d-clock", 36, 36, (c) => {
    c.fillStyle = "rgba(0,0,0,0.25)"; c.beginPath(); c.arc(19, 20, 15, 0, Math.PI * 2); c.fill();
    const rim = c.createLinearGradient(3, 3, 33, 33); rim.addColorStop(0, "#8b6b3f"); rim.addColorStop(1, "#3b2a18");
    c.fillStyle = rim; c.beginPath(); c.arc(18, 18, 15, 0, Math.PI * 2); c.fill();
    const face = c.createRadialGradient(15, 15, 2, 18, 18, 12); face.addColorStop(0, "#ffffff"); face.addColorStop(1, "#e5e7eb");
    c.fillStyle = face; c.beginPath(); c.arc(18, 18, 12, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#374151";
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.fillRect(18 + Math.cos(a) * 9.5 - 0.7, 18 + Math.sin(a) * 9.5 - 0.7, 1.4, 1.4); }
    c.strokeStyle = "#111827"; c.lineCap = "round"; c.lineWidth = 2; c.beginPath(); c.moveTo(18, 18); c.lineTo(18, 11); c.stroke();
    c.lineWidth = 1.4; c.beginPath(); c.moveTo(18, 18); c.lineTo(24, 20); c.stroke();
    c.fillStyle = "#dc2626"; c.beginPath(); c.arc(18, 18, 1.4, 0, Math.PI * 2); c.fill();
  });
  scene.add.image(x, y, key).setScale(0.5).setDepth(3);
}

/** Wooden student desk with a chair, drawn as one sprite; depth sorts by y. */
export function schoolDesk(scene: Phaser.Scene, x: number, y: number) {
  const key = canvasTexture(scene, "d-sdesk", 76, 84, (c) => {
    c.fillStyle = "rgba(0,0,0,0.28)"; c.beginPath(); c.ellipse(38, 74, 32, 7, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#475569"; for (const lx of [10, 62]) c.fillRect(lx, 40, 3, 30);
    c.fillStyle = "#1e3a8a"; c.fillRect(24, 50, 28, 4);
    const seat = c.createLinearGradient(0, 54, 0, 66); seat.addColorStop(0, "#60a5fa"); seat.addColorStop(1, "#1d4ed8");
    c.fillStyle = seat; c.beginPath(); c.roundRect ? c.roundRect(24, 54, 28, 14, 4) : c.rect(24, 54, 28, 14); c.fill();
    c.fillStyle = "#1e40af"; c.fillRect(26, 68, 3, 6); c.fillRect(47, 68, 3, 6);
    const front = c.createLinearGradient(0, 34, 0, 44); front.addColorStop(0, "#8a5a2b"); front.addColorStop(1, "#5b3a1e");
    c.fillStyle = front; c.fillRect(8, 34, 60, 10);
    const top = c.createLinearGradient(8, 8, 68, 36); top.addColorStop(0, "#e0b27a"); top.addColorStop(1, "#b07a45");
    c.fillStyle = top; c.beginPath(); c.roundRect ? c.roundRect(6, 8, 64, 28, 4) : c.rect(6, 8, 64, 28); c.fill();
    c.strokeStyle = "rgba(60,35,10,0.6)"; c.lineWidth = 1; c.stroke();
    c.fillStyle = "rgba(255,255,255,0.3)"; c.fillRect(10, 10, 56, 2);
    c.fillStyle = "#f8fafc"; c.fillRect(14, 16, 18, 13); c.strokeStyle = "#94a3b8"; c.strokeRect(14, 16, 18, 13);
    c.fillStyle = "#94a3b8"; for (let l = 0; l < 3; l++) c.fillRect(17, 19 + l * 3, 12, 1);
    c.fillStyle = "#facc15"; c.fillRect(44, 20, 14, 3);
    c.fillStyle = "#ef4444"; c.fillRect(56, 20, 2, 3);
  });
  scene.add.image(x, y + 17, key).setScale(0.5).setDepth(y + 20);
}

export function teacherDesk(scene: Phaser.Scene, x: number, y: number) {
  const key = canvasTexture(scene, "d-tdesk", 260, 78, (c) => {
    c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); c.ellipse(130, 70, 118, 8, 0, 0, Math.PI * 2); c.fill();
    const front = c.createLinearGradient(0, 28, 0, 66); front.addColorStop(0, "#7a4a22"); front.addColorStop(1, "#4b2e12");
    c.fillStyle = front; c.fillRect(12, 28, 236, 38);
    c.strokeStyle = "rgba(0,0,0,0.35)"; c.lineWidth = 2; c.strokeRect(24, 34, 88, 28); c.strokeRect(148, 34, 88, 28);
    c.fillStyle = "#d6a935"; c.fillRect(64, 46, 8, 3); c.fillRect(188, 46, 8, 3);
    const top = c.createLinearGradient(8, 8, 252, 30); top.addColorStop(0, "#d9a76a"); top.addColorStop(1, "#a9713a");
    c.fillStyle = top; c.beginPath(); c.roundRect ? c.roundRect(6, 8, 248, 22, 5) : c.rect(6, 8, 248, 22); c.fill();
    c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(12, 10, 236, 2);
    c.fillStyle = "#c23b3b"; c.fillRect(30, 14, 26, 11);
    c.fillStyle = "#fff"; c.fillRect(34, 17, 18, 1);
    c.fillStyle = "#1f2937"; c.fillRect(108, 12, 40, 12); c.fillStyle = "#38bdf8"; c.fillRect(110, 14, 36, 8);
    c.fillStyle = "#d93a2b"; c.beginPath(); c.arc(214, 16, 7, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#16a34a"; c.fillRect(213, 6, 2, 4);
  });
  scene.add.image(x, y + 1, key).setScale(0.26).setDepth(190);
}

/** Steel lab bench with a laminate top, cabinet doors and a lower shelf. */
export function labBench(scene: Phaser.Scene, x: number, y: number, w: number, h: number, depth: number) {
  const key = canvasTexture(scene, `d-bench-${w}-${h}`, w + 12, h + 10, (c) => {
    c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); c.ellipse((w + 12) / 2, h + 4, w / 2 + 4, 5, 0, 0, Math.PI * 2); c.fill();
    const body = c.createLinearGradient(0, 14, 0, h); body.addColorStop(0, "#64748b"); body.addColorStop(1, "#334155");
    c.fillStyle = body; c.fillRect(6, 14, w, h - 14);
    c.strokeStyle = "rgba(0,0,0,0.4)"; c.lineWidth = 1;
    const doors = Math.max(2, Math.floor(w / 40)); const dw = (w - 8) / doors;
    for (let i = 0; i < doors; i++) {
      c.strokeRect(10 + i * dw, 20, dw - 4, h - 30);
      c.fillStyle = "#e2e8f0"; c.fillRect(10 + i * dw + dw / 2 - 4, 26, 6, 2);
    }
    c.fillStyle = "#1e293b"; c.fillRect(6, h - 6, w, 4);
    const top = c.createLinearGradient(0, 0, 0, 14); top.addColorStop(0, "#f1f5f9"); top.addColorStop(1, "#94a3b8");
    c.fillStyle = top; c.beginPath(); c.roundRect ? c.roundRect(2, 2, w + 8, 14, 3) : c.rect(2, 2, w + 8, 14); c.fill();
    c.strokeStyle = "#64748b"; c.stroke();
    c.fillStyle = "rgba(255,255,255,0.7)"; c.fillRect(6, 4, w, 2);
  });
  scene.add.image(x, y, key).setScale(0.5).setDepth(depth);
}

export function hvacUnit(scene: Phaser.Scene, x: number, y: number) {
  const key = canvasTexture(scene, "d-unit", 110, 90, (c) => {
    c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); c.ellipse(55, 80, 50, 7, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#6b7280"; c.fillRect(8, 74, 94, 6);
    const body = c.createLinearGradient(8, 0, 102, 0); body.addColorStop(0, "#e5e7eb"); body.addColorStop(0.5, "#cbd5e1"); body.addColorStop(1, "#8b97a6");
    c.fillStyle = body; c.beginPath(); c.roundRect ? c.roundRect(8, 10, 94, 66, 5) : c.rect(8, 10, 94, 66); c.fill();
    c.strokeStyle = "#475569"; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = "#1f2937"; c.beginPath(); c.arc(55, 36, 24, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#9ca3af"; c.lineWidth = 1.2;
    for (let r = 6; r <= 22; r += 4) { c.beginPath(); c.arc(55, 36, r, 0, Math.PI * 2); c.stroke(); }
    for (let a = 0; a < 6; a++) { c.beginPath(); c.moveTo(55, 36); c.lineTo(55 + Math.cos(a * 1.047) * 23, 36 + Math.sin(a * 1.047) * 23); c.stroke(); }
    c.fillStyle = "#374151"; c.beginPath(); c.arc(55, 36, 5, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#9ca3af"; for (let i = 0; i < 6; i++) c.fillRect(14, 64 + (i % 2) * 0, 1, 0);
    c.fillStyle = "rgba(0,0,0,0.25)"; for (let i = 0; i < 12; i++) c.fillRect(12 + i * 7.5, 64, 4, 8);
    c.fillStyle = "#f59e0b"; c.fillRect(86, 14, 12, 8); c.fillStyle = "#111827"; c.fillRect(88, 16, 8, 1); c.fillRect(88, 18, 6, 1);
    c.fillStyle = "rgba(255,255,255,0.45)"; c.fillRect(10, 12, 90, 2);
  });
  scene.add.image(x, y + 2, key).setScale(0.5).setDepth(y + 1);
}

export function stairsArt(scene: Phaser.Scene, x: number, y: number, up: boolean) {
  const key = canvasTexture(scene, `d-stairs-${up}`, 64, 56, (c) => {
    c.fillStyle = "rgba(0,0,0,0.3)"; c.fillRect(6, 8, 56, 46);
    c.fillStyle = "#3b2512"; c.fillRect(2, 2, 58, 50);
    for (let i = 0; i < 6; i++) {
      const yy = 6 + i * 7.5;
      const g = c.createLinearGradient(0, yy, 0, yy + 7);
      g.addColorStop(0, up ? "#e3b983" : "#9a6d3f"); g.addColorStop(1, up ? "#a9713a" : "#6b4a2b");
      c.fillStyle = g; c.fillRect(6, yy, 50, 6);
      c.fillStyle = "rgba(0,0,0,0.35)"; c.fillRect(6, yy + 6, 50, 1.5);
    }
    c.fillStyle = "#1f2937"; c.fillRect(2, 2, 4, 50); c.fillRect(56, 2, 4, 50);
    c.fillStyle = "#9ca3af"; c.fillRect(3, 2, 1.5, 50); c.fillRect(57, 2, 1.5, 50);
  });
  scene.add.image(x, y, key).setScale(0.5).setDepth(2);
}

export function doorMat(scene: Phaser.Scene, x: number, y: number, color: number) {
  const key = canvasTexture(scene, `d-door-${color}`, 110, 60, (c) => {
    c.fillStyle = "#3b2512"; c.fillRect(22, 30, 66, 28);
    const dg = c.createLinearGradient(0, 30, 0, 58); dg.addColorStop(0, "#8b5a2b"); dg.addColorStop(1, "#5b3a1e");
    c.fillStyle = dg; c.fillRect(26, 32, 58, 26);
    c.strokeStyle = "rgba(0,0,0,0.35)"; c.strokeRect(32, 36, 20, 18); c.strokeRect(58, 36, 20, 18);
    c.fillStyle = "#facc15"; c.beginPath(); c.arc(78, 46, 2, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#" + color.toString(16).padStart(6, "0"); c.fillRect(4, 4, 102, 22);
    c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(7, 7, 96, 2); c.fillRect(7, 21, 96, 2);
    c.fillStyle = "rgba(0,0,0,0.2)"; for (let i = 0; i < 24; i++) c.fillRect(8 + i * 4, 11, 1, 8);
  });
  scene.add.image(x, y - 4, key).setScale(0.5).setDepth(1);
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
