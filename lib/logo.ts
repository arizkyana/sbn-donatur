/** Logo bawaan selama `settings.logo_url` kosong. Sama dengan sbn-office. */
export const DEFAULT_LOGO_SRC = "/logo-sbn.jpg";

// Bucket logo yang diunggah dari pengaturan office (migration sbn-supabase
// `create_site_assets_bucket`).
const LOGO_URL_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/`;

/**
 * `true` hanya untuk URL publik bucket site-assets milik project ini. Logo
 * dipakai sebagai favicon dan `next/image` (host lain tidak ada di
 * `images.remotePatterns`), jadi nilai lain diganti logo bawaan.
 */
export function isLogoUrl(src: string | undefined): src is string {
  return (
    typeof src === "string" &&
    src.startsWith(LOGO_URL_PREFIX) &&
    src.length > LOGO_URL_PREFIX.length &&
    // Tanpa ../ agar tidak keluar dari folder bucket.
    !src.includes("..")
  );
}
