import { motion } from "motion/react";
import logoAsset from "@/assets/logo-lk.png.asset.json";
import bloom from "@/assets/lotus-bloom.png.asset.json";
import { WEDDING } from "./wedding-data";
import { Ornament, Petals } from "./Petals";

export function Closing() {
  return (
    <footer className="relative overflow-hidden bg-cover-gradient px-6 pb-28 pt-24 text-center">
      <Petals count={8} />
      <img
        src={bloom.url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 w-48 rotate-[-8deg] opacity-40 sm:w-72"
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-xl"
      >
        <img src={logoAsset.url} alt="Logo L&K" className="mx-auto w-20" />
        <p className="mt-8 font-script text-5xl text-primary sm:text-6xl">Trân trọng cảm ơn</p>
        <div className="mt-6">
          <Ornament />
        </div>
        <p className="mt-6 text-lg leading-relaxed text-foreground/80">
          Rất hân hạnh được đón tiếp Quý khách trong ngày vui của chúng tôi.
        </p>
        <p className="mt-8 text-eyebrow text-primary">
          {WEDDING.bride} &amp; {WEDDING.groom} · {WEDDING.dateDisplay.day}.{WEDDING.dateDisplay.month}.
          {WEDDING.dateDisplay.year}
        </p>
        <p className="mt-10 text-xs text-muted-foreground">
          Nhạc nền: “Canon in D Major” – Kevin MacLeod (incompetech.com), CC BY 3.0
        </p>
      </motion.div>
    </footer>
  );
}
