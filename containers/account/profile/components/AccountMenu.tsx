import Link from "next/link";
import {
  ChevronRightIcon,
  ExternalLinkIcon,
  HistoryIcon,
  KeyRoundIcon,
  MessageCircleIcon,
} from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { whatsappMessage } from "@/lib/whatsapp";

const MENU_ITEMS = [
  { href: "/akun/riwayat", label: "Riwayat Donasi", icon: HistoryIcon },
  { href: "/atur-ulang-password", label: "Ubah Password", icon: KeyRoundIcon },
];

const rowClassName = "flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted";

export default function AccountMenu({
  whatsappNumber,
}: {
  whatsappNumber: string | null;
}) {
  return (
    <nav className="flex flex-col divide-y rounded-lg border">
      {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={rowClassName}>
          <Icon className="size-4 text-muted-foreground" />
          <span className="flex-1">{label}</span>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </Link>
      ))}
      {/* Membuka WhatsApp di tab baru; tidak tampil bila nomor admin kosong. */}
      <WhatsAppButton
        variant="link"
        phone={whatsappNumber}
        message={whatsappMessage.account()}
        className={rowClassName}
      >
        <MessageCircleIcon className="size-4 text-muted-foreground" />
        <span className="flex-1">Chat Admin</span>
        <ExternalLinkIcon className="size-4 text-muted-foreground" />
      </WhatsAppButton>
    </nav>
  );
}
