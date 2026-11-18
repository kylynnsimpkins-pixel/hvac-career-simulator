import * as Phaser from "phaser";
import { useGameStore } from "@/store/gameStore";

const FONT = "monospace";
const css = (c: number) => `#${c.toString(16).padStart(6, "0")}`;
const lighter = (c: number, n: number) => css(Phaser.Display.Color.ValueToColor(c).lighten(n).color);
const darker = (c: number, n: number) => css(Phaser.Display.Color.ValueToColor(c).darken(n).color);

type Ctx = CanvasRenderingContext2D;

export function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Draws a canvas texture at 2x resolution; display it with setScale(0.5). */
export function canvasTexture(scene: Phaser.Scene, key: string, w: number, h: number, draw: (ctx: Ctx) => void) {
  if (scene.textures.exists(key)) return key;
  const tex = scene.textures.createCanvas(key, w * 2, h * 2)!;
  const ctx = tex.getContext();
  ctx.scale(2, 2);
  draw(ctx);
  tex.refresh();
  return key;
}

/** Warm sunlight grade plus soft edge darkening for a cinematic, lived-in look. */
export function addVignette(scene: Phaser.Scene, warm = 1) {
  if (!scene.textures.exists("vignette")) {
    const tex = scene.textures.createCanvas("vignette", 640, 480)!;
    const ctx = tex.getContext();
    const grad = ctx.createRadialGradient(320, 230, 190, 320, 240, 470);
    grad.addColorStop(0, "rgba(10,6,20,0)");
    grad.addColorStop(1, "rgba(10,6,20,0.5)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);
    tex.refresh();
  }
  if (!scene.textures.exists("sunwash")) {
    const tex = scene.textures.createCanvas("sunwash", 640, 480)!;
    const ctx = tex.getContext();
    const grad = ctx.createRadialGradient(150, 20, 10, 150, 20, 560);
    grad.addColorStop(0, "rgba(255,226,160,0.5)");
    grad.addColorStop(0.5, "rgba(255,200,130,0.16)");
    grad.addColorStop(1, "rgba(255,200,130,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);
    tex.refresh();
  }
  scene.add.image(320, 240, "sunwash").setDepth(9390).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.35 * warm);
  scene.add.image(320, 240, "vignette").setDepth(9400);
}

/** Soft ground shadow under an object. */
export function dropShadow(scene: Phaser.Scene, x: number, y: number, w: number, h: number, depth = 1) {
  if (!scene.textures.exists("softshadow")) {
    const tex = scene.textures.createCanvas("softshadow", 128, 64)!;
    const ctx = tex.getContext();
    ctx.save();
    ctx.scale(1, 0.5);
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(0.6, "rgba(0,0,0,0.28)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    ctx.restore();
    tex.refresh();
  }
  return scene.add.image(x, y, "softshadow").setDisplaySize(w * 1.25, h * 1.6).setDepth(depth);
}

/**
 * Solid piece of furniture with a lit top face, a shaded front face and a soft contact shadow.
 * x/y is the centre of the top face. Returns the image.
 */
export function furniture(scene: Phaser.Scene, x: number, y: number, w: number, h: number, color: number, depth: number, lift = 8) {
  const key = `furn-${w}-${h}-${color}-${lift}`;
  const pad = 6;
  const tw = w + pad * 2;
  const th = h + lift + pad * 2;
  canvasTexture(scene, key, tw, th, (ctx) => {
    const base = pad + h + lift;
    const sh = ctx.createRadialGradient(tw / 2, base, 2, tw / 2, base, tw / 2);
    sh.addColorStop(0, "rgba(0,0,0,0.4)");
    sh.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(0, base);
    ctx.scale(1, 0.22);
    ctx.fillStyle = sh;
    ctx.fillRect(0, -base * 4, tw, base * 8);
    ctx.restore();
    roundRect(ctx, pad, pad + 2, w, h + lift - 1, 3);
    const front = ctx.createLinearGradient(0, pad + h, 0, pad + h + lift);
    front.addColorStop(0, darker(color, 18));
    front.addColorStop(1, darker(color, 40));
    ctx.fillStyle = front;
    ctx.fill();
    roundRect(ctx, pad, pad, w, h, 3);
    const top = ctx.createLinearGradient(pad, pad, pad + w, pad + h);
    top.addColorStop(0, lighter(color, 22));
    top.addColorStop(1, css(color));
    ctx.fillStyle = top;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.moveTo(pad + 3, pad + 1);
    ctx.lineTo(pad + w - 3, pad + 1);
    ctx.stroke();
  });
  return scene.add.image(x, y + lift / 2, key).setScale(0.5).setDepth(depth);
}

/** Tileable floor: "wood" planks or "tile" squares with subtle gradients. */
export function floorTexture(scene: Phaser.Scene, key: string, kind: "wood" | "tile", base: number, line: number) {
  return canvasTexture(scene, key, 64, 64, (ctx) => {
    if (kind === "wood") {
      for (let i = 0; i < 4; i++) {
        const g = ctx.createLinearGradient(0, i * 16, 0, i * 16 + 16);
        g.addColorStop(0, lighter(base, 4 + (i % 2) * 3));
        g.addColorStop(1, darker(base, 4 + (i % 3) * 2));
        ctx.fillStyle = g;
        ctx.fillRect(0, i * 16, 64, 16);
        ctx.fillStyle = css(line);
        ctx.fillRect(0, i * 16 + 15, 64, 1);
        ctx.fillRect((i * 23 + 11) % 56, i * 16, 1, 15);
        ctx.fillStyle = "rgba(255,255,255,0.07)";
        ctx.fillRect(4 + i * 9, i * 16 + 4, 22, 1);
        ctx.fillStyle = "rgba(0,0,0,0.06)";
        ctx.fillRect(30 - i * 5, i * 16 + 9, 18, 1);
      }
    } else {
      const g = ctx.createLinearGradient(0, 0, 64, 64);
      g.addColorStop(0, lighter(base, 7));
      g.addColorStop(1, darker(base, 4));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = css(line);
      ctx.fillRect(0, 0, 64, 1.5);
      ctx.fillRect(0, 0, 1.5, 64);
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(5, 5, 22, 3);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(5, 8, 3, 22);
    }
  });
}

/** Back wall with gradient, wainscot, crown moulding and baseboard, covering y 0..156. */
export function wallPanel(scene: Phaser.Scene, wall: number, trim: number) {
  const key = `wall-${wall}-${trim}`;
  canvasTexture(scene, key, 640, 156, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 156);
    g.addColorStop(0, lighter(wall, 10));
    g.addColorStop(1, darker(wall, 8));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 640, 156);
    const w = ctx.createLinearGradient(0, 108, 0, 150);
    w.addColorStop(0, darker(wall, 16));
    w.addColorStop(1, darker(wall, 30));
    ctx.fillStyle = w;
    ctx.fillRect(0, 108, 640, 42);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(0, 106, 640, 3);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    for (let x = 20; x < 640; x += 64) ctx.fillRect(x, 114, 1.5, 32);
    ctx.fillStyle = css(trim);
    ctx.fillRect(0, 0, 640, 5);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(0, 0, 640, 1.5);
    ctx.fillStyle = darker(trim, 12);
    ctx.fillRect(0, 148, 640, 8);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(0, 148, 640, 1.5);
  });
  return scene.add.image(320, 78, key).setScale(0.5).setDepth(0);
}

