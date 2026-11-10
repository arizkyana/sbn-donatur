import type { Enums } from "@/lib/supabase/database.types";
import { getAbsoluteUrl } from "@/lib/utils";
import { getYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

export const postTypeLabel: Record<Enums<"post_type">, string> = {
  ARTICLE: "Artikel",
  VIDEO: "Video",
};

type PostImageSource = {
  type: Enums<"post_type">;
  cover: string | null;
  video_url: string | null;
};

/**
 * Gambar post: cover, atau thumbnail YouTube untuk video tanpa cover (A3
 * backlog 006). `null` bila keduanya tidak ada.
 */
export function getPostImage({ type, cover, video_url }: PostImageSource) {
  if (cover) return cover;
  if (type !== "VIDEO") return null;
  const id = getYouTubeId(video_url);
  return id ? getYouTubeThumbnail(id) : null;
}

/** URL publik detail blog, dipakai untuk tombol bagikan. */
export function getPostUrl(slug: string) {
  return getAbsoluteUrl(`/blog/${slug}`);
}
