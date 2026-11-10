import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap";
import { getAbsoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { campaigns, posts } = await getSitemapEntries();

  return [
    { url: getAbsoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: getAbsoluteUrl("/blog"), changeFrequency: "daily", priority: 0.8 },
    {
      url: getAbsoluteUrl("/tentang"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: getAbsoluteUrl("/syarat-ketentuan"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
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
