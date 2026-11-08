import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronUp } from "lucide-react";
import sleeveAsset from "@/assets/cover-sleeve.png.asset.json";
import logoAsset from "@/assets/logo-lk.png.asset.json";
import { AUTO_OPEN_MS, WEDDING } from "./wedding-data";
import { Petals } from "./Petals";

type Phase = "idle" | "pulling" | "leaving";
const EASE = [0.65, 0, 0.35, 1] as const;

export function Cover({
  guest,
  onOpenStart,
  onReveal,
  onDone,
}: {
  guest?: string | undefined;
  /** Called synchronously inside the user gesture so music may start. */
  onOpenStart: () => void;
  /** Card is out of the sleeve; the cover starts fading into page 2. */
  onReveal: () => void;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const started = useRef(false);
  const touchY = useRef<number | null>(null);

  const open = useCallback(() => {
    if (started.current) return;
    started.current = true;
    onOpenStart();
    setPhase("pulling");
  }, [onOpenStart]);

  // Auto-pull the card if the guest doesn't interact.
  useEffect(() => {
    const t = window.setTimeout(open, AUTO_OPEN_MS);
    return () => window.clearTimeout(t);
  }, [open]);

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

  return (
    <motion.div
      role="dialog"
      aria-label="Bìa thiệp cưới"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-cover-gradient"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "leaving" ? 0 : 1 }}
      transition={{ duration: 1.1, ease: "easeInOut" }}
      onAnimationComplete={() => phase === "leaving" && onDone()}
      onClick={open}
      onTouchStart={(e) => (touchY.current = e.touches[0]?.clientY ?? null)}
      onTouchEnd={(e) => {
        const start = touchY.current;
        const end = e.changedTouches[0]?.clientY;
        if (start != null && end != null && start - end > 40) open();
      }}
    >
      <Petals count={14} />

      <motion.div
        className="cover-stage cursor-pointer"
        initial={{ opacity: 0, y: 40, scale: 0.94, rotate: -1.5 }}
        animate={
          phase === "idle"
            ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
            : { opacity: 1, y: "16%", scale: 0.96, rotate: 0 }
        }
        transition={{ duration: phase === "idle" ? 1.4 : 1.8, ease: phase === "idle" ? [0.22, 1, 0.36, 1] : EASE }}
      >
        <div className="cover-base" />

        {/* The white card that slides out of the lotus sleeve */}
        <motion.div
          className="cover-card"
          animate={
            phase === "idle"
              ? { y: ["0%", "-1.6%", "0%"] }
              : { y: "-58%", boxShadow: "var(--shadow-pull)" }
          }
          transition={
            phase === "idle"
              ? { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }
              : { duration: 1.9, ease: EASE }
          }
          onAnimationComplete={() => {
            if (phase === "pulling")
              window.setTimeout(() => {
                setPhase("leaving");
                onReveal();
              }, 250);
          }}
        >
          <img src={logoAsset.url} alt="Logo L&K" className="cover-card-logo" draggable={false} />
          <div className="cover-card-names">
            <p className="text-eyebrow" style={{ fontSize: "2.4cqw" }}>
              {WEDDING.ceremony}
            </p>
            <p className="font-script" style={{ fontSize: "9cqw", lineHeight: 1.15, marginTop: "2cqw" }}>
              {WEDDING.bride}
            </p>
            <p className="font-script" style={{ fontSize: "5cqw", lineHeight: 1 }}>
              &amp;
            </p>
            <p className="font-script" style={{ fontSize: "9cqw", lineHeight: 1.15 }}>
              {WEDDING.groom}
            </p>
            <p className="text-numeral" style={{ fontSize: "3.6cqw", marginTop: "2.4cqw", letterSpacing: "0.3em" }}>
              {WEDDING.dateDisplay.day} . {WEDDING.dateDisplay.month} . {WEDDING.dateDisplay.year}
            </p>
          </div>
        </motion.div>

        <img src={sleeveAsset.url} alt="" className="cover-sleeve" draggable={false} />

        <motion.button
          type="button"
          className="cover-cta"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: phase === "idle" ? 1 : 0, x: 0 }}
          transition={{ delay: phase === "idle" ? 1.2 : 0, duration: 0.8 }}
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
            transition={{ delay: 1.6, duration: 1 }}
          >
            {guest}
          </motion.span>
        )}
      </motion.div>

      <motion.p
        className="mt-5 flex items-center gap-2 text-eyebrow text-primary/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "idle" ? [0.35, 0.9, 0.35] : 0 }}
        transition={phase === "idle" ? { duration: 2.8, repeat: Infinity, delay: 2 } : { duration: 0.4 }}
      >
        Vuốt lên để mở thiệp
      </motion.p>
    </motion.div>
  );
}
