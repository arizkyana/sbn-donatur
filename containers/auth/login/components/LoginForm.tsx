"use client";

import type { ReactNode } from "react";
import Link from "next/link";
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
import useLogin from "../hooks/useLogin";

type LoginFormProps = {
  /** Tombol "Chat Admin" (server, di dalam <Suspense>) untuk akun nonaktif. */
  contactAdmin?: ReactNode;
};

export default function LoginForm({ contactAdmin }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    onSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    unverifiedEmail,
    isInactive,
    resendStatus,
    resendError,
    onResendVerification,
  } = useLogin();
  // Tetap disabled setelah berhasil, selama browser berpindah halaman.
  const isProcessing = isSubmitting || isSubmitSuccessful;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      {errors.root && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          <p>{errors.root.message}</p>
          {isInactive && contactAdmin}
          {unverifiedEmail &&
            (resendStatus === "sent" ? (
              <p className="text-foreground">
                Bila email ini terdaftar dan belum diverifikasi, kami telah
                mengirim ulang link verifikasi.
              </p>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                disabled={resendStatus === "sending"}
                onClick={onResendVerification}
              >
                {resendStatus === "sending" && (
                  <Loader2Icon className="animate-spin" />
                )}
                Kirim ulang email verifikasi
              </Button>
            ))}
          {resendError && <p>{resendError}</p>}
        </div>
      )}
      <FieldGroup>
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
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <Field data-invalid={!!error}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/lupa-password"
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <Input
                {...field}
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!error}
              />
              <FieldError errors={[error]} />
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex flex-col gap-3">
        <Button type="submit" size="lg" disabled={isProcessing}>
          {isProcessing && <Loader2Icon className="animate-spin" />}
          {isProcessing ? "Memproses..." : "Masuk"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/daftar"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Daftar
          </Link>
        </p>
      </div>
    </form>
  );
}
