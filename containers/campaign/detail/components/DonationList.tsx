"use client";

import { UserRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/date";
import { formatRupiah } from "@/lib/utils";
import useDonations from "../hooks/useDonations";

type DonationListProps = {
  campaignsId: number;
  donorCount: number;
};

export default function DonationList({
  campaignsId,
  donorCount,
}: DonationListProps) {
  const {
    data,
    isPending,
    isError,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useDonations(campaignsId);

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Daftar donasi gagal dimuat.
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
      return (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Jadilah donatur pertama untuk campaign ini
        </p>
      );
    }

    // new Date() hanya dipanggil setelah data selesai di-fetch di client.
    const now = new Date();
    return (
      <>
        <ul className="flex flex-col divide-y">
          {donations.map((donation, index) => (
            // View public_donations tidak punya id; daftar hanya bertambah di akhir.
            <li key={index} className="flex items-center gap-3 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRoundIcon className="size-4" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {donation.display_name}
                </span>
                {donation.paid_at && (
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(donation.paid_at, now)}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold">
                {formatRupiah(donation.amount ?? 0)}
              </span>
            </li>
          ))}
        </ul>
        {hasNextPage && (
          <Button
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Memuat..." : "Muat lebih banyak"}
          </Button>
        )}
      </>
    );
  };

  return (
    <section className="flex flex-col gap-3 border-t p-4">
      <h2 className="font-semibold">Donasi ({donorCount})</h2>
      {renderContent()}
    </section>
  );
}
