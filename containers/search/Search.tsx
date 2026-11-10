import { Suspense } from "react";
import SearchContent from "./components/SearchContent";
import SearchSkeleton from "./components/SearchSkeleton";

// Kata kunci dibaca dari ?q= lewat useSearchParams(), jadi wajib di dalam <Suspense>.
export function Search() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
