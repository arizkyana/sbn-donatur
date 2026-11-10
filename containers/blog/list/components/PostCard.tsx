import Image from "next/image";
import Link from "next/link";
import { ImageIcon, PlayIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostImage } from "@/lib/blog";
import { formatDateTime } from "@/lib/date";
import type { PostListItem } from "../hooks/usePosts";

type PostCardProps = {
  post: PostListItem;
  /** Kartu pertama di layar: gambar dimuat segera (gambar LCP). */
  eager?: boolean;
};

export default function PostCard({ post, eager }: PostCardProps) {
  const image = getPostImage(post);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="pt-0 transition-colors hover:bg-muted/40">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 448px) 100vw, 448px"
              loading={eager ? "eager" : undefined}
              className="object-cover"
            />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" />
          )}
          {post.type === "VIDEO" && (
            <span className="absolute flex size-12 items-center justify-center rounded-full bg-black/60 text-white">
              <PlayIcon className="size-6 fill-current" />
              <span className="sr-only">Video</span>
            </span>
          )}
        </div>
        <CardHeader className="gap-2">
          <Badge variant="secondary">{post.categories.name}</Badge>
          <CardTitle className="line-clamp-2 font-semibold">
            {post.title}
          </CardTitle>
          {post.published_at && (
            <p className="text-xs text-muted-foreground">
              {formatDateTime(post.published_at)}
            </p>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
