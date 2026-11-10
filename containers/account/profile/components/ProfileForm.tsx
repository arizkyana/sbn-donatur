"use client";

import { Loader2Icon } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ProfileInput } from "../Profile.types";
import useProfileForm from "../hooks/useProfileForm";

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileInput;
}) {
  const {
    control,
    handleSubmit,
    onSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useProfileForm(defaultValues);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <h2 className="font-semibold">Ubah Profil</h2>
      {errors.root && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          {errors.root.message}
        </p>
      )}
      <FieldGroup>
        <Controller
          control={control}
          name="full_name"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="full_name">Nama lengkap</FieldLabel>
              <Input
                {...field}
                id="full_name"
                autoComplete="name"
                aria-invalid={!!error}
              />
              <FieldError errors={[error]} />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="phone">No. HP (opsional)</FieldLabel>
              <Input
                {...field}
                id="phone"
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
      </FieldGroup>
      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting && <Loader2Icon className="animate-spin" />}
        {isSubmitting ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
