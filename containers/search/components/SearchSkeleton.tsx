import { Skeleton } from "@/components/ui/skeleton";

export default function SearchSkeleton() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <Skeleton className="size-11 rounded-lg" />
      <Skeleton className="h-12 flex-1 rounded-lg" />
    </div>
  );
}
