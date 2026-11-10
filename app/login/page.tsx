import { Suspense } from "react";
import type { Metadata } from "next";
import { RedirectIfLoggedIn } from "@/components/auth/RedirectIfLoggedIn";
import { Login, LoginNotice } from "@/containers/auth/login";

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
      />
    </div>
  );
}
