import type { Metadata } from "next";
import {
  CampaignDetail,
  generateCampaignMetadata,
} from "@/containers/campaign/detail";

export async function generateMetadata({
  params,
}: PageProps<"/campaign/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return generateCampaignMetadata(slug);
}

export default async function CampaignPage({
  params,
}: PageProps<"/campaign/[slug]">) {
  const { slug } = await params;
  return <CampaignDetail slug={slug} />;
}
