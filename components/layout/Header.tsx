import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <Link href="/" className="flex h-14 items-center gap-2 px-4">
        <Image
          src="/logo-sbn.jpg"
          alt="Logo Sobat Baik Nusantara"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
        <span className="font-semibold">Sobat Baik Nusantara</span>
      </Link>
    </header>
  );
}
