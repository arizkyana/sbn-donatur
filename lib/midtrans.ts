import "server-only";

import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import type { Enums } from "@/lib/supabase/database.types";

// Integrasi Midtrans lewat REST API (fetch), tanpa SDK. Snap untuk membuat
// transaksi, Core API untuk membaca status saat memverifikasi webhook.
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const SNAP_BASE_URL = IS_PRODUCTION
  ? "https://app.midtrans.com"
  : "https://app.sandbox.midtrans.com";
const CORE_BASE_URL = IS_PRODUCTION
  ? "https://api.midtrans.com"
  : "https://api.sandbox.midtrans.com";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Webhook DON005. Dikirim per transaksi lewat header X-Override-Notification, jadi
// notifikasi selalu kembali ke deployment yang membuat transaksi (lokal lewat tunnel,
// staging, production) dan tidak bergantung pada Notification URL di dashboard.
const NOTIFICATION_URL = new URL(
  "/api/midtrans/notification",
  SITE_URL,
).toString();

/** Format `generateOrderId()`, contoh `SBN-20261109-7K2QX9AB`. */
export const ORDER_ID_PATTERN = /^SBN-\d{8}-[A-Z0-9]{8}$/;

const ORDER_ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// en-CA menghasilkan format YYYY-MM-DD.
const wibDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getServerKey() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY belum diatur");
  return serverKey;
}

function getAuthHeaders() {
  return {
    Authorization: `Basic ${Buffer.from(`${getServerKey()}:`).toString("base64")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/**
 * Order ID unik: tanggal WIB + 8 karakter acak dari `crypto`. Harus sulit
 * ditebak karena menjadi URL halaman status `/donasi/<order_id>`.
 */
export function generateOrderId(now: Date) {
  const date = wibDateFormatter.format(now).replaceAll("-", "");
  const suffix = Array.from(
    { length: 8 },
    () => ORDER_ID_ALPHABET[randomInt(ORDER_ID_ALPHABET.length)],
  ).join("");
  return `SBN-${date}-${suffix}`;
}

type SnapTransactionInput = {
  orderId: string;
  amount: number;
  campaign: { id: number; title: string };
  donor: { name: string; email: string; phone: string | null };
};

/** Membuat transaksi Snap. Donatur diarahkan ke `redirectUrl` untuk membayar. */
export async function createSnapTransaction({
  orderId,
  amount,
  campaign,
  donor,
}: SnapTransactionInput) {
  const response = await fetch(`${SNAP_BASE_URL}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "X-Override-Notification": NOTIFICATION_URL,
    },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: amount },
      // Total item_details harus sama dengan gross_amount. Nama item maksimal 50 karakter.
      item_details: [
        {
          id: String(campaign.id),
          name: campaign.title.slice(0, 50),
          price: amount,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: donor.name,
        email: donor.email,
        ...(donor.phone && { phone: donor.phone }),
      },
      callbacks: { finish: new URL(`/donasi/${orderId}`, SITE_URL).toString() },
      // Tanpa start_time, masa berlaku dihitung sejak transaksi dibuat.
      expiry: { unit: "hours", duration: 24 },
    }),
  });

  if (!response.ok) {
    console.error(
      `Midtrans Snap gagal (${response.status}) untuk ${orderId}:`,
      await response.text(),
    );
    throw new Error(`Midtrans Snap gagal dengan status ${response.status}`);
  }

  const data = (await response.json()) as {
    token: string;
    redirect_url: string;
  };
  return { token: data.token, redirectUrl: data.redirect_url };
}

/** Respons GET status Core API (field yang dipakai webhook). */
export type MidtransTransactionStatus = {
  order_id: string;
  status_code: string;
  transaction_status: string;
  fraud_status?: string;
  gross_amount: string;
  payment_type?: string;
  settlement_time?: string;
};

/**
 * Status transaksi langsung dari Midtrans. Dipakai webhook untuk memverifikasi
 * notifikasi: respons ini diautentikasi dengan server key kita, jadi tidak bisa
 * dipalsukan pengirim notifikasi. `null` bila Midtrans tidak mengenal order_id.
 */
export async function getTransactionStatus(orderId: string) {
  const response = await fetch(
    `${CORE_BASE_URL}/v2/${encodeURIComponent(orderId)}/status`,
    { headers: getAuthHeaders() },
  );
  if (!response.ok) {
    console.error(
      `Midtrans GET status gagal (${response.status}) untuk ${orderId}:`,
      await response.text(),
    );
    throw new Error(`Midtrans GET status gagal dengan status ${response.status}`);
  }

  const data = (await response.json()) as MidtransTransactionStatus;
  // Transaksi tidak ditemukan tetap dibalas HTTP 200, dengan status_code "404".
  if (data.status_code === "404") return null;
  return data;
}

type SignedNotification = {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
};

/**
 * Verifikasi `signature_key` notifikasi Midtrans. `gross_amount` dipakai persis
 * seperti string yang dikirim Midtrans (contoh `"50000.00"`).
 *
 * Tidak dipakai webhook: di akun Midtrans ini notifikasi ditandatangani dengan key
 * yang berbeda dari MIDTRANS_SERVER_KEY (signature tidak pernah cocok, juga setelah
 * server key dirotasi), jadi webhook memverifikasi lewat `getTransactionStatus()`.
 */
export function verifySignature(notification: SignedNotification) {
  const expected = Buffer.from(
    createHash("sha512")
      .update(
        notification.order_id +
          notification.status_code +
          notification.gross_amount +
          getServerKey(),
      )
      .digest("hex"),
  );
  const actual = Buffer.from(notification.signature_key);
  // timingSafeEqual melempar error bila panjang buffer berbeda.
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/**
 * `transaction_status` Midtrans → `payment_status`. `null` untuk status di luar
 * scope (refund, chargeback, dll.), yang diabaikan oleh webhook.
 */
export function mapPaymentStatus(
  transactionStatus: string,
  fraudStatus?: string,
): Enums<"payment_status"> | null {
  switch (transactionStatus) {
    case "settlement":
      return "SUCCESS";
    case "capture":
      // Kartu kredit: challenge berarti masih menunggu review fraud di dashboard Midtrans.
      if (fraudStatus === "accept") return "SUCCESS";
      if (fraudStatus === "challenge") return "PENDING";
      return null;
    case "pending":
      return "PENDING";
    case "expire":
      return "EXPIRED";
    case "cancel":
    case "deny":
    case "failure":
      return "FAILED";
    default:
      return null;
  }
}

const SETTLEMENT_TIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

/**
 * Waktu bayar untuk `paid_at`. `settlement_time` dikirim dalam WIB tanpa offset
 * (contoh `"2026-11-09 10:00:00"`); bila tidak ada, pakai waktu sekarang.
 */
export function getPaidAt(settlementTime: string | undefined, now: Date) {
  if (settlementTime && SETTLEMENT_TIME_PATTERN.test(settlementTime)) {
    return new Date(`${settlementTime.replace(" ", "T")}+07:00`).toISOString();
  }
  return now.toISOString();
}
