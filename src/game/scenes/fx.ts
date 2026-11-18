import * as Phaser from "phaser";

const FONT = "monospace";

/** Soft edge darkening for a more cinematic, modern look. */
export function addVignette(scene: Phaser.Scene) {
  if (!scene.textures.exists("vignette")) {
    const tex = scene.textures.createCanvas("vignette", 640, 480)!;
    const ctx = tex.getContext();
    const grad = ctx.createRadialGradient(320, 240, 170, 320, 240, 430);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);
    tex.refresh();
  }
  scene.add.image(320, 240, "vignette").setDepth(9400);
}

/** Soft ground shadow under an object. */
export function dropShadow(scene: Phaser.Scene, x: number, y: number, w: number, h: number, depth = 1) {
  return scene.add.ellipse(x, y, w, h, 0x000000, 0.22).setDepth(depth);
}

/** Rounded translucent title pill at the top of the screen. */
export function hudBar(scene: Phaser.Scene, text: string) {
  const g = scene.add.graphics().setDepth(9500);
  g.fillStyle(0x0b1224, 0.72).fillRoundedRect(8, 6, 624, 24, 12);
  g.lineStyle(1, 0x5b7bd5, 0.6).strokeRoundedRect(8, 6, 624, 24, 12);
  scene.add.text(22, 11, text, { fontFamily: FONT, fontSize: "11px", color: "#e6ecff" }).setDepth(9501);
}
