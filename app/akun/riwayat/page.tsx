import type { Metadata } from "next";
import { History } from "@/containers/account/history";

export const metadata: Metadata = {
  title: "Riwayat Donasi",
  robots: { index: false },
};

export default function DonationHistoryPage() {
  return <History />;
}
