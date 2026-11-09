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

// Pilih href terpanjang yang cocok, agar /akun/riwayat tidak ikut mengaktifkan Akun.
export function getActiveHref(pathname: string) {
  return NAV_ITEMS.map((item) => item.href)
    .filter((href) => isActivePath(pathname, href))
    .reduce<string | null>(
      (longest, href) =>
        longest && longest.length >= href.length ? longest : href,
      null,
    );
}
