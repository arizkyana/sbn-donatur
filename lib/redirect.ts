// Dipakai proxy.ts juga, jadi tidak boleh `server-only`.

/** Tujuan setelah login bila parameter `next` kosong atau tidak aman. */
export const DEFAULT_AFTER_LOGIN = "/akun";

const BASE = "http://x.invalid";

function hasUnsafeChar(value: string) {
  // Browser menganggap "\" sebagai "/" dan membuang tab/CR/LF, sehingga
  // "/\evil.com" atau "/\t/evil.com" bisa berubah menjadi "//evil.com".
  return [...value].some((char) => {
    const code = char.charCodeAt(0);
    return char === "\\" || code < 0x20 || code === 0x7f;
  });
}

/**
 * Path internal yang aman untuk parameter `next` (mencegah open redirect):
 * hanya path relatif yang diawali satu "/". Selain itu kembali ke /akun.
 */
export function getSafeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AFTER_LOGIN;
  }
  if (hasUnsafeChar(value)) return DEFAULT_AFTER_LOGIN;

  const url = new URL(value, BASE);
  if (url.origin !== BASE) return DEFAULT_AFTER_LOGIN;
  // Normalisasi bisa menghasilkan "//" lagi, contoh "/..//evil.com".
  if (url.pathname.startsWith("//")) return DEFAULT_AFTER_LOGIN;
  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * URL absolut /auth/confirm untuk `emailRedirectTo`/`redirectTo` Supabase Auth.
 * Template email menambahkan `?token_hash=…`, jadi URL ini tidak boleh punya query.
 */
export function getAuthConfirmUrl() {
  return new URL(
    "/auth/confirm",
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002",
  ).toString();
}
