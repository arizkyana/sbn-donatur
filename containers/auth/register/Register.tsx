"use client";

import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import CheckEmailNotice from "./components/CheckEmailNotice";
import RegisterForm from "./components/RegisterForm";
import useRegister from "./hooks/useRegister";

export function Register() {
  const { registeredEmail, onSubmit, ...form } = useRegister();

  if (registeredEmail) return <CheckEmailNotice email={registeredEmail} />;

  return (
    <div className="flex flex-col gap-6">
      <AuthPageHeader
        title="Daftar Akun"
        description="Simpan data Anda agar formulir donasi terisi otomatis dan riwayat donasi tercatat."
      />
      <RegisterForm form={form} onSubmit={onSubmit} />
    </div>
  );
}
