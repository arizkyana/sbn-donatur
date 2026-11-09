import "server-only";

import { cache } from "react";
import { ORDER_ID_PATTERN } from "@/lib/midtrans";
import { createAdminClient } from "@/lib/supabase/admin";

// Publik tidak punya akses baca ke transactions, jadi dibaca lewat service role
// dengan kolom terbatas. Email dan no. HP donatur sengaja tidak dibaca.
export const getDonationByOrderId = cache(async (orderId: string) => {
  // order_id yang formatnya salah langsung dianggap tidak ada, tanpa query ke database.
  if (!ORDER_ID_PATTERN.test(orderId)) return null;

  const { data, error } = await createAdminClient()
    .from("transactions")
    .select(
      "order_id, amount, payment_status, payment_method, paid_at, created_at, payment_url, donor_name, campaigns (title, slug)",
    )
    .eq("order_id", orderId)
    .maybeSingle();
  if (error) throw error;
  return data;
});
