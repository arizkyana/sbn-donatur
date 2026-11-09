import "server-only";

import { cache } from "react";
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
