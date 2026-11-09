import "server-only";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildDonationReceiptEmail } from "./donation-receipt";

/**
 * Kirim email bukti donasi lewat Resend. Dipanggil di dalam `after()` webhook,
 * jadi error cukup dicatat di log dan tidak dilempar ulang.
 */
export async function sendDonationReceipt(transactionId: number) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
      throw new Error("RESEND_API_KEY atau EMAIL_FROM belum diatur");
    }

    const { data: transaction, error } = await createAdminClient()
      .from("transactions")
      .select(
        "order_id, amount, donor_name, donor_email, paid_at, payment_method, campaigns (title)",
      )
      .eq("id", transactionId)
      .single();
    if (error) throw error;

    const { subject, html, text } = buildDonationReceiptEmail({
      donorName: transaction.donor_name,
      campaignTitle: transaction.campaigns.title,
      amount: transaction.amount,
      orderId: transaction.order_id,
      paidAt: transaction.paid_at,
      paymentMethod: transaction.payment_method,
    });

    // Resend mengembalikan { error } alih-alih melempar. idempotencyKey mencegah
    // email ganda bila pengiriman untuk transaksi yang sama terulang (24 jam).
    const { error: sendError } = await new Resend(apiKey).emails.send(
      { from, to: transaction.donor_email, subject, html, text },
      { idempotencyKey: `donation-receipt/${transaction.order_id}` },
    );
    if (sendError) throw new Error(`${sendError.name}: ${sendError.message}`);
  } catch (error) {
    console.error(
      `Gagal mengirim bukti donasi untuk transaksi ${transactionId}:`,
      error,
    );
  }
}
