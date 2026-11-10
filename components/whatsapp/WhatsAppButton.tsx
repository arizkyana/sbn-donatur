import type { ReactNode } from "react";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  /** Nomor admin dari `getSettings()`. Kosong → tidak merender apa pun. */
  phone: string | null;
  message: string;
  /**
   * `button`: tombol "Chat Admin" dengan ikon; `icon`: ikon saja (sticky bar);
   * `link`: link biasa dengan isi dan class dari pemanggil (footer, menu akun).
   */
  variant?: "button" | "icon" | "link";
  children?: ReactNode;
  className?: string;
};

export function WhatsAppButton({
  phone,
  message,
  variant = "button",
  children,
  className,
}: WhatsAppButtonProps) {
  const href = getWhatsAppUrl(phone, message);
  if (!href) return null;

  const anchor = <a href={href} target="_blank" rel="noopener noreferrer" />;

  if (variant === "link") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children ?? "Chat Admin"}
      </a>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon-lg"
        aria-label="Chat admin lewat WhatsApp"
        className={className}
        nativeButton={false}
        render={anchor}
      >
        <MessageCircleIcon />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className={className}
      nativeButton={false}
      render={anchor}
    >
      <MessageCircleIcon />
      {children ?? "Chat Admin"}
    </Button>
  );
}
