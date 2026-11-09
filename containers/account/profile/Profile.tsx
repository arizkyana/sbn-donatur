import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { requireDonatur } from "@/lib/auth";
import AccountMenu from "./components/AccountMenu";
import LogoutButton from "./components/LogoutButton";
import ProfileCard from "./components/ProfileCard";
import ProfileForm from "./components/ProfileForm";
import VerifiedToast from "./components/VerifiedToast";

// Halaman /akun berada di dalam <Suspense> loading.tsx, jadi aman membaca session.
export async function Profile() {
  const user = await requireDonatur("/akun");

  return (
    <div className="flex flex-col gap-6 p-4">
      <Suspense fallback={null}>
        <VerifiedToast />
      </Suspense>
      <ProfileCard fullName={user.fullName} email={user.email} />
      <ProfileForm
        defaultValues={{
          full_name: user.fullName ?? "",
          phone: user.phone ?? "",
        }}
      />
      <Separator />
      <AccountMenu />
      <LogoutButton />
    </div>
  );
}
