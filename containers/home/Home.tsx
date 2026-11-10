"use client";

import { useState } from "react";
import { HeartHandshakeIcon, TriangleAlertIcon } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { CampaignCardSkeleton } from "@/components/campaign/CampaignCardSkeleton";
import { type CampaignSort, useCampaigns } from "@/hooks/use-campaigns";
import CampaignFilters from "./components/CampaignFilters";
import WelcomeBanner from "./components/WelcomeBanner";

export function Home() {
  const [sort, setSort] = useState<CampaignSort>("newest");

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
  } = useCampaigns({ search: "", sort });

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, index) => (
            <CampaignCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <EmptyState
          icon={TriangleAlertIcon}
          title="Daftar campaign gagal dimuat"
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
          icon={HeartHandshakeIcon}
          title={
            sort === "ending"
              ? "Belum ada campaign yang segera berakhir"
              : "Belum ada campaign"
          }
          description="Campaign kebaikan baru akan tampil di sini."
        />
      );
    }

    return (
      <>
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
  };

  return (
    <div className="flex flex-col">
      <WelcomeBanner />
      <section
        aria-labelledby="campaign-list-heading"
        className="flex flex-col gap-4 p-4 pt-6"
      >
        <div className="flex flex-col gap-3">
          <h2 id="campaign-list-heading" className="text-lg font-bold">
            Campaign Kebaikan
          </h2>
          <CampaignFilters sort={sort} onSortChange={setSort} />
        </div>
        {renderContent()}
      </section>
    </div>
  );
}
