"use client";

import {
  HeartHandshakeIcon,
  TriangleAlertIcon,
  UserRoundIcon,
} from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/date";
import { cn, formatRupiah } from "@/lib/utils";
import useDonations from "../hooks/useDonations";

// Warna avatar bergantian dari palet hijau dan emas.
const AVATAR_COLORS = [
  "bg-primary/10 text-primary",
  "bg-brand-gold/20 text-brand-gold-strong",
];

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

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
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <EmptyState
          icon={TriangleAlertIcon}
          title="Daftar donasi gagal dimuat"
          className="py-6"
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
      return (
        <EmptyState
          icon={HeartHandshakeIcon}
          title="Jadilah donatur pertama"
          description="Belum ada donasi untuk campaign ini."
          className="py-6"
        />
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
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  AVATAR_COLORS[index % AVATAR_COLORS.length],
                )}
              >
                {/* "Anonim" dan nama kosong memakai ikon, bukan inisial. */}
                {donation.display_name && donation.display_name !== "Anonim" ? (
                  getInitials(donation.display_name)
                ) : (
                  <UserRoundIcon className="size-5" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-base font-semibold">
                  {donation.display_name}
                </span>
                {donation.paid_at && (
                  <span className="text-sm text-muted-foreground">
                    {formatRelativeTime(donation.paid_at, now)}
                  </span>
                )}
              </div>
              <span className="text-base font-bold text-primary">
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
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Donasi ({donorCount})</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
