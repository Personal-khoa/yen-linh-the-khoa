import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { Cover } from "@/components/wedding/Cover";
import { StoryViewer } from "@/components/wedding/story/StoryViewer";
import { MusicProvider, useMusic } from "@/components/wedding/music";
import { makeStories, PHOTOS, PageBack } from "@/components/wedding/story/StoryPages";

export const Route = createFileRoute("/fr")({
  validateSearch: (s: Record<string, unknown>): { khach?: string } => {
    const k = typeof s["khach"] === "string" ? s["khach"].trim().slice(0, 60) : "";
    return k ? { khach: k } : {};
  },
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

  // "chúng mình" for /fr route
  const stories = useMemo(() => makeStories("chúng mình"), []);

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
      <StoryViewer
        started={revealed}
        guest={khach}
        stories={stories}
        photos={PHOTOS}
        PageBack={PageBack}
      />
      <AnimatePresence>
        {coverShown && (
          <Cover key="cover" guest={khach} onOpenStart={onOpenStart} onReveal={onReveal} onDone={onDone} />
        )}
      </AnimatePresence>
    </main>
  );
}
