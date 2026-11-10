import { z } from "zod";

/** Nilai field filter di UI (string kosong = tidak difilter). */
export type HistoryFilterValues = {
  from: string;
  to: string;
  /** `"ALL"` atau `campaigns_id`. */
  campaignsId: string;
};

export const EMPTY_HISTORY_FILTERS: HistoryFilterValues = {
  from: "",
  to: "",
  campaignsId: "ALL",
};

const dateSchema = z.iso.date("Format tanggal tidak valid");

export const historyFilterSchema = z
  .object({
    from: dateSchema.optional(),
    to: dateSchema.optional(),
    campaignsId: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => !data.from || !data.to || data.to >= data.from, {
    path: ["to"],
    message: "Tanggal akhir tidak boleh sebelum tanggal awal",
  });

export type HistoryFilters = z.infer<typeof historyFilterSchema>;

/** Nilai field filter → filter tervalidasi. Gagal bila rentang tanggal terbalik. */
export function parseHistoryFilters(values: HistoryFilterValues) {
  return historyFilterSchema.safeParse({
    from: values.from || undefined,
    to: values.to || undefined,
    campaignsId: values.campaignsId === "ALL" ? undefined : values.campaignsId,
  });
}
