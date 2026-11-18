import * as Phaser from "phaser";
import { drawPerson, type Look } from "./avatar";
import { buildLook, DEFAULT_WARDROBE, type Wardrobe } from "@/game/data/wardrobe";

/** Character textures are drawn at 2x (32x48) and displayed at scale CHAR_SCALE. */
export const CHAR_SCALE = 0.5;
export const CHAR_BODY = { w: 28, h: 20, ox: 2, oy: 44 };

function paint(scene: Phaser.Scene, key: string, look: Look, frame: number) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, 32, 48)!;
  drawPerson(tex.getContext(), look, frame);
  tex.refresh();
}

/** Builds the shared player and teacher textures used by every scene. */
export function makeCharacterTextures(scene: Phaser.Scene, wardrobe: Wardrobe = DEFAULT_WARDROBE) {
  const player: Look = buildLook(wardrobe);
  paint(scene, "player-0", player, 0);
  paint(scene, "player-1", player, 1);
  paint(scene, "teacher", { shirt: 0xf5f5f5, pants: 0x3a3a3a, skin: 0x8d5524, hair: 0x2a1a10, dreads: true, shoes: 0x2b1d14, tie: 0xb02a2a, glasses: true }, 0);
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
