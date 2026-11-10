"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { CampaignCardSkeleton } from "@/components/campaign/CampaignCardSkeleton";
import { type CampaignSort, useCampaigns } from "@/hooks/use-campaigns";
import CampaignFilters from "./components/CampaignFilters";

export function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<CampaignSort>("newest");
  const debouncedSearch = useDebouncedValue(search.trim());

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
  } = useCampaigns({ search: debouncedSearch, sort });

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
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Daftar campaign gagal dimuat.
          </p>
          <Button
            variant="outline"
            disabled={isRefetching}
            onClick={() => refetch()}
          >
            Coba lagi
          </Button>
        </div>
      );
    }

    const campaigns = data.pages.flatMap((page) => page.rows);
    if (campaigns.length === 0) {
      return (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {debouncedSearch
              ? "Campaign tidak ditemukan"
              : "Belum ada campaign"}
          </p>
        </div>
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
    <section className="flex flex-col gap-4 p-4">
      <h1 className="sr-only">Daftar campaign</h1>
      <CampaignFilters
        search={search}
        sort={sort}
        onSearchChange={setSearch}
        onSortChange={setSort}
      />
      {renderContent()}
    </section>
  );
}