/** Shafts of window light falling across the floor. */
export function lightShafts(scene: Phaser.Scene, xs: number[], y0: number, alpha = 0.14) {
  const key = "shaft";
  canvasTexture(scene, key, 80, 200, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 200);
    g.addColorStop(0, "rgba(255,240,190,0.9)");
    g.addColorStop(1, "rgba(255,240,190,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(66, 0);
    ctx.lineTo(80, 200);
    ctx.lineTo(0, 200);
    ctx.closePath();
    ctx.fill();
  });
  xs.forEach((x) => scene.add.image(x, y0 + 100, key).setScale(0.5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(alpha * 2).setDepth(9300));
}

/** Glassy translucent title pill at the top of the screen. */
export function hudBar(scene: Phaser.Scene, text: string) {
  const g = scene.add.graphics().setDepth(9500);
  g.fillStyle(0x0b1224, 0.66).fillRoundedRect(8, 6, 624, 24, 12);
  g.fillStyle(0xffffff, 0.08).fillRoundedRect(10, 7, 620, 10, { tl: 10, tr: 10, bl: 0, br: 0 });
  g.lineStyle(1, 0x9bb4ff, 0.55).strokeRoundedRect(8, 6, 624, 24, 12);
  scene.add.text(22, 11, text, { fontFamily: FONT, fontSize: "11px", color: "#e6ecff" }).setDepth(9501);
}

/** Sims-style status panel with portrait and need bars. */
export function simsPanel(scene: Phaser.Scene, x = 8, y = 392) {
  const w = 168;
  const h = 80;
  const g = scene.add.graphics().setDepth(9600);
  g.fillStyle(0x0b1224, 0.78).fillRoundedRect(x, y, w, h, 10);
  g.fillStyle(0xffffff, 0.07).fillRoundedRect(x + 2, y + 2, w - 4, 20, { tl: 8, tr: 8, bl: 0, br: 0 });
  g.lineStyle(2, 0x6ee7b7, 0.8).strokeRoundedRect(x, y, w, h, 10);
  g.fillStyle(0x1f2a4a, 1).fillCircle(x + 26, y + 30, 20);
  g.lineStyle(2, 0xe6ecff, 0.9).strokeCircle(x + 26, y + 30, 20);
  scene.add.image(x + 26, y + 46, "player-0").setScale(0.62).setOrigin(0.5, 1).setDepth(9601).setCrop(0, 0, 32, 30);
  const name = scene.add.text(x + 52, y + 6, "", { fontFamily: FONT, fontSize: "11px", color: "#ffffff", fontStyle: "bold" }).setDepth(9601);
  const lvl = scene.add.text(x + 52, y + 19, "", { fontFamily: FONT, fontSize: "9px", color: "#9bb4ff" }).setDepth(9601);
  const bars = scene.add.graphics().setDepth(9601);
  ["Learning", "Rep", "Skill"].forEach((t, i) => scene.add.text(x + 52, y + 34 + i * 14, t, { fontFamily: FONT, fontSize: "8px", color: "#cbd5ff" }).setDepth(9601));
  const update = () => {
    const a = useGameStore.getState().active;
    if (!a) return;
    name.setText(a.playerName);
    lvl.setText(`${a.xp} XP`);
    const vals = [Math.min(1, a.graduationPoints / 1000), Math.min(1, a.contractorCredits / 5000), Math.min(1, (a.xp % 500) / 500)];
    const cols = [0x34d399, 0xfbbf24, 0x60a5fa];
    bars.clear();
    vals.forEach((v, i) => {
      const by = y + 35 + i * 14;
      bars.fillStyle(0x000000, 0.5).fillRoundedRect(x + 92, by, 68, 8, 4);
      bars.fillStyle(cols[i], 1).fillRoundedRect(x + 92, by, Math.max(4, 68 * v), 8, 4);
      bars.fillStyle(0xffffff, 0.3).fillRoundedRect(x + 93, by + 1, Math.max(2, 68 * v - 2), 2, 1);
    });
  };
  update();
  scene.time.addEvent({ delay: 500, loop: true, callback: update });
}
