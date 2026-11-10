import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { requireDonatur } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { whatsappMessage } from "@/lib/whatsapp";
import DonationHistory from "./components/DonationHistory";

// Halaman /akun/riwayat berada di dalam <Suspense> loading.tsx, jadi aman membaca session.
export async function History() {
  const [user, settings] = await Promise.all([
    requireDonatur("/akun/riwayat"),
    getSettings(),
  ]);

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Riwayat Donasi</h1>
        <WhatsAppButton
          size="sm"
          phone={settings.whatsapp_number}
          message={whatsappMessage.account()}
        />
      </div>
      <DonationHistory userId={user.id} />
    </section>
  );
}
