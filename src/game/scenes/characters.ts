import * as Phaser from "phaser";

/** Character textures are drawn at 2x (32x48) and displayed at scale CHAR_SCALE. */
export const CHAR_SCALE = 0.5;
export const CHAR_BODY = { w: 28, h: 20, ox: 2, oy: 44 };

const css = (c: number) => `#${c.toString(16).padStart(6, "0")}`;
const mix = (c: number, amt: number) => {
  const col = Phaser.Display.Color.ValueToColor(c);
  return css((amt >= 0 ? col.lighten(amt) : col.darken(-amt)).color);
};

type Ctx = CanvasRenderingContext2D;

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function grad(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, a: string, b: string) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  return g;
}

function fillShape(ctx: Ctx, fill: string | CanvasGradient) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = "rgba(20,12,8,0.55)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

interface Look {
  shirt: number;
  pants: number;
  skin: number;
  hair?: number;
  dreads?: boolean;
  hat?: number;
  tie?: number;
  glasses?: boolean;
  belt?: boolean;
}

function drawPerson(ctx: Ctx, look: Look, frame: number) {
  const stride = frame === 0 ? 0 : 1;
  const skin = css(look.skin);
  // Legs, alternating stride.
  [[10, stride ? 0 : 2], [18, stride ? 2 : 0]].forEach(([x, lift]) => {
    rr(ctx, x, 33, 6, 12 - lift, 2);
    fillShape(ctx, grad(ctx, x, 0, x + 6, 0, mix(look.pants, 8), mix(look.pants, -18)));
    rr(ctx, x - 1, 43 - lift, 8, 5, 2);
    fillShape(ctx, "#2b1d14");
  });
  // Arms swing opposite the legs.
  const swing = stride ? 2 : -2;
  [[3, swing], [25, -swing]].forEach(([x, dy]) => {
    rr(ctx, x, 21 + dy, 5, 11, 2.5);
    fillShape(ctx, grad(ctx, x, 0, x + 5, 0, mix(look.shirt, 10), mix(look.shirt, -25)));
    ctx.beginPath();
    ctx.arc(x + 2.5, 33 + dy, 2.6, 0, Math.PI * 2);
    fillShape(ctx, skin);
  });
  // Torso with soft shading.
  rr(ctx, 7, 20, 18, 16, 4);
  fillShape(ctx, grad(ctx, 7, 0, 25, 0, mix(look.shirt, 12), mix(look.shirt, -28)));
  if (look.tie !== undefined) {
    ctx.beginPath();
    ctx.moveTo(14, 21);
    ctx.lineTo(18, 21);
    ctx.lineTo(18.5, 31);
    ctx.lineTo(16, 33);
    ctx.lineTo(13.5, 31);
    ctx.closePath();
    fillShape(ctx, css(look.tie));
  }
  if (look.belt) {
    ctx.fillStyle = "#6b4423";
    ctx.fillRect(7, 31, 18, 3);
    ctx.fillStyle = "#e6c14a";
    ctx.fillRect(14, 31, 4, 3);
    rr(ctx, 20, 30, 5, 6, 1.5);
    fillShape(ctx, "#8a5a2b");
  }
  // Neck and head.
  ctx.fillStyle = mix(look.skin, -12);
  ctx.fillRect(13, 17, 6, 5);
  ctx.beginPath();
  ctx.arc(16, 11.5, 8.5, 0, Math.PI * 2);
  const hg = ctx.createRadialGradient(13, 8, 1, 16, 12, 10);
  hg.addColorStop(0, mix(look.skin, 10));
  hg.addColorStop(1, skin);
  fillShape(ctx, hg);
  // Ears.
  [7.6, 24.4].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 12.5, 1.7, 0, Math.PI * 2);
    fillShape(ctx, skin);
  });
  // Face.
  ctx.fillStyle = "#1f1a17";
  ctx.beginPath();
  ctx.ellipse(12.8, 12.2, 1.1, 1.5, 0, 0, Math.PI * 2);
  ctx.ellipse(19.2, 12.2, 1.1, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(12.4, 11.3, 0.7, 0.7);
  ctx.fillRect(18.8, 11.3, 0.7, 0.7);
  ctx.strokeStyle = "rgba(120,50,40,0.9)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(16, 14.4, 2.2, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "rgba(240,120,110,0.28)";
  ctx.beginPath();
  ctx.arc(10.8, 14.6, 1.6, 0, Math.PI * 2);
  ctx.arc(21.2, 14.6, 1.6, 0, Math.PI * 2);
  ctx.fill();
  if (look.glasses) {
    ctx.strokeStyle = "#3b3b3b";
    ctx.lineWidth = 1;
    ctx.strokeRect(10.4, 10.2, 4.8, 4);
    ctx.strokeRect(16.8, 10.2, 4.8, 4);
    ctx.beginPath();
    ctx.moveTo(15.2, 11.6);
    ctx.lineTo(16.8, 11.6);
    ctx.stroke();
  }
  // Hair or hard hat.
  if (look.hair !== undefined) {
    ctx.beginPath();
    ctx.arc(16, 9.5, 8.7, Math.PI * 1.02, Math.PI * 1.98);
    ctx.lineTo(24.4, 12);
    ctx.lineTo(22, 7.5);
    ctx.lineTo(10, 7.5);
    ctx.lineTo(7.6, 12);
    ctx.closePath();
    fillShape(ctx, grad(ctx, 0, 2, 0, 12, mix(look.hair, 15), css(look.hair)));
    if (look.dreads) {
      ctx.lineCap = "round";
      for (let i = 0; i < 9; i++) {
        const x = 8.6 + i * 1.85;
        const len = i < 2 || i > 6 ? 15 : 8;
        ctx.strokeStyle = i % 2 ? css(look.hair) : mix(look.hair, 14);
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(x, 5);
        ctx.lineTo(x + (i < 4 ? -1.2 : i > 4 ? 1.2 : 0), 5 + len);
        ctx.stroke();
      }
    }
  }
  if (look.hat !== undefined) {
    ctx.beginPath();
    ctx.arc(16, 9, 9.2, Math.PI, Math.PI * 2);
    ctx.closePath();
    fillShape(ctx, grad(ctx, 0, 0, 0, 10, mix(look.hat, 25), css(look.hat)));
    rr(ctx, 5.5, 8.4, 21, 3, 1.5);
    fillShape(ctx, mix(look.hat, -12));
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(11, 2.6, 5, 1.4);
  }
}

