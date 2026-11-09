import { z } from "zod";
import { fullNameSchema, phoneSchema } from "@/lib/validation";

// Email tidak bisa diubah sendiri oleh donatur (A2 backlog 005).
export const profileSchema = z.object({
  full_name: fullNameSchema,
  phone: phoneSchema,
});

export type ProfileInput = z.infer<typeof profileSchema>;
