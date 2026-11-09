import { Skeleton } from "@/components/ui/skeleton";

/** Kartu riwayat saat memuat. `withFilters` untuk loading.tsx halaman. */
export function HistorySkeleton({ withFilters = false }) {
  return (
    <div className="flex flex-col gap-4">
      {withFilters && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-lg border p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
