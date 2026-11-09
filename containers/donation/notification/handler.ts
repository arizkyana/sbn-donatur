import "server-only";

import { after } from "next/server";
import { z } from "zod";
import { sendDonationReceipt } from "@/lib/email/send";
import { getPaidAt, mapPaymentStatus, verifySignature } from "@/lib/midtrans";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

// Field yang dibutuhkan webhook. Seluruh body tetap disimpan di midtrans_payload.
const notificationSchema = z.object({
  order_id: z.string().min(1),
  status_code: z.string().min(1),
  gross_amount: z.string().min(1),
  signature_key: z.string().min(1),
  transaction_status: z.string().min(1),
  fraud_status: z.string().optional(),
  payment_type: z.string().optional(),
  settlement_time: z.string().optional(),
});

/**
 * Notifikasi (webhook) Midtrans. Status 200 berarti notifikasi diterima;
 * selain 2xx, Midtrans mengirim ulang notifikasi yang sama.
 */
export async function handleMidtransNotification(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body harus JSON" }, { status: 400 });
  }

  const parsed = notificationSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Field notifikasi tidak lengkap" },
      { status: 400 },
    );
  }
  const notification = parsed.data;

  if (!verifySignature(notification)) {
    return Response.json({ error: "Signature tidak valid" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: transaction, error } = await admin
    .from("transactions")
    .select("amount")
    .eq("order_id", notification.order_id)
    .maybeSingle();
  if (error) throw error;
  if (!transaction) {
    // Contoh: tombol "Test notification" di dashboard Midtrans.
    console.warn(
      `Notifikasi Midtrans untuk order_id yang tidak dikenal: ${notification.order_id}`,
    );
    return Response.json({ ignored: true });
  }

  if (Math.round(Number(notification.gross_amount)) !== transaction.amount) {
    console.error(
      `Nominal notifikasi ${notification.order_id} (${notification.gross_amount}) berbeda dengan transaksi (${transaction.amount})`,
    );
    return Response.json({ error: "Nominal tidak sesuai" }, { status: 400 });
  }

  const paymentStatus = mapPaymentStatus(
    notification.transaction_status,
    notification.fraud_status,
  );
  if (!paymentStatus) return Response.json({ ignored: true });

  // Idempoten: hanya transaksi yang masih PENDING yang berubah, jadi transaksi final
  // (SUCCESS, FAILED, EXPIRED) aman dari notifikasi yang datang berkali-kali.
  const { data: updated, error: updateError } = await admin
    .from("transactions")
    .update({
      payment_status: paymentStatus,
      payment_method: notification.payment_type ?? null,
      paid_at:
        paymentStatus === "SUCCESS"
          ? getPaidAt(notification.settlement_time, new Date())
          : null,
      midtrans_payload: body as Json,
    })
    .eq("order_id", notification.order_id)
    .eq("payment_status", "PENDING")
    .select("id, payment_status")
    .maybeSingle();
  if (updateError) throw updateError;

  // Hanya request yang benar-benar mengubah baris menjadi SUCCESS yang mengirim email.
  // after(): dikirim setelah respons, agar Midtrans tidak menunggu lalu mengirim ulang
  // karena timeout.
  if (updated?.payment_status === "SUCCESS") {
    after(() => sendDonationReceipt(updated.id));
  }

  return Response.json({ updated: updated !== null });
}
