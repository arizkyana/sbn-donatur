/** `true` bila HTML dari editor berisi teks (editor kosong tetap menghasilkan tag seperti "<p></p>"). */
export function hasHtmlContent(html: string | null): html is string {
  return Boolean(html?.replace(/<[^>]*>/g, "").trim());
}

/**
 * Class untuk HTML dari editor office (konten campaign, artikel, S&K, profil).
 * Tabel lebar di-scroll di dalam kotaknya sendiri agar halaman tidak ter-scroll
 * ke samping di HP, dan setiap sel diberi garis agar mudah dibaca. Editor membungkus
 * isi sel dengan `<p>`, jadi margin paragraf di dalam sel dihapus.
 */
export const RICH_TEXT_CLASS_NAME =
  "prose max-w-none prose-a:text-primary prose-table:block prose-table:overflow-x-auto prose-th:border prose-th:bg-muted prose-th:px-2 prose-th:py-1.5 prose-td:border prose-td:px-2 prose-td:py-1.5 [&_:is(th,td)>p]:my-0";
