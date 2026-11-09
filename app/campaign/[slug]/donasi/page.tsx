import type { Metadata } from "next";
import {
  DonationForm,
  generateDonationMetadata,
} from "@/containers/donation/form";

export async function generateMetadata({
  params,
}: PageProps<"/campaign/[slug]/donasi">): Promise<Metadata> {
  const { slug } = await params;
  return generateDonationMetadata(slug);
}

export default async function DonationPage({
  params,
}: PageProps<"/campaign/[slug]/donasi">) {
  const { slug } = await params;
  return <DonationForm slug={slug} />;
}
