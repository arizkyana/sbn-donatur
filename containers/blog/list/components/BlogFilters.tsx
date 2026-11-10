"use client";

import { Button } from "@/components/ui/button";
import { postTypeLabel } from "@/lib/blog";
import type { PostTypeFilter } from "../hooks/usePosts";

const typeOptions: { value: PostTypeFilter; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "ARTICLE", label: postTypeLabel.ARTICLE },
  { value: "VIDEO", label: postTypeLabel.VIDEO },
];

type BlogFiltersProps = {
  type: PostTypeFilter;
  categoriesId: number | null;
  categories: { id: number; name: string }[];
  onTypeChange: (type: PostTypeFilter) => void;
  onCategoryChange: (categoriesId: number | null) => void;
};

export default function BlogFilters({
  type,
  categoriesId,
  categories,
  onTypeChange,
  onCategoryChange,
}: BlogFiltersProps) {
  const categoryOptions = [
    { id: null, name: "Semua" },
    ...categories,
  ] as const satisfies readonly { id: number | null; name: string }[];

  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label="Tipe post" className="flex gap-2">
        {typeOptions.map((option) => (
          <Button
            key={option.value}
            variant={type === option.value ? "default" : "outline"}
            size="sm"
            className="flex-1 rounded-full"
            aria-pressed={type === option.value}
            onClick={() => onTypeChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {/* Kategori bisa banyak: di-scroll horizontal, tidak membungkus ke baris baru. */}
      <div
        role="group"
        aria-label="Kategori"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
      >
        {categoryOptions.map((category) => (
          <Button
            key={category.id ?? "all"}
            variant={categoriesId === category.id ? "secondary" : "ghost"}
            size="sm"
            className="shrink-0 rounded-full"
            aria-pressed={categoriesId === category.id}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
