import { Bot } from "grammy/web";
import { serverEnvs } from "@/core/config/envs.server";
import { getTelegramBotDbConfig } from "@/services/db/config/config-cached.service";

let bot: Bot | null = null;

async function ensureBot(): Promise<Bot> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig();

    bot = new Bot(botConfig.TELEGRAM_BOT_TOKEN);

    bot.on("message", async (ctx) => {
      try {
        await ctx.reply(serverEnvs.TELEGRAM_MESSAGE_RESPONSE);
        //console.log(`[telegram] Response sent to chat ${ctx.chat.id}`);
      } catch (error) {
        console.error(
          `[telegram] Failed to send response to chat ${ctx.chat.id}:`,
          error,
        );
      }
    });

    await bot.init();
    // console.log(`[telegram] Bot initialized: @${bot.botInfo.username}`);
  }
  return bot;
}

export async function registerWebhook(): Promise<void> {
  const b = await ensureBot();
  const botConfig = await getTelegramBotDbConfig();
  const webhookUrl = `${botConfig.WEBHOOK_URL}/api/bot1-telegram/webhook`;

  try {
    await b.api.setWebhook(webhookUrl);
    // console.log(`[telegram] Webhook registered: ${webhookUrl}`);
  } catch (error) {
    console.error("[telegram] Failed to register webhook:", error);
    throw error;
  }
}

export async function handleUpdate(body: unknown): Promise<void> {
  const b = await ensureBot();
  await b.handleUpdate(body as Parameters<Bot["handleUpdate"]>[0]);
}
