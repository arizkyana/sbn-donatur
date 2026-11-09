"use server";

import { z } from "zod";
import { getAuthErrorCode, getAuthErrorMessage } from "@/lib/auth-errors";
import { getAuthConfirmUrl } from "@/lib/redirect";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "./ForgotPassword.types";

/**
 * Kirim link atur ulang password. Hasilnya sama untuk email terdaftar maupun
 * tidak, agar halaman ini tidak membocorkan email mana yang punya akun.
 */
export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const result = forgotPasswordSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      message: "Periksa kembali email Anda",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    result.data.email,
    // /auth/confirm (type=recovery) mengarahkan ke /atur-ulang-password.
    { redirectTo: getAuthConfirmUrl() },
  );
  const code = getAuthErrorCode(error);
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit") {
    return {
      success: false,
      message: getAuthErrorMessage(error, "Gagal mengirim email."),
    };
  }
  if (error) console.error("Gagal mengirim email atur ulang password:", error);

  return { success: true };
}
