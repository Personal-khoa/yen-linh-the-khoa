import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import pond from "@/assets/couple-lotus-pond.jpg";
import hands from "@/assets/couple-hands-lotus.jpg";
import halong from "@/assets/couple-halong-bay.jpg";
import hall from "@/assets/couple-arched-hall.jpg";
import boat from "@/assets/couple-boat-dawn.jpg";
import aodai from "@/assets/couple-ao-dai-red.jpg";
import { Ornament } from "./Petals";

type Photo = { src: string; alt: string; w: number; h: number; caption: string };

const PHOTOS: Photo[] = [
  { src: pond, alt: "Cô dâu chú rể bên hồ sen", w: 1024, h: 1536, caption: "Bên hồ sen" },
  { src: halong, alt: "Cô dâu chú rể trên đỉnh núi nhìn vịnh Hạ Long", w: 1536, h: 1024, caption: "Hạ Long hoàng hôn" },
  { src: hands, alt: "Đôi bàn tay với nhẫn cưới và đoá sen", w: 1024, h: 1280, caption: "Trao nhau lời hứa" },
  { src: aodai, alt: "Cô dâu chú rể trong áo dài đỏ", w: 1024, h: 1536, caption: "Áo dài ngày cưới" },
  { src: boat, alt: "Cô dâu chú rể trên thuyền giữa đầm sen", w: 1024, h: 1280, caption: "Sương sớm" },
  { src: hall, alt: "Cô dâu chú rể trong sảnh vòm", w: 1024, h: 1536, caption: "Mãi bên nhau" },
];

// Each tile enters with its own movement.
const ENTRANCES: Variants[] = [
  { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } },
  { hidden: { opacity: 0, x: 60, rotate: 3 }, show: { opacity: 1, x: 0, rotate: 0 } },
  { hidden: { opacity: 0, filter: "blur(14px)" }, show: { opacity: 1, filter: "blur(0px)" } },
  { hidden: { opacity: 0, y: -50, rotate: -3 }, show: { opacity: 1, y: 0, rotate: 0 } },
];

function Slideshow({ onOpen }: { onOpen: (i: number) => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % PHOTOS.length), 5200);
    return () => window.clearInterval(id);
  }, []);
  const p = PHOTOS[i];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -inset-3 rounded-t-full border border-gold/50" />
      <button
        type="button"
        onClick={() => onOpen(i)}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-t-full bg-blush shadow-card"
        aria-label={`Xem ảnh: ${p.caption}`}
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={p.src}
            src={p.src}
            alt={p.alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1.04, x: i % 2 ? "-2%" : "2%" }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 6.5, ease: "linear" }, x: { duration: 6.5 } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-veil" />
        <AnimatePresence mode="wait">
          <motion.p
            key={p.caption}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-x-0 bottom-8 text-center font-script text-4xl text-primary-foreground"
          >
            {p.caption}
          </motion.p>
        </AnimatePresence>
      </button>
      <div className="mt-6 flex justify-center gap-2">
        {PHOTOS.map((_, k) => (
          <button
            key={k}
            type="button"
            aria-label={`Ảnh ${k + 1}`}
            onClick={() => setI(k)}
            className={`h-1.5 rounded-full transition-all duration-700 ${k === i ? "w-8 bg-primary" : "w-1.5 bg-primary/30"}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Lightbox({ index, onClose, onNav }: { index: number; onClose: () => void; onNav: (d: number) => void }) {
  const p = PHOTOS[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/90 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button type="button" aria-label="Đóng" onClick={onClose} className="absolute right-5 top-5 text-primary-foreground">
        <X className="h-7 w-7" />
      </button>
      <button
        type="button"
        aria-label="Ảnh trước"
        onClick={(e) => {
          e.stopPropagation();
          onNav(-1);
        }}
        className="absolute left-3 z-10 hidden text-primary-foreground sm:block"
      >
        <ChevronLeft className="h-9 w-9" />
      </button>
      <AnimatePresence mode="wait">
        <motion.figure
          key={p.src}
          className="flex max-h-full flex-col items-center"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.5 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) onNav(1);
            else if (info.offset.x > 60) onNav(-1);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={p.src} alt={p.alt} className="max-h-[80svh] w-auto object-contain shadow-card" draggable={false} />
          <figcaption className="mt-4 font-script text-3xl text-primary-foreground">{p.caption}</figcaption>
        </motion.figure>
      </AnimatePresence>
      <button
        type="button"
        aria-label="Ảnh sau"
        onClick={(e) => {
          e.stopPropagation();
          onNav(1);
        }}
        className="absolute right-3 z-10 hidden text-primary-foreground sm:block"
      >
        <ChevronRight className="h-9 w-9" />
      </button>
    </motion.div>
  );
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const nav = useCallback((d: number) => setOpen((v) => (v == null ? v : (v + d + PHOTOS.length) % PHOTOS.length)), []);

  return (
    <section id="album" className="relative overflow-hidden bg-paper px-5 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1 }}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <p className="text-eyebrow text-muted-foreground">Album ảnh cưới</p>
        <h2 className="mt-3 font-script text-6xl text-primary sm:text-7xl">Khoảnh khắc yêu thương</h2>
        <div className="mt-6">
          <Ornament />
        </div>
      </motion.div>

      <Slideshow onOpen={setOpen} />

      <div className="mx-auto mt-24 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {PHOTOS.map((p, k) => {
          const wide = p.w > p.h;
          return (
            <motion.button
              key={p.src}
              type="button"
              onClick={() => setOpen(k)}
              variants={ENTRANCES[k % ENTRANCES.length]}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: (k % 3) * 0.12 }}
              className={`group relative overflow-hidden bg-blush shadow-soft ${
                wide ? "col-span-2 aspect-[3/2]" : k % 3 === 1 ? "aspect-[3/4] sm:row-span-2 sm:aspect-auto" : "aspect-[3/4]"
              }`}
              aria-label={`Xem ảnh: ${p.caption}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-veil opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <span className="absolute inset-3 border border-primary-foreground/0 transition-colors duration-700 group-hover:border-primary-foreground/60" />
              <span className="absolute inset-x-0 bottom-4 flex translate-y-4 flex-col items-center opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                <Heart className="h-4 w-4 text-primary-foreground" />
                <span className="mt-1 font-script text-2xl text-primary-foreground">{p.caption}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>{open != null && <Lightbox index={open} onClose={() => setOpen(null)} onNav={nav} />}</AnimatePresence>
    </section>
  );
}
