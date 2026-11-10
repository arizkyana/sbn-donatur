/** `true` bila HTML dari editor berisi teks (editor kosong tetap menghasilkan tag seperti "<p></p>"). */
export function hasHtmlContent(html: string | null): html is string {
  return Boolean(html?.replace(/<[^>]*>/g, "").trim());
}
