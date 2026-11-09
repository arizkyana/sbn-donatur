import { Skeleton } from "@/components/ui/skeleton";

export function DonationStatusSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col items-center gap-3 py-6">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex flex-col gap-3 rounded-lg border p-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
