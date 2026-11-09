import type { NextRequest } from "next/server";
import { handleAuthConfirm } from "@/containers/auth/confirm/handler";

export async function GET(request: NextRequest) {
  return handleAuthConfirm(request);
}
