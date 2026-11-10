"use client";

import { Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ShareButtonProps = {
  title: string;
  url: string;
  /** `true`: tombol dengan teks "Bagikan"; `false` (default): tombol ikon saja. */
  withLabel?: boolean;
};

// Dipakai detail campaign (DonateBar) dan detail blog.
export function ShareButton({
  title,
  url,
  withLabel = false,
}: ShareButtonProps) {
  const handleShare = async () => {
    // Web Share API umumnya hanya tersedia di HP; selain itu link disalin.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // AbortError: pengunjung menutup share sheet tanpa memilih aplikasi.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        toast.error("Gagal membagikan link");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link disalin");
    } catch {
      toast.error("Link gagal disalin");
    }
  };

  if (withLabel) {
    return (
      <Button variant="outline" onClick={handleShare}>
        <Share2Icon />
        Bagikan
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label="Bagikan"
      onClick={handleShare}
    >
      <Share2Icon />
    </Button>
  );
}
