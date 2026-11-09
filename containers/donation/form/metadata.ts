import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/containers/campaign/detail/queries";

export async function generateDonationMetadata(
  slug: string,
): Promise<Metadata> {
  // Memakai cache() yang sama dengan halaman, jadi tidak ada query tambahan.
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  return {
    title: `Donasi - ${campaign.title}`,
    robots: { index: false },
  };
}
