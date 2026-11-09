import { handleMidtransNotification } from "@/containers/donation/notification";

export async function POST(request: Request) {
  return handleMidtransNotification(request);
}
