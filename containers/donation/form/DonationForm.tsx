import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/containers/campaign/detail/queries";
import { getCurrentUser } from "@/lib/auth";
import { isCampaignEnded } from "@/lib/campaign";
import CampaignEndedNotice from "./components/CampaignEndedNotice";
import CampaignSummary from "./components/CampaignSummary";
import DonationFormFields from "./components/DonationFormFields";

export async function DonationForm({ slug }: { slug: string }) {
  // Halaman ini berada di dalam <Suspense> loading.tsx, jadi aman membaca session.
  const [campaign, user] = await Promise.all([
    getCampaignBySlug(slug),
    getCurrentUser(),
  ]);
  if (!campaign) notFound();

  return (
    <div className="flex flex-col">
      <CampaignSummary title={campaign.title} cover={campaign.cover} />
      {/* Sama dengan tombol donasi di detail campaign (A5 di backlog 003). */}
      {isCampaignEnded(campaign.end_date, new Date()) ? (
        <CampaignEndedNotice slug={campaign.slug} />
      ) : (
        <DonationFormFields
          slug={campaign.slug}
          // DON008: isi awal dari profil bila login; field tetap bisa diubah.
          donor={
            user && {
              donor_name: user.fullName ?? "",
              donor_email: user.email,
              donor_phone: user.phone ?? "",
            }
          }
        />
      )}
    </div>
  );
}
