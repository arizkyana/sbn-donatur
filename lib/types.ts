export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
      /** Kode error (contoh `email_not_confirmed`) bila UI perlu aksi khusus. */
      code?: string;
    };
