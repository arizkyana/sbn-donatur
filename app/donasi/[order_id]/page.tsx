import type { Metadata } from "next";
import { DonationStatus } from "@/containers/donation/status";

export const metadata: Metadata = {
  title: "Status Donasi",
  robots: { index: false },
};

export default async function DonationStatusPage({
  params,
}: PageProps<"/donasi/[order_id]">) {
  const { order_id } = await params;
  return <DonationStatus orderId={order_id} />;
}
