import type { Metadata } from "next";
import { BlogList } from "@/containers/blog/list";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Kabar program, laporan penyaluran, dan kegiatan Sobat Baik Nusantara dalam bentuk artikel dan video.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogList />;
}
