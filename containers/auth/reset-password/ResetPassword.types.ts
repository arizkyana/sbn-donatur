import { z } from "zod";
import { passwordSchema } from "@/lib/validation";

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    password_confirmation: z
      .string()
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Konfirmasi password tidak sama",
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
