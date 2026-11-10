import type { ComponentProps } from "react";
import { getSettings } from "@/lib/settings";
import { WhatsAppButton } from "./WhatsAppButton";

type AdminWhatsAppButtonProps = Omit<
  ComponentProps<typeof WhatsAppButton>,
  "phone"
>;

/**
 * `WhatsAppButton` yang membaca nomor admin sendiri, untuk halaman yang belum
 * memanggil `getSettings()`. Membaca cookies, jadi wajib di dalam `<Suspense>`.
 */
export async function AdminWhatsAppButton(props: AdminWhatsAppButtonProps) {
  const { whatsapp_number } = await getSettings();
  return <WhatsAppButton phone={whatsapp_number} {...props} />;
}
