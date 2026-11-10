import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import LoginForm from "./components/LoginForm";

type LoginProps = {
  /** Pesan dari redirect lain (`LoginNotice`), di dalam <Suspense>. */
  notice: React.ReactNode;
};

export function Login({ notice }: LoginProps) {
  return (
    <div className="flex flex-col gap-6">
      <AuthPageHeader
        title="Masuk"
        description="Masuk untuk melihat riwayat donasi dan mengisi formulir donasi lebih cepat."
      />
      {notice}
      <LoginForm />
    </div>
  );
}
