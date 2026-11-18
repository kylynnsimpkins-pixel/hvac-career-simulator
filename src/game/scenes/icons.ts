import * as Phaser from "phaser";

type G = Phaser.GameObjects.Graphics;
type Draw = (g: G, color: number) => void;

const rect = (g: G, c: number, x: number, y: number, w: number, h: number) => g.fillStyle(c, 1).fillRect(x, y, w, h);
const line = (g: G, c: number, w: number, x1: number, y1: number, x2: number, y2: number) =>
  g.lineStyle(w, c, 1).beginPath().moveTo(x1, y1).lineTo(x2, y2).strokePath();
const dot = (g: G, c: number, x: number, y: number, r: number) => g.fillStyle(c, 1).fillCircle(x, y, r);

const GREY = 0x9aa5b1;
const DARK = 0x2d3748;
const STEEL = 0xcbd5e0;
const BRASS = 0xd69e2e;
const COPPER = 0xdd6b20;

const WIRE_COLORS: Record<string, number> = { red: 0xe53e3e, blue: 0x3182ce, green: 0x38a169, white: 0xf7fafc, yellow: 0xecc94b };

const ICONS: Record<string, Draw> = {
  look: (g) => {
    dot(g, 0x90cdf4, 13, 13, 9);
    dot(g, 0x1a202c, 13, 13, 6.5);
    dot(g, 0xbee3f8, 13, 13, 5.5);
    line(g, 0x744210, 4, 20, 20, 28, 28);
  },
  multimeter: (g) => {
    rect(g, 0xd69e2e, 7, 2, 18, 28);
    rect(g, 0x1a202c, 7, 2, 18, 2);
    rect(g, 0x9ae6b4, 10, 6, 12, 7);
    rect(g, 0x22543d, 12, 8, 8, 3);
    dot(g, DARK, 16, 20, 5);
    line(g, 0xe53e3e, 2, 16, 20, 19, 17);
    rect(g, 0x1a202c, 9, 27, 3, 3);
    rect(g, 0xe53e3e, 14, 27, 3, 3);
    rect(g, 0x1a202c, 20, 27, 3, 3);
  },
  strippers: (g) => {
    line(g, STEEL, 4, 9, 3, 21, 18);
    line(g, STEEL, 4, 23, 3, 11, 18);
    dot(g, DARK, 16, 11, 2);
    line(g, 0xe53e3e, 5, 21, 18, 25, 29);
    line(g, 0xe53e3e, 5, 11, 18, 7, 29);
  },
  screwdriver: (g) => {
    rect(g, 0xdd6b20, 12, 2, 8, 13);
    rect(g, 0xc05621, 12, 6, 8, 2);
    rect(g, GREY, 15, 15, 2, 13);
    rect(g, STEEL, 14, 27, 4, 3);
  },
  lockout: (g) => {
    g.lineStyle(3, GREY, 1).strokeRoundedRect(9, 3, 14, 14, 5);
    rect(g, 0xe53e3e, 6, 14, 20, 15);
    rect(g, 0xfc8181, 6, 14, 20, 3);
    dot(g, 0x1a202c, 16, 21, 2.5);
    rect(g, 0x1a202c, 15, 22, 2, 4);
  },
  manifold: (g) => {
    rect(g, GREY, 3, 14, 26, 7);
    dot(g, 0xffffff, 9, 9, 6);
    dot(g, 0x3182ce, 9, 9, 4.5);
    dot(g, 0xffffff, 23, 9, 6);
    dot(g, 0xe53e3e, 23, 9, 4.5);
    line(g, DARK, 1, 9, 9, 11, 7);
    line(g, DARK, 1, 23, 9, 25, 7);
    line(g, 0x3182ce, 3, 8, 21, 8, 29);
    line(g, 0xe53e3e, 3, 24, 21, 24, 29);
    line(g, 0xecc94b, 3, 16, 21, 16, 29);
  },
  cylinder: (g) => {
    rect(g, 0x38a169, 8, 8, 16, 22);
    rect(g, 0x68d391, 8, 8, 4, 22);
    rect(g, 0x38a169, 10, 5, 12, 4);
    rect(g, GREY, 13, 2, 6, 4);
    rect(g, BRASS, 10, 1, 12, 2);
    rect(g, 0xffffff, 10, 16, 12, 6);
    rect(g, DARK, 12, 18, 8, 2);
  },
  anemometer: (g) => {
    line(g, GREY, 3, 16, 14, 16, 30);
    dot(g, DARK, 16, 14, 3);
    line(g, STEEL, 2, 16, 14, 6, 9);
    line(g, STEEL, 2, 16, 14, 26, 9);
    line(g, STEEL, 2, 16, 14, 16, 3);
    dot(g, 0x3182ce, 6, 9, 3.5);
    dot(g, 0x3182ce, 26, 9, 3.5);
    dot(g, 0x3182ce, 16, 3, 3.5);
  },
  wire: (g, c) => {
    const col = c || WIRE_COLORS.red;
    g.lineStyle(4, col, 1).beginPath().moveTo(3, 24).lineTo(10, 24).lineTo(10, 8).lineTo(22, 8).lineTo(22, 24).lineTo(29, 24).strokePath();
    rect(g, COPPER, 1, 22, 3, 4);
    rect(g, COPPER, 28, 22, 3, 4);
  },
  capacitor: (g) => {
    rect(g, STEEL, 8, 7, 16, 22);
    rect(g, 0xedf2f7, 8, 7, 5, 22);
    rect(g, 0x2b6cb0, 8, 14, 16, 6);
    rect(g, DARK, 11, 3, 4, 4);
    rect(g, DARK, 17, 3, 4, 4);
    rect(g, GREY, 8, 5, 16, 3);
  },
  filter: (g) => {
    rect(g, 0xa0aec0, 2, 4, 28, 24);
    rect(g, 0xf7fafc, 5, 7, 22, 18);
    for (let i = 0; i < 6; i++) line(g, 0x90cdf4, 2, 7 + i * 3.6, 8, 7 + i * 3.6, 24);
  },
  disconnect: (g) => {
    rect(g, GREY, 6, 3, 20, 26);
    rect(g, 0xcbd5e0, 8, 5, 16, 22);
    rect(g, 0xe53e3e, 12, 9, 8, 14);
    rect(g, 0x1a202c, 14, 7, 4, 7);
    dot(g, DARK, 9, 7, 1);
    dot(g, DARK, 23, 25, 1);
  },
  transformer: (g) => {
    rect(g, GREY, 4, 5, 24, 22);
    rect(g, DARK, 9, 9, 14, 14);
    for (let i = 0; i < 5; i++) {
      line(g, COPPER, 2, 7, 10 + i * 3, 25, 10 + i * 3);
    }
    rect(g, BRASS, 6, 28, 4, 3);
    rect(g, BRASS, 14, 28, 4, 3);
    rect(g, BRASS, 22, 28, 4, 3);
  },
  thermostat: (g) => {
    rect(g, 0xedf2f7, 6, 3, 20, 26);
    rect(g, 0x1a202c, 9, 6, 14, 9);
    rect(g, 0x63b3ed, 11, 8, 10, 5);
    dot(g, GREY, 16, 22, 4);
    dot(g, 0xedf2f7, 16, 22, 2);
  },
  terminal: (g, c) => {
    rect(g, GREY, 4, 8, 24, 16);
    rect(g, 0x718096, 4, 8, 24, 3);
    dot(g, BRASS, 16, 17, 5);
    line(g, DARK, 2, 13, 17, 19, 17);
    if (c) rect(g, c, 0, 15, 5, 4);
  },
  motor: (g) => {
    rect(g, 0x4a5568, 5, 8, 18, 16);
    rect(g, 0x718096, 5, 8, 18, 4);
    for (let i = 0; i < 4; i++) rect(g, DARK, 8 + i * 4, 13, 2, 9);
    rect(g, STEEL, 23, 14, 7, 4);
    rect(g, 0x2b6cb0, 3, 10, 2, 12);
  },
  fan: (g) => {
    dot(g, DARK, 16, 16, 14);
    dot(g, 0x4a5568, 16, 16, 12);
    for (let a = 0; a < 4; a++) {
      const r = (a * Math.PI) / 2 + 0.5;
      g.fillStyle(0xcbd5e0, 1).fillEllipse(16 + Math.cos(r) * 6, 16 + Math.sin(r) * 6, 10, 5);
    }
    dot(g, DARK, 16, 16, 2.5);
  },
  blower: (g) => {
    dot(g, 0x4a5568, 16, 16, 13);
    dot(g, DARK, 16, 16, 9);
    for (let i = 0; i < 12; i++) {
      const r = (i * Math.PI) / 6;
      line(g, 0xa0aec0, 2, 16 + Math.cos(r) * 4, 16 + Math.sin(r) * 4, 16 + Math.cos(r) * 11, 16 + Math.sin(r) * 11);
    }
    dot(g, BRASS, 16, 16, 2.5);
  },
  contactor: (g) => {
    rect(g, 0x1a202c, 4, 4, 24, 24);
    rect(g, 0x4a5568, 6, 6, 20, 8);
    rect(g, BRASS, 7, 2, 4, 4);
    rect(g, BRASS, 14, 2, 4, 4);
    rect(g, BRASS, 21, 2, 4, 4);
    rect(g, BRASS, 7, 26, 4, 4);
    rect(g, BRASS, 14, 26, 4, 4);
    rect(g, BRASS, 21, 26, 4, 4);
    rect(g, 0xe53e3e, 10, 17, 12, 6);
  },
  register: (g) => {
    rect(g, 0xa0aec0, 2, 5, 28, 22);
    for (let i = 0; i < 5; i++) rect(g, DARK, 5, 8 + i * 4, 22, 2);
  },
  duct: (g) => {
    rect(g, GREY, 3, 8, 26, 16);
    rect(g, STEEL, 3, 8, 26, 3);
    for (let i = 0; i < 4; i++) rect(g, 0x718096, 7 + i * 6, 8, 2, 16);
  },
  breaker: (g) => {
    rect(g, DARK, 5, 2, 22, 28);
    rect(g, 0x4a5568, 8, 5, 16, 22);
    rect(g, 0x1a202c, 12, 8, 8, 16);
    rect(g, 0xecc94b, 12, 8, 8, 7);
    rect(g, 0xf7fafc, 9, 28, 14, 1);
  },
  valve: (g) => {
    rect(g, BRASS, 6, 12, 20, 12);
    rect(g, 0xb7791f, 6, 12, 20, 3);
    rect(g, GREY, 1, 15, 6, 6);
    rect(g, GREY, 25, 15, 6, 6);
    rect(g, 0x1a202c, 12, 4, 8, 8);
    dot(g, 0xe53e3e, 16, 6, 3);
  },
  port: (g) => {
    rect(g, GREY, 4, 13, 14, 6);
    rect(g, BRASS, 18, 9, 9, 14);
    rect(g, 0xb7791f, 22, 7, 4, 18);
    dot(g, DARK, 25, 16, 2);
  },
  compressor: (g) => {
    dot(g, 0x1a202c, 16, 18, 12);
    g.fillStyle(0x1a202c, 1).fillRect(4, 18, 24, 11);
    rect(g, 0x4a5568, 8, 10, 4, 14);
    rect(g, COPPER, 14, 2, 3, 8);
    rect(g, COPPER, 21, 4, 3, 7);
    rect(g, BRASS, 13, 1, 5, 2);
    rect(g, BRASS, 20, 3, 5, 2);
  },
  coil: (g) => {
    rect(g, 0x718096, 3, 4, 26, 24);
    for (let i = 0; i < 8; i++) rect(g, 0xbee3f8, 5 + i * 3, 6, 2, 20);
    for (let i = 0; i < 4; i++) rect(g, COPPER, 3, 8 + i * 5, 26, 2);
  },
  hose: (g) => {
    g.lineStyle(4, 0x3182ce, 1).beginPath().moveTo(4, 24).lineTo(4, 10).lineTo(16, 10).lineTo(16, 24).lineTo(28, 24).strokePath();
    rect(g, BRASS, 2, 24, 5, 5);
    rect(g, BRASS, 26, 22, 5, 5);
  },
  scale: (g) => {
    rect(g, GREY, 3, 20, 26, 9);
    rect(g, STEEL, 5, 15, 22, 5);
    rect(g, 0x9ae6b4, 20, 22, 7, 4);
    rect(g, 0x22543d, 21, 23, 5, 2);
  },
  condenser: (g) => {
    rect(g, 0x4a5568, 3, 4, 26, 24);
    rect(g, 0x718096, 3, 4, 26, 3);
    dot(g, DARK, 16, 16, 9);
    for (let a = 0; a < 4; a++) {
      const r = (a * Math.PI) / 2;
      g.fillStyle(0xcbd5e0, 1).fillEllipse(16 + Math.cos(r) * 4, 16 + Math.sin(r) * 4, 7, 3);
    }
  },
  gear: (g) => {
    dot(g, GREY, 16, 16, 10);
    dot(g, DARK, 16, 16, 4);
  },
};

