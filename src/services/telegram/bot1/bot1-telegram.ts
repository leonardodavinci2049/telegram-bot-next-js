import { Bot } from "grammy";
import { env } from "@/env";

let bot: Bot | null = null;

async function ensureBot(): Promise<Bot> {
  if (!bot) {
    bot = new Bot(env.TELEGRAM_BOT_TOKEN);

    bot.on("message", async (ctx) => {
      try {
        await ctx.reply(env.TELEGRAM_MESSAGE_RESPONSE);
        console.log(`[telegram] Response sent to chat ${ctx.chat.id}`);
      } catch (error) {
        console.error(
          `[telegram] Failed to send response to chat ${ctx.chat.id}:`,
          error,
        );
      }
    });

    await bot.init();
    console.log(`[telegram] Bot initialized: @${bot.botInfo.username}`);
  }
  return bot;
}

export async function registerWebhook(): Promise<void> {
  const b = await ensureBot();
  const webhookUrl = `${env.WEBHOOK_URL}api/telegram/webhook`;

  try {
    await b.api.setWebhook(webhookUrl);
    console.log(`[telegram] Webhook registered: ${webhookUrl}`);
  } catch (error) {
    console.error("[telegram] Failed to register webhook:", error);
    throw error;
  }
}

export async function handleUpdate(body: unknown): Promise<void> {
  const b = await ensureBot();
  await b.handleUpdate(body as Parameters<Bot["handleUpdate"]>[0]);
}
