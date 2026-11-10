import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { startOfDayJakarta, startOfNextDayJakarta } from "@/lib/date";
import { createClient } from "@/lib/supabase/client";
import type { HistoryFilters } from "../History.types";

export const PAGE_SIZE = 10;

// userId ikut di query key agar cache tidak tercampur antarakun setelah
// keluar lalu masuk dengan akun lain di tab yang sama.
type MyDonationsParams = HistoryFilters & { userId: string };

async function fetchMyDonations(
  { userId, from, to, campaignsId }: MyDonationsParams,
  page: number,
) {
  const supabase = createClient();
  const start = page * PAGE_SIZE;

  // users_id eksplisit walau RLS sudah membatasi: admin yang login bisa membaca
  // semua transaksi. Campaign arsip/draft tidak bisa dibaca donatur, jadi
  // `campaigns` bernilai null (relasi tidak memakai !inner agar barisnya tetap ada).
  let query = supabase
    .from("transactions")
    .select(
      "order_id, created_at, amount, payment_status, campaigns_id, campaigns (title, slug)",
      { count: "exact" },
    )
    .eq("users_id", userId);
  if (campaignsId) query = query.eq("campaigns_id", campaignsId);
  if (from) query = query.gte("created_at", startOfDayJakarta(from));
  if (to) query = query.lt("created_at", startOfNextDayJakarta(to));

  // id sebagai pengurut terakhir agar .range() stabil antar halaman.
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(start, start + PAGE_SIZE - 1);
  if (error) throw error;

  return { rows: data, total: count ?? 0 };
}

export type MyDonation = Awaited<
  ReturnType<typeof fetchMyDonations>
>["rows"][number];

export default function useMyDonations(
  params: MyDonationsParams,
  { enabled }: { enabled: boolean },
) {
  return useInfiniteQuery({
    queryKey: ["my-donations", params],
    queryFn: ({ pageParam }) => fetchMyDonations(params, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * PAGE_SIZE < lastPage.total
        ? allPages.length
        : undefined,
    placeholderData: keepPreviousData,
    enabled,
  });
}
