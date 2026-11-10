import Link from "next/link";
import { CalendarXIcon } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CampaignEndedNotice({ slug }: { slug: string }) {
  return (
    <Card>
      <EmptyState
        icon={CalendarXIcon}
        title="Campaign telah berakhir"
        description="Campaign ini sudah tidak menerima donasi."
        action={
          <Button
            nativeButton={false}
            render={<Link href={`/campaign/${slug}`} />}
          >
            Kembali ke campaign
          </Button>
        }
      />
    </Card>
  );
}
