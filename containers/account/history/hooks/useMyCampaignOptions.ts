import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

/** Opsi filter: campaign yang pernah didonasi user (unik, urut judul). */
async function fetchMyCampaignOptions(userId: string) {
  const { data, error } = await createClient()
    .from("transactions")
    .select("campaigns_id, campaigns (title)")
    .eq("users_id", userId);
  if (error) throw error;

  // Campaign arsip/draft (campaigns null) tidak bisa ditampilkan judulnya, jadi dilewati.
  const titleById = new Map<number, string>();
  data.forEach((row) => {
    if (row.campaigns) titleById.set(row.campaigns_id, row.campaigns.title);
  });
  return [...titleById]
    .map(([id, title]) => ({ value: String(id), label: title }))
    .sort((a, b) => a.label.localeCompare(b.label, "id"));
}

export default function useMyCampaignOptions(userId: string) {
  return useQuery({
    queryKey: ["my-donations", "campaign-options", { userId }],
    queryFn: () => fetchMyCampaignOptions(userId),
  });
}
