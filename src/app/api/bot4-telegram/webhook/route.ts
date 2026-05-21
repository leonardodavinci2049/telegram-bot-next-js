import { handleUpdate } from "@/services/telegram/bot4/bot4-telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[webhook:bot4] Update received");

    await handleUpdate(body);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[webhook:bot4] Error processing update:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
