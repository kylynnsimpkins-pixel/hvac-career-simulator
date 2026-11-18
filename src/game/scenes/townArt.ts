import * as Phaser from "phaser";
import { canvasTexture, roundRect } from "./fx";
import { makeCampusTextures } from "./campusArt";

const css = (c: number) => `#${c.toString(16).padStart(6, "0")}`;
const lighter = (c: number, n: number) => css(Phaser.Display.Color.ValueToColor(c).lighten(n).color);
const darker = (c: number, n: number) => css(Phaser.Display.Color.ValueToColor(c).darken(n).color);

export type BuildingKind = "house" | "house2" | "shop";
export interface TownBuilding {
  key: string;
  kind: BuildingKind;
  wall: number;
  roof: number;
}

/** Stable texture key for a building look. */
export const townKey = (kind: BuildingKind, wall: number, roof: number) => `town-${kind}-${wall.toString(16)}-${roof.toString(16)}`;

function windowPane(ctx: CanvasRenderingContext2D, x: number, y: number, w = 20, h = 22) {
  ctx.fillStyle = "#f3efe6";
  roundRect(ctx, x - 2, y - 2, w + 4, h + 4, 2);
  ctx.fill();
  const gl = ctx.createLinearGradient(x, y, x + w, y + h);
  gl.addColorStop(0, "#c6ecff");
  gl.addColorStop(0.5, "#8cc9ee");
  gl.addColorStop(1, "#5f9fcf");
  ctx.fillStyle = gl;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x, y + h / 2);
  ctx.fill();
  ctx.fillStyle = "#f3efe6";
  ctx.fillRect(x + w / 2 - 1, y, 2, h);
  ctx.fillRect(x, y + h / 2 - 1, w, 2);
}

