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
  className?: string;
};

// Dipakai di kartu beranda (client) dan halaman detail (server), jadi tanpa hook.
export function CampaignProgress({
  collectedAmount,
  targetBudget,
  donorCount,
  endDate,
  className,
}: CampaignProgressProps) {
  const percent = getProgressPercent(collectedAmount, targetBudget);
  // new Date() aman di sini: komponen ini hanya dirender setelah data campaign
  // dibaca saat request (server) atau selesai di-fetch (client), bukan saat prerender.
  const remainingDays = getRemainingDays(endDate, new Date());

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-0.5">
        <p className="text-sm text-muted-foreground">
          Terkumpul{" "}
          <span className="font-semibold text-primary">
            {formatRupiah(collectedAmount)}
          </span>
        </p>
        {targetBudget && (
          <p className="text-xs text-muted-foreground">
            dari target {formatRupiah(targetBudget)}
          </p>
        )}
      </div>
      {percent !== null && (
        <Progress
          value={percent}
          aria-label="Progres donasi"
          className="**:data-[slot=progress-indicator]:bg-brand-gold **:data-[slot=progress-track]:h-1.5"
        />
      )}
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <UsersIcon className="size-3.5" />
          {donorCount} donatur
        </span>
        <span className="flex items-center gap-1">
          <ClockIcon className="size-3.5" />
          {formatRemainingDays(remainingDays)}
        </span>
      </div>
    </div>
  );
}
