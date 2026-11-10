import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { CampaignProgress } from "@/components/campaign/CampaignProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CampaignListItem } from "@/hooks/use-campaigns";
import { formatRemainingDays, getRemainingDays } from "@/lib/campaign";

const ENDING_SOON_DAYS = 7;

type CampaignCardProps = {
  campaign: CampaignListItem;
  /** Kartu pertama di layar: cover dimuat segera (gambar LCP). */
  eager?: boolean;
};

function RemainingDaysBadge({ days }: { days: number | null }) {
  if (days === null) return null;
  if (days === 0) {
    return (
      <Badge className="bg-foreground/75 text-white">Telah berakhir</Badge>
    );
  }
  if (days <= ENDING_SOON_DAYS) {
    return (
      <Badge className="bg-brand-gold text-foreground shadow-sm">
        Segera berakhir
      </Badge>
    );
  }
  return (
    <Badge className="bg-card/95 text-primary shadow-sm">
      {formatRemainingDays(days)}
    </Badge>
  );
}

// Dipakai beranda dan halaman pencarian (client component), jadi new Date() aman:
// kartu hanya dirender setelah data campaign selesai di-fetch.
export function CampaignCard({ campaign, eager }: CampaignCardProps) {
  const remainingDays = getRemainingDays(campaign.end_date, new Date());

  return (
    <Card className="relative pt-0">
      <div className="relative flex aspect-video items-center justify-center bg-muted">
        {campaign.cover ? (
          <Image
            src={campaign.cover}
            alt=""
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            loading={eager ? "eager" : undefined}
            className="object-cover"
          />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" />
        )}
        <div className="absolute top-3 left-3">
          <RemainingDaysBadge days={remainingDays} />
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-base font-bold">
          {/* Stretched link: seluruh kartu menuju detail, kecuali tombol Donasi. */}
          <Link
            href={`/campaign/${campaign.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {campaign.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CampaignProgress
          collectedAmount={campaign.collected}
          targetBudget={campaign.target_budget}
          donorCount={campaign.donorCount}
          endDate={campaign.end_date}
        />
        {remainingDays !== 0 && (
          <Button
            className="relative z-10 w-full"
            nativeButton={false}
            render={<Link href={`/campaign/${campaign.slug}/donasi`} />}
          >
            Donasi Sekarang
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
