import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { CalendarHeart, MapPin } from "lucide-react";
import bloom from "@/assets/lotus-bloom.png.asset.json";
import leafTop from "@/assets/lotus-leaf-top.png.asset.json";
import { WEDDING, getCountdown, googleCalendarUrl, type Countdown } from "./wedding-data";
import { Ornament } from "./Petals";

const rise: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

function CountdownRow() {
  const [c, setC] = useState<Countdown | null>(null);
  useEffect(() => {
    const tick = () => setC(getCountdown(WEDDING.dateISO, new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (c?.done) {
    return <p className="font-script text-4xl text-primary">Ngày vui đã đến!</p>;
  }
  const cells: [string, number | undefined][] = [
    ["Ngày", c?.days],
    ["Giờ", c?.hours],
    ["Phút", c?.minutes],
    ["Giây", c?.seconds],
  ];
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-5">
      {cells.map(([label, v]) => (
        <div
          key={label}
          className="flex w-[4.4rem] flex-col items-center border border-border bg-card/70 py-3 sm:w-24 sm:py-4"
        >
          <motion.span
            key={v}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-numeral text-3xl text-primary sm:text-4xl"
          >
            {v == null ? "--" : String(v).padStart(2, "0")}
          </motion.span>
          <span className="mt-1 text-eyebrow text-[0.62rem] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function WeddingDetails() {
  return (
    <section id="thong-tin" className="relative overflow-hidden bg-section-blush px-5 py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="mx-auto mb-14 max-w-2xl text-center"
      >
        <motion.p variants={rise} className="text-eyebrow text-muted-foreground">
          Save the date
        </motion.p>
        <motion.h2 variants={rise} className="mt-3 font-script text-6xl text-primary sm:text-7xl">
          {WEDDING.ceremony}
        </motion.h2>
        <motion.div variants={rise} className="mt-6">
          <Ornament />
        </motion.div>
      </motion.div>

      {/* The printed card, re-imagined */}
      <motion.article
        initial={{ opacity: 0, y: 60, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1200 }}
        className="relative mx-auto max-w-3xl overflow-hidden bg-paper shadow-card"
      >
        <img
          src={leafTop.url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-2 w-40 opacity-70 animate-float-slow sm:w-56"
        />
        <img
          src={bloom.url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-2 -left-2 w-40 opacity-80 animate-sway sm:w-60"
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative z-10 flex flex-col items-center px-6 py-16 text-center sm:px-16 sm:py-20"
        >
          {/* Date block, as on the back of the card */}
          <motion.div variants={rise} className="flex items-center gap-4 text-primary sm:gap-10">
            <div className="whitespace-nowrap text-right">
              <p className="text-eyebrow text-[0.68rem] tracking-[0.2em] text-muted-foreground sm:text-xs">
                {WEDDING.weekday}
              </p>
              <p className="mt-2 text-eyebrow text-[0.68rem] tracking-[0.2em] text-muted-foreground sm:text-xs">
                {WEDDING.timeLabel}
              </p>
            </div>
            <div className="flex flex-col items-center border-x border-gold/60 px-5 sm:px-10">
              <span className="text-numeral text-6xl leading-none sm:text-7xl">{WEDDING.dateDisplay.day}</span>
              <span className="text-numeral text-5xl leading-none sm:text-6xl">{WEDDING.dateDisplay.month}</span>
              <span className="mt-2 h-px w-12 bg-primary/50" />
              <span className="text-numeral mt-2 text-lg tracking-[0.3em]">{WEDDING.dateDisplay.year}</span>
            </div>
            <div className="whitespace-nowrap text-left">
              <p className="text-eyebrow text-[0.68rem] tracking-[0.2em] text-muted-foreground sm:text-xs">Tháng</p>
              <p className="mt-2 text-eyebrow text-[0.68rem] tracking-[0.2em] text-muted-foreground sm:text-xs">
                Mười hai
              </p>
            </div>
          </motion.div>

          <motion.p variants={rise} className="mt-6 italic text-muted-foreground">
            {WEDDING.lunar}
          </motion.p>

          <motion.div variants={rise} className="mt-10 text-primary">
            <p className="font-script text-6xl leading-tight sm:text-7xl">{WEDDING.bride}</p>
            <p className="font-script text-4xl text-gold">&amp;</p>
            <p className="font-script text-6xl leading-tight sm:text-7xl">{WEDDING.groom}</p>
          </motion.div>

          <motion.div variants={rise} className="mt-10 w-full max-w-md">
            <p className="text-eyebrow text-muted-foreground">Hôn lễ được tổ chức tại</p>
            <p className="mt-4 text-xl text-foreground">{WEDDING.venue.hall}</p>
            <p className="mt-1 text-2xl font-semibold uppercase tracking-[0.18em] text-primary sm:text-3xl">
              {WEDDING.venue.name}
            </p>
            <div className="mx-auto my-5 w-40 border-t border-dotted border-primary/40" />
            {WEDDING.venue.address.map((l) => (
              <p key={l} className="text-lg tracking-wide text-foreground/80">
                {l}
              </p>
            ))}
          </motion.div>

          <motion.div variants={rise} className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={WEDDING.venue.mapUrl} target="_blank" rel="noreferrer" className="btn-invite-solid">
              <MapPin className="h-4 w-4" /> Chỉ đường
            </a>
            <a href={googleCalendarUrl()} target="_blank" rel="noreferrer" className="btn-invite">
              <CalendarHeart className="h-4 w-4" /> Lưu vào lịch
            </a>
          </motion.div>

          <motion.div variants={rise} className="mt-14 grid w-full max-w-md grid-cols-2 gap-6">
            {[WEDDING.brideFamily, WEDDING.groomFamily].map((f) => (
              <div key={f.label}>
                <p className="text-eyebrow text-primary">{f.label}</p>
                <span className="mx-auto mt-3 block gold-line w-16" />
                {f.parents.map((p) => (
                  <p key={p} className="mt-2 text-lg text-foreground/85">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.article>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={stagger}
        className="mx-auto mt-20 flex max-w-2xl flex-col items-center text-center"
      >
        <motion.p variants={rise} className="text-eyebrow text-muted-foreground">
          Đếm ngược đến ngày vui
        </motion.p>
        <motion.div variants={rise} className="mt-6">
          <CountdownRow />
        </motion.div>
        <motion.p variants={rise} className="mt-12 max-w-lg text-lg italic leading-relaxed text-foreground/80 sm:text-xl">
          “Sự hiện diện cùng những lời chúc phúc tốt đẹp nhất của Quý khách sẽ là món quà vô giá
          và ý nghĩa đối với hai gia đình chúng tôi trong ngày trọng đại này!”
        </motion.p>
      </motion.div>
    </section>
  );
}
