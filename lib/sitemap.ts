import "server-only";

import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Slug dan `updated_at` campaign serta post PUBLISH untuk `app/sitemap.ts`.
 * Di-cache per jam: ikut di-prerender saat build dan diperbarui di latar
 * belakang setelah cache kedaluwarsa.
 */
export async function getSitemapEntries() {
  "use cache";
  cacheLife("hours");

  const supabase = createPublicClient();
  const [campaigns, posts] = await Promise.all([
    supabase
      .from("campaigns")
      .select("slug, updated_at")
      .eq("status", "PUBLISH")
      .order("updated_at", { ascending: false }),
    supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("status", "PUBLISH")
      .order("updated_at", { ascending: false }),
  ]);
  if (campaigns.error) throw campaigns.error;
  if (posts.error) throw posts.error;

  return { campaigns: campaigns.data, posts: posts.data };
}
