import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Header no-cache yang ditulis @supabase/ssr saat session di-refresh.
const SESSION_HEADERS = ["cache-control", "expires", "pragma"];

function isAccountPath(pathname: string) {
  return pathname === "/akun" || pathname.startsWith("/akun/");
}

// Me-refresh session di semua halaman. Hanya /akun/* yang diarahkan ke login
// secara optimistis (cek ada/tidaknya session); pengecekan sebenarnya tetap di
// requireDonatur(). Halaman lain publik, jadi tidak ada redirect global.
export async function proxy(request: NextRequest) {
  const { response, claims } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!claims && isAccountPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies
      .getAll()
      .forEach((cookie) => redirectResponse.cookies.set(cookie));
    SESSION_HEADERS.forEach((key) => {
      const value = response.headers.get(key);
      if (value) redirectResponse.headers.set(key, value);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    // sitemap.xml dan robots.txt tidak butuh session.
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
