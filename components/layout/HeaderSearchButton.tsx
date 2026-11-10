"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isActivePath } from "./navigation";

export function SearchButtonLink() {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Cari campaign"
      nativeButton={false}
      render={<Link href="/cari" />}
    >
      <SearchIcon className="size-6" />
    </Button>
  );
}

// Disembunyikan di /cari karena halaman itu sudah punya kolom cari sendiri.
export function HeaderSearchButton() {
  const pathname = usePathname();
  if (isActivePath(pathname, "/cari")) return null;
  return <SearchButtonLink />;
}
