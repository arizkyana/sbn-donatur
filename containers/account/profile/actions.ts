"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDonatur } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { profileSchema, type ProfileInput } from "./Profile.types";

export async function updateProfile(
  input: ProfileInput,
): Promise<ActionResult> {
  const result = profileSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      message: "Periksa kembali data profil Anda",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  const user = await requireDonatur("/akun");
  const supabase = await createClient();
  // Server client: RLS profiles_update_own dan grant kolom (full_name, phone)
  // membatasi perubahan ke baris dan kolom milik donatur sendiri.
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: result.data.full_name,
      phone: result.data.phone || null,
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();
  // Ditolak RLS menghasilkan 0 baris, bukan error.
  if (error || !data) {
    console.error(`Gagal menyimpan profil ${user.id}:`, error);
    return {
      success: false,
      message: "Profil gagal disimpan. Silakan coba lagi.",
    };
  }

  revalidatePath("/akun");
  return { success: true };
}

// Tanpa requireDonatur(): akun nonaktif pun harus bisa keluar.
export async function logout() {
  const supabase = await createClient();
  // "local": hanya keluar dari perangkat ini, session di perangkat lain tetap.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}
