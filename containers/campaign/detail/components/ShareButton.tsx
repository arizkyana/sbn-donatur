"use client";

import { Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ShareButtonProps = {
  title: string;
  url: string;
};

export default function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    // Web Share API umumnya hanya tersedia di HP; selain itu link disalin.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // AbortError: donatur menutup share sheet tanpa memilih aplikasi.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        toast.error("Campaign gagal dibagikan");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link campaign disalin");
    } catch {
      toast.error("Link campaign gagal disalin");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label="Bagikan campaign"
      onClick={handleShare}
    >
      <Share2Icon />
    </Button>
  );
}
