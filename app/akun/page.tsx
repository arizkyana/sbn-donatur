import type { Metadata } from "next";
import { Profile } from "@/containers/account/profile";

export const metadata: Metadata = {
  title: "Akun Saya",
  robots: { index: false },
};

export default function AccountPage() {
  return <Profile />;
}
