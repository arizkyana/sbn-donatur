import Link from "next/link";
import { ShareButton } from "@/components/share/ShareButton";
import { Button } from "@/components/ui/button";
import { getCampaignUrl } from "@/lib/campaign";

type DonateBarProps = {
  slug: string;
  title: string;
  isEnded: boolean;
};

export default function DonateBar({ slug, title, isEnded }: DonateBarProps) {
  return (
    // bottom-16: tepat di atas Bottom Navigation (h-16).
    <div
      data-sticky-bar
      className="fixed inset-x-0 bottom-16 z-10 mx-auto flex max-w-md gap-2 border-t bg-background px-4 py-3"
    >
      <ShareButton title={title} url={getCampaignUrl(slug)} />
      {/* Tombol WhatsApp admin ditambahkan di backlog 007-pengaturan. */}
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
