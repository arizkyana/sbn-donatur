import Image from "next/image";

type AuthPageHeaderProps = {
  title: string;
  description: string;
};

/** Judul halaman login, daftar, lupa password, dan atur ulang password. */
export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-linear-to-br from-primary/10 to-brand-gold/10 px-4 py-6 text-center">
      {/* Maksimal 48px sampai ada logo resolusi tinggi (D1 backlog 008). */}
      <Image
        src="/logo-sbn.jpg"
        alt=""
        width={48}
        height={48}
        className="mb-1 rounded-full shadow-card"
      />
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="text-base text-muted-foreground">{description}</p>
    </div>
  );
}
