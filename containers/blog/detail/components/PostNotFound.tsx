import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PostNotFound() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <SearchXIcon className="size-10 text-muted-foreground" />
      <h1 className="text-lg font-semibold">Post tidak ditemukan</h1>
      <p className="text-sm text-muted-foreground">
        Link mungkin salah atau post sudah tidak tersedia.
      </p>
      <Button nativeButton={false} render={<Link href="/blog" />}>
        Kembali ke blog
      </Button>
    </div>
  );
}
