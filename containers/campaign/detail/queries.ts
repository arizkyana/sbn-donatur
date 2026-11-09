import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Sama dengan aturan slug di schema campaign sbn-office.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// cache(): halaman dan generateMetadata cukup satu query per request.
export const getCampaignBySlug = cache(async (slug: string) => {
  // Slug yang formatnya salah langsung dianggap tidak ada, tanpa query ke database.
  if (!SLUG_PATTERN.test(slug)) return null;

  const supabase = await createClient();
  // RLS sudah membatasi publik ke PUBLISH; filter eksplisit agar admin yang login pun sama.
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select(
      "id, slug, title, description, content, cover, end_date, target_budget",
    )
    .eq("slug", slug)
    .eq("status", "PUBLISH")
    .maybeSingle();
  if (error) throw error;
  if (!campaign) return null;

  // View campaign_progress tidak terdeteksi sebagai relasi, jadi dibaca dengan query kedua.
  const { data: progress, error: progressError } = await supabase
    .from("campaign_progress")
    .select("collected_amount, donor_count")
    .eq("campaigns_id", campaign.id)
    .maybeSingle();
  if (progressError) throw progressError;

  return {
    ...campaign,
    collected: progress?.collected_amount ?? 0,
    donorCount: progress?.donor_count ?? 0,
  };
});
