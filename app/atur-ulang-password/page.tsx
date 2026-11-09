import { Suspense } from "react";
import type { Metadata } from "next";
import {
  ResetPassword,
  ResetPasswordSkeleton,
} from "@/containers/auth/reset-password";

export const metadata: Metadata = {
  title: "Atur Ulang Password",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<ResetPasswordSkeleton />}>
        <ResetPassword />
      </Suspense>
    </div>
  );
}
