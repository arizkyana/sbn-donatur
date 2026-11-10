import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap";
import { getAbsoluteUrl } from "@/lib/utils";

// /tentang dan /syarat-ketentuan ditambahkan setelah halamannya dibuat (backlog 007).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { campaigns, posts } = await getSitemapEntries();

  return [
    { url: getAbsoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: getAbsoluteUrl("/blog"), changeFrequency: "daily", priority: 0.8 },
    ...campaigns.map((campaign) => ({
      url: getAbsoluteUrl(`/campaign/${campaign.slug}`),
      lastModified: campaign.updated_at,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...posts.map((post) => ({
      url: getAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
