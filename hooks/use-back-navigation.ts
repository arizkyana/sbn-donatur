import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Dibagi semua pemakai hook: apakah donatur sudah berpindah halaman di dalam app
// sejak halaman pertama dimuat. Reset sendiri saat halaman di-reload.
let initialPathname: string | null = null;
let hasNavigatedInApp = false;

/**
 * Aksi tombol kembali: `router.back()` bila donatur datang dari halaman lain di
 * app ini, atau ke `fallbackHref` bila halaman dibuka langsung (link yang
 * dibagikan, redirect Midtrans), agar tidak keluar dari situs.
 */
export function useBackNavigation(fallbackHref: string) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (initialPathname === null) initialPathname = pathname;
    else if (pathname !== initialPathname) hasNavigatedInApp = true;
  }, [pathname]);

  return () => {
    if (hasNavigatedInApp) router.back();
    else router.push(fallbackHref);
  };
}
