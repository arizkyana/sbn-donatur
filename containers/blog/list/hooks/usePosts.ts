import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import type { Enums } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";

export const PAGE_SIZE = 10;

export type PostTypeFilter = "ALL" | Enums<"post_type">;

type PostListParams = {
  type: PostTypeFilter;
  /** `null` = semua kategori. */
  categoriesId: number | null;
};

async function fetchPosts(
  { type, categoriesId }: PostListParams,
  page: number,
) {
  const supabase = createClient();
  const from = page * PAGE_SIZE;

  // RLS sudah membatasi publik ke PUBLISH; filter eksplisit agar admin yang login pun sama.
  let query = supabase
    .from("posts")
    .select(
      "id, slug, title, type, cover, video_url, published_at, categories (name)",
      { count: "exact" },
    )
    .eq("status", "PUBLISH");
  if (type !== "ALL") query = query.eq("type", type);
  if (categoriesId !== null) query = query.eq("categories_id", categoriesId);

  // DESC di Postgres menaruh NULL di depan; id sebagai pengurut terakhir agar
  // .range() stabil antar halaman.
  const { data, count, error } = await query
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw error;

  return { rows: data, total: count ?? 0 };
}

export type PostListItem = Awaited<
  ReturnType<typeof fetchPosts>
>["rows"][number];

export default function usePosts(params: PostListParams) {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: ({ pageParam }) => fetchPosts(params, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * PAGE_SIZE < lastPage.total
        ? allPages.length
        : undefined,
    placeholderData: keepPreviousData,
  });
}
