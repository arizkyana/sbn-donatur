import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export const PAGE_SIZE = 10;

export type CampaignSort = "newest" | "ending";

type CampaignListParams = {
  search: string;
  sort: CampaignSort;
};

// % dan _ dari input dicari apa adanya, bukan sebagai wildcard ilike.
function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

async function fetchCampaigns(
  { search, sort }: CampaignListParams,
  page: number,
) {
  const supabase = createClient();
  const from = page * PAGE_SIZE;
  const now = new Date().toISOString();

  // RLS sudah membatasi publik ke PUBLISH; filter eksplisit agar admin yang login pun sama.
  // Campaign terjadwal (start_date di masa depan) belum tampil.
  let query = supabase
    .from("campaigns")
    .select("id, slug, title, cover, target_budget, end_date", {
      count: "exact",
    })
    .eq("status", "PUBLISH")
    .lte("start_date", now);
  if (search) query = query.ilike("title", `%${escapeLike(search)}%`);

  if (sort === "ending") {
    // Campaign yang sudah berakhir tidak termasuk "Segera Berakhir"; yang tanpa end_date di akhir.
    query = query
      .or(`end_date.is.null,end_date.gte."${now}"`)
      .order("end_date", { ascending: true, nullsFirst: false });
  } else {
    query = query.order("start_date", { ascending: false });
  }

  // id sebagai pengurut terakhir agar .range() stabil antar halaman.
  const { data, count, error } = await query
    .order("id", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  // View campaign_progress tidak terdeteksi sebagai relasi, jadi dibaca dengan query kedua.
  const progressById = new Map<
    number,
    { collected: number; donorCount: number }
  >();
  if (data.length > 0) {
    const { data: progress, error: progressError } = await supabase
      .from("campaign_progress")
      .select("campaigns_id, collected_amount, donor_count")
      .in(
        "campaigns_id",
        data.map((campaign) => campaign.id),
      );
    if (progressError) throw progressError;

    progress.forEach((row) => {
      if (row.campaigns_id !== null) {
        progressById.set(row.campaigns_id, {
          collected: row.collected_amount ?? 0,
          donorCount: row.donor_count ?? 0,
        });
      }
    });
  }

  return {
    rows: data.map((campaign) => ({
      ...campaign,
      collected: progressById.get(campaign.id)?.collected ?? 0,
      donorCount: progressById.get(campaign.id)?.donorCount ?? 0,
    })),
    total: count ?? 0,
  };
}

export type CampaignListItem = Awaited<
  ReturnType<typeof fetchCampaigns>
>["rows"][number];

// Dipakai beranda dan halaman pencarian.
export function useCampaigns(params: CampaignListParams) {
  return useInfiniteQuery({
    queryKey: ["campaigns", params],
    queryFn: ({ pageParam }) => fetchCampaigns(params, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * PAGE_SIZE < lastPage.total
        ? allPages.length
        : undefined,
    placeholderData: keepPreviousData,
  });
}
