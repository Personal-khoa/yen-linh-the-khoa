import { useCallback, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { Cover } from "@/components/wedding/Cover";
import { InvitationLetter } from "@/components/wedding/InvitationLetter";
import { WeddingDetails } from "@/components/wedding/WeddingDetails";
import { Gallery } from "@/components/wedding/Gallery";
import { Closing } from "@/components/wedding/Closing";
import { MusicButton, MusicProvider, useMusic } from "@/components/wedding/music";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { khach?: string } => {
    const k = typeof s.khach === "string" ? s.khach.trim().slice(0, 60) : "";
    return k ? { khach: k } : {};
  },
  head: () => ({
    meta: [
      { title: "Thiệp cưới Yến Linh & Thế Khoa · 25.12.2026" },
      {
        name: "description",
        content:
          "Trân trọng kính mời Quý khách tới dự lễ vu quy của Yến Linh & Thế Khoa – 11 giờ, Thứ Sáu 25.12.2026 tại Grand View Palace Hạ Long.",
      },
      { property: "og:title", content: "Thiệp cưới Yến Linh & Thế Khoa · 25.12.2026" },
      {
        property: "og:description",
        content: "Lễ vu quy – 11 giờ, Thứ Sáu 25.12.2026 · Hội trường Queen, Grand View Palace Hạ Long.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <MusicProvider>
      <Invitation />
    </MusicProvider>
  );
}

function Invitation() {
  const { khach } = Route.useSearch();
  const { play } = useMusic();
  const [coverShown, setCoverShown] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const onOpenStart = useCallback(() => {
    play();
  }, [play]);

  const onDone = useCallback(() => {
    setRevealed(true);
    setCoverShown(false);
  }, []);

  return (
    <main className="relative">
      <AnimatePresence>
        {coverShown && <Cover key="cover" guest={khach} onOpenStart={onOpenStart} onDone={onDone} />}
      </AnimatePresence>

      <InvitationLetter revealed={revealed} guest={khach} />
      <WeddingDetails />
      <Gallery />
      <Closing />

      <MusicButton visible={!coverShown} />
    </main>
  );
}
