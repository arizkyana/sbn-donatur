import { redirect } from "next/navigation";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import { getCurrentUser } from "@/lib/auth";
import ResetPasswordForm from "./components/ResetPasswordForm";

// Butuh session: dari link atur ulang password (/auth/confirm type=recovery)
// atau donatur yang sudah login. Render di dalam <Suspense>.
export async function ResetPassword() {
  const user = await getCurrentUser();
  if (!user) redirect("/lupa-password");
  if (!user.isActive) redirect("/login?error=nonaktif");

  return (
    <div className="flex flex-col gap-6">
      <AuthPageHeader
        title="Atur Ulang Password"
        description={`Buat password baru untuk ${user.email}.`}
      />
      <ResetPasswordForm />
    </div>
  );
}
