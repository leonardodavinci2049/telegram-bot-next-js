export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  const [
    { registerWebhook: registerBot1Webhook },
    //{ registerWebhook: registerBot2Webhook },
    { registerWebhook: registerBot3Webhook },
  ] = await Promise.all([
    import("@/services/telegram/bot1/bot1-telegram"),
    //{ import("@/services/telegram/bot2/bot2-telegram"),
    import("@/services/telegram/bot3/bot3-telegram"),
  ]);

  const results = await Promise.allSettled([
    registerBot1Webhook(),
    // registerBot2Webhook(),
    registerBot3Webhook(),
  ]);

  for (const [index, result] of results.entries()) {
    if (result.status === "rejected") {
      console.error(
        `[instrumentation] Bot ${index + 1} webhook registration failed:`,
        result.reason,
      );
    }
  }
}
