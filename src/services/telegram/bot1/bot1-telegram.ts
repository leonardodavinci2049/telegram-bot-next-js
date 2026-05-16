import { Bot } from "grammy";
import { getTelegramBotDbConfig } from "@/services/db/config/config-cached.service";
import { setupMessageHandler, setupReplyWithPhotoWebHandler } from "./eventos";

let bot: Bot | null = null;

async function ensureBot(): Promise<Bot> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig();

    bot = new Bot(botConfig.TELEGRAM_BOT_TOKEN);

    // Configura handlers de eventos
    await setupMessageHandler(bot, botConfig);

    await setupReplyWithPhotoWebHandler(bot, botConfig, {
      respondToAllTextMessages: true,
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
