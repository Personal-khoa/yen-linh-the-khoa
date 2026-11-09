import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronLeft, ChevronRight, Music2, Pause, Play, VolumeX } from "lucide-react";
import logoAsset from "@/assets/logo-lk.webp.asset.json";
import bloom from "@/assets/lotus-bloom.webp.asset.json";
import { WEDDING } from "../wedding-data";
import { useMusic } from "../music";
import { Petals } from "../Petals";
import { PHOTOS, PageBack, STORIES } from "./StoryPages";
import { FLIP_SECONDS, clampStep, gestureStep } from "./story-nav";

type Flip = { from: number; to: number; dir: 1 | -1 };
type Role = "static" | "under" | "turn" | "idle";

const isUi = (t: EventTarget | null) => t instanceof Element && !!t.closest("a,button,[data-story-ui]");

export function StoryViewer({ started, guest }: { started: boolean; guest?: string | undefined }) {
  const count = STORIES.length;
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();
  const { playing, toggle } = useMusic();

  /** Page rotation in degrees: 0 = lying flat on the right, -180 = turned over to the left. */
  const rot = useMotionValue(0);
  const progress = useMotionValue(0);
  const frontShade = useTransform(rot, [0, -90], [0, 0.6]);
  const backShade = useTransform(rot, [-90, -180], [0.6, 0]);
  const backOpacity = useTransform(rot, [-125, -180], [1, 0]);
  const underShadow = useTransform(rot, [0, -180], [0.55, 0]);

  const indexRef = useRef(index);
  indexRef.current = index;
  const flipRef = useRef<Flip | null>(flip);
  flipRef.current = flip;

  const goTo = useCallback(
    (to: number) => {
      const from = indexRef.current;
      if (flipRef.current || to === from || to < 0 || to >= count) return;
      const f: Flip = { from, to, dir: to > from ? 1 : -1 };
      rot.set(f.dir === 1 ? 0 : -180);
      progress.set(0);
      flipRef.current = f;
      setFlip(f);
    },
    [count, rot, progress],
  );

  const step = useCallback(
    (s: -1 | 0 | 1) => {
      if (s === 0) return;
      const t = clampStep(indexRef.current, s, count);
      if (t == null) {
        if (s === -1 && !flipRef.current) progress.set(0); // restart the first story
        return;
      }
      goTo(t);
    },
    [count, goTo, progress],
  );

  // Run the page-flip.
  useEffect(() => {
    if (!flip) return;
    let alive = true;
    const c = animate(rot, flip.dir === 1 ? -180 : 0, {
      duration: reduce ? 0.01 : FLIP_SECONDS,
      ease: [0.45, 0.05, 0.3, 1],
    });
    c.then(() => {
      if (!alive) return;
      progress.set(0);
      setIndex(flip.to);
      setFlip(null);
    });
    return () => {
      alive = false;
      c.stop();
    };
  }, [flip, rot, progress, reduce]);

  // Story progress bar + auto-advance (pauses on hold, pause button, hidden tab, or during a flip).
  useEffect(() => {
    if (!started || flip || paused || holding || hidden) return;
    const seconds = STORIES[index]!.seconds;
    const remaining = Math.max(0.05, (1 - progress.get()) * seconds);
    let alive = true;
    const c = animate(progress, 1, { duration: remaining, ease: "linear" });
    c.then(() => {
      if (alive && index < count - 1) goTo(index + 1);
    });
    return () => {
      alive = false;
      c.stop();
    };
  }, [started, flip, paused, holding, hidden, index, count, goTo, progress]);

  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  // Preload album photos so a turned page never lands on an empty frame.
  useEffect(() => {
    if (!started) return;
    PHOTOS.forEach((p) => {
      const img = new Image();
      img.src = p.src;
    });
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") step(1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") step(-1);
      else if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, step]);

  // Tap left/right, swipe, or press-and-hold to pause — like Facebook stories.
  const press = useRef<{ x: number; y: number; t: number } | null>(null);
  const heldRef = useRef(false);
  const holdTimer = useRef<number | undefined>(undefined);
  const endPress = () => {
    window.clearTimeout(holdTimer.current);
    press.current = null;
    heldRef.current = false;
    setHolding(false);
  };

  const shown = flip ? flip.to : index;
  const tone = STORIES[shown]!.tone;
  const onPhoto = tone === "photo";

  // The current page plus its neighbours stay mounted, so a turn only moves layers that already exist.
  const turnIdx = flip ? (flip.dir === 1 ? flip.from : flip.to) : -1;
  const underIdx = flip ? (flip.dir === 1 ? flip.to : flip.from) : -1;
  const mounted = new Set<number>([index - 1, index, index + 1]);
  if (flip) [flip.to - 1, flip.to, flip.to + 1].forEach((i) => mounted.add(i));
  const layers: { i: number; role: Role }[] = [...mounted]
    .filter((i) => i >= 0 && i < count)
    .sort((a, b) => a - b)
    .map((i) => ({
      i,
      role: flip ? (i === turnIdx ? "turn" : i === underIdx ? "under" : "idle") : i === index ? "static" : "idle",
    }));

  const visible = (i: number) => started && (i === index || i === flip?.to);
  const onReplay = useCallback(() => goTo(0), [goTo]);

  return (
    <div className="story-shell" aria-roledescription="story" data-paused={!started}>
      <Petals count={12} className="opacity-60" />
      <img
        src={bloom.url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-16 hidden w-[28rem] opacity-25 mix-blend-screen sm:block"
      />

      <div
        className="story-frame"
        onPointerDown={(e) => {
          if (!started || isUi(e.target)) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          press.current = { x: e.clientX, y: e.clientY, t: performance.now() };
          heldRef.current = false;
          holdTimer.current = window.setTimeout(() => {
            heldRef.current = true;
            setHolding(true);
          }, 260);
        }}
        onPointerUp={(e) => {
          const p = press.current;
          const held = heldRef.current;
          endPress();
          if (!p) return;
          const rect = e.currentTarget.getBoundingClientRect();
          step(
            gestureStep({
              dx: e.clientX - p.x,
              dy: e.clientY - p.y,
              ms: performance.now() - p.t,
              relX: (p.x - rect.left) / rect.width,
              held,
            }),
          );
        }}
        onPointerCancel={endPress}
      >
        <div className="story-stage">
          {layers.map(({ i, role }) => (
            <Leaf
              key={STORIES[i]!.id}
              role={role}
              rot={rot}
              frontShade={frontShade}
              backShade={backShade}
              backOpacity={backOpacity}
              underShadow={underShadow}
            >
              {STORIES[i]!.render({ visible: visible(i), guest, onReplay })}
            </Leaf>
          ))}
        </div>

        {/* Story chrome: progress bars + header, like Facebook stories */}
        <motion.header
          className={`story-chrome ${onPhoto ? "text-primary-foreground" : "text-primary"}`}
          animate={{ opacity: holding ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-[0.25em]" aria-label={`Trang ${shown + 1} / ${count}`}>
            {STORIES.map((s, i) => (
              <span
                key={s.id}
                className={`relative h-[0.17em] min-h-[2px] flex-1 overflow-hidden rounded-full transition-colors duration-700 ${onPhoto ? "bg-primary-foreground/35" : "bg-primary/20"}`}
              >
                {i === shown ? (
                  <motion.span
                    className={`absolute inset-0 origin-left rounded-full ${onPhoto ? "bg-primary-foreground" : "bg-primary"}`}
                    style={{ scaleX: progress }}
                  />
                ) : (
                  <span
                    className={`absolute inset-0 origin-left rounded-full ${onPhoto ? "bg-primary-foreground" : "bg-primary"}`}
                    style={{ transform: `scaleX(${i < shown ? 1 : 0})` }}
                  />
                )}
              </span>
            ))}
          </div>
          <div className="mt-[0.75em] flex items-center gap-[0.6em]">
            <span className="grid size-[2.5em] shrink-0 place-items-center rounded-full bg-card ring-1 ring-gold">
              <img src={logoAsset.url} alt="" className="w-[1.35em]" draggable={false} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-names text-[1.35em] leading-[1.3]">
                {WEDDING.bride} &amp; {WEDDING.groom}
              </p>
              <p className="truncate text-eyebrow text-[0.58em] tracking-[0.22em] opacity-80">
                {STORIES[shown]!.label}
              </p>
            </div>
            <ChromeButton label={paused ? "Tiếp tục" : "Tạm dừng"} onClick={() => setPaused((p) => !p)}>
              {paused ? <Play className="size-[1.15em]" /> : <Pause className="size-[1.15em]" />}
            </ChromeButton>
            <ChromeButton label={playing ? "Tắt nhạc" : "Bật nhạc"} onClick={toggle} musicToggle>
              {playing ? <Music2 className="size-[1.15em] animate-pulse" /> : <VolumeX className="size-[1.15em]" />}
            </ChromeButton>
          </div>
        </motion.header>

        {/* Desktop arrows beside the frame */}
        <button
          type="button"
          aria-label="Trang trước"
          onClick={() => step(-1)}
          disabled={shown === 0}
          className="story-arrow -left-16"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Trang sau"
          onClick={() => step(1)}
          disabled={shown === count - 1}
          className="story-arrow -right-16"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

function ChromeButton({
  label,
  onClick,
  musicToggle,
  children,
}: {
  label: string;
  onClick: () => void;
  musicToggle?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-music-toggle={musicToggle ? "" : undefined}
      onClick={onClick}
      className="grid size-[2.2em] shrink-0 place-items-center rounded-full transition-colors hover:bg-current/10"
    >
      {children}
    </button>
  );
}

function Leaf({
  role,
  rot,
  frontShade,
  backShade,
  backOpacity,
  underShadow,
  children,
}: {
  role: Role;
  rot: MotionValue<number>;
  frontShade: MotionValue<number>;
  backShade: MotionValue<number>;
  backOpacity: MotionValue<number>;
  underShadow: MotionValue<number>;
  children: ReactNode;
}) {
  const turning = role === "turn";
  return (
    <motion.div
      className="story-leaf"
      data-role={role}
      aria-hidden={role === "idle" || undefined}
      style={{ rotateY: turning ? rot : 0, zIndex: turning ? 2 : role === "idle" ? 0 : 1 }}
    >
      <div className="story-face">
        {children}
        {turning && <motion.div className="story-shade-front" style={{ opacity: frontShade }} />}
        {role === "under" && <motion.div className="story-under-shadow" style={{ opacity: underShadow }} />}
      </div>
      {turning && (
        <motion.div className="story-face story-face-back" style={{ opacity: backOpacity }}>
          <PageBack />
          <motion.div className="story-shade-back" style={{ opacity: backShade }} />
        </motion.div>
      )}
    </motion.div>
  );
}
