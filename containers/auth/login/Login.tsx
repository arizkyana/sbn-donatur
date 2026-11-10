import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import LoginForm from "./components/LoginForm";

type LoginProps = {
  /** Pesan dari redirect lain (`LoginNotice`), di dalam <Suspense>. */
  notice: React.ReactNode;
  /** Tombol "Chat Admin" untuk akun nonaktif, di dalam <Suspense>. */
  contactAdmin: React.ReactNode;
};

export function Login({ notice, contactAdmin }: LoginProps) {
  return (
    <div className="flex flex-col gap-6">
      <AuthPageHeader
        title="Masuk"
        description="Masuk untuk melihat riwayat donasi dan mengisi formulir donasi lebih cepat."
      />
      {notice}
      <LoginForm contactAdmin={contactAdmin} />
    </div>
  );
}
