import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// Untuk /login, /daftar, dan /lupa-password: donatur aktif yang sudah login
// langsung ke /akun. Akun nonaktif tidak diarahkan, agar tidak berputar dengan
// requireDonatur(). Render di dalam <Suspense fallback={null}>.
export async function RedirectIfLoggedIn() {
  const user = await getCurrentUser();
  if (user?.isActive) redirect("/akun");
  return null;
}
