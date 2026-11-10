"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getAuthErrorCode, getAuthErrorMessage } from "@/lib/auth-errors";
import { getAuthConfirmUrl } from "@/lib/redirect";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { registerSchema, type RegisterInput } from "./Register.types";

export async function register(
  input: RegisterInput,
): Promise<ActionResult<{ email: string }>> {
  const result = registerSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      message: "Periksa kembali data pendaftaran Anda",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }
  const { full_name, email, phone, password } = result.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Dibaca trigger handle_new_user() untuk mengisi profiles.
      data: { full_name, phone: phone || null },
      emailRedirectTo: getAuthConfirmUrl(),
    },
  });

  if (error) {
    const code = getAuthErrorCode(error);
    // Email yang sudah terdaftar diperlakukan sama dengan pendaftaran baru,
    // agar halaman ini tidak membocorkan email mana yang terdaftar.
    if (code === "user_already_exists" || code === "email_exists") {
      return { success: true, data: { email } };
    }
    const message = getAuthErrorMessage(
      error,
      "Pendaftaran gagal. Silakan coba lagi.",
    );
    if (code === "weak_password") {
      return { success: false, message, fieldErrors: { password: [message] } };
    }
    if (code === "email_address_invalid") {
      return { success: false, message, fieldErrors: { email: [message] } };
    }
    return { success: false, message };
  }

  // Bila "Confirm email" dimatikan di project, Supabase langsung memberi session.
  if (data.session) redirect("/akun");

  return { success: true, data: { email } };
}