function kindFor(name: string): { kind: string; color: number } {
  const n = name.toLowerCase();
  const colorWord = /\b(red|blue|green|white|yellow)\b/.exec(n)?.[1];
  const letter = ({ r: "red", c: "blue", g: "green", w: "white", y: "yellow" } as Record<string, string>)[/^([rcgwy]) /.exec(n)?.[1] ?? ""];
  const color = WIRE_COLORS[colorWord ?? letter ?? ""] ?? 0;
  const rules: [RegExp, string][] = [
    [/look|inspect/, "look"],
    [/multimeter/, "multimeter"],
    [/strippers/, "strippers"],
    [/screwdriver/, "screwdriver"],
    [/lockout/, "lockout"],
    [/manifold|gauge/, "manifold"],
    [/recovery cylinder|cylinder/, "cylinder"],
    [/anemometer/, "anemometer"],
    [/capacitor/, "capacitor"],
    [/filter/, "filter"],
    [/breaker/, "breaker"],
    [/disconnect/, "disconnect"],
    [/transformer/, "transformer"],
    [/wire|wiring|lead|harness/, "wire"],
    [/thermostat/, "thermostat"],
    [/terminal/, "terminal"],
    [/blower wheel|blower/, "blower"],
    [/fan/, "fan"],
    [/motor/, "motor"],
    [/contactor/, "contactor"],
    [/register|grille/, "register"],
    [/duct/, "duct"],
    [/valve/, "valve"],
    [/port/, "port"],
    [/compressor/, "compressor"],
    [/coil/, "coil"],
    [/hose/, "hose"],
    [/scale/, "scale"],
    [/condenser/, "condenser"],
  ];
  for (const [re, kind] of rules) if (re.test(n)) return { kind, color };
  return { kind: "gear", color };
}

/** Icons are drawn at 4x resolution so they stay sharp when shown large; display scale is 1/ICON_SS of the old size. */
export const ICON_SS = 4;

/** Draws a small pixel-art picture for a tool or HVAC component the first time it's needed and returns its texture key. */
export function iconKey(scene: Phaser.Scene, name: string): string {
  const { kind, color } = kindFor(name);
  const key = `ico-${kind}-${color}`;
  if (!scene.textures.exists(key)) {
    const g = scene.add.graphics().setVisible(false);
    g.scaleCanvas(ICON_SS, ICON_SS);
    ICONS[kind](g, color);
    g.generateTexture(key, 32 * ICON_SS, 32 * ICON_SS);
    g.destroy();
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
  }
  return key;
}
