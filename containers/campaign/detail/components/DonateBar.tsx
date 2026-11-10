import Link from "next/link";
import { ShareButton } from "@/components/share/ShareButton";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { getCampaignUrl } from "@/lib/campaign";
import { whatsappMessage } from "@/lib/whatsapp";

type DonateBarProps = {
  slug: string;
  title: string;
  isEnded: boolean;
  whatsappNumber: string | null;
};

export default function DonateBar({
  slug,
  title,
  isEnded,
  whatsappNumber,
}: DonateBarProps) {
  const url = getCampaignUrl(slug);

  return (
    // Latar bar menerus sampai bawah layar (di belakang Bottom Navigation) agar sudut
    // membulat navigasi tidak memperlihatkan konten; tombolnya tepat di atas navigasi.
    <div
      data-sticky-bar="fixed"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-md gap-2 rounded-t-2xl bg-card px-4 pt-3 pb-[calc(4.75rem+env(safe-area-inset-bottom))] shadow-bar"
    >
      <ShareButton title={title} url={url} />
      <WhatsAppButton
        variant="icon"
        phone={whatsappNumber}
        message={whatsappMessage.campaign(title, url)}
      />
      {isEnded ? (
        <Button size="lg" className="flex-1" disabled>
          Campaign telah berakhir
        </Button>
      ) : (
        <Button
          size="lg"
          className="flex-1"
          nativeButton={false}
          render={<Link href={`/campaign/${slug}/donasi`} />}
        >
          Donasi Sekarang
        </Button>
      )}
    </div>
  );
}
