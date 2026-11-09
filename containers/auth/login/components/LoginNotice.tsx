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
    <p
      role="alert"
      className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
    >
      {message}
    </p>
  );
}
