"use client";

import { SearchIcon } from "lucide-react";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useCampaigns } from "@/hooks/use-campaigns";

const SUGGESTION_COUNT = 3;

// Tampilan sebelum mengetik: petunjuk dan campaign yang segera berakhir sebagai saran.
export default function SearchSuggestions() {
  // Query key sama dengan urutan "Segera Berakhir" di beranda, jadi cache dipakai ulang.
  const { data } = useCampaigns({ search: "", sort: "ending" });
  // Campaign tanpa tanggal berakhir ada di urutan akhir dan bukan "segera berakhir".
  const campaigns =
    data?.pages[0].rows
      .filter((campaign) => campaign.end_date)
      .slice(0, SUGGESTION_COUNT) ?? [];

  return (
    <>
      <EmptyState
        icon={SearchIcon}
        title="Cari campaign yang ingin kamu bantu"
        description="Ketik nama program, contoh: sedekah, yatim."
        className="py-8"
      />
      {campaigns.length > 0 && (
        <section
          aria-labelledby="search-suggestion-heading"
          className="flex flex-col gap-4"
        >
          <h2 id="search-suggestion-heading" className="text-lg font-bold">
            Segera berakhir
          </h2>
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </section>
      )}
    </>
  );
}
