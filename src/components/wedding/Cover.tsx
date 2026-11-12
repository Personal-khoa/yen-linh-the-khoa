import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronUp, Music2, VolumeX } from "lucide-react";
import coverSleeveAsset from "@/assets/cover-sleeve.webp";
import logoAsset from "@/assets/logo-lk.webp";
import { AUTO_OPEN_MS, COVER_TIMING, WEDDING } from "./wedding-data";
import { useMusic } from "./music";
import { Petals } from "./Petals";
import { PHOTOS } from "./story/StoryPages";

type Phase = "idle" | "pulling" | "leaving";
/** Slow grip, long glide, soft landing — like sliding a card out of a paper sleeve. */
const PULL_EASE = [0.6, 0.02, 0.2, 1] as const;
const SETTLE_EASE = [0.22, 1, 0.36, 1] as const;

/** Wait until the card artwork and script fonts are ready so nothing pops in mid-animation. */
function useAssetsReady(maxMs: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const done = () => alive && setReady(true);
    // Preload cover assets + first story photo so there's no red flash on handoff
    const firstPhoto = PHOTOS[0]?.src;
    const imageSrcs = [coverSleeveAsset, logoAsset, ...(firstPhoto ? [firstPhoto] : [])];
    const images = imageSrcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode().catch(() => undefined);
    });
    const names = `${WEDDING.bride} ${WEDDING.groom} &`;
    const fonts = document.fonts
      ? Promise.all([
          document.fonts.load('400 1em "Pinyon Script"', names),
          document.fonts.load('400 1em "Great Vibes"', names),
          document.fonts.load('italic 500 1em "Cormorant Garamond"', "Chạm để xem thiệp"),
        ]).catch(() => undefined)
      : Promise.resolve();
    void Promise.all([...images, fonts]).then(done);
    const t = window.setTimeout(done, maxMs);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [maxMs]);
  return ready;
}

