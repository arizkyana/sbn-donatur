"use client";

import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      className="flex flex-col gap-4"
    >
      {errors.root && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          {errors.root.message}
        </p>
      )}
      <Card>
        <CardHeader>
          <h2 className="text-base font-bold">Pilih Nominal</h2>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-base font-bold">Data Diri</h2>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              control={control}
              name="donor_name"
              render={({ field, fieldState: { error } }) => (
                <Field data-invalid={!!error}>
                  <FieldLabel htmlFor="donor_name" className="font-semibold">
                    Nama lengkap
                  </FieldLabel>
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
                  <FieldLabel htmlFor="donor_email" className="font-semibold">
                    Email
                  </FieldLabel>
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
                  <FieldLabel htmlFor="donor_phone" className="font-semibold">
                    No. HP (opsional)
                  </FieldLabel>
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
                // Seluruh baris bisa diklik: label membungkus checkbox.
                <FieldLabel htmlFor="is_anonymous" className="rounded-xl">
                  <Field
                    orientation="horizontal"
                    className="min-h-12 items-center"
                  >
                    <Checkbox
                      id="is_anonymous"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                    <span className="text-base font-normal">
                      Sembunyikan nama saya (tampil sebagai Anonim)
                    </span>
                  </Field>
                </FieldLabel>
              )}
            />
          </FieldGroup>
        </CardContent>
      </Card>
      <p className="px-1 text-sm text-muted-foreground">
        Dengan berdonasi, Anda menyetujui{" "}
        <Link
          href="/syarat-ketentuan"
          className="font-medium text-primary underline underline-offset-4"
        >
          Syarat &amp; Ketentuan
        </Link>
        .
      </p>
      {/* Ringkasan total selalu terlihat di atas Bottom Navigation selama form di layar.
          data-sticky-bar menyembunyikan tombol Hubungi Kami yang mengambang. */}
      <div
        data-sticky-bar="sticky"
        className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] z-10 -mx-4 flex flex-col gap-2 rounded-t-2xl bg-card px-4 pt-3 pb-3 shadow-bar"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">Total donasi</span>
          <span className="text-lg font-bold text-primary">
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
