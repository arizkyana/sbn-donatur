import { z } from "zod";
import { formatRupiah } from "@/lib/utils";
import { emailSchema, fullNameSchema, phoneSchema } from "@/lib/validation";

// A1 di backlog 003: masih menunggu konfirmasi PO, jadi cukup diubah di sini.
export const MIN_DONATION_AMOUNT = 10_000;

/** Pilihan cepat nominal donasi. */
export const AMOUNT_OPTIONS = [
  10_000, 25_000, 50_000, 100_000, 250_000, 500_000,
];

export const donationSchema = z.object({
  slug: z.string().min(1, "Campaign tidak valid"),
  amount: z
    .number("Pilih atau isi nominal donasi")
    .int("Nominal harus bilangan bulat")
    .min(
      MIN_DONATION_AMOUNT,
      `Nominal minimal ${formatRupiah(MIN_DONATION_AMOUNT)}`,
    ),
  donor_name: fullNameSchema,
  donor_email: emailSchema,
  donor_phone: phoneSchema,
  is_anonymous: z.boolean(),
});

export type DonationInput = z.infer<typeof donationSchema>;
