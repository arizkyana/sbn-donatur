import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Hanya me-refresh session. Tidak ada redirect global ke login karena hampir
// semua halaman donatur publik; proteksi /akun/* dilakukan per halaman.
export async function proxy(request: NextRequest) {
  const { response } = await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
