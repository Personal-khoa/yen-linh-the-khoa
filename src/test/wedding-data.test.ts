import { describe, expect, it } from "vitest";
import { AUTO_OPEN_MS, WEDDING, getCountdown } from "@/components/wedding/wedding-data";

describe("wedding details", () => {
  it("ceremony is 11:00 on Friday 25 Dec 2026, Vietnam time", () => {
    const d = new Date(WEDDING.dateISO);
    expect(d.toISOString()).toBe("2026-12-25T04:00:00.000Z");
    expect(d.getUTCDay()).toBe(5); // Friday
  });

  it("countdown from 8 Nov 2026 21:43 Saigon is 46 days 13h 17m", () => {
    const c = getCountdown(WEDDING.dateISO, new Date("2026-11-08T21:43:00+07:00"));
    expect(c).toEqual({ days: 46, hours: 13, minutes: 17, seconds: 0, done: false });
  });

  it("countdown is done once the ceremony starts", () => {
    expect(getCountdown(WEDDING.dateISO, new Date("2026-12-25T11:00:01+07:00")).done).toBe(true);
  });

  it("cover opens on its own after 7 seconds", () => {
    expect(AUTO_OPEN_MS).toBe(7000);
  });
});
