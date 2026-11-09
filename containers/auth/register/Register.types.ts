import { z } from "zod";
import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
  phoneSchema,
} from "@/lib/validation";

export const registerSchema = z
  .object({
    full_name: fullNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    password_confirmation: z
      .string()
      .min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Konfirmasi password tidak sama",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
