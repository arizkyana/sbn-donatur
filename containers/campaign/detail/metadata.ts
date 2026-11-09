import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "./queries";

// URL relatif di-resolve oleh metadataBase (NEXT_PUBLIC_SITE_URL) di root layout.
export async function generateCampaignMetadata(
  slug: string,
): Promise<Metadata> {
  // Memakai cache() yang sama dengan halaman, jadi tidak ada query tambahan.
  const campaign = await getCampaignBySlug(slug);
  // Status tetap 200 (shell loading.tsx sudah terkirim), tetapi Next menambahkan
  // meta robots noindex pada halaman not-found.
  if (!campaign) notFound();

  const url = `/campaign/${campaign.slug}`;
  const description = campaign.description ?? undefined;
  const images = campaign.cover ? [campaign.cover] : undefined;

  return {
    title: campaign.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: campaign.title,
      description,
      images,
      siteName: "Sobat Baik Nusantara",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.title,
      description,
      images,
    },
  };
}
