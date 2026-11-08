import { describe, expect, it } from "vitest";
import { clampStep, gestureStep } from "@/components/wedding/story/story-nav";

const tap = { dx: 0, dy: 0, ms: 120, held: false };

describe("story navigation", () => {
  it("tapping the right side turns to the next page", () => {
    expect(gestureStep({ ...tap, relX: 0.8 })).toBe(1);
  });

  it("tapping the left side turns back a page", () => {
    expect(gestureStep({ ...tap, relX: 0.1 })).toBe(-1);
  });

  it("swiping left goes forward, swiping right goes back", () => {
    expect(gestureStep({ ...tap, dx: -80, ms: 300, relX: 0.2 })).toBe(1);
    expect(gestureStep({ ...tap, dx: 80, ms: 300, relX: 0.8 })).toBe(-1);
  });

  it("holding to pause does not turn the page", () => {
    expect(gestureStep({ ...tap, ms: 900, held: true, relX: 0.8 })).toBe(0);
  });

  it("cannot turn before the first or past the last page", () => {
    expect(clampStep(0, -1, 10)).toBeNull();
    expect(clampStep(9, 1, 10)).toBeNull();
    expect(clampStep(3, 1, 10)).toBe(4);
  });
});
