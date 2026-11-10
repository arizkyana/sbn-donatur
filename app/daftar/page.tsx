import { Suspense } from "react";
import type { Metadata } from "next";
import { RedirectIfLoggedIn } from "@/components/auth/RedirectIfLoggedIn";
import { Register } from "@/containers/auth/register";

export const metadata: Metadata = {
  title: "Daftar",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="p-4">
      <Suspense fallback={null}>
        <RedirectIfLoggedIn />
      </Suspense>
      <Register />
    </div>
  );
}
