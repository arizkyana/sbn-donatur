import Image from "next/image";
import { ImageIcon } from "lucide-react";

type CampaignSummaryProps = {
  title: string;
  cover: string | null;
};

export default function CampaignSummary({
  title,
  cover,
}: CampaignSummaryProps) {
  return (
    <div className="flex items-center gap-3 border-b p-4">
      <div className="relative flex aspect-video w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <ImageIcon className="size-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-xs text-muted-foreground">Donasi untuk</p>
        <h1 className="line-clamp-2 text-sm leading-snug font-semibold">
          {title}
        </h1>
      </div>
    </div>
  );
}
