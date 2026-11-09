import { Skeleton } from "@/components/ui/skeleton";
import { HistorySkeleton } from "@/containers/account/history";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-7 w-1/2" />
      <HistorySkeleton withFilters />
    </div>
  );
}
