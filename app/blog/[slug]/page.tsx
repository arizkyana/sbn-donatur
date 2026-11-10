import type { Metadata } from "next";
import { BlogDetail, generatePostMetadata } from "@/containers/blog/detail";

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata(slug);
}

export default async function BlogDetailPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  return <BlogDetail slug={slug} />;
}
