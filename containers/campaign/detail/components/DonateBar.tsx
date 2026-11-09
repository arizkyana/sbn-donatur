import Link from "next/link";
import { Button } from "@/components/ui/button";

type DonateBarProps = {
  slug: string;
  isEnded: boolean;
};

export default function DonateBar({ slug, isEnded }: DonateBarProps) {
  return (
    // bottom-16: tepat di atas Bottom Navigation (h-16).
    <div className="fixed inset-x-0 bottom-16 z-10 mx-auto flex max-w-md gap-2 border-t bg-background px-4 py-3">
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
