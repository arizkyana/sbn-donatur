import {
  HistoryIcon,
  HouseIcon,
  NewspaperIcon,
  UserRoundIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

// Bottom Navigation sesuai bagian Halaman Donatur di planning/init.md.
export const NAV_ITEMS: NavItem[] = [
  { title: "Beranda", href: "/", icon: HouseIcon },
  { title: "Blog", href: "/blog", icon: NewspaperIcon },
  { title: "Riwayat", href: "/akun/riwayat", icon: HistoryIcon },
  { title: "Akun", href: "/akun", icon: UserRoundIcon },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Tujuan tombol kembali di header bila halaman detail dibuka langsung, atau
 * `null` untuk halaman yang bukan detail (tanpa tombol kembali).
 */
export function getBackHref(pathname: string) {
  const [first, second, third, ...rest] = pathname.split("/").filter(Boolean);
  if (!second || rest.length > 0) return null;
  if (first === "campaign" && !third) return "/";
  if (first === "campaign" && third === "donasi") return `/campaign/${second}`;
  if (first === "donasi" && !third) return "/";
  if (first === "blog" && !third) return "/blog";
  return null;
}

// Pilih href terpanjang yang cocok, agar /akun/riwayat tidak ikut mengaktifkan Akun.
// Halaman pencarian dianggap bagian dari Beranda.
export function getActiveHref(pathname: string) {
  const path = isActivePath(pathname, "/cari") ? "/" : pathname;
  return NAV_ITEMS.map((item) => item.href)
    .filter((href) => isActivePath(path, href))
    .reduce<string | null>(
      (longest, href) =>
        longest && longest.length >= href.length ? longest : href,
      null,
    );
}
