import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import musicAsset from "@/assets/canon-in-d.mp3.asset.json";
import { MUSIC_VOLUME, type MusicLevel } from "./wedding-data";

type MusicCtx = {
  playing: boolean;
  play: () => void;
  toggle: () => void;
  setLevel: (level: MusicLevel) => void;
};
const Ctx = createContext<MusicCtx | null>(null);

type Graph = { ctx: AudioContext; gain: GainNode };

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const graphRef = useRef<Graph | null>(null);
  const fadeRef = useRef<number | undefined>(undefined);
  const level = useRef<MusicLevel>("cover");
  const wantsPlay = useRef(false);
  const [playing, setPlaying] = useState(false);

  // Volume goes through a gain node so it also works on iPhone, where audio.volume is read-only.
  const ensureGraph = useCallback((): Graph | null => {
    if (graphRef.current) return graphRef.current;
    const a = audioRef.current;
    const AC =
      typeof window === "undefined"
        ? undefined
        : (window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!a || !AC) return null;
    try {
      const ctx = new AC();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(a).connect(gain).connect(ctx.destination);
      a.volume = 1;
      graphRef.current = { ctx, gain };
    } catch {
      graphRef.current = null;
    }
    return graphRef.current;
  }, []);

  const fadeTo = useCallback((target: number, seconds: number) => {
    const g = graphRef.current;
    if (g) {
      const now = g.ctx.currentTime;
      g.gain.gain.cancelScheduledValues(now);
      g.gain.gain.setValueAtTime(g.gain.gain.value, now);
      g.gain.gain.linearRampToValueAtTime(target, now + seconds);
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    window.clearInterval(fadeRef.current);
    const stepMs = 100;
    const delta = (target - a.volume) / Math.max(1, (seconds * 1000) / stepMs);
    fadeRef.current = window.setInterval(() => {
      const next = a.volume + delta;
      const done = delta >= 0 ? next >= target : next <= target;
      a.volume = Math.min(1, Math.max(0, done ? target : next));
      if (done) window.clearInterval(fadeRef.current);
    }, stepMs);
  }, []);

  const start = useCallback(() => {
    const a = audioRef.current;
    if (!a) return Promise.reject(new Error("no audio"));
    const g = ensureGraph();
    const wasPaused = a.paused;
    if (wasPaused) {
      if (g) g.gain.gain.value = 0;
      else a.volume = 0;
    }
    const resume = g && g.ctx.state !== "running" ? g.ctx.resume() : Promise.resolve();
    return Promise.all([a.play(), resume]).then(() => {
      if (g && g.ctx.state !== "running") throw new Error("audio context suspended");
      fadeTo(MUSIC_VOLUME[level.current], wasPaused ? 2.5 : 1.5);
    });
  }, [ensureGraph, fadeTo]);

  const play = useCallback(() => {
    wantsPlay.current = true;
    start().catch(() => {
      // Autoplay blocked: start on the visitor's first touch, click or key press.
      // Keep listening until one gesture actually starts the sound (iOS only honours some events).
      const resume = () => {
        if (!wantsPlay.current) return cleanup();
        start().then(cleanup).catch(() => undefined);
      };
      const cleanup = () => {
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
        window.removeEventListener("touchend", resume);
      };
      window.addEventListener("pointerdown", resume);
      window.addEventListener("keydown", resume);
      window.addEventListener("touchend", resume);
    });
  }, [start]);

  const setLevel = useCallback(
    (l: MusicLevel) => {
      if (level.current === l) return;
      level.current = l;
      if (audioRef.current && !audioRef.current.paused) fadeTo(MUSIC_VOLUME[l], 2.5);
    },
    [fadeTo],
  );

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      wantsPlay.current = true;
      start().catch(() => undefined);
    } else {
      wantsPlay.current = false;
      a.pause();
    }
  }, [start]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    a.addEventListener("play", on);
    a.addEventListener("pause", off);
    return () => {
      a.removeEventListener("play", on);
      a.removeEventListener("pause", off);
      window.clearInterval(fadeRef.current);
    };
  }, []);

  return (
    <Ctx.Provider value={{ playing, play, toggle, setLevel }}>
      <audio ref={audioRef} src={musicAsset.url} loop preload="auto" />
      {children}
    </Ctx.Provider>
  );
}

export function useMusic() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusic must be used inside MusicProvider");
  return c;
}
