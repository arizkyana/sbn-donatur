import type { Metadata } from "next";
import { StaticPage } from "@/containers/pages";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Profil lembaga Sobat Baik Nusantara: siapa kami, program yang dijalankan, dan kontak resmi.",
  alternates: { canonical: "/tentang" },
};

export default function AboutPage() {
  return <StaticPage title="Tentang Kami" settingKey="company_profile" />;
}
