"use client";

import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import useDonationForm, { type DonorDefaults } from "../hooks/useDonationForm";
import AmountPicker from "./AmountPicker";

type DonationFormFieldsProps = {
  slug: string;
  donor: DonorDefaults | null;
};

export default function DonationFormFields({
  slug,
  donor,
}: DonationFormFieldsProps) {
  const {
    control,
    handleSubmit,
    onSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useDonationForm(slug, donor);
  const amount = useWatch({ control, name: "amount" });
  // Tetap disabled setelah berhasil, selama browser berpindah ke Midtrans,
  // agar klik berulang tidak membuat transaksi ganda.
  const isProcessing = isSubmitting || isSubmitSuccessful;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6 p-4"
    >
      {errors.root && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          {errors.root.message}
        </p>
      )}
      <Controller
        control={control}
        name="amount"
        render={({ field, fieldState: { error } }) => (
          <AmountPicker
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            error={error}
          />
        )}
      />
      <FieldGroup>
        <Controller
          control={control}
          name="donor_name"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="donor_name">Nama lengkap</FieldLabel>
              <Input
                {...field}
                id="donor_name"
                autoComplete="name"
                aria-invalid={!!error}
              />
              <FieldError errors={[error]} />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="donor_email"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="donor_email">Email</FieldLabel>
              <Input
                {...field}
                id="donor_email"
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!error}
              />
              <FieldDescription>
                Bukti donasi dikirim ke email ini
              </FieldDescription>
              <FieldError errors={[error]} />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="donor_phone"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="donor_phone">No. HP (opsional)</FieldLabel>
              <Input
                {...field}
                id="donor_phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="08xxxxxxxxxx"
                aria-invalid={!!error}
              />
              <FieldError errors={[error]} />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="is_anonymous"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox
                id="is_anonymous"
                name={field.name}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
              <FieldLabel htmlFor="is_anonymous" className="font-normal">
                Sembunyikan nama saya (tampil sebagai Anonim)
              </FieldLabel>
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex flex-col gap-3 border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Dengan berdonasi, Anda menyetujui{" "}
          <Link
            href="/syarat-ketentuan"
            className="text-primary underline-offset-4 hover:underline"
          >
            Syarat &amp; Ketentuan
          </Link>
          .
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total donasi</span>
          <span className="font-semibold">
            {amount ? formatRupiah(amount) : "-"}
          </span>
        </div>
        <Button type="submit" size="lg" disabled={isProcessing}>
          {isProcessing && <Loader2Icon className="animate-spin" />}
          {isProcessing ? "Memproses..." : "Lanjut ke Pembayaran"}
        </Button>
      </div>
    </form>
  );
}
