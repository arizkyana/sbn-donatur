"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getAuthErrorCode, getAuthErrorMessage } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "./ResetPassword.types";

// Dipakai dari link atur ulang password (session recovery) dan menu "Ubah
// Password" di /akun. Redirect ke /akun dilakukan hook setelah toast.
export async function updatePassword(
  input: ResetPasswordInput,
): Promise<ActionResult> {
  const result = resetPasswordSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      message: "Periksa kembali password Anda",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  const user = await getCurrentUser();
  if (!user?.isActive) {
    return {
      success: false,
      message: "Sesi Anda sudah berakhir. Minta link atur ulang password lagi.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });
  if (error) {
    const message = getAuthErrorMessage(
      error,
      "Password gagal diubah. Silakan coba lagi.",
    );
    const code = getAuthErrorCode(error);
    if (code === "same_password" || code === "weak_password") {
      return { success: false, message, fieldErrors: { password: [message] } };
    }
    return { success: false, message };
  }

  return { success: true };
}
