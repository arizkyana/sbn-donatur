import "server-only";

import { isAuthError, isAuthRetryableFetchError } from "@supabase/supabase-js";

const RATE_LIMIT_MESSAGE =
  "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.";

// Berdasarkan `error.code` Supabase Auth. Pesan mentah Supabase tidak pernah
// ditampilkan. `user_already_exists`/`email_exists` sengaja tidak ada di sini:
// pendaftaran memperlakukannya sebagai berhasil agar email terdaftar tidak bocor.
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Email atau password salah",
  email_not_confirmed: "Email belum diverifikasi. Cek kotak masuk Anda.",
  user_banned: "Akun Anda dinonaktifkan. Hubungi admin SBN.",
  over_email_send_rate_limit: RATE_LIMIT_MESSAGE,
  over_request_rate_limit: RATE_LIMIT_MESSAGE,
  same_password: "Password baru tidak boleh sama dengan password lama",
  weak_password: "Password terlalu lemah. Gunakan kombinasi yang lebih kuat.",
  email_address_invalid: "Alamat email ini tidak dapat digunakan",
  email_address_not_authorized:
    "Email belum bisa dikirim ke alamat ini. Hubungi admin SBN.",
  otp_expired: "Link sudah kedaluwarsa atau tidak valid. Silakan coba lagi.",
  signup_disabled: "Pendaftaran akun sedang ditutup",
  reauthentication_needed: "Silakan masuk kembali sebelum mengubah password",
  session_not_found: "Sesi Anda sudah berakhir. Silakan masuk kembali.",
};

/** `error.code` Supabase Auth, atau `undefined` bila bukan error Auth. */
export function getAuthErrorCode(error: unknown) {
  return isAuthError(error) ? error.code : undefined;
}

/** Pesan Bahasa Indonesia untuk error Supabase Auth; `fallback` bila kodenya tidak dikenal. */
export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (isAuthRetryableFetchError(error)) {
    return "Koneksi ke server sedang bermasalah. Silakan coba lagi.";
  }
  const code = getAuthErrorCode(error);
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];

  console.error("Error Supabase Auth tidak dikenal:", error);
  return fallback;
}
