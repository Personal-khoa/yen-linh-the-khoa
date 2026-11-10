export const WEDDING = {
  bride: "Yến Linh",
  groom: "Thế Khoa",
  ceremony: "Lễ Vu Quy",
  /** 11:00, Friday 25 December 2026, Vietnam time (UTC+7). */
  dateISO: "2026-12-25T11:00:00+07:00",
  dateDisplay: { day: "25", month: "12", year: "2026" },
  timeLabel: "11 giờ 00",
  weekday: "Thứ Sáu",
  lunar: "Tức ngày 17 tháng 11 năm Bính Ngọ",
  venue: {
    hall: "Hội trường Queen – Tầng 2",
    name: "Grand View Palace Hạ Long",
    address: ["Đường Trần Thái Tông – Tổ 6 KP Yết Kiêu 6", "Phường Hồng Gai – TP. Quảng Ninh"],
    mapUrl:
      "https://www.google.com/maps/place/Grand+View+Palace+Ha+Long+Hotel/@20.9633878,107.0729702,17z/data=!4m10!3m9!1s0x314a59b782ab1789:0x9ecacf03a317fe03!5m3!1s2026-11-23!4m1!1i2!8m2!3d20.9633878!4d107.0729702!16s%2Fg%2F11mvylw1p9?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D",
  },
  brideFamily: { label: "Nhà gái", parents: ["Lương Thanh Cao", "Khương Thị Hải Yến"] },
  groomFamily: { label: "Nhà trai", parents: ["Vũ Quang Viện", "Đào Thị Xuyến"] },
} as const;

/** How long the cover waits for a tap before pulling the card out by itself. */
export const AUTO_OPEN_MS = 7000;

/** Cover hand-off: the fade into the story starts before the pull ends so the motion never stalls. */
export const COVER_TIMING = {
  /** Longest wait for the card artwork and fonts before showing the cover anyway. */
  maxWaitMs: 2600,
  pullMs: 1800,
  revealAfterMs: 1350,
  fadeMs: 1000,
} as const;

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

export function getCountdown(targetISO: string, now: Date): Countdown {
  const diff = new Date(targetISO).getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: false,
  };
}

/** Background music: soft on the cover, fuller once the story pages start. */
export const MUSIC_VOLUME = { cover: 0.45, story: 0.72 } as const;
export type MusicLevel = keyof typeof MUSIC_VOLUME;
