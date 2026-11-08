import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Music2, VolumeX } from "lucide-react";
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

export function MusicButton({ visible }: { visible: boolean }) {
  const { playing, toggle } = useMusic();
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full border border-gold bg-card text-primary shadow-soft"
        >
          {playing && <span className="absolute inset-0 rounded-full border border-rose animate-ripple" />}
          <span className={playing ? "animate-spin-slow" : ""}>
            {playing ? <Music2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </span>
          {playing && (
            <span className="absolute -top-1 -left-1 flex h-4 items-end gap-[2px] rounded-full bg-primary px-1.5 py-[3px]">
              {[0, 0.2, 0.4].map((d) => (
                <span
                  key={d}
                  className="block h-full w-[2px] bg-primary-foreground animate-eq"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </span>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
