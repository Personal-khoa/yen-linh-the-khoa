/** Pure navigation rules for the story viewer, kept separate so they can be tested. */

/** Horizontal drag (px) that counts as a swipe to the next / previous story. */
export const SWIPE_PX = 45;
/** A press longer than this is a "hold to pause", not a tap. */
export const TAP_MAX_MS = 350;
/** Finger movement allowed for something to still count as a tap. */
export const TAP_MAX_MOVE = 12;
/** Left share of the frame where a tap goes back (like Facebook stories). */
export const BACK_ZONE = 0.3;
/** Duration of the book page-flip between stories. */
export const FLIP_SECONDS = 1.15;

export type Gesture = {
  dx: number;
  dy: number;
  ms: number;
  /** Where the press started, 0 = left edge of the frame, 1 = right edge. */
  relX: number;
  /** The press lasted long enough to pause the story. */
  held: boolean;
};

/** -1 = previous story, 1 = next story, 0 = nothing. */
export function gestureStep(g: Gesture): -1 | 0 | 1 {
  if (Math.abs(g.dx) >= SWIPE_PX && Math.abs(g.dx) > Math.abs(g.dy)) return g.dx < 0 ? 1 : -1;
  if (g.held || g.ms > TAP_MAX_MS || Math.hypot(g.dx, g.dy) > TAP_MAX_MOVE) return 0;
  return g.relX < BACK_ZONE ? -1 : 1;
}

/** Target index for a step, or null when it would leave the story list. */
export function clampStep(index: number, step: number, count: number): number | null {
  if (step === 0) return null;
  const t = index + step;
  return t < 0 || t >= count ? null : t;
}
