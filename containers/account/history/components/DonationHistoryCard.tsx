import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  const campaignTitle = (donation.campaigns as { title: string } | null)?.title;

  return (
    <Link
      href={`/donasi/${donation.order_id}`}
      className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="flex-row items-center gap-3 p-4 transition-colors hover:bg-muted/40">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="line-clamp-2 text-base font-semibold">
            {campaignTitle ?? (
              <span className="text-muted-foreground">
                Campaign tidak tersedia
              </span>
            )}
          </p>
          <p className="text-base font-bold text-primary">
            {formatRupiah(donation.amount)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={paymentStatusBadgeVariant[donation.payment_status]}>
              {paymentStatusLabel[donation.payment_status]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDateTime(donation.created_at)}
            </span>
          </div>
        </div>
        <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" />
      </Card>
    </Link>
  );
}
