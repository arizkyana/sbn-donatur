import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DonationStatusSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col items-center gap-3 pt-4">
        <Skeleton className="mb-2 size-20 rounded-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
      </div>
      <Card>
        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}
