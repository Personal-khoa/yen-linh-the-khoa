import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { Cover } from "@/components/wedding/Cover";
import { StoryViewer } from "@/components/wedding/story/StoryViewer";
import { MusicProvider, useMusic } from "@/components/wedding/music";
import sleeveAsset from "@/assets/cover-sleeve.webp.asset.json";
import logoAsset from "@/assets/logo-lk.webp.asset.json";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { khach?: string } => {
    const k = typeof s["khach"] === "string" ? s["khach"].trim().slice(0, 60) : "";
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
    // Fetch the cover artwork right away so the opening animation starts without waiting.
    links: [
      { rel: "preload", as: "image", href: sleeveAsset.url, type: "image/webp" },
      { rel: "preload", as: "image", href: logoAsset.url, type: "image/webp" },
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
  const { play, setLevel } = useMusic();
  const [coverShown, setCoverShown] = useState(true);
  const [revealed, setRevealed] = useState(false);

  // Soft music as soon as the page opens (or on the first touch if the browser blocks it).
  useEffect(() => {
    play();
  }, [play]);

  const onOpenStart = useCallback(() => {
    play();
  }, [play]);

  const onReveal = useCallback(() => {
    setRevealed(true);
    setLevel("story");
  }, [setLevel]);
  const onDone = useCallback(() => {
    setRevealed(true);
    setLevel("story");
    setCoverShown(false);
  }, [setLevel]);

  return (
    <main className="relative">
      <StoryViewer started={revealed} guest={khach} />
      <AnimatePresence>
        {coverShown && (
          <Cover key="cover" guest={khach} onOpenStart={onOpenStart} onReveal={onReveal} onDone={onDone} />
        )}
      </AnimatePresence>
    </main>
  );
}
