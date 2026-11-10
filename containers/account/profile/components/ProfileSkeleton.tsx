import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center gap-4 rounded-xl bg-muted p-4">
        <Skeleton className="size-14 rounded-full bg-card" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-1/2 bg-card" />
          <Skeleton className="h-4 w-2/3 bg-card" />
        </div>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-5 w-1/3" />
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
