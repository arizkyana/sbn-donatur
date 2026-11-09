import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { CampaignProgress } from "@/components/campaign/CampaignProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CampaignListItem } from "../hooks/useCampaigns";

type CampaignCardProps = {
  campaign: CampaignListItem;
  /** Kartu pertama di layar: cover dimuat segera (gambar LCP). */
  eager?: boolean;
};

export default function CampaignCard({ campaign, eager }: CampaignCardProps) {
  return (
    <Link
      href={`/campaign/${campaign.slug}`}
      className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="pt-0 transition-colors hover:bg-muted/40">
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
            <ImageIcon className="size-6 text-muted-foreground" />
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 font-semibold">
            {campaign.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignProgress
            collectedAmount={campaign.collected}
            targetBudget={campaign.target_budget}
            donorCount={campaign.donorCount}
            endDate={campaign.end_date}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
