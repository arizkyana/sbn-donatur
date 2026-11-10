"use client";

import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { RegisterInput } from "../Register.types";

type RegisterFormProps = {
  form: UseFormReturn<RegisterInput>;
  onSubmit: (values: RegisterInput) => Promise<void>;
};

type TextFieldName = keyof RegisterInput;

const FIELDS: {
  name: TextFieldName;
  label: string;
  type?: string;
  autoComplete: string;
  inputMode?: "email" | "tel";
  description?: string;
}[] = [
  { name: "full_name", label: "Nama lengkap", autoComplete: "name" },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    name: "phone",
    label: "No. HP (opsional)",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "new-password",
    description: "Minimal 8 karakter",
  },
  {
    name: "password_confirmation",
    label: "Konfirmasi password",
    type: "password",
    autoComplete: "new-password",
  },
];

export default function RegisterForm({ form, onSubmit }: RegisterFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

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
        {FIELDS.map(({ name, label, description, ...inputProps }) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <Input
                  {...field}
                  {...inputProps}
                  id={name}
                  aria-invalid={!!error}
                />
                {description && (
                  <FieldDescription>{description}</FieldDescription>
                )}
                <FieldError errors={[error]} />
              </Field>
            )}
          />
        ))}
      </FieldGroup>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Dengan mendaftar, Anda menyetujui{" "}
          <Link
            href="/syarat-ketentuan"
            className="text-primary underline-offset-4 hover:underline"
          >
            Syarat &amp; Ketentuan
          </Link>
          .
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {isSubmitting ? "Memproses..." : "Daftar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </form>
  );
}
