"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
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
  // Memilih chip mengisi input; mengetik di input mengosongkan pilihan chip.
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor="amount">Nominal donasi</FieldLabel>
      <div className="grid grid-cols-3 gap-2">
        {AMOUNT_OPTIONS.map((option) => (
          <Button
            key={option}
            type="button"
            variant={selectedOption === option ? "default" : "outline"}
            aria-pressed={selectedOption === option}
            onClick={() => {
              setSelectedOption(option);
              onChange(option);
            }}
          >
            {formatRupiah(option)}
          </Button>
        ))}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
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
          placeholder="Nominal lain"
          className="pl-9"
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
      <FieldDescription>
        Minimal {formatRupiah(MIN_DONATION_AMOUNT)}
      </FieldDescription>
      <FieldError errors={[error]} />
    </Field>
  );
}
