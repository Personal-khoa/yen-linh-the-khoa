import { useEffect, useState, type ReactNode } from "react";
import { motion, type TargetAndTransition, type Variants } from "motion/react";
import { MapPin, RotateCcw } from "lucide-react";
import logoAsset from "@/assets/logo-lk.png.asset.json";
import leafTop from "@/assets/lotus-leaf-top.png.asset.json";
import leafBottom from "@/assets/lotus-leaf-bottom.png.asset.json";
import bloom from "@/assets/lotus-bloom.png.asset.json";
import pond from "@/assets/couple-lotus-pond.jpg";
import hands from "@/assets/couple-hands-lotus.jpg";
import halong from "@/assets/couple-halong-bay.jpg";
import hall from "@/assets/couple-arched-hall.jpg";
import boat from "@/assets/couple-boat-dawn.jpg";
import aodai from "@/assets/couple-ao-dai-red.jpg";
import { WEDDING, getCountdown, type Countdown } from "../wedding-data";
import { Ornament, Petals } from "../Petals";

export type StoryCtx = { visible: boolean; guest?: string | undefined; onReplay: () => void };
export type Story = {
  id: string;
  label: string;
  tone: "paper" | "photo";
  seconds: number;
  render: (ctx: StoryCtx) => ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;
const stagger: Variants = { hide: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.3 } } };
const rise: Variants = {
  hide: { opacity: 0, y: 18, filter: "blur(5px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: EASE } },
};
const pop: Variants = {
  hide: { opacity: 0, scale: 0.75, filter: "blur(8px)" },
  show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1.5, ease: EASE } },
};

const CONTENT =
  "relative z-10 flex h-full flex-col items-center justify-center px-[2.1em] pb-[3.2em] pt-[4.6em] text-center";

