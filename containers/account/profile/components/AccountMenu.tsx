import Link from "next/link";
import { ChevronRightIcon, HistoryIcon, KeyRoundIcon } from "lucide-react";

const MENU_ITEMS = [
  { href: "/akun/riwayat", label: "Riwayat Donasi", icon: HistoryIcon },
  { href: "/atur-ulang-password", label: "Ubah Password", icon: KeyRoundIcon },
];

// Tombol WhatsApp admin ditambahkan di backlog 007-pengaturan (D4).
export default function AccountMenu() {
  return (
    <nav className="flex flex-col divide-y rounded-lg border">
      {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted"
        >
          <Icon className="size-4 text-muted-foreground" />
          <span className="flex-1">{label}</span>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </Link>
      ))}
    </nav>
  );
}
