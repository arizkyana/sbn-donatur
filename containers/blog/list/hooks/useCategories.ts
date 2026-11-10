import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

async function fetchCategories() {
  // Kategori bisa dibaca publik (RLS categories_select = true).
  const { data, error } = await createClient()
    .from("categories")
    .select("id, name")
    .order("name");
  if (error) throw error;
  return data;
}

export default function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}
