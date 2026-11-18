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
      if (cancelled || !ref.current) return;
      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: ref.current,
        width: 640,
        height: 480,
        physics: { default: "arcade" },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: [CampusScene],
      });
    })();

    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  return <div ref={ref} className="mx-auto w-full max-w-[640px]" />;
}
