/** Procedural background music (Web Audio), so no audio files or licences are needed. */

interface Track {
  bpm: number;
  root: number; // MIDI note of the key
  scale: number[]; // semitone offsets
  prog: number[]; // scale degree per bar (4 bars)
  lead: (number | null)[]; // 16 steps, scale degrees
  bass: (number | null)[]; // 16 steps, scale degrees
  wave: OscillatorType;
  bassWave: OscillatorType;
  drums: "none" | "soft" | "beat" | "swing";
  level?: number;
}

const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
const MIXO = [0, 2, 4, 5, 7, 9, 10];
const LYDIAN = [0, 2, 4, 6, 7, 9, 11];
const DORIAN = [0, 2, 3, 5, 7, 9, 10];
const _ = null;

export const TRACKS: Record<string, Track> = {
  campus: { bpm: 112, root: 60, scale: MAJOR, prog: [0, 4, 5, 3], wave: "triangle", bassWave: "sine", drums: "soft",
    lead: [0, _, 2, _, 4, _, 2, _, 5, _, 4, _, 2, _, 1, _], bass: [0, _, _, _, 0, _, _, _, 0, _, _, _, 4, _, _, _] },
  classroom: { bpm: 84, root: 62, scale: MAJOR, prog: [0, 5, 3, 4], wave: "sine", bassWave: "sine", drums: "none",
    lead: [4, _, _, _, 2, _, _, _, 0, _, 2, _, _, _, _, _], bass: [0, _, _, _, _, _, _, _, 0, _, _, _, _, _, _, _] },
  lab: { bpm: 100, root: 57, scale: MINOR, prog: [0, 0, 5, 4], wave: "square", bassWave: "triangle", drums: "beat", level: 0.7,
    lead: [0, _, _, 2, _, 4, _, _, 3, _, _, 2, _, 0, _, _], bass: [0, _, 0, _, _, 0, _, _, 0, _, 0, _, _, 4, _, _] },
  drive: { bpm: 92, root: 55, scale: MIXO, prog: [0, 3, 4, 3], wave: "triangle", bassWave: "sine", drums: "soft",
    lead: [4, _, _, 5, _, 4, _, 2, _, _, 0, _, 2, _, _, _], bass: [0, _, _, _, 0, _, 4, _, 0, _, _, _, 3, _, _, _] },
  map: { bpm: 120, root: 62, scale: MAJOR, prog: [0, 3, 4, 0], wave: "triangle", bassWave: "triangle", drums: "beat",
    lead: [0, 2, 4, _, 7, _, 4, 2, 5, _, 4, _, 2, _, 4, _], bass: [0, _, 0, _, 3, _, 3, _, 4, _, 4, _, 0, _, 4, _] },
  arrival: { bpm: 104, root: 60, scale: MAJOR, prog: [0, 4, 0, 4], wave: "triangle", bassWave: "sine", drums: "soft",
    lead: [2, _, 4, _, 7, _, _, _, 5, _, 4, _, 2, _, _, _], bass: [0, _, _, _, _, _, 4, _, 0, _, _, _, _, _, 4, _] },
  ranch: { bpm: 96, root: 55, scale: MAJOR, prog: [0, 0, 3, 4], wave: "triangle", bassWave: "sine", drums: "soft",
    lead: [4, _, 4, 5, 4, _, 2, _, 0, _, 2, _, 4, _, _, _], bass: [0, _, 4, _, 0, _, 4, _, 0, _, 4, _, 0, _, 4, _] },
  twostory: { bpm: 104, root: 64, scale: LYDIAN, prog: [0, 1, 0, 4], wave: "sine", bassWave: "sine", drums: "none",
    lead: [0, _, 2, 4, _, 6, _, 4, 2, _, 4, _, 0, _, _, _], bass: [0, _, _, _, 4, _, _, _, 0, _, _, _, 1, _, _, _] },
  grocery: { bpm: 116, root: 57, scale: MIXO, prog: [0, 0, 3, 4], wave: "square", bassWave: "sawtooth", drums: "beat", level: 0.6,
    lead: [_, 2, _, 4, 5, _, 4, _, _, 2, _, 0, 2, _, _, _], bass: [0, _, 0, 0, _, 0, _, 3, 0, _, 0, 0, _, 4, _, 3] },
  school: { bpm: 108, root: 60, scale: MAJOR, prog: [0, 3, 0, 4], wave: "triangle", bassWave: "triangle", drums: "soft",
    lead: [0, 0, 4, 4, 5, 5, 4, _, 3, 3, 2, 2, 1, 1, 0, _], bass: [0, _, _, _, 3, _, _, _, 0, _, _, _, 4, _, _, _] },
  restaurant: { bpm: 100, root: 58, scale: DORIAN, prog: [0, 3, 1, 4], wave: "sine", bassWave: "triangle", drums: "swing",
    lead: [0, _, _, 2, 4, _, 6, _, 4, _, 2, _, _, 3, _, _], bass: [0, _, _, 0, _, _, 4, _, 0, _, _, 0, _, _, 3, _] },
  graduation: { bpm: 120, root: 60, scale: MAJOR, prog: [0, 4, 5, 3], wave: "triangle", bassWave: "triangle", drums: "beat",
    lead: [0, _, 2, _, 4, _, 7, _, 7, _, 5, _, 4, 2, 4, _], bass: [0, _, _, 0, 4, _, _, 4, 5, _, _, 5, 3, _, 4, _] },
  exam: { bpm: 80, root: 57, scale: MINOR, prog: [0, 5, 3, 4], wave: "sine", bassWave: "sine", drums: "none", level: 0.8,
    lead: [0, _, _, _, 2, _, _, _, 4, _, _, _, 2, _, _, _], bass: [0, _, _, _, _, _, _, _, 0, _, _, _, _, _, _, _] },
};

