import { hasHtmlContent } from "@/lib/html";
import { getSettings, type Settings } from "@/lib/settings";

type StaticPageProps = {
  title: string;
  /** Konten HTML dari pengaturan office (`/settings`). */
  settingKey: Extract<
    keyof Settings,
    "terms_and_conditions" | "company_profile"
  >;
};

// /syarat-ketentuan dan /tentang. Berada di dalam <Suspense> loading.tsx, jadi aman
// membaca settings lewat server client.
export async function StaticPage({ title, settingKey }: StaticPageProps) {
  const content = (await getSettings())[settingKey];

  return (
    <article className="flex flex-col gap-4 p-4">
      <h1 className="text-xl leading-snug font-semibold">{title}</h1>
      {hasHtmlContent(content) ? (
        <div
          className="prose prose-sm max-w-none prose-a:text-primary"
          // Konten sudah disanitasi di server saat disimpan dari sbn-office.
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-sm text-muted-foreground">Konten belum tersedia.</p>
      )}
    </article>
  );
}
