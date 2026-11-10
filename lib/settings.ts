import "server-only";

import { cacheLife } from "next/cache";
import { cache } from "react";
import { DEFAULT_LOGO_SRC, isLogoUrl } from "@/lib/logo";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type Settings = {
  whatsapp_number: string | null;
  terms_and_conditions: string | null;
  company_profile: string | null;
};

const SETTING_KEYS = [
  "whatsapp_number",
  "terms_and_conditions",
  "company_profile",
] as const satisfies (keyof Settings)[];

/**
 * Pengaturan yang dikelola admin di sbn-office (`/settings`). Tidak memakai
 * `"use cache"` agar perubahan dari office langsung terlihat; RLS `settings`
 * terbuka untuk publik. Nilai kosong dikembalikan sebagai `null`.
 *
 * Membaca cookies lewat server client, jadi pemanggilnya wajib di dalam `<Suspense>`.
 */
export const getSettings = cache(async (): Promise<Settings> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", SETTING_KEYS);
  if (error) throw error;

  const values = new Map(data.map((row) => [row.key, row.value.trim()]));
  return {
    whatsapp_number: values.get("whatsapp_number") || null,
    terms_and_conditions: values.get("terms_and_conditions") || null,
    company_profile: values.get("company_profile") || null,
  };
});

/**
 * Logo utama dari `settings.logo_url` untuk header, footer, halaman auth, dan
 * favicon (root layout), atau logo bawaan bila kosong.
 *
 * Berbeda dengan `getSettings()`, logo di-cache agar tetap ikut kerangka statis
 * setiap halaman dan favicon ada di `<head>`. Office tidak bisa me-revalidate
 * cache app ini, jadi logo baru tampil paling lambat beberapa menit setelah
 * disimpan (diperbarui di latar belakang setelah 1 menit).
 */
export async function getLogoSrc() {
  "use cache";
  cacheLife("minutes");

  const { data, error } = await createPublicClient()
    .from("settings")
    .select("value")
    .eq("key", "logo_url")
    .maybeSingle();
  // Logo gagal dibaca tidak boleh menggagalkan halaman: pakai logo bawaan.
  if (error) {
    console.error("Logo gagal dibaca", error);
    return DEFAULT_LOGO_SRC;
  }

  const url = data?.value.trim();
  return isLogoUrl(url) ? url : DEFAULT_LOGO_SRC;
}
