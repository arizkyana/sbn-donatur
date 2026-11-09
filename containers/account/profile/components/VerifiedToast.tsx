"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

// /auth/confirm mengarahkan ke /akun?verifikasi=berhasil. Render di dalam
// <Suspense> karena membaca searchParams.
export default function VerifiedToast() {
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verifikasi") === "berhasil";

  useEffect(() => {
    if (!isVerified) return;
    // id: tidak tampil dua kali saat effect berjalan ulang (StrictMode).
    toast.success("Email berhasil diverifikasi", { id: "email-verified" });
    // replaceState (bukan router.replace) agar halaman tidak di-fetch ulang.
    const url = new URL(window.location.href);
    url.searchParams.delete("verifikasi");
    window.history.replaceState(null, "", url);
  }, [isVerified]);

  return null;
}
