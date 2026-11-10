import Link from "next/link";
import { Suspense } from "react";
import { HeaderBackButton } from "./HeaderBackButton";
import { HeaderSearchButton, SearchButtonLink } from "./HeaderSearchButton";
import { SiteLogo } from "./SiteLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-card/90 shadow-card backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-4">
        {/* usePathname() wajib di dalam <Suspense> (lihat ActiveBottomNavigation). */}
        <Suspense fallback={null}>
          <HeaderBackButton />
        </Suspense>
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5">
          <SiteLogo
            size={36}
            alt="Logo Sobat Baik Nusantara"
            className="rounded-full"
            preload
          />
          <span className="truncate text-base font-bold">
            Sobat Baik Nusantara
          </span>
        </Link>
        <Suspense fallback={<SearchButtonLink />}>
          <HeaderSearchButton />
        </Suspense>
      </div>
    </header>
  );
}
