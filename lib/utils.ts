export { cn } from "cn";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(amount: number) {
  return rupiahFormatter.format(amount);
}

/** URL absolut di domain donatur (link bagikan, sitemap, robots). */
export function getAbsoluteUrl(path: string) {
  return new URL(
    path,
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002",
  ).toString();
}
