import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";

export type CurrentUser = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: Enums<"user_role">;
  isActive: boolean;
};

// cache(): dipanggil berkali-kali dalam satu request cukup sekali query.
// Pemanggil wajib berada di dalam <Suspense> karena membaca session (aturan cacheComponents).
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role, is_active")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    phone: profile.phone,
    role: profile.role,
    isActive: profile.is_active,
  };
});

/**
 * Halaman dan aksi /akun/*: donatur wajib login dan aktif. Pemanggil halaman
 * wajib berada di dalam <Suspense>.
 *
 * Akun nonaktif tidak di-signOut() di sini karena cookie tidak bisa ditulis dari
 * Server Component (dan render bisa terjadi saat prefetch). Session-nya berakhir
 * sendiri setelah di-ban (refresh ditolak), dan login berikutnya ditolak.
 */
export async function requireDonatur(next: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!user.isActive) redirect("/login?error=nonaktif");
  return user;
}
