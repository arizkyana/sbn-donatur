"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EMPTY_HISTORY_FILTERS,
  parseHistoryFilters,
  type HistoryFilterValues,
} from "../History.types";
import useMyCampaignOptions from "../hooks/useMyCampaignOptions";
import useMyDonations from "../hooks/useMyDonations";
import DonationHistoryCard from "./DonationHistoryCard";
import HistoryFilters from "./HistoryFilters";
import { HistorySkeleton } from "./HistorySkeleton";

export default function DonationHistory({ userId }: { userId: string }) {
  const [values, setValues] = useState(EMPTY_HISTORY_FILTERS);
  const parsed = parseHistoryFilters(values);
  const filters = parsed.success ? parsed.data : {};
  const filterError = parsed.success
    ? undefined
    : parsed.error.issues[0]?.message;
  const hasFilters =
    values.from !== "" || values.to !== "" || values.campaignsId !== "ALL";

  const { data: campaignOptions = [] } = useMyCampaignOptions(userId);
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
  } = useMyDonations({ userId, ...filters }, { enabled: parsed.success });

  const updateFilters = (changes: Partial<HistoryFilterValues>) =>
    setValues((current) => ({ ...current, ...changes }));

  const renderContent = () => {
    // Rentang tanggal terbalik: query tidak dijalankan, pesan ada di bawah filter.
    if (!parsed.success) return null;

    if (isPending) return <HistorySkeleton />;

    if (isError) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Riwayat donasi gagal dimuat.
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

    const donations = data.pages.flatMap((page) => page.rows);
    if (donations.length === 0) {
      return hasFilters ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Tidak ada donasi yang cocok dengan filter
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">Belum ada donasi</p>
          <Button nativeButton={false} render={<Link href="/" />}>
            Lihat Campaign
          </Button>
        </div>
      );
    }

    return (
      <>
        <div
          className={cn(
            "flex flex-col gap-3 transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          {donations.map((donation) => (
            <DonationHistoryCard key={donation.order_id} donation={donation} />
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
    <div className="flex flex-col gap-4">
      <HistoryFilters
        values={values}
        campaignOptions={campaignOptions}
        error={filterError}
        canReset={hasFilters}
        onChange={updateFilters}
        onReset={() => setValues(EMPTY_HISTORY_FILTERS)}
      />
      {renderContent()}
    </div>
  );
}
