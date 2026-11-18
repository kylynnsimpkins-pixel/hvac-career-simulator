"use client";

import { useEffect, useRef } from "react";

export default function GameCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: import("phaser").Game | undefined;
    let cancelled = false;

    (async () => {
      const Phaser = await import("phaser");
      const { CampusScene } = await import("@/game/scenes/CampusScene");
      const { ClassroomScene } = await import("@/game/scenes/ClassroomScene");
      const { LabScene } = await import("@/game/scenes/LabScene");
      const { DriveHomeScene } = await import("@/game/scenes/DriveHomeScene");
      const { JobMapScene } = await import("@/game/scenes/JobMapScene");
      const { JobsiteScene } = await import("@/game/scenes/JobsiteScene");
      const { GraduationScene } = await import("@/game/scenes/GraduationScene");
      const { ExamScene } = await import("@/game/scenes/ExamScene");
      if (cancelled || !ref.current) return;
      // Render at 2x for crisp, smooth art; scenes still lay out in 640x480 world units.
      const factory = Phaser.GameObjects.GameObjectFactory.prototype as unknown as { text: (...a: unknown[]) => Phaser.GameObjects.Text; __hires?: boolean };
      if (!factory.__hires) {
        const orig = factory.text;
        factory.text = function (this: unknown, ...args: unknown[]) {
          return orig.apply(this, args).setResolution(2);
        };
        factory.__hires = true;
      }
      game = new Phaser.Game({
        type: Phaser.AUTO,
        pixelArt: false,
        antialias: true,
        parent: ref.current,
        width: 1280,
        height: 960,
        physics: { default: "arcade" },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: [CampusScene, ClassroomScene, LabScene, DriveHomeScene, JobMapScene, JobsiteScene, GraduationScene, ExamScene],
      });
      game.events.once("ready", () => {
        const frame = (s: Phaser.Scene) => {
          s.cameras.main.setZoom(2).centerOn(320, 240);
          s.physics?.world.setBounds(0, 0, 640, 480);
        };
        game!.scene.scenes.forEach((s) => {
          s.sys.events.on(Phaser.Scenes.Events.CREATE, () => frame(s));
          if (s.sys.isActive()) frame(s);
        });
      });
    })();

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  return <div ref={ref} className="mx-auto w-full max-w-[640px]" />;
}
