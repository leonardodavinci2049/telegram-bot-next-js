export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  try {
    const { registerWebhook } = await import("@/services/telegram/bot1/bot1-telegram");
    await registerWebhook();
  } catch (error) {
    console.error("[instrumentation] Webhook registration failed:", error);
  }
}
