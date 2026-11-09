import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, resendVerification } from "../actions";
import { loginSchema, type LoginInput } from "../Login.types";

type ResendStatus = "idle" | "sending" | "sent";

export default function useLogin() {
  // Diisi saat login ditolak karena email belum diverifikasi.
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<ResendStatus>("idle");
  const [resendError, setResendError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginInput) => {
    // Dibaca saat submit (bukan lewat useSearchParams), agar form tetap bagian
    // dari shell statis halaman.
    const next = new URLSearchParams(window.location.search).get("next");
    const result = await login(values, next);
    // Login berhasil: action melakukan redirect, tidak ada hasil yang perlu ditangani.
    if (!result || result.success) return;

    setUnverifiedEmail(
      result.code === "email_not_confirmed" ? values.email : null,
    );
    setResendStatus("idle");
    setResendError(null);
    Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
      form.setError(field as keyof LoginInput, { message: messages[0] });
    });
    form.setError("root", { message: result.message });
  };

  const onResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResendStatus("sending");
    const result = await resendVerification(unverifiedEmail);
    if (result.success) {
      setResendStatus("sent");
      return;
    }
    setResendStatus("idle");
    setResendError(result.message);
  };

  return {
    ...form,
    onSubmit,
    unverifiedEmail,
    resendStatus,
    resendError,
    onResendVerification,
  };
}
