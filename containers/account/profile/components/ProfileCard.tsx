type ProfileCardProps = {
  fullName: string | null;
  email: string;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export default function ProfileCard({ fullName, email }: ProfileCardProps) {
  const displayName = fullName?.trim() || email;

  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground"
      >
        {getInitials(displayName)}
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="truncate font-semibold">{displayName}</p>
        {/* Email tidak bisa diubah sendiri (A2 backlog 005). */}
        <p className="truncate text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
