"use server";

import { z } from "zod";
import { getCampaignBySlug } from "@/containers/campaign/detail/queries";
import { getCurrentUser } from "@/lib/auth";
import { isCampaignEnded } from "@/lib/campaign";
import { createSnapTransaction, generateOrderId } from "@/lib/midtrans";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/types";
import { donationSchema, type DonationInput } from "./DonationForm.types";

const PAYMENT_ERROR_MESSAGE =
  "Pembayaran belum bisa diproses. Silakan coba beberapa saat lagi.";

// Halaman publik: tanpa requireAdmin(). Hook yang mengarahkan donatur ke Midtrans.
export async function createDonation(
  input: DonationInput,
): Promise<ActionResult<{ redirectUrl: string }>> {
  const result = donationSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      message: "Periksa kembali data donasi Anda",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }
  const { slug, amount, donor_name, donor_email, is_anonymous } = result.data;
  const donor_phone = result.data.donor_phone || null;

  const now = new Date();
  const campaign = await getCampaignBySlug(slug);
  if (!campaign || isCampaignEnded(campaign.end_date, now)) {
    return { success: false, message: "Campaign tidak dapat menerima donasi" };
  }

  // Donasi saat login tersimpan dengan users_id agar muncul di riwayat akun (DON008).
  const user = await getCurrentUser();
  const orderId = generateOrderId(now);

  // Insert/update transactions hanya lewat service role (tidak ada policy tulis di RLS).
  const admin = createAdminClient();
  const { data: transaction, error: insertError } = await admin
    .from("transactions")
    .insert({
      campaigns_id: campaign.id,
      users_id: user?.id ?? null,
      donor_name,
      donor_email,
      donor_phone,
      is_anonymous,
      amount,
      order_id: orderId,
    })
    .select("id")
    .single();
  if (insertError) {
    console.error(`Gagal membuat transaksi ${orderId}:`, insertError);
    return { success: false, message: PAYMENT_ERROR_MESSAGE };
  }

  let redirectUrl: string;
  try {
    ({ redirectUrl } = await createSnapTransaction({
      orderId,
      amount,
      campaign: { id: campaign.id, title: campaign.title },
      donor: { name: donor_name, email: donor_email, phone: donor_phone },
    }));
  } catch (error) {
    await admin
      .from("transactions")
      .update({
        payment_status: "FAILED",
        midtrans_payload: {
          error: error instanceof Error ? error.message : String(error),
        },
      })
      .eq("id", transaction.id);
    return { success: false, message: PAYMENT_ERROR_MESSAGE };
  }

  // Bila gagal, donasi tetap bisa dibayar; hanya tombol "Lanjutkan Pembayaran" yang tidak muncul.
  const { error: updateError } = await admin
    .from("transactions")
    .update({ payment_url: redirectUrl })
    .eq("id", transaction.id);
  if (updateError) {
    console.error(`Gagal menyimpan payment_url ${orderId}:`, updateError);
  }

  return { success: true, data: { redirectUrl } };
}
