import type { Metadata } from "next";
import { Search } from "@/containers/search";

// Hasil pencarian tidak diindeks (konten tipis dan berubah-ubah).
export const metadata: Metadata = {
  title: "Cari Campaign",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return <Search />;
}
