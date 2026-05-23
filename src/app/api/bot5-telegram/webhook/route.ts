import { handleUpdate } from "@/services/telegram/bot5/bot5-telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
   // console.log("[webhook:bot5] Update received");

    await handleUpdate(body);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[webhook:bot5] Error processing update:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
