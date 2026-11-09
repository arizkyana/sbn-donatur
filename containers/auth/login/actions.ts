"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthErrorCode, getAuthErrorMessage } from "@/lib/auth-errors";
import { getAuthConfirmUrl, getSafeNextPath } from "@/lib/redirect";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { emailSchema } from "@/lib/validation";
import { loginSchema, type LoginInput } from "./Login.types";

const INACTIVE_MESSAGE = "Akun Anda dinonaktifkan. Hubungi admin SBN.";

export async function login(
  input: LoginInput,
  next: string | null,
): Promise<ActionResult> {
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      message: "Periksa kembali email dan password",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(result.data);
  if (error) {
    return {
      success: false,
      code: getAuthErrorCode(error),
      message: getAuthErrorMessage(error, "Gagal masuk. Silakan coba lagi."),
    };
  }

  // Akun yang dinonaktifkan admin tetapi belum di-ban di Auth (AKN011).
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", data.user.id)
    .single();
  if (!profile?.is_active) {
    await supabase.auth.signOut({ scope: "local" });
    return { success: false, code: "user_banned", message: INACTIVE_MESSAGE };
  }

  // `next` divalidasi ulang di server walau sudah dari URL halaman login.
  redirect(getSafeNextPath(next));
}

/** Kirim ulang email verifikasi. Hasilnya selalu sama agar status akun tidak bocor. */
export async function resendVerification(
  email: string,
): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { success: false, message: "Format email tidak valid" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data,
    options: { emailRedirectTo: getAuthConfirmUrl() },
  });
  // Sama dengan lupa password: batas kirim email tidak ditampilkan agar status
  // akun tidak bocor; hanya batas request per-IP.
  if (getAuthErrorCode(error) === "over_request_rate_limit") {
    return {
      success: false,
      message: getAuthErrorMessage(error, "Gagal mengirim ulang email."),
    };
  }
  if (error) console.error("Gagal mengirim ulang email verifikasi:", error);

  return { success: true };
}
