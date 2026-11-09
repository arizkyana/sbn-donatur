import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/date";
import { formatRupiah } from "@/lib/utils";
import type { MyDonation } from "../hooks/useMyDonations";
import { paymentStatusBadgeVariant, paymentStatusLabel } from "../status";

export default function DonationHistoryCard({
  donation,
}: {
  donation: MyDonation;
}) {
  // Tipe hasil generate menganggap relasi selalu ada, padahal RLS membuatnya
  // null untuk campaign arsip/draft.
  const campaignTitle = (donation.campaigns as { title: string } | null)
    ?.title;

  return (
    <Link
      href={`/donasi/${donation.order_id}`}
      className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="line-clamp-2 text-sm font-medium">
          {campaignTitle ?? (
            <span className="text-muted-foreground">
              Campaign tidak tersedia
            </span>
          )}
        </p>
        <p className="font-semibold">{formatRupiah(donation.amount)}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={paymentStatusBadgeVariant[donation.payment_status]}>
            {paymentStatusLabel[donation.payment_status]}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(donation.created_at)}
          </span>
        </div>
      </div>
      <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
