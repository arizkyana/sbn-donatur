import { MessageCircleIcon } from "lucide-react";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { getSettings } from "@/lib/settings";
import { whatsappMessage } from "@/lib/whatsapp";

/**
 * Tombol "Hubungi Kami" (WhatsApp admin) yang mengambang di pojok kanan bawah,
 * di atas Bottom Navigation dan sejajar tepi kanan kolom `max-w-md`.
 * Disembunyikan di halaman yang punya bar bawah (`data-sticky-bar`): bar donasi
 * sudah punya tombol WhatsApp sendiri, dan tombol ini akan menutupi bar tersebut. Membaca settings, jadi wajib di dalam `<Suspense>`.
 */
export async function FloatingContactButton() {
  const { whatsapp_number } = await getSettings();

  return (
    <WhatsAppButton
      variant="link"
      phone={whatsapp_number}
      message={whatsappMessage.general()}
      className="fixed right-[max(1rem,calc(50%-13rem))] bottom-[calc(5rem+env(safe-area-inset-bottom))] z-20 inline-flex h-12 items-center gap-2 rounded-full bg-linear-to-b from-primary to-primary-strong px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:transition-transform motion-safe:active:scale-95 group-has-[[data-sticky-bar]]/app:hidden"
    >
      <MessageCircleIcon className="size-5" />
      Hubungi Kami
    </WhatsAppButton>
  );
}