function Deco({
  src,
  className,
  from,
  visible,
  delay = 0.3,
}: {
  src: string;
  className: string;
  from: TargetAndTransition;
  visible: boolean;
  delay?: number;
}) {
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none absolute ${className}`}
      initial={from}
      animate={visible ? { opacity: 0.65, x: 0, y: 0, rotate: 0 } : from}
      transition={{ duration: 1.8, ease: EASE, delay }}
    />
  );
}

/* ---------- 1 · Lời mời ---------- */
function LetterPage({ visible, guest }: StoryCtx) {
  return (
    <div className="story-page bg-paper">
      <Petals count={7} />
      <Deco src={leafTop.url} visible={visible} className="-right-[2.4em] -top-[0.6em] w-[12em]" from={{ opacity: 0, x: 30, rotate: 8 }} />
      <Deco src={leafBottom.url} visible={visible} delay={0.5} className="-bottom-[1em] -left-[2.4em] w-[12em]" from={{ opacity: 0, x: -30, rotate: -8 }} />
      <motion.div variants={stagger} initial="hide" animate={visible ? "show" : "hide"} className={CONTENT}>
        <motion.div variants={pop} className="relative grid aspect-square w-[7.6em] place-items-center">
          <span className="absolute inset-0 rounded-full border border-gold/60" />
          <span className="absolute -inset-[0.7em] rounded-full border border-gold/25" />
          <img src={logoAsset.url} alt="Logo Yến Linh & Thế Khoa" className="relative w-[4.2em]" draggable={false} />
        </motion.div>
        <motion.p variants={rise} className="mt-[2.6em] text-eyebrow text-[0.7em] text-muted-foreground">
          Trân trọng kính mời
        </motion.p>
        <motion.p variants={rise} className="mt-[0.2em] font-script text-[2.4em] leading-tight text-primary">
          {guest ?? "Quý khách thân mến"}
        </motion.p>
        <motion.div variants={rise} className="mt-[0.9em]">
          <Ornament />
        </motion.div>
        <motion.p variants={rise} className="mt-[1.1em] text-[1.05em] leading-relaxed text-foreground/85">
          Trong niềm hạnh phúc ngập tràn, gia đình chúng tôi trân trọng kính mời Quý khách tới dự bữa tiệc mừng{" "}
          <em className="text-primary">lễ vu quy</em> của hai con – cùng chứng kiến và chúc phúc cho một khởi đầu mới.
        </motion.p>
        <motion.div variants={rise} className="mt-[1.3em] flex flex-col items-center text-primary">
          <span className="font-names text-[2.5em] leading-[1.25]">{WEDDING.bride}</span>
          <span className="font-script text-[1.5em] leading-none text-gold">&amp;</span>
          <span className="font-names text-[2.5em] leading-[1.25]">{WEDDING.groom}</span>
        </motion.div>
      </motion.div>
      <motion.p
        className="absolute inset-x-0 bottom-[1.4em] z-10 text-center text-eyebrow text-[0.62em] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: [0.3, 0.9, 0.3] } : { opacity: 0 }}
        transition={{ duration: 2.6, repeat: Infinity, delay: 2.4 }}
      >
        Chạm bên phải để lật trang ›
      </motion.p>
    </div>
  );
}

/* ---------- 2 · Hôn lễ ---------- */
function DetailsPage({ visible }: StoryCtx) {
  const side = "text-eyebrow text-[0.6em] tracking-[0.18em] text-muted-foreground";
  return (
    <div className="story-page bg-paper-blush">
      <Deco src={leafTop.url} visible={visible} className="-right-[2em] -top-[0.4em] w-[10em] animate-float-slow" from={{ opacity: 0, y: -20 }} />
      <Deco src={bloom.url} visible={visible} delay={0.6} className="-bottom-[0.6em] -left-[1.6em] w-[11em]" from={{ opacity: 0, x: -30, rotate: -6 }} />
      <motion.div variants={stagger} initial="hide" animate={visible ? "show" : "hide"} className={CONTENT}>
        <motion.p variants={rise} className="text-eyebrow text-[0.66em] text-muted-foreground">
          Save the date
        </motion.p>
        <motion.h2 variants={rise} className="font-script text-[3em] leading-tight text-primary">
          {WEDDING.ceremony}
        </motion.h2>
        <motion.div variants={rise} className="mt-[0.4em]">
          <Ornament />
        </motion.div>

        <motion.div variants={pop} className="mt-[1.4em] flex items-center gap-[0.9em] text-primary">
          <div className="whitespace-nowrap text-right">
            <p className={side}>{WEDDING.weekday}</p>
            <p className={`mt-[0.8em] ${side}`}>{WEDDING.timeLabel}</p>
          </div>
          <div className="flex flex-col items-center border-x border-gold/60 px-[0.9em]">
            <span className="text-numeral text-[3.3em] leading-none">{WEDDING.dateDisplay.day}</span>
            <span className="text-numeral text-[2.7em] leading-none">{WEDDING.dateDisplay.month}</span>
            <span className="mt-[0.4em] h-px w-[2.6em] bg-primary/50" />
            <span className="text-numeral mt-[0.35em] text-[0.95em] tracking-[0.3em]">{WEDDING.dateDisplay.year}</span>
          </div>
          <div className="whitespace-nowrap text-left">
            <p className={side}>Tháng</p>
            <p className={`mt-[0.8em] ${side}`}>Mười hai</p>
          </div>
        </motion.div>
        <motion.p variants={rise} className="mt-[0.9em] text-[0.95em] italic text-muted-foreground">
          {WEDDING.lunar}
        </motion.p>

        <motion.p variants={rise} className="mt-[1.6em] text-eyebrow text-[0.62em] text-muted-foreground">
          Hôn lễ được tổ chức tại
        </motion.p>
        <motion.p variants={rise} className="mt-[0.5em] text-[1.08em] text-foreground">
          {WEDDING.venue.hall}
        </motion.p>
        <motion.p
          variants={rise}
          className="mt-[0.1em] text-balance text-[1.2em] font-semibold uppercase leading-snug tracking-[0.12em] text-primary"
        >
          {WEDDING.venue.name}
        </motion.p>
        <motion.div variants={rise} className="my-[0.7em] w-[8em] border-t border-dotted border-primary/40" />
        <motion.div variants={rise}>
          {WEDDING.venue.address.map((l) => (
            <p key={l} className="text-[0.92em] leading-snug text-foreground/80">
              {l}
            </p>
          ))}
        </motion.div>
        <motion.div variants={rise} className="mt-[1.4em] flex flex-wrap justify-center gap-[0.6em]">
          <a href={WEDDING.venue.mapUrl} target="_blank" rel="noreferrer" className="btn-story-solid">
            <MapPin className="size-[1.2em]" /> Chỉ đường
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- 3 · Hai gia đình & đếm ngược ---------- */
function CountdownRow({ visible }: { visible: boolean }) {
  const [c, setC] = useState<Countdown | null>(null);
  useEffect(() => {
    if (!visible) return;
    const tick = () => setC(getCountdown(WEDDING.dateISO, new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [visible]);

  if (c?.done) return <p className="font-script text-[2.2em] text-primary">Ngày vui đã đến!</p>;
  const cells: [string, number | undefined][] = [
    ["Ngày", c?.days],
    ["Giờ", c?.hours],
    ["Phút", c?.minutes],
    ["Giây", c?.seconds],
  ];
  return (
    <div className="grid grid-cols-4 gap-[0.5em]">
      {cells.map(([label, v]) => (
        <div key={label} className="flex w-[3.7em] flex-col items-center border border-border bg-card/70 py-[0.55em]">
          <motion.span
            key={v}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-numeral text-[1.7em] leading-none text-primary"
          >
            {v == null ? "--" : String(v).padStart(2, "0")}
          </motion.span>
          <span className="mt-[0.5em] text-eyebrow text-[0.55em] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

function FamilyPage({ visible }: StoryCtx) {
  return (
    <div className="story-page bg-paper">
      <Petals count={6} />
      <Deco src={bloom.url} visible={visible} className="-right-[2.6em] -top-[0.4em] w-[10em] -scale-x-100" from={{ opacity: 0, y: -24 }} />
      <Deco src={leafBottom.url} visible={visible} delay={0.5} className="-bottom-[1.2em] -left-[2em] w-[10em] animate-sway" from={{ opacity: 0, x: -24 }} />
      <motion.div variants={stagger} initial="hide" animate={visible ? "show" : "hide"} className={CONTENT}>
        <motion.p variants={rise} className="text-eyebrow text-[0.66em] text-muted-foreground">
          Hai gia đình
        </motion.p>
        <motion.div variants={rise} className="mt-[1.2em] grid w-full grid-cols-2 gap-[1em]">
          {[WEDDING.brideFamily, WEDDING.groomFamily].map((f) => (
            <div key={f.label}>
              <p className="text-eyebrow text-[0.7em] text-primary">{f.label}</p>
              <span className="mx-auto mt-[0.6em] block gold-line w-[3.5em]" />
              {f.parents.map((p) => (
                <p key={p} className="mt-[0.45em] text-[0.98em] leading-snug text-foreground/85">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </motion.div>

        <motion.div variants={pop} className="mt-[1.6em] flex flex-col items-center text-primary">
          <span className="font-names text-[3em] leading-[1.25]">{WEDDING.bride}</span>
          <span className="font-script text-[1.8em] leading-none text-gold">&amp;</span>
          <span className="font-names text-[3em] leading-[1.25]">{WEDDING.groom}</span>
        </motion.div>
        <motion.div variants={rise} className="mt-[0.8em]">
          <Ornament />
        </motion.div>

        <motion.p variants={rise} className="mt-[1.4em] text-eyebrow text-[0.62em] text-muted-foreground">
          Đếm ngược đến ngày vui
        </motion.p>
        <motion.div variants={rise} className="mt-[0.8em]">
          <CountdownRow visible={visible} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- 4 · Album ---------- */
type Photo = { src: string; alt: string; caption: string };
export const PHOTOS: Photo[] = [
  { src: pond, alt: "Cô dâu chú rể bên hồ sen", caption: "Bên hồ sen" },
  { src: halong, alt: "Cô dâu chú rể trên đỉnh núi nhìn vịnh Hạ Long", caption: "Hạ Long hoàng hôn" },
  { src: hands, alt: "Đôi bàn tay với nhẫn cưới và đoá sen", caption: "Trao nhau lời hứa" },
  { src: aodai, alt: "Cô dâu chú rể trong áo dài đỏ", caption: "Áo dài ngày cưới" },
  { src: boat, alt: "Cô dâu chú rể trên thuyền giữa đầm sen", caption: "Sương sớm" },
  { src: hall, alt: "Cô dâu chú rể trong sảnh vòm", caption: "Mãi bên nhau" },
];

// Each photo moves differently: zoom out, pan, zoom in, drift, tilt, glide.
const KEN_BURNS: { from: TargetAndTransition; to: TargetAndTransition }[] = [
  { from: { scale: 1.22, y: "3%" }, to: { scale: 1.04, y: "-1%" } },
  { from: { scale: 1.06, objectPosition: "15% 50%" }, to: { scale: 1.06, objectPosition: "85% 50%" } },
  { from: { scale: 1.02 }, to: { scale: 1.22 } },
  { from: { scale: 1.16, x: "-4%" }, to: { scale: 1.16, x: "4%" } },
  { from: { scale: 1.26, rotate: -1.5 }, to: { scale: 1.06, rotate: 0.5 } },
  { from: { scale: 1.12, y: "-4%" }, to: { scale: 1.12, y: "4%" } },
];

const CAPTION_IN: Variants[] = [
  { hide: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } },
  { hide: { opacity: 0, letterSpacing: "0.25em" }, show: { opacity: 1, letterSpacing: "0em" } },
  { hide: { opacity: 0, filter: "blur(12px)" }, show: { opacity: 1, filter: "blur(0px)" } },
  { hide: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
  { hide: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } },
  { hide: { opacity: 0, y: -24 }, show: { opacity: 1, y: 0 } },
];

function PhotoPage({ visible, photo, i, seconds }: StoryCtx & { photo: Photo; i: number; seconds: number }) {
  const ken = KEN_BURNS[i % KEN_BURNS.length]!;
  const caption = CAPTION_IN[i % CAPTION_IN.length]!;
  return (
    <div className="story-page bg-foreground">
      <motion.img
        src={photo.src}
        alt={photo.alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        initial={ken.from}
        animate={visible ? ken.to : ken.from}
        transition={{ duration: seconds + 1.5, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-story-scrim" />
      <motion.div
        variants={stagger}
        initial="hide"
        animate={visible ? "show" : "hide"}
        className="absolute inset-x-0 bottom-[3em] z-10 flex flex-col items-center px-[2em] text-center text-primary-foreground"
      >
        <motion.p variants={rise} className="text-eyebrow text-[0.62em] opacity-85">
          {ALBUM_TITLE} · {String(i + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}
        </motion.p>
        <motion.p
          variants={{
            hide: caption["hide"]!,
            show: { ...(caption["show"] as object), transition: { duration: 1.3, ease: EASE } },
          }}
          className="mt-[0.3em] font-script text-[2.8em] leading-tight"
        >
          {photo.caption}
        </motion.p>
        <motion.span variants={rise} className="mt-[0.5em] block gold-line w-[6em]" />
      </motion.div>
    </div>
  );
}

/* ---------- 5 · Cảm ơn ---------- */
function ThanksPage({ visible, onReplay }: StoryCtx) {
  return (
    <div className="story-page bg-paper-blush">
      <Petals count={10} />
      <Deco src={bloom.url} visible={visible} className="-bottom-[0.4em] -right-[2em] w-[12em] -rotate-6" from={{ opacity: 0, y: 30 }} />
      <Deco src={leafTop.url} visible={visible} delay={0.5} className="-left-[2.4em] -top-[0.4em] w-[10em] -scale-x-100" from={{ opacity: 0, y: -24 }} />
      <motion.div variants={stagger} initial="hide" animate={visible ? "show" : "hide"} className={CONTENT}>
        <motion.img variants={pop} src={logoAsset.url} alt="Logo L&K" className="w-[4.6em]" draggable={false} />
        <motion.p variants={rise} className="mt-[0.3em] font-script text-[3.1em] leading-tight text-primary">
          Lời cảm ơn
        </motion.p>
        <motion.div variants={rise} className="mt-[0.6em]">
          <Ornament />
        </motion.div>
        <motion.p variants={rise} className="mt-[1.2em] text-[1.05em] italic leading-relaxed text-foreground/85">
          “Sự hiện diện cùng những lời chúc tốt đẹp nhất của người thân thương sẽ là món quà vô giá và ý nghĩa đối
          với hai gia đình trong ngày trọng đại này.”
        </motion.p>
        <motion.p variants={rise} className="mt-[1.4em] font-names text-[2em] leading-tight text-primary">
          {WEDDING.bride} &amp; {WEDDING.groom}
        </motion.p>
        <motion.p variants={rise} className="mt-[0.3em] text-eyebrow text-[0.66em] text-primary">
          {WEDDING.dateDisplay.day} . {WEDDING.dateDisplay.month} . {WEDDING.dateDisplay.year}
        </motion.p>
        <motion.div variants={rise} className="mt-[1.6em]">
          <button type="button" onClick={onReplay} className="btn-story">
            <RotateCcw className="size-[1.2em]" /> Xem lại thiệp
          </button>
        </motion.div>
        <motion.p variants={rise} className="mt-[1.4em] text-[0.62em] text-muted-foreground">
          Nhạc nền: “Canon in D Major” – Kevin MacLeod (incompetech.com), CC BY 3.0
        </motion.p>
      </motion.div>
    </div>
  );
}

/** Back side of a page while it is being turned. */
export function PageBack() {
  return (
    <div className="story-page bg-paper-blush">
      <img
        src={logoAsset.url}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute left-1/2 top-1/2 w-[7em] -translate-x-1/2 -translate-y-1/2 opacity-15"
      />
    </div>
  );
}

const PHOTO_SECONDS = 6;
const ALBUM_TITLE = "The beginning of always";

export const STORIES: Story[] = [
  { id: "loi-moi", label: "Lời mời", tone: "paper", seconds: 11, render: (c) => <LetterPage {...c} /> },
  { id: "hon-le", label: "Hôn lễ", tone: "paper", seconds: 13, render: (c) => <DetailsPage {...c} /> },
  { id: "gia-dinh", label: "Hai gia đình", tone: "paper", seconds: 11, render: (c) => <FamilyPage {...c} /> },
  ...PHOTOS.map(
    (p, i): Story => ({
      id: `anh-${i + 1}`,
      label: ALBUM_TITLE,
      tone: "photo",
      seconds: PHOTO_SECONDS,
      render: (c) => <PhotoPage {...c} photo={p} i={i} seconds={PHOTO_SECONDS} />,
    }),
  ),
  { id: "cam-on", label: "Lời cảm ơn", tone: "paper", seconds: 12, render: (c) => <ThanksPage {...c} /> },
];
