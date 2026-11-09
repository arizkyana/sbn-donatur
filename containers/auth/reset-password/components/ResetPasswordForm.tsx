"use client";

import { Loader2Icon } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useResetPassword from "../hooks/useResetPassword";

export default function ResetPasswordForm() {
  const {
    control,
    handleSubmit,
    onSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useResetPassword();
  const isProcessing = isSubmitting || isSubmitSuccessful;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
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
          name="password"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="password">Password baru</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!error}
              />
              <FieldDescription>Minimal 8 karakter</FieldDescription>
              <FieldError errors={[error]} />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="password_confirmation">
                Konfirmasi password baru
              </FieldLabel>
              <Input
                {...field}
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!error}
              />
              <FieldError errors={[error]} />
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" size="lg" disabled={isProcessing}>
        {isProcessing && <Loader2Icon className="animate-spin" />}
        {isProcessing ? "Memproses..." : "Simpan Password"}
      </Button>
    </form>
  );
}
