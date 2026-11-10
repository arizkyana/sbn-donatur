import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Kartu riwayat saat memuat. `withFilters` untuk loading.tsx halaman. */
export function HistorySkeleton({ withFilters = false }) {
  return (
    <div className="flex flex-col gap-4">
      {withFilters && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      )}
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index} className="gap-2 p-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/2" />
        </Card>
      ))}
    </div>
  );
}
