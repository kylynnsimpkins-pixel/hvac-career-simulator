export const css = (c: number) => `#${c.toString(16).padStart(6, "0")}`;
export const mix = (c: number, amt: number) => {
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt >= 0 ? v + (255 - v) * (amt / 100) : v * (1 + amt / 100))));
  return css((f((c >> 16) & 255) << 16) | (f((c >> 8) & 255) << 8) | f(c & 255));
};
export type Ctx = CanvasRenderingContext2D;

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

export interface Look {
  shirt: number;
  pants: number;
  skin: number;
  hair?: number;
  hairStyle?: string;
  hatStyle?: string;
  shoes?: number;
  dreads?: boolean;
  hat?: number;
  tie?: number;
  glasses?: boolean;
  belt?: boolean;
  female?: boolean;
}

export function drawPerson(ctx: Ctx, look: Look, frame: number) {
  const stride = frame === 0 ? 0 : 1;
  const skin = css(look.skin);
  const hairStyle = look.hairStyle ?? (look.dreads ? "dreads" : look.hair !== undefined ? "crop" : "bald");
  const hatOn = look.hatStyle !== undefined && look.hatStyle !== "none";
  if (look.hair !== undefined && hairStyle !== "bald") drawHair(ctx, hairStyle, look.hair, hatOn, "back");
  // Legs, alternating stride.
  [[10, stride ? 0 : 2], [18, stride ? 2 : 0]].forEach(([x, lift]) => {
    rr(ctx, x, 33, 6, 12 - lift, 2);
    fillShape(ctx, grad(ctx, x, 0, x + 6, 0, mix(look.pants, 8), mix(look.pants, -18)));
    rr(ctx, x - 1, 43 - lift, 8, 5, 2);
    fillShape(ctx, look.shoes !== undefined ? css(look.shoes) : "#2b1d14");
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
  if (look.female) {
    ctx.beginPath();
    ctx.moveTo(8.5, 20);
    ctx.lineTo(23.5, 20);
    ctx.quadraticCurveTo(21.5, 28, 24.5, 36);
    ctx.lineTo(7.5, 36);
    ctx.quadraticCurveTo(10.5, 28, 8.5, 20);
    ctx.closePath();
  } else rr(ctx, 7, 20, 18, 16, 4);
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
  if (look.female) {
    ctx.strokeStyle = "#1f1a17";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(11.2, 10.6); ctx.lineTo(10.2, 9.8);
    ctx.moveTo(20.8, 10.6); ctx.lineTo(21.8, 9.8);
    ctx.stroke();
    ctx.fillStyle = "#c2415a";
    ctx.beginPath();
    ctx.ellipse(16, 15.6, 1.8, 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
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
  // Hair and headwear.
  if (look.hair !== undefined && hairStyle !== "bald") drawHair(ctx, hairStyle, look.hair, hatOn, "front");
  const hatStyle = look.hatStyle ?? (look.hat !== undefined ? "hardhat" : "none");
  if (look.hat !== undefined && hatStyle !== "none") drawHat(ctx, hatStyle, look.hat);
}

function hairCapShape(ctx: Ctx, color: number, top = 7.5) {
  ctx.beginPath();
  ctx.arc(16, 9.5, 8.7, Math.PI * 1.02, Math.PI * 1.98);
  ctx.lineTo(24.4, 12);
  ctx.lineTo(22, top);
  ctx.lineTo(10, top);
  ctx.lineTo(7.6, 12);
  ctx.closePath();
  fillShape(ctx, grad(ctx, 0, 2, 0, 12, mix(color, 15), css(color)));
}

const BACK_STYLES = ["long", "ponytail", "bob", "pigtails", "braid", "dreads", "afro"];

/** "back" draws hair that hangs behind the head and body; "front" draws the scalp and fringe. */
function drawHair(ctx: Ctx, style: string, color: number, hatOn: boolean, part: "back" | "front") {
  const back = part === "back";
  if (hatOn && (style === "afro" || style === "curly" || style === "mohawk" || style === "bun")) style = "crop";
  if (back && !BACK_STYLES.includes(style)) return;
  const hairCap = (top = 7.5) => {
    if (!back) hairCapShape(ctx, color, top);
  };
  const strand = (x0: number, y0: number, x1: number, y1: number, w = 1.7, i = 0) => {
    if (!back) return;
    ctx.lineCap = "round";
    ctx.strokeStyle = i % 2 ? css(color) : mix(color, 14);
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };
  const blob = (cx: number, cy: number, r: number) => {
    if ((style === "afro") !== back) return;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    fillShape(ctx, grad(ctx, 0, cy - r, 0, cy + r, mix(color, 15), css(color)));
  };
  if (!back) ctx.lineCap = "round";
  switch (style) {
    case "buzz":
      ctx.beginPath();
      ctx.arc(16, 9.5, 8.7, Math.PI * 1.05, Math.PI * 1.95);
      ctx.lineTo(23, 6.5);
      ctx.lineTo(9, 6.5);
      ctx.closePath();
      fillShape(ctx, css(color));
      break;
    case "side":
      hairCap(6);
      ctx.beginPath();
      ctx.moveTo(8, 8);
      ctx.quadraticCurveTo(16, 2, 24.4, 8);
      ctx.lineTo(24, 4);
      ctx.lineTo(9, 4);
      ctx.closePath();
      fillShape(ctx, css(color));
      break;
    case "curly":
      [[9, 5.5], [13, 3], [18, 2.5], [23, 5.5], [11, 6], [21, 6], [16, 5]].forEach(([x, y]) => blob(x, y, 3.6));
      break;
    case "afro":
      blob(16, 7, 11);
      break;
    case "long":
      hairCap();
      [[7.4, 22], [24.6, 22]].forEach(([x, h], i) => strand(x, 8, x, h, 3.2, i));
      break;
    case "ponytail":
      hairCap();
      strand(24, 8, 28, 22, 3.4);
      break;
    case "mohawk":
      ctx.beginPath();
      ctx.moveTo(13, 8);
      ctx.lineTo(14.5, -0.5);
      ctx.lineTo(17.5, -0.5);
      ctx.lineTo(19, 8);
      ctx.closePath();
      fillShape(ctx, css(color));
      break;
    case "bob":
      hairCap();
      [[7.2, 18], [24.8, 18]].forEach(([x, h], i) => strand(x, 8, x, h, 3.6, i));
      strand(8, 18, 24, 18, 1, 0);
      break;
    case "pigtails":
      hairCap();
      [[6.5, 23], [25.5, 23]].forEach(([x, h], i) => strand(x, 9, x + (i ? 2 : -2), h, 3.8, i));
      break;
    case "bun":
      hairCap();
      blob(16, 3, 3.2);
      break;
    case "braid":
      hairCap();
      strand(23.5, 9, 25.5, 17, 3, 0);
      strand(25.5, 17, 24.5, 26, 2.6, 1);
      break;
    case "pixie":
      hairCap(6);
      ctx.beginPath();
      ctx.moveTo(8, 9);
      ctx.quadraticCurveTo(12, 3, 24, 8);
      ctx.lineTo(24, 10);
      ctx.lineTo(19, 8);
      ctx.closePath();
      fillShape(ctx, css(color));
      break;
    case "sidesweep":
      hairCap(6);
      ctx.beginPath();
      ctx.moveTo(8, 11);
      ctx.quadraticCurveTo(10, 3, 22, 4);
      ctx.quadraticCurveTo(14, 6, 11, 10);
      ctx.closePath();
      fillShape(ctx, css(color));
      strand(7.4, 9, 7.4, 20, 3, 1);
      break;
    case "dreads":
      hairCap();
      for (let i = 0; i < 9; i++) {
        const x = 6.8 + i * 2.2;
        strand(x, 6, x + (i < 4 ? -1.2 : i > 4 ? 1.2 : 0), i < 2 || i > 6 ? 24 : 18, 2, i);
      }
      break;
    default:
      hairCap();
  }
}

function drawHat(ctx: Ctx, style: string, color: number) {
  if (style === "hardhat") {
    ctx.beginPath();
    ctx.arc(16, 9, 9.2, Math.PI, Math.PI * 2);
    ctx.closePath();
    fillShape(ctx, grad(ctx, 0, 0, 0, 10, mix(color, 25), css(color)));
    rr(ctx, 5.5, 8.4, 21, 3, 1.5);
    fillShape(ctx, mix(color, -12));
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(11, 2.6, 5, 1.4);
  } else if (style === "cap") {
    ctx.beginPath();
    ctx.arc(16, 9, 8.8, Math.PI, Math.PI * 2);
    ctx.closePath();
    fillShape(ctx, grad(ctx, 0, 0, 0, 10, mix(color, 20), css(color)));
    rr(ctx, 8, 8, 21, 2.6, 1.3);
    fillShape(ctx, mix(color, -18));
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(14, 4, 4, 2);
  } else {
    ctx.beginPath();
    ctx.arc(16, 8.6, 8.9, Math.PI, Math.PI * 2);
    ctx.lineTo(24.9, 9.6);
    ctx.lineTo(7.1, 9.6);
    ctx.closePath();
    fillShape(ctx, grad(ctx, 0, 0, 0, 10, mix(color, 18), css(color)));
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 0.8;
    for (let x = 10; x < 24; x += 2.6) {
      ctx.beginPath();
      ctx.moveTo(x, 3);
      ctx.lineTo(x, 9);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(16, 1.3, 1.8, 0, Math.PI * 2);
    fillShape(ctx, mix(color, 30));
  }
}