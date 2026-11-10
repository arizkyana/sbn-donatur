"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Nomor donasi disebutkan donatur saat menghubungi admin.
export default function CopyOrderIdButton({ orderId }: { orderId: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      toast.success("Nomor donasi disalin");
    } catch {
      toast.error("Nomor donasi gagal disalin");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Salin nomor donasi"
      className="shrink-0"
      onClick={handleCopy}
    >
      <CopyIcon />
    </Button>
  );
}
