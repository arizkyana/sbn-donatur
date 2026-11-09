import { z } from "zod";
import { formatRupiah } from "@/lib/utils";

// A1 di backlog 003: masih menunggu konfirmasi PO, jadi cukup diubah di sini.
export const MIN_DONATION_AMOUNT = 10_000;

/** Pilihan cepat nominal donasi. */
export const AMOUNT_OPTIONS = [
  10_000, 25_000, 50_000, 100_000, 250_000, 500_000,
];

const PHONE_PATTERN = /^\+?\d{9,15}$/;

export const donationSchema = z.object({
  slug: z.string().min(1, "Campaign tidak valid"),
  amount: z
    .number("Pilih atau isi nominal donasi")
    .int("Nominal harus bilangan bulat")
    .min(
      MIN_DONATION_AMOUNT,
      `Nominal minimal ${formatRupiah(MIN_DONATION_AMOUNT)}`,
    ),
  donor_name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  donor_email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .pipe(z.email("Format email tidak valid")),
  // Opsional: string kosong berarti tidak diisi dan disimpan sebagai null.
  donor_phone: z
    .string()
    .trim()
    .refine(
      (phone) => phone === "" || PHONE_PATTERN.test(phone),
      "No. HP hanya berisi angka (boleh diawali +), 9–15 digit",
    ),
  is_anonymous: z.boolean(),
});

export type DonationInput = z.infer<typeof donationSchema>;
