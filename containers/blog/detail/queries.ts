import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { SLUG_PATTERN } from "@/lib/validation";

// cache(): halaman dan generateMetadata cukup satu query per request.
export const getPostBySlug = cache(async (slug: string) => {
  // Slug yang formatnya salah langsung dianggap tidak ada, tanpa query ke database.
  if (!SLUG_PATTERN.test(slug)) return null;

  const supabase = await createClient();
  // RLS sudah membatasi publik ke PUBLISH; filter eksplisit agar admin yang login pun sama.
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, type, description, content, cover, video_url, published_at, updated_at, categories (name, alias)",
    )
    .eq("slug", slug)
    .eq("status", "PUBLISH")
    .maybeSingle();
  if (error) throw error;
  return data;
});
