// Nomor disimpan office dalam format internasional tanpa "+" (contoh 6281234567890).
const WHATSAPP_NUMBER_PATTERN = /^\d{10,15}$/;

/** Link chat WhatsApp dengan pesan terisi, atau `null` bila nomor kosong/tidak valid. */
export function getWhatsAppUrl(phone: string | null, message: string) {
  if (!phone || !WHATSAPP_NUMBER_PATTERN.test(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Pesan pembuka chat admin per halaman (SET003 backlog 007). */
export const whatsappMessage = {
  campaign: (title: string, url: string) =>
    `Halo Admin SBN, saya ingin bertanya tentang campaign "${title}": ${url}`,
  donation: (orderId: string) =>
    `Halo Admin SBN, saya ingin bertanya tentang donasi saya dengan nomor ${orderId}`,
  account: () => "Halo Admin SBN, saya ingin bertanya tentang donasi saya",
  inactiveAccount: () =>
    "Halo Admin SBN, akun saya dinonaktifkan. Saya ingin bertanya lebih lanjut.",
  general: () =>
    "Halo Admin SBN, saya ingin bertanya tentang Sobat Baik Nusantara",
};
