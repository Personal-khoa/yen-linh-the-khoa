import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import musicAsset from "@/assets/canon-in-d.mp3.asset.json";

type MusicCtx = { playing: boolean; play: () => void; toggle: () => void };
const Ctx = createContext<MusicCtx | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const wantsPlay = useRef(false);

  const fadeIn = (a: HTMLAudioElement) => {
    a.volume = 0;
    const id = window.setInterval(() => {
      a.volume = Math.min(0.55, a.volume + 0.03);
      if (a.volume >= 0.55) window.clearInterval(id);
    }, 120);
  };

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    wantsPlay.current = true;
    a.play()
      .then(() => fadeIn(a))
      .catch(() => {
        // Autoplay blocked: start on the next real interaction instead.
        const resume = () => {
          if (!wantsPlay.current) return;
          a.play().then(() => fadeIn(a)).catch(() => undefined);
          cleanup();
        };
        const cleanup = () => {
          window.removeEventListener("pointerdown", resume);
          window.removeEventListener("keydown", resume);
          window.removeEventListener("touchend", resume);
        };
        window.addEventListener("pointerdown", resume, { once: true });
        window.addEventListener("keydown", resume, { once: true });
        window.addEventListener("touchend", resume, { once: true });
      });
  }, []);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      wantsPlay.current = true;
      a.play().then(() => fadeIn(a)).catch(() => undefined);
    } else {
      wantsPlay.current = false;
      a.pause();
    }
  }, []);

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
    };
  }, []);

  return (
    <Ctx.Provider value={{ playing, play, toggle }}>
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
