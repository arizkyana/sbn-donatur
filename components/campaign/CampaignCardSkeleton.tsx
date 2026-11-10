import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CampaignCardSkeleton() {
  return (
    <Card className="pt-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-2.5 w-full rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-11 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
