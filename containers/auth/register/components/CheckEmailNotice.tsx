import Link from "next/link";
import { MailCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sama untuk email baru maupun yang sudah terdaftar (tidak membocorkan akun).
export default function CheckEmailNotice({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <MailCheckIcon className="size-12 text-primary" />
      <h2 className="text-lg font-semibold">Cek email Anda</h2>
      <p className="text-sm text-muted-foreground">
        Kami telah mengirim link verifikasi ke{" "}
        <span className="font-medium text-foreground">{email}</span>. Buka link
        tersebut untuk mengaktifkan akun Anda.
      </p>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/login" />}
      >
        Ke halaman Masuk
      </Button>
    </div>
  );
}
