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
      game = new Phaser.Game({
        type: Phaser.AUTO,
        pixelArt: true,
        parent: ref.current,
        width: 640,
        height: 480,
        physics: { default: "arcade" },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: [CampusScene, ClassroomScene, LabScene, DriveHomeScene, JobMapScene, JobsiteScene, GraduationScene, ExamScene],
      });
    })();

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  return <div ref={ref} className="mx-auto w-full max-w-[640px]" />;
}
