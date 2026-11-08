<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Wedding content (names, date, venue, families) lives only in `src/components/wedding/wedding-data.ts`; components read from it so details change in one place.
- The cover is three stacked layers (pink base, HTML white card, transparent lotus-sleeve PNG cut from the user's card image); keep the card between base and sleeve so the "pull out" animation reads correctly.
- Guest personalization comes from the `?khach=` search param on `/`, so each guest can get their own link without a backend.
- Animations use `motion/react`; background music starts inside the open gesture because browsers block autoplay.
- Everything after the cover is a story viewer (`src/components/wedding/story/`): one fixed frame, horizontal tap/swipe navigation and a 3D book-flip between leaves; pages are entries in the `STORIES` list so adding or reordering pages happens in one place.
- Story pages size everything in `em` off the frame-scaled font size (`--u` in styles.css) so a page always fits the frame and never scrolls.
- Gesture and step rules live in `story-nav.ts` as pure functions with tests; keep UI code calling them rather than re-deriving thresholds.
