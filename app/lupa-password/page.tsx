import { Suspense } from "react";
import type { Metadata } from "next";
import { RedirectIfLoggedIn } from "@/components/auth/RedirectIfLoggedIn";
import { ForgotPassword } from "@/containers/auth/forgot-password";

export const metadata: Metadata = {
  title: "Lupa Password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="p-4">
      <Suspense fallback={null}>
        <RedirectIfLoggedIn />
      </Suspense>
      <ForgotPassword />
    </div>
  );
}
