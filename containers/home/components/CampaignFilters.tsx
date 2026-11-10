"use client";

import { Button } from "@/components/ui/button";
import type { CampaignSort } from "@/hooks/use-campaigns";

const sortOptions: { value: CampaignSort; label: string }[] = [
  { value: "newest", label: "Terbaru" },
  { value: "ending", label: "Segera Berakhir" },
];

type CampaignFiltersProps = {
  sort: CampaignSort;
  onSortChange: (sort: CampaignSort) => void;
};

// Pencarian ada di halaman /cari; beranda hanya mengatur urutan.
export default function CampaignFilters({
  sort,
  onSortChange,
}: CampaignFiltersProps) {
  return (
    <div role="group" aria-label="Urutkan campaign" className="flex gap-2">
      {sortOptions.map((option) => (
        <Button
          key={option.value}
          variant={sort === option.value ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          aria-pressed={sort === option.value}
          onClick={() => onSortChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
