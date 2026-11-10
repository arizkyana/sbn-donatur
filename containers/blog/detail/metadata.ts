import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostImage } from "@/lib/blog";
import { getPostBySlug } from "./queries";

// URL relatif di-resolve oleh metadataBase (NEXT_PUBLIC_SITE_URL) di root layout.
export async function generatePostMetadata(slug: string): Promise<Metadata> {
  // Memakai cache() yang sama dengan halaman, jadi tidak ada query tambahan.
  const post = await getPostBySlug(slug);
  // Status tetap 200 (shell loading.tsx sudah terkirim), tetapi Next menambahkan
  // meta robots noindex pada halaman not-found.
  if (!post) notFound();

  const url = `/blog/${post.slug}`;
  const description = post.description ?? undefined;
  // Cover, atau thumbnail YouTube untuk video tanpa cover.
  const image = getPostImage(post);
  const images = image ? [image] : undefined;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      images,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      section: post.categories.name,
      siteName: "Sobat Baik Nusantara",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images,
    },
  };
}
