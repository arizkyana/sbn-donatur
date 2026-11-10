"use client";

import Link from "next/link";
import { SearchXIcon, TriangleAlertIcon } from "lucide-react";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { CampaignCardSkeleton } from "@/components/campaign/CampaignCardSkeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { useCampaigns } from "@/hooks/use-campaigns";
import { cn } from "@/lib/utils";

export default function SearchResults({ keyword }: { keyword: string }) {
  const {
    data,
    isPending,
    isError,
    isPlaceholderData,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCampaigns({ search: keyword, sort: "newest" });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 2 }, (_, index) => (
          <CampaignCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={TriangleAlertIcon}
        title="Pencarian gagal dimuat"
        description="Periksa koneksi internet, lalu coba lagi."
        action={
          <Button
            variant="outline"
            disabled={isRefetching}
            onClick={() => refetch()}
          >
            Coba lagi
          </Button>
        }
      />
    );
  }

  const campaigns = data.pages.flatMap((page) => page.rows);
  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="Campaign tidak ditemukan"
        description={`Tidak ada campaign untuk "${keyword}". Coba kata kunci lain.`}
        action={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            Lihat semua campaign
          </Button>
        }
      />
    );
  }

  return (
    <>
      <p aria-live="polite" className="text-base">
        Ditemukan <span className="font-bold">{data.pages[0].total}</span>{" "}
        campaign untuk{" "}
        <span className="font-bold">&ldquo;{keyword}&rdquo;</span>
      </p>
      <div
        className={cn(
          "flex flex-col gap-4 transition-opacity",
          isPlaceholderData && "opacity-60",
        )}
      >
        {campaigns.map((campaign, index) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            eager={index === 0}
          />
        ))}
      </div>
      {hasNextPage && (
        <Button
          variant="outline"
          disabled={isFetchingNextPage || isPlaceholderData}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Memuat..." : "Muat lebih banyak"}
        </Button>
      )}
    </>
  );
}
