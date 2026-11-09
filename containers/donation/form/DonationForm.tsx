import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/containers/campaign/detail/queries";
import { isCampaignEnded } from "@/lib/campaign";
import CampaignEndedNotice from "./components/CampaignEndedNotice";
import CampaignSummary from "./components/CampaignSummary";
import DonationFormFields from "./components/DonationFormFields";

export async function DonationForm({ slug }: { slug: string }) {
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  return (
    <div className="flex flex-col">
      <CampaignSummary title={campaign.title} cover={campaign.cover} />
      {/* Sama dengan tombol donasi di detail campaign (A5 di backlog 003). */}
      {isCampaignEnded(campaign.end_date, new Date()) ? (
        <CampaignEndedNotice slug={campaign.slug} />
      ) : (
        <DonationFormFields slug={campaign.slug} />
      )}
    </div>
  );
}
