import { CampaignDetail } from "@/containers/campaign/detail";

export default async function CampaignPage({
  params,
}: PageProps<"/campaign/[slug]">) {
  const { slug } = await params;
  return <CampaignDetail slug={slug} />;
}
