import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HeaderSearchButton, SearchButtonLink } from "./HeaderSearchButton";

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-card/90 shadow-card backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-2 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-sbn.jpg"
            alt="Logo Sobat Baik Nusantara"
            width={36}
            height={36}
            className="rounded-full"
            preload
          />
          <span className="text-base font-bold">Sobat Baik Nusantara</span>
        </Link>
        {/* usePathname() wajib di dalam <Suspense> (lihat ActiveBottomNavigation). */}
        <Suspense fallback={<SearchButtonLink />}>
          <HeaderSearchButton />
        </Suspense>
      </div>
    </header>
  );
}
