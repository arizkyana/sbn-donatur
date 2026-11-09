"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CampaignSort } from "../hooks/useCampaigns";

const sortOptions: { value: CampaignSort; label: string }[] = [
  { value: "newest", label: "Terbaru" },
  { value: "ending", label: "Segera Berakhir" },
];

type CampaignFiltersProps = {
  search: string;
  sort: CampaignSort;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: CampaignSort) => void;
};

export default function CampaignFilters({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: CampaignFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari campaign"
          aria-label="Cari judul campaign"
          className="pl-8"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
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
    </div>
  );
}
