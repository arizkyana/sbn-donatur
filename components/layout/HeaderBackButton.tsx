"use client";

import { usePathname } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackNavigation } from "@/hooks/use-back-navigation";
import { getBackHref } from "./navigation";

// Tampil di halaman detail (campaign, formulir dan status donasi, artikel).
// Selalu ter-mount di header agar perpindahan halaman di dalam app tercatat.
export function HeaderBackButton() {
  const backHref = getBackHref(usePathname());
  const goBack = useBackNavigation(backHref ?? "/");
  if (!backHref) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Kembali"
      className="-ml-2 shrink-0"
      onClick={goBack}
    >
      <ArrowLeftIcon className="size-6" />
    </Button>
  );
}
