import Image from "next/image";
import { notFound } from "next/navigation";
import { ClockIcon, ImageIcon, UsersIcon, type LucideIcon } from "lucide-react";
import { CampaignProgress } from "@/components/campaign/CampaignProgress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  formatRemainingDays,
  getRemainingDays,
  isCampaignEnded,
} from "@/lib/campaign";
import { RICH_TEXT_CLASS_NAME } from "@/lib/html";
import { getSettings } from "@/lib/settings";
import DonateBar from "./components/DonateBar";
import DonationList from "./components/DonationList";
import { getCampaignBySlug } from "./queries";

function StatTile({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-base leading-tight font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export async function CampaignDetail({ slug }: { slug: string }) {
  // DRAFT, ARCHIVED, dan slug yang tidak ada sama-sama 404.
  const [campaign, settings] = await Promise.all([
    getCampaignBySlug(slug),
    getSettings(),
  ]);
  if (!campaign) notFound();

  // Aman: dipanggil setelah data dibaca saat request, bukan saat prerender.
  const now = new Date();
  const remainingDays = getRemainingDays(campaign.end_date, now);

  return (
    // Ruang untuk bar donasi diberikan oleh Footer (data-sticky-bar="fixed").
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
      {/* Lembar info menumpang di tepi bawah cover. */}
      <div className="relative -mt-6 flex flex-col gap-4 rounded-t-3xl bg-card p-4 pt-5 shadow-card">
        <h1 className="text-xl leading-snug font-bold">{campaign.title}</h1>
        <CampaignProgress
          collectedAmount={campaign.collected}
          targetBudget={campaign.target_budget}
          donorCount={campaign.donorCount}
          endDate={campaign.end_date}
          hideMeta
        />
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            icon={UsersIcon}
            value={String(campaign.donorCount)}
            label="Donatur"
          />
          <StatTile
            icon={ClockIcon}
            value={formatRemainingDays(remainingDays)}
            label="Sisa waktu"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {campaign.content && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Cerita</h2>
            </CardHeader>
            <CardContent>
              <div
                className={RICH_TEXT_CLASS_NAME}
                // Konten sudah disanitasi di server saat disimpan dari sbn-office.
                dangerouslySetInnerHTML={{ __html: campaign.content }}
              />
            </CardContent>
          </Card>
        )}
        <DonationList
          campaignsId={campaign.id}
          donorCount={campaign.donorCount}
        />
      </div>
      <DonateBar
        slug={campaign.slug}
        title={campaign.title}
        isEnded={isCampaignEnded(campaign.end_date, now)}
        whatsappNumber={settings.whatsapp_number}
      />
    </article>
  );
}
