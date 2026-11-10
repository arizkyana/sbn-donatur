import { Skeleton } from "@/components/ui/skeleton";

export function BlogDetailSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex flex-col gap-2 border-t p-4">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
