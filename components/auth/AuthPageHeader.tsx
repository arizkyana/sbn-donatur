type AuthPageHeaderProps = {
  title: string;
  description: string;
};

/** Judul halaman login, daftar, lupa password, dan atur ulang password. */
export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
