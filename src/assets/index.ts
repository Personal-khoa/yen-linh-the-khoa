// Import media files directly so Vite rewrites URLs with the correct base path.
// Do NOT use .asset.json URLs — they are absolute paths that ignore VITE_BASE.

import coverSleeveUrl from "./cover-sleeve.webp";
import logoUrl from "./logo-lk.webp";
import lotusBloomUrl from "./lotus-bloom.webp";
import lotusLeafTopUrl from "./lotus-leaf-top.webp";
import lotusLeafBottomUrl from "./lotus-leaf-bottom.webp";
import canonInDUrl from "./canon-in-d.mp3";

export const coverSleeve = { url: coverSleeveUrl };
export const logoLk = { url: logoUrl };
export const lotusBloom = { url: lotusBloomUrl };
export const lotusLeafTop = { url: lotusLeafTopUrl };
export const lotusLeafBottom = { url: lotusLeafBottomUrl };
export const canonInD = { url: canonInDUrl };
