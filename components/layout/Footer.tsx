import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";
import { AdminWhatsAppButton } from "@/components/whatsapp/AdminWhatsAppButton";
import { whatsappMessage } from "@/lib/whatsapp";

const linkClassName =
  "inline-flex min-h-10 items-center gap-2 self-start text-sm font-medium hover:text-primary hover:underline underline-offset-4";

export function Footer() {
  return (
    // Ruang bawah untuk Bottom Navigation (h-16 + safe area), ditambah sticky bar
    // donasi (data-sticky-bar) di halaman yang memilikinya.
    <footer className="flex flex-col gap-4 border-t bg-muted/60 px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] group-has-[[data-sticky-bar]]/app:pb-[calc(11rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2">
        <Image
          src="/logo-sbn.jpg"
          alt=""
          width={28}
          height={28}
          className="rounded-full"
        />
        <span className="text-sm font-semibold">Sobat Baik Nusantara</span>
      </div>
      <nav aria-label="Informasi lembaga" className="flex flex-col">
        <Link href="/tentang" className={linkClassName}>
          Tentang Kami
        </Link>
        <Link href="/syarat-ketentuan" className={linkClassName}>
          Syarat &amp; Ketentuan
        </Link>
        {/* Membaca nomor admin dari settings; tanpa nomor, link tidak tampil. */}
        <Suspense fallback={null}>
          <AdminWhatsAppButton
            variant="link"
            message={whatsappMessage.general()}
            className={linkClassName}
          >
            <MessageCircleIcon className="size-4" />
            Hubungi Kami
          </AdminWhatsAppButton>
        </Suspense>
      </nav>
      {/* Tanpa tahun: new Date() saat prerender membuat build gagal (cacheComponents). */}
      <p className="text-xs text-muted-foreground">© Sobat Baik Nusantara</p>
    </footer>
  );
}
