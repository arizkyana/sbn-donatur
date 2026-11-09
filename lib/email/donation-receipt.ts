import "server-only";

import { formatDateTime } from "@/lib/date";
import { getPaymentMethodLabel } from "@/lib/payment-method";
import { formatRupiah } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Warna --primary dan teks muted dari app/globals.css, dalam hex untuk klien email.
const PRIMARY_COLOR = "#2f6646";
const MUTED_COLOR = "#737373";
const BORDER_COLOR = "#e5e5e5";

export type DonationReceipt = {
  donorName: string;
  campaignTitle: string;
  amount: number;
  orderId: string;
  paidAt: string | null;
  paymentMethod: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Subject, HTML, dan teks email bukti donasi. Nama selalu nama asli walau donasi
 * anonim, karena email hanya diterima donatur sendiri.
 */
export function buildDonationReceiptEmail(receipt: DonationReceipt) {
  const statusUrl = new URL(`/donasi/${receipt.orderId}`, SITE_URL).toString();
  const details: [string, string][] = [
    ["Campaign", receipt.campaignTitle],
    ["Nominal", formatRupiah(receipt.amount)],
    ["Nomor donasi", receipt.orderId],
    ["Waktu bayar", receipt.paidAt ? formatDateTime(receipt.paidAt) : "-"],
    ["Metode pembayaran", getPaymentMethodLabel(receipt.paymentMethod)],
  ];

  const rows = details
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:${MUTED_COLOR};vertical-align:top;">${label}</td>
          <td style="padding:8px 0;text-align:right;font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="id">
  <body style="margin:0;padding:24px 12px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#171717;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 4px;font-size:14px;color:${PRIMARY_COLOR};font-weight:600;">Sobat Baik Nusantara</p>
          <h1 style="margin:0 0 16px;font-size:20px;">Terima kasih, ${escapeHtml(receipt.donorName)}</h1>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.5;">Donasi Anda sudah kami terima. Berikut bukti donasi Anda:</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-top:1px solid ${BORDER_COLOR};border-bottom:1px solid ${BORDER_COLOR};">${rows}
          </table>
          <p style="margin:24px 0 0;text-align:center;">
            <a href="${statusUrl}" style="display:inline-block;padding:12px 20px;background:${PRIMARY_COLOR};color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Lihat Status Donasi</a>
          </p>
          <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:${MUTED_COLOR};">Simpan nomor donasi di atas bila Anda perlu menghubungi admin Sobat Baik Nusantara.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Terima kasih, ${receipt.donorName}`,
    "",
    "Donasi Anda sudah kami terima. Berikut bukti donasi Anda:",
    ...details.map(([label, value]) => `${label}: ${value}`),
    "",
    `Lihat status donasi: ${statusUrl}`,
  ].join("\n");

  return {
    subject: `Bukti Donasi - ${receipt.campaignTitle}`,
    html,
    text,
  };
}
