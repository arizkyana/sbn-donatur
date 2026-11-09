import { requireDonatur } from "@/lib/auth";
import DonationHistory from "./components/DonationHistory";

// Halaman /akun/riwayat berada di dalam <Suspense> loading.tsx, jadi aman membaca session.
export async function History() {
  const user = await requireDonatur("/akun/riwayat");

  return (
    <section className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-semibold">Riwayat Donasi</h1>
      <DonationHistory userId={user.id} />
    </section>
  );
}
