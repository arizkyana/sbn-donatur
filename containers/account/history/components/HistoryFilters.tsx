"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HistoryFilterValues } from "../History.types";

type HistoryFiltersProps = {
  values: HistoryFilterValues;
  campaignOptions: { value: string; label: string }[];
  error?: string;
  canReset: boolean;
  onChange: (values: Partial<HistoryFilterValues>) => void;
  onReset: () => void;
};

export default function HistoryFilters({
  values,
  campaignOptions,
  error,
  canReset,
  onChange,
  onReset,
}: HistoryFiltersProps) {
  // `items` membuat trigger Select Base UI menampilkan label, bukan value.
  const campaignItems = [
    { value: "ALL", label: "Semua campaign" },
    ...campaignOptions,
  ];

  return (
    <div className="flex flex-col gap-2">
      <Select
        items={campaignItems}
        value={values.campaignsId}
        onValueChange={(value) => value && onChange({ campaignsId: value })}
      >
        <SelectTrigger aria-label="Filter campaign" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {campaignItems.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          aria-label="Dari tanggal"
          className="flex-1"
          max={values.to || undefined}
          value={values.from}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange({ from: event.target.value })}
        />
        <span className="text-sm text-muted-foreground">s.d.</span>
        <Input
          type="date"
          aria-label="Sampai tanggal"
          className="flex-1"
          min={values.from || undefined}
          value={values.to}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange({ to: event.target.value })}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Riwayat hanya menampilkan donasi yang dilakukan saat Anda masuk ke
          akun.
        </p>
        {canReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