function drawHouse(ctx: CanvasRenderingContext2D, wall: number, roof: number, two: boolean) {
  const w = 128;
  const h = 112;
  const top = two ? 30 : 44;
  const wg = ctx.createLinearGradient(0, top, 0, h);
  wg.addColorStop(0, lighter(wall, 8));
  wg.addColorStop(1, darker(wall, 14));
  ctx.fillStyle = wg;
  ctx.fillRect(8, top, w - 16, h - top);
  ctx.fillStyle = "rgba(255,255,255,0.09)";
  for (let y = top + 6; y < h - 6; y += 7) ctx.fillRect(8, y, w - 16, 1);
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  for (let y = top + 9; y < h - 6; y += 7) ctx.fillRect(8, y, w - 16, 1);
  const side = ctx.createLinearGradient(w - 30, 0, w - 8, 0);
  side.addColorStop(0, "rgba(0,0,0,0)");
  side.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = side;
  ctx.fillRect(w - 30, top, 22, h - top);
  ctx.fillStyle = darker(wall, 32);
  ctx.fillRect(8, h - 7, w - 16, 7);

  // chimney
  ctx.fillStyle = "#8b4f3c";
  ctx.fillRect(18, two ? 4 : 10, 12, 22);
  ctx.fillStyle = "#5c3225";
  ctx.fillRect(16, two ? 2 : 8, 16, 4);
  // roof
  const peak = two ? 2 : 6;
  const rg = ctx.createLinearGradient(0, peak, 0, top + 4);
  rg.addColorStop(0, lighter(roof, 14));
  rg.addColorStop(1, darker(roof, 20));
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.moveTo(0, top + 4);
  ctx.lineTo(64, peak);
  ctx.lineTo(w, top + 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.moveTo(64, peak);
  ctx.lineTo(w, top + 4);
  ctx.lineTo(64, top + 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = darker(roof, 30);
  ctx.lineWidth = 0.8;
  for (let y = peak + 8; y < top + 4; y += 6) {
    ctx.beginPath();
    ctx.moveTo(64 - (y - peak) * (64 / (top + 4 - peak)), y);
    ctx.lineTo(64 + (y - peak) * (64 / (top + 4 - peak)), y);
    ctx.stroke();
  }
  ctx.fillStyle = darker(roof, 40);
  ctx.fillRect(0, top + 2, w, 3);
  const eave = ctx.createLinearGradient(0, top + 5, 0, top + 15);
  eave.addColorStop(0, "rgba(0,0,0,0.35)");
  eave.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = eave;
  ctx.fillRect(8, top + 5, w - 16, 10);

  // windows
  const rows = two ? [top + 14, top + 52] : [top + 12];
  rows.forEach((wy) => {
    windowPane(ctx, 18, wy);
    windowPane(ctx, 90, wy);
  });
  if (two) {
    windowPane(ctx, 54, top + 14, 20, 20);
    ctx.fillStyle = "#6b4a2a";
    roundRect(ctx, 86, top + 36, 28, 5, 1.5);
    ctx.fill();
    ["#ff6b8a", "#fff176", "#ff9a5a"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(92 + i * 9, top + 35, 2.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  // door, porch, steps
  ctx.fillStyle = "#efe9dc";
  roundRect(ctx, 47, h - 52, 34, 52, 2);
  ctx.fill();
  const dg = ctx.createLinearGradient(51, 0, 77, 0);
  dg.addColorStop(0, "#7b4a27");
  dg.addColorStop(1, "#573318");
  ctx.fillStyle = dg;
  roundRect(ctx, 51, h - 48, 26, 48, 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.strokeRect(54, h - 44, 9, 17);
  ctx.strokeRect(65, h - 44, 9, 17);
  ctx.fillStyle = "#e8c04a";
  ctx.beginPath();
  ctx.arc(73, h - 22, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(43, h - 56, 42, 5);
  ctx.fillStyle = "#c9c9c9";
  roundRect(ctx, 42, h - 5, 44, 5, 2);
  ctx.fill();
}

function drawShop(ctx: CanvasRenderingContext2D, wall: number, roof: number) {
  const w = 128;
  const h = 112;
  const wg = ctx.createLinearGradient(0, 22, 0, h);
  wg.addColorStop(0, lighter(wall, 6));
  wg.addColorStop(1, darker(wall, 16));
  ctx.fillStyle = wg;
  ctx.fillRect(4, 22, w - 8, h - 22);
  ctx.fillStyle = "rgba(0,0,0,0.09)";
  for (let y = 28; y < h - 4; y += 10) ctx.fillRect(4, y, w - 8, 1);
  const side = ctx.createLinearGradient(w - 26, 0, w - 4, 0);
  side.addColorStop(0, "rgba(0,0,0,0)");
  side.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = side;
  ctx.fillRect(w - 26, 22, 22, h - 22);
  // parapet and rooftop unit
  ctx.fillStyle = darker(roof, 10);
  ctx.fillRect(0, 12, w, 12);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(0, 12, w, 2);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 22, w, 3);
  ctx.fillStyle = "#aeb6c2";
  roundRect(ctx, 82, 2, 26, 11, 2);
  ctx.fill();
  ctx.fillStyle = "#7b8594";
  ctx.beginPath();
  ctx.arc(95, 7, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // sign band
  const sg = ctx.createLinearGradient(0, 28, 0, 42);
  sg.addColorStop(0, lighter(roof, 14));
  sg.addColorStop(1, darker(roof, 8));
  ctx.fillStyle = sg;
  roundRect(ctx, 14, 28, 100, 14, 3);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  for (let x = 22; x < 106; x += 10) ctx.fillRect(x, 33, 6, 4);
  // storefront windows
  [10, 78].forEach((x) => {
    ctx.fillStyle = "#e9e5dc";
    roundRect(ctx, x - 2, 54, 44, 44, 2);
    ctx.fill();
    const gl = ctx.createLinearGradient(x, 56, x + 40, 96);
    gl.addColorStop(0, "#d2f1ff");
    gl.addColorStop(0.5, "#8cc9ee");
    gl.addColorStop(1, "#4f8fbf");
    ctx.fillStyle = gl;
    ctx.fillRect(x, 56, 40, 40);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.moveTo(x, 56);
    ctx.lineTo(x + 22, 56);
    ctx.lineTo(x, 80);
    ctx.fill();
  });
  // awning
  const aw = ctx.createLinearGradient(0, 44, 0, 56);
  aw.addColorStop(0, lighter(roof, 4));
  aw.addColorStop(1, darker(roof, 12));
  ctx.fillStyle = aw;
  ctx.beginPath();
  ctx.moveTo(4, 56);
  ctx.lineTo(w - 4, 56);
  ctx.lineTo(w - 10, 44);
  ctx.lineTo(10, 44);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  for (let x = 10; x < w - 10; x += 16) ctx.fillRect(x, 44, 8, 12);
  // glass double door
  ctx.fillStyle = "#e9e5dc";
  roundRect(ctx, 50, 62, 28, 50, 2);
  ctx.fill();
  const dg = ctx.createLinearGradient(52, 0, 76, 0);
  dg.addColorStop(0, "#9fd6f0");
  dg.addColorStop(1, "#5f9fcf");
  ctx.fillStyle = dg;
  ctx.fillRect(53, 65, 22, 47);
  ctx.fillStyle = "#e9e5dc";
  ctx.fillRect(63, 65, 2, 47);
  ctx.fillStyle = "#c9c9c9";
  roundRect(ctx, 46, 106, 36, 6, 2);
  ctx.fill();
}

export function ensureTownTextures(scene: Phaser.Scene) {
  makeCampusTextures(scene, []);
  canvasTexture(scene, "van", 132, 64, (ctx) => {
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(66, 58, 60, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    const body = ctx.createLinearGradient(0, 10, 0, 54);
    body.addColorStop(0, "#ffffff");
    body.addColorStop(1, "#cfd8e3");
    ctx.fillStyle = body;
    roundRect(ctx, 4, 12, 92, 42, 5);
    ctx.fill();
    ctx.fillStyle = "#e8eef5";
    ctx.beginPath();
    ctx.moveTo(96, 20);
    ctx.lineTo(118, 20);
    ctx.quadraticCurveTo(128, 24, 128, 36);
    ctx.lineTo(128, 54);
    ctx.lineTo(96, 54);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(4, 38, 124, 7);
    ctx.fillStyle = "#f97316";
    ctx.fillRect(4, 45, 124, 2);
    ctx.fillStyle = "#8cc9ee";
    ctx.beginPath();
    ctx.moveTo(100, 24);
    ctx.lineTo(116, 24);
    ctx.quadraticCurveTo(123, 27, 124, 36);
    ctx.lineTo(100, 36);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1d4ed8";
    ctx.font = "bold 13px monospace";
    ctx.fillText("HVAC", 22, 32);
    ctx.fillStyle = "#475569";
    ctx.fillRect(10, 6, 80, 3);
    ctx.fillRect(14, 9, 2, 4);
    ctx.fillRect(84, 9, 2, 4);
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(124, 42, 4, 5);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(2, 44, 3, 5);
    [26, 104].forEach((x) => {
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(x, 54, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#9ca3af";
      ctx.beginPath();
      ctx.arc(x, 54, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

export function ensureBuilding(scene: Phaser.Scene, kind: BuildingKind, wall: number, roof: number) {
  const key = townKey(kind, wall, roof);
  canvasTexture(scene, key, 128, 112, (ctx) => {
    if (kind === "shop") drawShop(ctx, wall, roof);
    else drawHouse(ctx, wall, roof, kind === "house2");
  });
  return key;
}
