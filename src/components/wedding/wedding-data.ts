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
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Grand View Palace Hạ Long, Trần Thái Tông, Hồng Gai, Quảng Ninh"),
  },
  brideFamily: { label: "Nhà gái", parents: ["Lương Thanh Cao", "Khương Thị Hải Yến"] },
  groomFamily: { label: "Nhà trai", parents: ["Vũ Quang Viện", "Đào Thị Xuyến"] },
} as const;

/** How long the cover waits for a tap before pulling the card out by itself. */
export const AUTO_OPEN_MS = 7000;

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

export function googleCalendarUrl() {
  const start = new Date(WEDDING.dateISO);
  const end = new Date(start.getTime() + 3 * 3600 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${WEDDING.ceremony} ${WEDDING.bride} & ${WEDDING.groom}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: `${WEDDING.venue.hall}, ${WEDDING.venue.name}, ${WEDDING.venue.address.join(", ")}`,
    details: "Trân trọng kính mời Quý khách tới dự bữa tiệc mừng lễ vu quy cùng gia đình chúng tôi.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
