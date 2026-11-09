import { Skeleton } from "@/components/ui/skeleton";

export function DonationFormSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 border-b p-4">
        <Skeleton className="aspect-video w-24 shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
      <div className="flex flex-col gap-6 p-4">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-8" />
          ))}
        </div>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
