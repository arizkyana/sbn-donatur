import { ClockIcon, UsersIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  formatRemainingDays,
  getProgressPercent,
  getRemainingDays,
} from "@/lib/campaign";
import { cn, formatRupiah } from "@/lib/utils";

type CampaignProgressProps = {
  collectedAmount: number;
  targetBudget: number | null;
  donorCount: number;
  endDate: string | null;
  /** Sembunyikan baris jumlah donatur dan sisa hari (detail campaign punya tile sendiri). */
  hideMeta?: boolean;
  className?: string;
};

// Dipakai di kartu campaign (client) dan halaman detail (server), jadi tanpa hook.
export function CampaignProgress({
  collectedAmount,
  targetBudget,
  donorCount,
  endDate,
  hideMeta = false,
  className,
}: CampaignProgressProps) {
  const percent = getProgressPercent(collectedAmount, targetBudget);
  // new Date() aman di sini: komponen ini hanya dirender setelah data campaign
  // dibaca saat request (server) atau selesai di-fetch (client), bukan saat prerender.
  const remainingDays = getRemainingDays(endDate, new Date());

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-end justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Terkumpul</span>
          <span className="text-lg leading-tight font-bold text-primary">
            {formatRupiah(collectedAmount)}
          </span>
        </div>
        {percent !== null && (
          <span className="text-sm font-semibold">{percent}%</span>
        )}
      </div>
      {percent !== null && (
        <Progress
          value={percent}
          aria-label="Progres donasi"
          className="**:data-[slot=progress-indicator]:origin-left **:data-[slot=progress-indicator]:bg-brand-gold motion-safe:**:data-[slot=progress-indicator]:animate-progress-grow"
        />
      )}
      {targetBudget && (
        <p className="text-sm text-muted-foreground">
          dari target {formatRupiah(targetBudget)}
        </p>
      )}
      {!hideMeta && (
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UsersIcon className="size-4" />
            {donorCount} donatur
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-4" />
            {formatRemainingDays(remainingDays)}
          </span>
        </div>
      )}
    </div>
  );
}
