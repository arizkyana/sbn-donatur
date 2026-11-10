import Image from "next/image";
import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { CampaignProgress } from "@/components/campaign/CampaignProgress";
import { isCampaignEnded } from "@/lib/campaign";
import { RICH_TEXT_CLASS_NAME } from "@/lib/html";
import { getSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import DonateBar from "./components/DonateBar";
import DonationList from "./components/DonationList";
import { getCampaignBySlug } from "./queries";

export async function CampaignDetail({ slug }: { slug: string }) {
  // DRAFT, ARCHIVED, dan slug yang tidak ada sama-sama 404.
  const [campaign, settings] = await Promise.all([
    getCampaignBySlug(slug),
    getSettings(),
  ]);
  if (!campaign) notFound();

  return (
    // Ruang untuk sticky bar donasi diberikan oleh Footer (data-sticky-bar).
    <article className="flex flex-col">
      <div className="relative flex aspect-video items-center justify-center bg-muted">
        {campaign.cover ? (
          <Image
            src={campaign.cover}
            alt=""
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            preload
            className="object-cover"
          />
        ) : (
          <ImageIcon className="size-8 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-xl leading-snug font-semibold">{campaign.title}</h1>
        <CampaignProgress
          collectedAmount={campaign.collected}
          targetBudget={campaign.target_budget}
          donorCount={campaign.donorCount}
          endDate={campaign.end_date}
        />
      </div>
      {campaign.content && (
        <div
          className={cn(RICH_TEXT_CLASS_NAME, "border-t p-4")}
          // Konten sudah disanitasi di server saat disimpan dari sbn-office.
          dangerouslySetInnerHTML={{ __html: campaign.content }}
        />
      )}
      <DonationList
        campaignsId={campaign.id}
        donorCount={campaign.donorCount}
      />
      <DonateBar
        slug={campaign.slug}
        title={campaign.title}
        isEnded={isCampaignEnded(campaign.end_date, new Date())}
        whatsappNumber={settings.whatsapp_number}
      />
    </article>
  );
}