export function Cover({
  guest,
  onOpenStart,
  onReveal,
  onDone,
}: {
  guest?: string | undefined;
  /** Called synchronously inside the user gesture so music may start. */
  onOpenStart: () => void;
  /** Card is (almost) out of the sleeve; the cover starts fading into the story pages. */
  onReveal: () => void;
  onDone: () => void;
}) {
  const ready = useAssetsReady(COVER_TIMING.maxWaitMs);
  const reduce = useReducedMotion();
  const { playing, toggle, play } = useMusic();
  const [phase, setPhase] = useState<Phase>("idle");
  const started = useRef(false);
  const readyRef = useRef(false);
  readyRef.current = ready;
  const touchY = useRef<number | null>(null);

  // Attempt autoplay immediately on mount — browser will grant it if the user
  // has already interacted with the page (e.g. clicked a link to open it).
  // If blocked, music.tsx arms a capture-phase listener so the first touch/click
  // anywhere on the cover triggers playback automatically.
  useEffect(() => {
    play();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const open = useCallback(() => {
    if (started.current || !readyRef.current) return;
    started.current = true;
    onOpenStart();
    setPhase("pulling");
  }, [onOpenStart]);
  useEffect(() => {
    if (phase !== "pulling") return;
    const t = window.setTimeout(
      () => {
        setPhase("leaving");
        onReveal();
      },
      reduce ? 100 : COVER_TIMING.revealAfterMs,
    );
    return () => window.clearTimeout(t);
  }, [phase, onReveal, reduce]);

  // Auto-pull the card if the guest doesn't interact (counted from when the cover is fully shown).
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(open, AUTO_OPEN_MS);
    return () => window.clearTimeout(t);
  }, [ready, open]);

  // Lock page scroll while the cover is showing.
  useEffect(() => {
    window.scrollTo(0, 0);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 8) open();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", " ", "ArrowDown", "ArrowUp", "PageDown"].includes(e.key)) open();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pull = phase !== "idle";
  const pullS = COVER_TIMING.pullMs / 1000;

  return (
    <motion.div
      role="dialog"
      aria-label="Bìa thiệp cưới"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-cover-gradient"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "leaving" ? 0 : 1 }}
      transition={{ duration: reduce ? 0.3 : COVER_TIMING.fadeMs / 1000, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={() => phase === "leaving" && onDone()}
      onClick={open}
      onTouchStart={(e) => (touchY.current = e.touches[0]?.clientY ?? null)}
      onTouchEnd={(e) => {
        const start = touchY.current;
        const end = e.changedTouches[0]?.clientY;
        if (start != null && end != null && start - end > 40) open();
      }}
    >
      <Petals count={12} />

      <motion.button
        type="button"
        data-music-toggle
        aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 grid size-11 place-items-center rounded-full bg-card/70 text-primary shadow-soft ring-1 ring-gold/60 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        onTouchEnd={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: ready && phase === "idle" ? 1 : 0, scale: ready ? 1 : 0.8 }}
        transition={{ duration: 0.6, ease: SETTLE_EASE }}
      >
        {playing ? <Music2 className="size-5 animate-pulse" /> : <VolumeX className="size-5" />}
      </motion.button>

      {ready && (
        <>
          <motion.div
            className="cover-stage cursor-pointer"
            initial={{ opacity: 0, y: 36, scale: 0.95 }}
            animate={pull ? { opacity: 1, y: "15%", scale: 0.965 } : { opacity: 1, y: 0, scale: 1 }}
            transition={pull ? { duration: pullS, ease: PULL_EASE } : { duration: 1.3, ease: SETTLE_EASE }}
          >
            <div className="cover-base" />

            {/* The white card that slides out of the lotus sleeve */}
            <motion.div
              className="cover-card"
              initial={{ y: "0%" }}
              animate={pull ? { y: "-62%" } : { y: ["0%", "-1.4%", "0%"] }}
              transition={
                pull
                  ? { duration: pullS, ease: PULL_EASE }
                  : { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
              }
            >
              <img src={logoAsset} alt="Logo L&K" className="cover-card-logo" draggable={false} />
              <div className="cover-card-names">
                <p className="text-eyebrow" style={{ fontSize: "2.4cqw" }}>
                  {WEDDING.ceremony}
                </p>
                <p className="font-names" style={{ fontSize: "8.2cqw", lineHeight: 1.25, marginTop: "2cqw" }}>
                  {WEDDING.bride}
                </p>
                <p className="font-script" style={{ fontSize: "5cqw", lineHeight: 1 }}>
                  &amp;
                </p>
                <p className="font-names" style={{ fontSize: "8.2cqw", lineHeight: 1.25 }}>
                  {WEDDING.groom}
                </p>
                <p
                  className="text-numeral"
                  style={{ fontSize: "3.6cqw", marginTop: "2.4cqw", letterSpacing: "0.3em" }}
                >
                  {WEDDING.dateDisplay.day} . {WEDDING.dateDisplay.month} . {WEDDING.dateDisplay.year}
                </p>
              </div>
            </motion.div>

            <img src={coverSleeveAsset} alt="" className="cover-sleeve" draggable={false} />

            <motion.button
              type="button"
              className="cover-cta"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: pull ? 0 : 1, x: 0 }}
              transition={{ delay: pull ? 0 : 1.1, duration: pull ? 0.4 : 0.8 }}
            >
              <span className="text-shimmer">Chạm để xem thiệp</span>
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex"
              >
                <ChevronUp style={{ width: "4.4cqw", height: "4.4cqw" }} />
              </motion.span>
            </motion.button>

            {guest && (
              <motion.span
                className="cover-guest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
              >
                {guest}
              </motion.span>
            )}
          </motion.div>

          {/* <motion.p
            className="mt-5 flex items-center gap-2 text-eyebrow text-primary/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: pull ? 0 : [0.35, 0.9, 0.35] }}
            transition={pull ? { duration: 0.4 } : { duration: 2.8, repeat: Infinity, delay: 1.8 }}
          >
            Vuốt lên để mở thiệp
          </motion.p> */}
        </>
      )}
    </motion.div>
  );
}
