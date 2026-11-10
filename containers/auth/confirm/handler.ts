import "server-only";

import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getAuthErrorCode } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";

// Template email AKN002: {{ .RedirectTo }}?token_hash=…&type=email|recovery.
const OTP_TYPES: EmailOtpType[] = ["email", "signup", "recovery"];

const VERIFIED_PATH = "/akun?verifikasi=berhasil";
const RESET_PASSWORD_PATH = "/atur-ulang-password";

function isOtpType(type: string | null): type is EmailOtpType {
  return type !== null && OTP_TYPES.includes(type);
}

function getFailurePath(error: unknown) {
  return getAuthErrorCode(error) === "user_banned"
    ? "/login?error=nonaktif"
    : "/login?error=link";
}

/**
 * Link verifikasi email dan atur ulang password. Session hasil verifikasi
 * disimpan di cookie lewat server client.
 */
export async function handleAuthConfirm(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const code = searchParams.get("code");
  const supabase = await createClient();

  if (tokenHash && isOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) redirect(getFailurePath(error));
    redirect(type === "recovery" ? RESET_PASSWORD_PATH : VERIFIED_PATH);
  }

  // Fallback template bawaan Supabase (PKCE, ?code=…), sebelum template AKN002
  // dipasang. Hanya berhasil di browser yang sama dengan saat mendaftar.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) redirect(getFailurePath(error));

    // Kode tidak menyebut jenis link; link atur ulang password tercatat
    // sebagai metode "recovery" di klaim amr.
    const { data } = await supabase.auth.getClaims();
    const amr: unknown[] = data?.claims.amr ?? [];
    const isRecovery = amr.some(
      (entry) =>
        entry === "recovery" ||
        (typeof entry === "object" &&
          entry !== null &&
          "method" in entry &&
          entry.method === "recovery"),
    );
    redirect(isRecovery ? RESET_PASSWORD_PATH : VERIFIED_PATH);
  }

  redirect("/login?error=link");
}
