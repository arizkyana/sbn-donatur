import "server-only";

import { cache } from "react";
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
