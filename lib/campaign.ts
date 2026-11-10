import { getAbsoluteUrl } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Persentase dana terkumpul terhadap target (0–100, dibulatkan ke bawah).
 * `null` bila campaign tidak punya target.
 */
export function getProgressPercent(collected: number, target: number | null) {
  if (!target) return null;
  return Math.min(100, Math.floor((collected / target) * 100));
}

/**
 * Sisa hari sampai `end_date`, dibulatkan ke atas. `0` bila sudah lewat,
 * `null` bila campaign tidak punya batas waktu.
 *
 * `end_date` disimpan sebagai 23:59:59 WIB, jadi nilai `1` berarti hari
 * terakhir campaign (WIB).
 */
export function getRemainingDays(endDate: string | null, now: Date) {
  if (!endDate) return null;
  const remainingMs = new Date(endDate).getTime() - now.getTime();
  if (remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / DAY_MS);
}

/** Campaign yang sudah melewati `end_date` tidak bisa menerima donasi. */
export function isCampaignEnded(endDate: string | null, now: Date) {
  return getRemainingDays(endDate, now) === 0;
}

/** Teks sisa hari dari hasil `getRemainingDays()`. */
export function formatRemainingDays(days: number | null) {
  if (days === null) return "Tanpa batas waktu";
  if (days === 0) return "Telah berakhir";
  if (days === 1) return "Berakhir hari ini";
  return `${days} hari lagi`;
}

/** URL publik detail campaign, dipakai untuk tombol bagikan. */
export function getCampaignUrl(slug: string) {
  return getAbsoluteUrl(`/campaign/${slug}`);
}
