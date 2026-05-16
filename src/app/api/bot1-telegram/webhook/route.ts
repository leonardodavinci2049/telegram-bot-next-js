import { handleUpdate } from "@/services/telegram/bot1/bot1-telegram";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[webhook] Update received");

    await handleUpdate(body);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[webhook] Error processing update:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