function paint(scene: Phaser.Scene, key: string, look: Look, frame: number) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, 32, 48)!;
  drawPerson(tex.getContext(), look, frame);
  tex.refresh();
}

/** Builds the shared player and teacher textures used by every scene. */
export function makeCharacterTextures(scene: Phaser.Scene, shirt: number) {
  const player: Look = { shirt, pants: 0x2b3a67, skin: 0xf1c27d, hat: 0xffd400, belt: true };
  paint(scene, "player-0", player, 0);
  paint(scene, "player-1", player, 1);
  paint(scene, "teacher", { shirt: 0xf5f5f5, pants: 0x3a3a3a, skin: 0x8d5524, hair: 0x2a1a10, dreads: true, tie: 0xb02a2a, glasses: true }, 0);
  paint(scene, "technician-npc", { shirt: 0x2f855a, pants: 0x374151, skin: 0xd9a066, hat: 0xf97316, belt: true }, 0);
}

/** Small green diamond that bobs above a character, like a plumbob. */
export function plumbob(scene: Phaser.Scene, follow: { x: number; y: number }, headOffset: number) {
  if (!scene.textures.exists("plumbob")) {
    const tex = scene.textures.createCanvas("plumbob", 24, 40)!;
    const ctx = tex.getContext();
    const half = (x0: number, x1: number, shade: string) => {
      ctx.beginPath();
      ctx.moveTo(12, 2);
      ctx.lineTo(x1, 20);
      ctx.lineTo(12, 38);
      ctx.lineTo(x0, 20);
      ctx.closePath();
      ctx.fillStyle = shade;
      ctx.fill();
    };
    half(12, 22, "#34d27b");
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(12, 38);
    ctx.lineTo(2, 20);
    ctx.closePath();
    ctx.fillStyle = "#8cf3b0";
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(22, 20);
    ctx.lineTo(12, 38);
    ctx.lineTo(2, 20);
    ctx.closePath();
    ctx.strokeStyle = "#0f7a43";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    tex.refresh();
  }
  const img = scene.add.image(follow.x, follow.y - headOffset, "plumbob").setScale(0.5).setDepth(9100);
  scene.tweens.add({ targets: img, angle: { from: -8, to: 8 }, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  const tick = () => img.setPosition(follow.x, follow.y - headOffset + Math.sin(scene.time.now / 260) * 3);
  scene.events.on("update", tick);
  scene.events.once("shutdown", () => scene.events.off("update", tick));
  return img;
}
