import Link from "next/link";
import {
  ChevronRightIcon,
  ExternalLinkIcon,
  HistoryIcon,
  KeyRoundIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { whatsappMessage } from "@/lib/whatsapp";

const MENU_ITEMS = [
  { href: "/akun/riwayat", label: "Riwayat Donasi", icon: HistoryIcon },
  { href: "/atur-ulang-password", label: "Ubah Password", icon: KeyRoundIcon },
];

const rowClassName =
  "flex min-h-14 items-center gap-3 px-4 py-2 text-base font-medium hover:bg-muted outline-none focus-visible:bg-muted";

// Ikon menu di dalam lingkaran ber-tint.
const iconChipClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary [&_svg]:size-5";

export default function AccountMenu({
  whatsappNumber,
}: {
  whatsappNumber: string | null;
}) {
  return (
    <Card className="gap-0 py-0">
      <nav className="flex flex-col divide-y">
        {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={rowClassName}>
            <span className={iconChipClassName}>
              <Icon />
            </span>
            <span className="flex-1">{label}</span>
            <ChevronRightIcon className="size-5 text-muted-foreground" />
          </Link>
        ))}
        {/* Membuka WhatsApp di tab baru; tidak tampil bila nomor admin kosong. */}
        <WhatsAppButton
          variant="link"
          phone={whatsappNumber}
          message={whatsappMessage.account()}
          className={rowClassName}
        >
          <span className={iconChipClassName}>
            <MessageCircleIcon />
          </span>
          <span className="flex-1">Chat Admin</span>
          <ExternalLinkIcon className="size-5 text-muted-foreground" />
        </WhatsAppButton>
      </nav>
    </Card>
  );
}
