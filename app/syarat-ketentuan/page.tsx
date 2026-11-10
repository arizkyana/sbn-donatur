import type { Metadata } from "next";
import { StaticPage } from "@/containers/pages";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Syarat dan ketentuan berdonasi melalui Sobat Baik Nusantara, termasuk penggunaan dana dan kontak resmi.",
  alternates: { canonical: "/syarat-ketentuan" },
};

export default function TermsPage() {
  return (
    <StaticPage title="Syarat & Ketentuan" settingKey="terms_and_conditions" />
  );
}
