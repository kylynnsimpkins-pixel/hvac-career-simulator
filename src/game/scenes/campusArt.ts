import * as Phaser from "phaser";
import { canvasTexture, roundRect } from "./fx";

const css = (c: number) => `#${c.toString(16).padStart(6, "0")}`;
const lighter = (c: number, n: number) => css(Phaser.Display.Color.ValueToColor(c).lighten(n).color);
const darker = (c: number, n: number) => css(Phaser.Display.Color.ValueToColor(c).darken(n).color);

/** Deterministic pseudo-random so textures are stable between runs. */
const rnd = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
};

export interface BuildingStyle {
  label: string;
  wall: number;
  roof: number;
}

export function makeCampusTextures(scene: Phaser.Scene, buildings: BuildingStyle[]) {
  canvasTexture(scene, "grass", 64, 64, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 64, 64);
    g.addColorStop(0, "#5cae4e");
    g.addColorStop(1, "#4a9a42");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const r = rnd(7);
    for (let i = 0; i < 90; i++) {
      const x = r() * 64;
      const y = r() * 64;
      ctx.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.10)" : "rgba(20,70,25,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (r() - 0.5) * 3, y - 3 - r() * 3);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    ctx.fillRect(0, 0, 64, 32);
  });

  canvasTexture(scene, "path", 64, 64, (ctx) => {
    ctx.fillStyle = "#8d7f66";
    ctx.fillRect(0, 0, 64, 64);
    const r = rnd(3);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * 16 + (row % 2 ? 8 : 0) - 8 + 16;
        const px = (x % 80) - 16;
        roundRect(ctx, px + 1, row * 16 + 1, 14, 14, 3);
        const t = r() * 14;
        const g = ctx.createLinearGradient(px, row * 16, px + 14, row * 16 + 14);
        g.addColorStop(0, `rgb(${196 + t},${182 + t},${150 + t})`);
        g.addColorStop(1, `rgb(${170 + t},${156 + t},${126 + t})`);
        ctx.fillStyle = g;
        ctx.fill();
      }
    }
  });

  buildings.forEach((b) => drawBuilding(scene, b));

  canvasTexture(scene, "tree", 44, 56, (ctx) => {
    const tr = ctx.createLinearGradient(18, 0, 28, 0);
    tr.addColorStop(0, "#7a5230");
    tr.addColorStop(1, "#4d3219");
    ctx.fillStyle = tr;
    roundRect(ctx, 18, 30, 8, 24, 2);
    ctx.fill();
    const blob = (x: number, y: number, rad: number, a: string, b2: string) => {
      const g = ctx.createRadialGradient(x - rad * 0.35, y - rad * 0.4, rad * 0.1, x, y, rad);
      g.addColorStop(0, a);
      g.addColorStop(1, b2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    };
    blob(22, 30, 17, "#3f9a45", "#256a2c");
    blob(13, 24, 12, "#52b552", "#2d7c33");
    blob(31, 25, 12, "#4cae4c", "#2a7530");
    blob(22, 16, 13, "#69c866", "#34893a");
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.arc(17, 12, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  canvasTexture(scene, "lamp", 20, 56, (ctx) => {
    ctx.fillStyle = "#2d3748";
    roundRect(ctx, 8.5, 12, 3, 40, 1.5);
    ctx.fill();
    ctx.fillStyle = "#1a202c";
    ctx.fillRect(6, 50, 8, 4);
    const g = ctx.createRadialGradient(10, 8, 1, 10, 8, 9);
    g.addColorStop(0, "#fff7c2");
    g.addColorStop(1, "#f6c744");
    ctx.fillStyle = g;
    roundRect(ctx, 4, 2, 12, 12, 4);
    ctx.fill();
    ctx.strokeStyle = "#1a202c";
    ctx.stroke();
  });
  canvasTexture(scene, "glow", 80, 80, (ctx) => {
    const g = ctx.createRadialGradient(40, 40, 2, 40, 40, 40);
    g.addColorStop(0, "rgba(255,225,140,0.55)");
    g.addColorStop(1, "rgba(255,225,140,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 80, 80);
  });

  canvasTexture(scene, "bench", 44, 28, (ctx) => {
    ctx.fillStyle = "#3b2a1a";
    ctx.fillRect(5, 16, 4, 9);
    ctx.fillRect(35, 16, 4, 9);
    const back = ctx.createLinearGradient(0, 2, 0, 10);
    back.addColorStop(0, "#c58a50");
    back.addColorStop(1, "#8a5a2b");
    ctx.fillStyle = back;
    roundRect(ctx, 2, 3, 40, 7, 2);
    ctx.fill();
    const seat = ctx.createLinearGradient(0, 12, 0, 20);
    seat.addColorStop(0, "#d79c62");
    seat.addColorStop(1, "#9a6735");
    ctx.fillStyle = seat;
    roundRect(ctx, 1, 12, 42, 8, 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.stroke();
  });

  canvasTexture(scene, "bush", 40, 28, (ctx) => {
    const blob = (x: number, y: number, rad: number, a: string, b2: string) => {
      const g = ctx.createRadialGradient(x - 3, y - 4, 1, x, y, rad);
      g.addColorStop(0, a);
      g.addColorStop(1, b2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    };
    blob(12, 16, 10, "#58b657", "#2c7a34");
    blob(28, 16, 10, "#4cae4c", "#2a7530");
    blob(20, 11, 10, "#6ccb69", "#34893a");
    ["#ff6b8a", "#fff176", "#ffffff", "#ffa94d"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(8 + i * 8, 9 + (i % 2) * 8, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

function drawBuilding(scene: Phaser.Scene, b: BuildingStyle) {
  canvasTexture(scene, `bld-${b.label}`, 128, 112, (ctx) => {
    const w = 128;
    const h = 112;
    // Wall with horizontal siding and ambient occlusion.
    const wg = ctx.createLinearGradient(0, 30, 0, h);
    wg.addColorStop(0, lighter(b.wall, 8));
    wg.addColorStop(1, darker(b.wall, 14));
    ctx.fillStyle = wg;
    ctx.fillRect(4, 30, w - 8, h - 30);
    ctx.fillStyle = "rgba(255,255,255,0.09)";
    for (let y = 40; y < h - 6; y += 8) ctx.fillRect(4, y, w - 8, 1);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    for (let y = 43; y < h - 6; y += 8) ctx.fillRect(4, y, w - 8, 1);
    const side = ctx.createLinearGradient(w - 24, 0, w - 4, 0);
    side.addColorStop(0, "rgba(0,0,0,0)");
    side.addColorStop(1, "rgba(0,0,0,0.2)");
    ctx.fillStyle = side;
    ctx.fillRect(w - 24, 30, 20, h - 30);
    ctx.fillStyle = darker(b.wall, 30);
    ctx.fillRect(4, h - 8, w - 8, 8);
    // Roof: gradient with scalloped shingles, ridge highlight and eave shadow.
    const rg = ctx.createLinearGradient(0, 0, 0, 32);
    rg.addColorStop(0, lighter(b.roof, 12));
    rg.addColorStop(1, darker(b.roof, 18));
    ctx.fillStyle = rg;
    roundRect(ctx, 0, 2, w, 30, 4);
    ctx.fill();
    ctx.strokeStyle = darker(b.roof, 30);
    ctx.lineWidth = 0.8;
    for (let y = 8; y < 32; y += 6) {
      for (let x = ((y / 6) % 2) * 5; x < w; x += 10) {
        ctx.beginPath();
        ctx.arc(x + 5, y, 5, 0, Math.PI);
        ctx.stroke();
      }
    }
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(4, 3, w - 8, 2);
    const eave = ctx.createLinearGradient(0, 32, 0, 42);
    eave.addColorStop(0, "rgba(0,0,0,0.38)");
    eave.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = eave;
    ctx.fillRect(4, 32, w - 8, 10);
    ctx.fillStyle = darker(b.roof, 38);
    ctx.fillRect(0, 30, w, 3);
    // Windows with frame, sky reflection, curtains and flower box.
    [16, 88].forEach((wx) => {
      ctx.fillStyle = "#f3efe6";
      roundRect(ctx, wx - 3, 44, 30, 30, 2);
      ctx.fill();
      const gl = ctx.createLinearGradient(wx, 47, wx + 24, 71);
      gl.addColorStop(0, "#c6ecff");
      gl.addColorStop(0.5, "#8cc9ee");
      gl.addColorStop(1, "#5f9fcf");
      ctx.fillStyle = gl;
      ctx.fillRect(wx, 47, 24, 24);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.moveTo(wx, 47);
      ctx.lineTo(wx + 12, 47);
      ctx.lineTo(wx, 62);
      ctx.fill();
      ctx.fillStyle = "rgba(255,244,214,0.7)";
      ctx.fillRect(wx, 47, 5, 24);
      ctx.fillRect(wx + 19, 47, 5, 24);
      ctx.fillStyle = "#f3efe6";
      ctx.fillRect(wx + 11, 47, 2, 24);
      ctx.fillRect(wx, 58, 24, 2);
      ctx.fillStyle = "#6b4a2a";
      roundRect(ctx, wx - 2, 73, 28, 6, 1.5);
      ctx.fill();
      ["#ff6b8a", "#fff176", "#ff9a5a", "#ff6b8a"].forEach((c, i) => {
        ctx.fillStyle = "#3f9a45";
        ctx.fillRect(wx + i * 7, 70, 5, 4);
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(wx + 2 + i * 7, 70, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    // Door with frame, panels, awning, steps and lantern.
    ctx.fillStyle = "#efe9dc";
    roundRect(ctx, 46, 58, 36, 54, 2);
    ctx.fill();
    const dg = ctx.createLinearGradient(50, 0, 78, 0);
    dg.addColorStop(0, "#8a5429");
    dg.addColorStop(1, "#63391a");
    ctx.fillStyle = dg;
    roundRect(ctx, 50, 62, 28, 50, 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.strokeRect(53, 66, 10, 18);
    ctx.strokeRect(65, 66, 10, 18);
    ctx.strokeRect(53, 88, 22, 20);
    ctx.fillStyle = "#e8c04a";
    ctx.beginPath();
    ctx.arc(73, 90, 1.8, 0, Math.PI * 2);
    ctx.fill();
    const aw = ctx.createLinearGradient(0, 52, 0, 62);
    aw.addColorStop(0, lighter(b.roof, 10));
    aw.addColorStop(1, darker(b.roof, 15));
    ctx.fillStyle = aw;
    ctx.beginPath();
    ctx.moveTo(42, 62);
    ctx.lineTo(86, 62);
    ctx.lineTo(82, 52);
    ctx.lineTo(46, 52);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let x = 48; x < 84; x += 8) ctx.fillRect(x, 52, 4, 10);
    const st = ctx.createLinearGradient(0, 106, 0, 112);
    st.addColorStop(0, "#c9c9c9");
    st.addColorStop(1, "#8d8d8d");
    ctx.fillStyle = st;
    roundRect(ctx, 42, 106, 44, 6, 2);
    ctx.fill();
  });
}