/** Which track plays in which scene. */
export function trackFor(sceneKey: string, siteId?: string): string | null {
  switch (sceneKey) {
    case "CampusScene": return "campus";
    case "ClassroomScene": return "classroom";
    case "LabScene": return "lab";
    case "DriveHomeScene": return "drive";
    case "JobMapScene": return "map";
    case "ArrivalScene": return "arrival";
    case "JobsiteScene": return siteId && TRACKS[siteId] ? siteId : "map";
    case "GraduationScene": return "graduation";
    case "ExamScene": return "exam";
    default: return null;
  }
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

class MusicPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private timer: number | null = null;
  private current: string | null = null;
  private step = 0;
  private nextTime = 0;
  private muted = false;
  private noise: AudioBuffer | null = null;

  constructor() {
    if (typeof window !== "undefined") this.muted = localStorage.getItem("hvac-music-muted") === "1";
  }

  get isMuted() {
    return this.muted;
  }

  /** Browsers only allow audio after a tap or key press. */
  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.22;
      this.master.connect(this.ctx.destination);
      const len = this.ctx.sampleRate / 4;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    if (this.current && !this.timer) this.begin();
  }

  setMuted(m: boolean) {
    this.muted = m;
    localStorage.setItem("hvac-music-muted", m ? "1" : "0");
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.22, this.ctx.currentTime, 0.05);
  }

  play(name: string | null) {
    if (name === this.current) return;
    this.current = name;
    this.stopLoop();
    if (name && this.ctx) this.begin();
  }

  stop() {
    this.current = null;
    this.stopLoop();
  }

  private stopLoop() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
    const old = this.bus;
    if (old && this.ctx) {
      old.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      window.setTimeout(() => old.disconnect(), 1200);
    }
    this.bus = null;
  }

  private begin() {
    const ctx = this.ctx;
    const t = this.current ? TRACKS[this.current] : null;
    if (!ctx || !this.master || !t) return;
    this.bus = ctx.createGain();
    this.bus.gain.value = t.level ?? 1;
    this.bus.connect(this.master);
    this.step = 0;
    this.nextTime = ctx.currentTime + 0.1;
    this.timer = window.setInterval(() => this.schedule(t), 40);
  }

  private schedule(t: Track) {
    const ctx = this.ctx!;
    const dur = 60 / t.bpm / 4;
    while (this.nextTime < ctx.currentTime + 0.2) {
      this.playStep(t, this.step, this.nextTime, dur);
      this.nextTime += dur;
      this.step++;
    }
  }

  private freq(t: Track, degree: number, octave: number) {
    const n = t.scale.length;
    const oct = Math.floor(degree / n);
    return midi(t.root + t.scale[((degree % n) + n) % n] + (oct + octave) * 12);
  }

  private playStep(t: Track, step: number, when: number, dur: number) {
    const s = step % 16;
    const bar = Math.floor(step / 16) % t.prog.length;
    const shift = t.prog[bar];
    const lead = t.lead[s];
    const bass = t.bass[s];
    if (lead !== null) this.tone(t.wave, this.freq(t, lead + shift, 0), when, dur * 1.8, 0.35);
    if (bass !== null) this.tone(t.bassWave, this.freq(t, bass + shift, -2), when, dur * 3, 0.5);
    if (s === 0) [0, 2, 4].forEach((d) => this.tone("sine", this.freq(t, d + shift, -1), when, dur * 15, 0.08));
    if (t.drums === "none") return;
    const swing = t.drums === "swing";
    if (t.drums === "beat" && s % 8 === 0) this.kick(when);
    if (t.drums === "beat" && s % 8 === 4) this.hat(when, 0.18, 0.09);
    if (t.drums === "soft" && s % 8 === 0) this.kick(when, 0.5);
    if (s % 2 === 0) this.hat(when + (swing && s % 4 === 2 ? dur * 0.3 : 0), swing ? 0.07 : 0.05, 0.03);
  }

  private tone(type: OscillatorType, f: number, when: number, len: number, vol: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(vol * 0.5, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, when + len);
    o.connect(g).connect(this.bus!);
    o.start(when);
    o.stop(when + len + 0.05);
  }

  private kick(when: number, vol = 0.9) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(120, when);
    o.frequency.exponentialRampToValueAtTime(40, when + 0.12);
    g.gain.setValueAtTime(vol * 0.6, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.18);
    o.connect(g).connect(this.bus!);
    o.start(when);
    o.stop(when + 0.2);
  }

  private hat(when: number, vol: number, len: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + len);
    src.connect(hp).connect(g).connect(this.bus!);
    src.start(when);
    src.stop(when + len + 0.02);
  }
}

export const music = new MusicPlayer();
