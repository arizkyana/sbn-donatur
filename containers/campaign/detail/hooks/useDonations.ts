import { useInfiniteQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export const PAGE_SIZE = 5;

async function fetchDonations(campaignsId: number, page: number) {
  const supabase = createClient();
  const from = page * PAGE_SIZE;

  // View public_donations hanya berisi donasi SUCCESS, nama sudah "Anonim" bila anonim.
  const { data, count, error } = await supabase
    .from("public_donations")
    .select("display_name, amount, paid_at", { count: "exact" })
    .eq("campaigns_id", campaignsId)
    .order("paid_at", { ascending: false, nullsFirst: false })
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  return { rows: data, total: count ?? 0 };
}

export default function useDonations(campaignsId: number) {
  return useInfiniteQuery({
    queryKey: ["donations", { campaignsId }],
    queryFn: ({ pageParam }) => fetchDonations(campaignsId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * PAGE_SIZE < lastPage.total
        ? allPages.length
        : undefined,
  });
}
