// Helper video YouTube untuk blog (BLG001). Sumber kebenaran ada di sbn-donatur;
// sbn-office menyalin file ini apa adanya, jadi ubah keduanya bila ada perubahan.

const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
]);

/**
 * ID video dari URL YouTube: `youtube.com/watch?v=ID`, `youtu.be/ID`,
 * `youtube.com/shorts/ID`, `youtube.com/embed/ID`, termasuk `www.` dan `m.`.
 * Selain itu `null`.
 */
export function getYouTubeId(url: string | null | undefined) {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  let id: string | null = null;
  const [, first, second] = parsed.pathname.split("/");
  if (parsed.hostname === "youtu.be") {
    id = first ?? null;
  } else if (YOUTUBE_HOSTS.has(parsed.hostname)) {
    if (first === "watch") id = parsed.searchParams.get("v");
    else if (first === "shorts" || first === "embed") id = second ?? null;
  }

  return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
}

/** URL embed tanpa cookie pelacak sampai video diputar. */
export function getYouTubeEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/** Thumbnail 480×360 yang selalu tersedia (maxresdefault tidak selalu ada). */
export function getYouTubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
