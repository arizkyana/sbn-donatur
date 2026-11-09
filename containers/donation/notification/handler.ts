import "server-only";

import { z } from "zod";
import {
  getPaidAt,
  getTransactionStatus,
  mapPaymentStatus,
} from "@/lib/midtrans";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

// Field wajib notifikasi Midtrans. Isinya hanya pemicu: status, nominal, metode,
// dan waktu bayar selalu dibaca ulang dari GET status Midtrans.
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
 *
 * Keaslian notifikasi diverifikasi dengan GET status ke Midtrans (cara yang
 * disarankan Midtrans), bukan dengan `signature_key`, karena di akun ini
 * signature dibuat dengan key yang berbeda dari MIDTRANS_SERVER_KEY.
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

  // Dicek sebelum memanggil Midtrans, agar order_id asing tidak memicu request keluar.
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

  let status;
  try {
    status = await getTransactionStatus(notification.order_id);
  } catch {
    // 503: Midtrans mengirim ulang notifikasi sampai empat kali.
    return Response.json(
      { error: "Status Midtrans belum bisa dibaca" },
      { status: 503 },
    );
  }
  if (!status) {
    console.warn(
      `Notifikasi untuk ${notification.order_id}, tetapi transaksinya tidak ada di Midtrans`,
    );
    return Response.json({ ignored: true });
  }

  if (Math.round(Number(status.gross_amount)) !== transaction.amount) {
    console.error(
      `Nominal Midtrans ${status.order_id} (${status.gross_amount}) berbeda dengan transaksi (${transaction.amount})`,
    );
    return Response.json({ error: "Nominal tidak sesuai" }, { status: 400 });
  }

  const paymentStatus = mapPaymentStatus(
    status.transaction_status,
    status.fraud_status,
  );
  if (!paymentStatus) return Response.json({ ignored: true });

  // Idempoten: hanya transaksi yang masih PENDING yang berubah, jadi transaksi final
  // (SUCCESS, FAILED, EXPIRED) aman dari notifikasi yang datang berkali-kali.
  const { data: updated, error: updateError } = await admin
    .from("transactions")
    .update({
      payment_status: paymentStatus,
      payment_method: status.payment_type ?? null,
      paid_at:
        paymentStatus === "SUCCESS"
          ? getPaidAt(status.settlement_time, new Date())
          : null,
      // Respons GET status yang sudah terverifikasi, bukan body notifikasi.
      midtrans_payload: status as Json,
    })
    .eq("order_id", notification.order_id)
    .eq("payment_status", "PENDING")
    .select("id, payment_status")
    .maybeSingle();
  if (updateError) throw updateError;

  return Response.json({ updated: updated !== null });
}
