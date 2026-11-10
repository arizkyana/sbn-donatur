import { Suspense } from "react";
import type { Metadata } from "next";
import { RedirectIfLoggedIn } from "@/components/auth/RedirectIfLoggedIn";
import { AdminWhatsAppButton } from "@/components/whatsapp/AdminWhatsAppButton";
import { Login, LoginNotice } from "@/containers/auth/login";
import { whatsappMessage } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false },
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="p-4">
      <Suspense fallback={null}>
        <RedirectIfLoggedIn />
      </Suspense>
      <Login
        notice={
          <Suspense fallback={null}>
            <LoginNotice searchParams={searchParams} />
          </Suspense>
        }
        contactAdmin={
          <Suspense fallback={null}>
            <AdminWhatsAppButton
              className="self-start"
              message={whatsappMessage.inactiveAccount()}
            />
          </Suspense>
        }
      />
    </div>
  );
}
