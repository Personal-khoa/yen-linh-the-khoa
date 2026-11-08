import { motion, type Variants } from "motion/react";
import { ChevronDown } from "lucide-react";
import logoAsset from "@/assets/logo-lk.png.asset.json";
import leafTop from "@/assets/lotus-leaf-top.png.asset.json";
import leafBottom from "@/assets/lotus-leaf-bottom.png.asset.json";
import { WEDDING } from "./wedding-data";
import { Ornament } from "./Petals";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.3 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

export function InvitationLetter({ revealed, guest }: { revealed: boolean; guest?: string }) {
  return (
    <section
      id="loi-moi"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-paper px-6 py-20"
    >
      <motion.img
        src={leafTop.url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-4 w-44 opacity-60 sm:w-64"
        initial={{ opacity: 0, x: 40, rotate: 8 }}
        animate={revealed ? { opacity: 0.6, x: 0, rotate: 0 } : {}}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      />
      <motion.img
        src={leafBottom.url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -left-6 w-44 opacity-60 sm:w-64"
        initial={{ opacity: 0, x: -40, rotate: -8 }}
        animate={revealed ? { opacity: 0.6, x: 0, rotate: 0 } : {}}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
      />

      <motion.div
        className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate={revealed ? "show" : "hidden"}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.7, filter: "blur(10px)" },
            show: {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="relative"
        >
          <span className="absolute inset-0 -m-6 rounded-full border border-gold/40" />
          <span className="absolute inset-0 -m-10 rounded-full border border-gold/20" />
          <img src={logoAsset.url} alt="Logo Yến Linh & Thế Khoa" className="relative w-32 sm:w-40" />
        </motion.div>

        <motion.p variants={item} className="mt-16 text-eyebrow text-muted-foreground">
          Trân trọng kính mời
        </motion.p>

        {guest ? (
          <motion.p variants={item} className="mt-3 font-script text-5xl text-primary sm:text-6xl">
            {guest}
          </motion.p>
        ) : (
          <motion.p variants={item} className="mt-3 font-script text-5xl text-primary sm:text-6xl">
            Quý khách thân mến
          </motion.p>
        )}

        <motion.div variants={item} className="mt-8">
          <Ornament />
        </motion.div>

        <motion.p variants={item} className="mt-8 text-lg leading-relaxed text-foreground/85 sm:text-xl">
          Có những khoảnh khắc trong đời chỉ đến một lần, và chúng tôi mong được
          chia sẻ khoảnh khắc ấy cùng những người thân yêu nhất.
        </motion.p>
        <motion.p variants={item} className="mt-5 text-lg leading-relaxed text-foreground/85 sm:text-xl">
          Trong niềm hạnh phúc ngập tràn, gia đình chúng tôi trân trọng kính mời
          Quý khách tới dự bữa tiệc mừng <em className="text-primary">lễ vu quy</em> của
          hai con — cùng chứng kiến và chúc phúc cho một khởi đầu mới.
        </motion.p>

        <motion.div variants={item} className="mt-12 flex items-center gap-4 text-primary">
          <span className="font-script text-4xl sm:text-5xl">{WEDDING.bride}</span>
          <span className="font-script text-3xl text-gold">&amp;</span>
          <span className="font-script text-4xl sm:text-5xl">{WEDDING.groom}</span>
        </motion.div>

        <motion.a
          variants={item}
          href="#thong-tin"
          className="mt-14 flex flex-col items-center gap-1 text-eyebrow text-muted-foreground"
        >
          Thông tin hôn lễ
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}
