import { handleUpdate } from "@/services/telegram/bot2/bot2-telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[webhook:bot2] Update received");

    await handleUpdate(body);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[webhook:bot2] Error processing update:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
