"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn, formatRupiah } from "@/lib/utils";
import { AMOUNT_OPTIONS, MIN_DONATION_AMOUNT } from "../DonationForm.types";

type AmountPickerProps = {
  value: number | undefined;
  onChange: (amount: number | undefined) => void;
  onBlur: () => void;
  inputRef: React.Ref<HTMLInputElement>;
  error?: { message?: string };
};

export default function AmountPicker({
  value,
  onChange,
  onBlur,
  inputRef,
  error,
}: AmountPickerProps) {
  // Memilih tile mengisi input; mengetik di input mengosongkan pilihan tile.
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <Field data-invalid={!!error} className="gap-4">
      <div
        role="group"
        aria-label="Pilihan nominal donasi"
        className="grid grid-cols-2 gap-3"
      >
        {AMOUNT_OPTIONS.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedOption(option);
                onChange(option);
              }}
              className={cn(
                "relative flex h-14 items-center justify-center rounded-xl border bg-card text-lg font-bold shadow-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:active:scale-[0.98]",
                isSelected
                  ? "border-2 border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted",
              )}
            >
              {formatRupiah(option)}
              {isSelected && (
                <CheckIcon className="absolute top-1.5 right-1.5 size-4" />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor="amount" className="font-semibold">
          Atau masukkan nominal lain
        </FieldLabel>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-base font-semibold text-muted-foreground">
            Rp
          </span>
          <Input
            ref={inputRef}
            id="amount"
            name="amount"
            type="number"
            inputMode="numeric"
            min={MIN_DONATION_AMOUNT}
            step={1}
            placeholder="0"
            className="h-14 pl-11 text-xl font-bold"
            aria-invalid={!!error}
            value={value ?? ""}
            onBlur={onBlur}
            onChange={(event) => {
              setSelectedOption(null);
              onChange(
                event.target.value === ""
                  ? undefined
                  : event.target.valueAsNumber,
              );
            }}
          />
        </div>
        <FieldDescription className="text-sm">
          Minimal {formatRupiah(MIN_DONATION_AMOUNT)}
        </FieldDescription>
        <FieldError errors={[error]} />
      </div>
    </Field>
  );
}
