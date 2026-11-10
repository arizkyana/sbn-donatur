import { z } from "zod";

// Aturan validasi yang dipakai bersama formulir donasi dan akun donatur.

const PHONE_PATTERN = /^\+?\d{9,15}$/;

/** Slug campaign dan post: sama dengan aturan slug di schema sbn-office. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Nama wajib diisi")
  .max(100, "Nama maksimal 100 karakter");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email wajib diisi")
  .pipe(z.email("Format email tidak valid"));

/** Opsional: string kosong berarti tidak diisi dan disimpan sebagai null. */
export const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => phone === "" || PHONE_PATTERN.test(phone),
    "No. HP hanya berisi angka (boleh diawali +), 9–15 digit",
  );

// Batas atas 72 mengikuti batas bcrypt di Supabase Auth.
export const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(72, "Password maksimal 72 karakter");
