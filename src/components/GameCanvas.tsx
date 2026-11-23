"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { music, trackFor } from "@/game/audio/music";

export default function GameCanvas({ start }: { start?: string } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(music.isMuted);
    const unlock = () => music.unlock();
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const setMode = useCallback((on: boolean) => {
    setFull(on);
    const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void };
    const root = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
    try {
      if (on) {
        void (root.requestFullscreen?.() ?? root.webkitRequestFullscreen?.())?.catch?.(() => {});
        void (screen.orientation as unknown as { lock?: (o: string) => Promise<void> })?.lock?.("landscape")?.catch(() => {});
      } else if (document.fullscreenElement || doc.webkitFullscreenElement) {
        void (document.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
      }
    } catch {
      /* the CSS fullscreen layout still works where the API is blocked */
    }
  }, []);

  useEffect(() => {
    // Phones and tablets start in fullscreen; the exit button gives access to the rest of the game.
    if (window.matchMedia("(pointer: coarse) and (max-width: 1024px)").matches) setFull(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = full ? "hidden" : "";
    const t = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
    return () => window.clearTimeout(t);
  }, [full]);

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setFull(false);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

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
      const { ArrivalScene } = await import("@/game/scenes/ArrivalScene");
      const { JobsiteScene } = await import("@/game/scenes/JobsiteScene");
      const { GraduationScene } = await import("@/game/scenes/GraduationScene");
      const { ExamScene } = await import("@/game/scenes/ExamScene");
      const { EndingScene } = await import("@/game/scenes/EndingScene");
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
        scene: start === "EndingScene" ? [EndingScene, CampusScene, ClassroomScene, LabScene, DriveHomeScene, JobMapScene, ArrivalScene, JobsiteScene, GraduationScene, ExamScene] : [CampusScene, ClassroomScene, LabScene, DriveHomeScene, JobMapScene, ArrivalScene, JobsiteScene, GraduationScene, ExamScene, EndingScene],
      });
      game.events.once("ready", () => {
        const frame = (s: Phaser.Scene) => {
          s.cameras.main.setZoom(2).centerOn(320, 240);
          s.physics?.world.setBounds(0, 0, 640, 480);
        };
        const tune = (s: Phaser.Scene) => {
          const site = (s as unknown as { site?: { id: string } }).site;
          music.play(trackFor(s.sys.settings.key, site?.id));
        };
        game!.scene.scenes.forEach((s) => {
          s.sys.events.on(Phaser.Scenes.Events.CREATE, () => {
            frame(s);
            tune(s);
          });
          if (s.sys.isActive()) {
            frame(s);
            tune(s);
          }
        });
      });
    })();

    return () => {
      cancelled = true;
      music.stop();
      game?.destroy(true);
    };
  }, []);

  return (
    <div className={full ? "fixed inset-0 z-50 flex items-center justify-center bg-black" : "relative mx-auto w-full max-w-[640px]"}>
      <div ref={ref} className={full ? "h-full w-full" : "w-full"} />
      <button
        type="button"
        onClick={() => {
          music.unlock();
          music.setMuted(!muted);
          setMuted(!muted);
        }}
        aria-label={muted ? "Turn music on" : "Turn music off"}
        className={`absolute left-2 top-2 z-10 rounded bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur hover:bg-black/80 ${full ? "pt-[max(0.375rem,env(safe-area-inset-top))]" : ""}`}
      >
        {muted ? "🔇 Music off" : "🎵 Music on"}
      </button>
      <button
        type="button"
        onClick={() => setMode(!full)}
        aria-label={full ? "Exit full screen" : "Enter full screen"}
        className={`absolute right-2 top-2 z-10 rounded bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur hover:bg-black/80 ${full ? "pt-[max(0.375rem,env(safe-area-inset-top))]" : ""}`}
      >
        {full ? "✕ Exit full screen" : "⛶ Full screen"}
      </button>
    </div>
  );
}
