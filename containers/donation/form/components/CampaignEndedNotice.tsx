import Link from "next/link";
import { CalendarXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CampaignEndedNotice({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <CalendarXIcon className="size-10 text-muted-foreground" />
      <h2 className="text-lg font-semibold">Campaign telah berakhir</h2>
      <p className="text-sm text-muted-foreground">
        Campaign ini sudah tidak menerima donasi.
      </p>
      <Button nativeButton={false} render={<Link href={`/campaign/${slug}`} />}>
        Kembali ke campaign
      </Button>
    </div>
  );
}
