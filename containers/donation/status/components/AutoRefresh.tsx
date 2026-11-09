"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REFRESH_INTERVAL_MS = 5_000;
const MAX_DURATION_MS = 3 * 60 * 1000;

/**
 * Selama status PENDING, muat ulang data server setiap 5 detik sampai 3 menit
 * sejak halaman dibuka. Status dibaca dari database, jadi tidak perlu API tambahan.
 */
export default function AutoRefresh() {
  const router = useRouter();
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - startedAt >= MAX_DURATION_MS) {
        clearInterval(interval);
        setIsStopped(true);
        return;
      }
      router.refresh();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <p className="text-center text-xs text-muted-foreground">
      {isStopped
        ? "Sudah membayar tapi status belum berubah? Muat ulang halaman ini beberapa saat lagi."
        : "Halaman ini diperbarui otomatis."}
    </p>
  );
}
