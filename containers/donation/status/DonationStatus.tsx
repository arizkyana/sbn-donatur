import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  TimerOffIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/date";
import type { Enums } from "@/lib/supabase/database.types";
import { cn, formatRupiah } from "@/lib/utils";
import AutoRefresh from "./components/AutoRefresh";
import { getPaymentMethodLabel } from "./payment-method";
import { getDonationByOrderId } from "./queries";

const STATUS_HEADERS: Record<
  Enums<"payment_status">,
  { icon: LucideIcon; iconClassName: string; title: string; description: string }
> = {
  SUCCESS: {
    icon: CircleCheckIcon,
    iconClassName: "text-primary",
    title: "Terima kasih, donasi Anda berhasil",
    description: "Donasi Anda sudah kami terima.",
  },
  PENDING: {
    icon: ClockIcon,
    iconClassName: "text-brand-gold",
    title: "Menunggu pembayaran",
    description: "Selesaikan pembayaran sesuai instruksi di halaman Midtrans.",
  },
  EXPIRED: {
    icon: TimerOffIcon,
    iconClassName: "text-muted-foreground",
    title: "Waktu pembayaran habis",
    description: "Donasi ini tidak dibayar sampai batas waktu pembayaran.",
  },
  FAILED: {
    icon: CircleXIcon,
    iconClassName: "text-destructive",
    title: "Pembayaran tidak berhasil",
    description: "Pembayaran dibatalkan atau ditolak. Silakan coba lagi.",
  },
};

export async function DonationStatus({ orderId }: { orderId: string }) {
  const donation = await getDonationByOrderId(orderId);
  if (!donation) notFound();

  const { campaigns: campaign, payment_status: status } = donation;
  const header = STATUS_HEADERS[status];
  const StatusIcon = header.icon;

  const details = [
    { label: "Nominal", value: formatRupiah(donation.amount) },
    { label: "Campaign", value: campaign.title },
    { label: "Atas nama", value: donation.donor_name },
    ...(status === "SUCCESS"
      ? [
          {
            label: "Waktu bayar",
            value: donation.paid_at ? formatDateTime(donation.paid_at) : "-",
          },
          {
            label: "Metode",
            value: getPaymentMethodLabel(donation.payment_method),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <StatusIcon className={cn("size-12", header.iconClassName)} />
        <h1 className="text-lg font-semibold">{header.title}</h1>
        <p className="text-sm text-muted-foreground">{header.description}</p>
      </div>

      <dl className="flex flex-col gap-3 rounded-lg border p-4 text-sm">
        {details.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="shrink-0 text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
        {/* Referensi bila donatur menghubungi admin. */}
        <div className="flex justify-between gap-4 border-t pt-3">
          <dt className="shrink-0 text-muted-foreground">Nomor donasi</dt>
          <dd className="font-mono text-xs leading-5">{donation.order_id}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        {status === "SUCCESS" && (
          <>
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href={`/campaign/${campaign.slug}`} />}
            >
              Lihat Campaign
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Kembali ke Beranda
            </Button>
          </>
        )}
        {status === "PENDING" && (
          <>
            {donation.payment_url && (
              <Button
                size="lg"
                nativeButton={false}
                render={<a href={donation.payment_url} />}
              >
                Lanjutkan Pembayaran
              </Button>
            )}
            <AutoRefresh />
          </>
        )}
        {(status === "EXPIRED" || status === "FAILED") && (
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={`/campaign/${campaign.slug}/donasi`} />}
          >
            Donasi Lagi
          </Button>
        )}
      </div>
    </div>
  );
}
