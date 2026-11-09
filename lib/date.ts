const relativeTimeFormatter = new Intl.RelativeTimeFormat("id", {
  numeric: "auto",
});

// Dari satuan terbesar; satuan pertama yang selisihnya ≥ 1 dipakai.
const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  dateStyle: "long",
  timeStyle: "short",
});

/** `timestamptz` → tanggal dan jam WIB, contoh "9 November 2026 pukul 10.00 WIB". */
export function formatDateTime(timestamp: string) {
  return `${dateTimeFormatter.format(new Date(timestamp))} WIB`;
}

/** `timestamptz` → waktu relatif, contoh "5 menit yang lalu", "kemarin". */
export function formatRelativeTime(timestamp: string, now: Date) {
  const seconds = (new Date(timestamp).getTime() - now.getTime()) / 1000;

  for (const [unit, unitSeconds] of RELATIVE_TIME_UNITS) {
    if (Math.abs(seconds) >= unitSeconds) {
      return relativeTimeFormatter.format(
        Math.trunc(seconds / unitSeconds),
        unit,
      );
    }
  }
  return "Baru saja";
}
