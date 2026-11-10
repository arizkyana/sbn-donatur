import { AdminWhatsAppButton } from "@/components/whatsapp/AdminWhatsAppButton";
import { whatsappMessage } from "@/lib/whatsapp";

// Pesan dari redirect lain: link verifikasi/reset yang gagal (AKN003) dan
// akun nonaktif (requireDonatur). Render di dalam <Suspense> karena membaca searchParams.
const NOTICES: Record<string, string> = {
  link: "Link sudah kedaluwarsa atau tidak valid. Silakan coba lagi.",
  nonaktif: "Akun Anda dinonaktifkan. Hubungi admin SBN.",
};

type LoginNoticeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function LoginNotice({ searchParams }: LoginNoticeProps) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? NOTICES[error] : undefined;
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
    >
      <p>{message}</p>
      {error === "nonaktif" && (
        <AdminWhatsAppButton
          className="self-start"
          message={whatsappMessage.inactiveAccount()}
        />
      )}
    </div>
  );
}
