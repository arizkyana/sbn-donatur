"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartHandshakeIcon,
  SearchXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
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
        <EmptyState
          icon={TriangleAlertIcon}
          title="Riwayat donasi gagal dimuat"
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

    const donations = data.pages.flatMap((page) => page.rows);
    if (donations.length === 0) {
      return hasFilters ? (
        <EmptyState
          icon={SearchXIcon}
          title="Tidak ada donasi yang cocok dengan filter"
          description="Ubah campaign atau rentang tanggal, atau tekan Reset."
        />
      ) : (
        <EmptyState
          icon={HeartHandshakeIcon}
          title="Belum ada donasi"
          description="Donasi yang Anda lakukan saat masuk ke akun akan tampil di sini."
          action={
            <Button nativeButton={false} render={<Link href="/" />}>
              Lihat Campaign
            </Button>
          }
        />
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
