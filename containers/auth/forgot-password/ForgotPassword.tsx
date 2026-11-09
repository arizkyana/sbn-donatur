"use client";

import Link from "next/link";
import { Loader2Icon, MailCheckIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import useForgotPassword from "./hooks/useForgotPassword";

export function ForgotPassword() {
  const {
    control,
    handleSubmit,
    onSubmit,
    isSent,
    formState: { errors, isSubmitting },
  } = useForgotPassword();

  if (isSent) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <MailCheckIcon className="size-12 text-primary" />
        <h2 className="text-lg font-semibold">Cek email Anda</h2>
        <p className="text-sm text-muted-foreground">
          Bila email terdaftar, kami telah mengirim link untuk mengatur ulang
          password.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/login" />}
        >
          Kembali ke halaman Masuk
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AuthPageHeader
        title="Lupa Password"
        description="Masukkan email akun Anda. Kami akan mengirim link untuk mengatur ulang password."
      />
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
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!error}
              />
              <FieldError errors={[error]} />
            </Field>
          )}
        />
        <div className="flex flex-col gap-3">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {isSubmitting ? "Memproses..." : "Kirim Link"}
          </Button>
          <Link
            href="/login"
            className="text-center text-sm text-primary underline-offset-4 hover:underline"
          >
            Kembali ke halaman Masuk
          </Link>
        </div>
      </form>
    </div>
  );
}
