import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

/**
 * Kata kunci pencarian yang disimpan di `?q=`, agar hasil bisa dibagikan dan
 * tetap ada saat kembali dari detail campaign. URL diperbarui setelah jeda
 * mengetik, dan `keyword` (yang sudah di-trim) dipakai untuk query.
 */
export default function useSearchQuery() {
  const router = useRouter();
  const urlKeyword = useSearchParams().get("q")?.trim() ?? "";
  const [query, setQuery] = useState(urlKeyword);
  const keyword = useDebouncedValue(query.trim());

  useEffect(() => {
    if (keyword === urlKeyword) return;
    router.replace(
      keyword ? `/cari?q=${encodeURIComponent(keyword)}` : "/cari",
      { scroll: false },
    );
  }, [keyword, urlKeyword, router]);

  return { query, setQuery, keyword };
}
