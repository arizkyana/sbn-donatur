import type { Enums } from "@/lib/supabase/database.types";

// Label dan warna sama dengan daftar transaksi di sbn-office.
export const paymentStatusLabel: Record<Enums<"payment_status">, string> = {
  SUCCESS: "Berhasil",
  PENDING: "Menunggu",
  EXPIRED: "Kedaluwarsa",
  FAILED: "Gagal",
};

// Badge tidak punya varian sukses/peringatan; "default" memakai warna primary (hijau).
export const paymentStatusBadgeVariant = {
  SUCCESS: "default",
  PENDING: "secondary",
  EXPIRED: "outline",
  FAILED: "destructive",
} as const satisfies Record<Enums<"payment_status">, string>;
