import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { ShareButton } from "@/components/share/ShareButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPostUrl } from "@/lib/blog";
import { formatDateTime } from "@/lib/date";
import { hasHtmlContent } from "@/lib/html";
import { getYouTubeEmbedUrl, getYouTubeId } from "@/lib/youtube";
import { getPostBySlug } from "./queries";

export async function BlogDetail({ slug }: { slug: string }) {
  // DRAFT dan slug yang tidak ada sama-sama 404.
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const videoId =
    post.type === "VIDEO" && post.video_url
      ? getYouTubeId(post.video_url)
      : null;

  return (
    <article className="flex flex-col">
      {post.type === "VIDEO" ? (
        <div className="flex aspect-video items-center justify-center bg-black">
          {videoId ? (
            <iframe
              src={getYouTubeEmbedUrl(videoId)}
              title={post.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              // Embed YouTube butuh Referer; "no-referrer" membuat video gagal dimuat.
              referrerPolicy="strict-origin-when-cross-origin"
              className="size-full"
            />
          ) : (
            <p className="text-sm text-white/70">Video tidak tersedia</p>
          )}
        </div>
      ) : (
        <div className="relative flex aspect-video items-center justify-center bg-muted">
          {post.cover ? (
            <Image
              src={post.cover}
              alt=""
              fill
              sizes="(max-width: 448px) 100vw, 448px"
              preload
              className="object-cover"
            />
          ) : (
            <ImageIcon className="size-8 text-muted-foreground" />
          )}
        </div>
      )}
      <div className="flex flex-col gap-2 p-4">
        <Badge variant="secondary">{post.categories.name}</Badge>
        <h1 className="text-xl leading-snug font-semibold">{post.title}</h1>
        {post.published_at && (
          <p className="text-xs text-muted-foreground">
            {formatDateTime(post.published_at)}
          </p>
        )}
      </div>
      {hasHtmlContent(post.content) && (
        <div
          className="prose prose-sm max-w-none border-t p-4 prose-a:text-primary"
          // Konten sudah disanitasi di server saat disimpan dari sbn-office.
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
      <div className="flex flex-col gap-3 border-t p-4">
        <ShareButton title={post.title} url={getPostUrl(post.slug)} withLabel />
        <Button variant="link" nativeButton={false} render={<Link href="/" />}>
          Lihat campaign yang sedang berjalan
        </Button>
      </div>
    </article>
  );
}
