"use client";

import { usePathname } from "next/navigation";
import { BottomNavigation } from "./BottomNavigation";
import { getActiveHref } from "./navigation";

// Wajib dibungkus <Suspense>: dengan cacheComponents, usePathname() menunda render
// di route dengan param dinamis (contoh /campaign/[slug]) saat prerender.
export function ActiveBottomNavigation() {
  const pathname = usePathname();
  return <BottomNavigation activeHref={getActiveHref(pathname)} />;
}
