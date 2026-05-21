export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  const botWebhookRegistrations = [
    {
      name: "bot4",
      load: () => import("@/services/telegram/bot4/bot4-telegram"),
    },
  ];

  const webhookModules = await Promise.all(
    botWebhookRegistrations.map(({ load }) => load()),
  );

  const results = await Promise.allSettled(
    webhookModules.map(({ registerWebhook }) => registerWebhook()),
  );

  for (const [index, result] of results.entries()) {
    if (result.status === "rejected") {
      const botName = botWebhookRegistrations[index]?.name ?? `bot${index + 1}`;

      console.error(
        `[instrumentation] ${botName} webhook registration failed:`,
        result.reason,
      );
    }
  }
}
