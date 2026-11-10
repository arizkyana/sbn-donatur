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
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { formatDateTime } from "@/lib/date";
import { getPaymentMethodLabel } from "@/lib/payment-method";
import { getSettings } from "@/lib/settings";
import type { Enums } from "@/lib/supabase/database.types";
import { cn, formatRupiah } from "@/lib/utils";
import { whatsappMessage } from "@/lib/whatsapp";
import AutoRefresh from "./components/AutoRefresh";
import CopyOrderIdButton from "./components/CopyOrderIdButton";
import { getDonationByOrderId } from "./queries";

const STATUS_HEADERS: Record<
  Enums<"payment_status">,
  {
    icon: LucideIcon;
    iconClassName: string;
    title: string;
    description: string;
  }
> = {
  SUCCESS: {
    icon: CircleCheckIcon,
    iconClassName: "bg-primary/10 text-primary",
    title: "Terima kasih, donasi Anda berhasil",
    description: "Bukti donasi telah dikirim ke email Anda.",
  },
  PENDING: {
    icon: ClockIcon,
    iconClassName: "bg-brand-gold/20 text-brand-gold-strong",
    title: "Menunggu pembayaran",
    description: "Selesaikan pembayaran sesuai instruksi di halaman Midtrans.",
  },
  EXPIRED: {
    icon: TimerOffIcon,
    iconClassName: "bg-muted text-muted-foreground",
    title: "Waktu pembayaran habis",
    description: "Donasi ini tidak dibayar sampai batas waktu pembayaran.",
  },
  FAILED: {
    icon: CircleXIcon,
    iconClassName: "bg-destructive/10 text-destructive",
    title: "Pembayaran tidak berhasil",
    description: "Pembayaran dibatalkan atau ditolak. Silakan coba lagi.",
  },
};

export async function DonationStatus({ orderId }: { orderId: string }) {
  const [donation, settings] = await Promise.all([
    getDonationByOrderId(orderId),
    getSettings(),
  ]);
  if (!donation) notFound();

  const { campaigns: campaign, payment_status: status } = donation;
  const header = STATUS_HEADERS[status];
  const StatusIcon = header.icon;

  const details = [
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
      <div className="flex flex-col items-center gap-2 pt-4 text-center">
        <span
          className={cn(
            "mb-2 flex size-20 items-center justify-center rounded-full",
            header.iconClassName,
          )}
        >
          <StatusIcon className="size-10" />
        </span>
        <h1 className="text-xl leading-snug font-bold">{header.title}</h1>
        <p className="text-2xl font-bold text-primary">
          {formatRupiah(donation.amount)}
        </p>
        <p className="text-base text-muted-foreground">{header.description}</p>
      </div>

      <Card>
        <CardContent>
          <dl className="flex flex-col gap-3 text-base">
            {details.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
            {/* Referensi bila donatur menghubungi admin. */}
            <div className="flex items-center justify-between gap-2 border-t pt-3">
              <dt className="shrink-0 text-muted-foreground">Nomor donasi</dt>
              <dd className="flex min-w-0 items-center gap-1">
                <span className="truncate font-mono text-sm">
                  {donation.order_id}
                </span>
                <CopyOrderIdButton orderId={donation.order_id} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

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
        {/* Paling dibutuhkan saat PENDING dan FAILED; nomor donasi ikut di pesan. */}
        <WhatsAppButton
          size="lg"
          phone={settings.whatsapp_number}
          message={whatsappMessage.donation(donation.order_id)}
        />
      </div>
    </div>
  );
}
