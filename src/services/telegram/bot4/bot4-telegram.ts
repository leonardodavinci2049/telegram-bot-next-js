import { Bot } from "grammy";
import { getTelegramBotDbConfig } from "@/services/db/load-settings/config-cached.service";
import { setupCourseBot } from "./course-bot/course bot";

const BOT4_CONFIG_ID = 9;

let bot: Bot | null = null;

async function ensureBot(): Promise<Bot> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig(BOT4_CONFIG_ID);

    // console.log(` [bot4] Using config ${BOT4_CONFIG_ID}:`, botConfig);

    bot = new Bot(botConfig.TELEGRAM_BOT_TOKEN);

    await setupCourseBot(bot);

    try {
      await bot.init();
    } catch (error) {
      console.error(
        `[telegram:bot4] Failed to initialize bot from config ${BOT4_CONFIG_ID}. Check TELEGRAM_BOT_TOKEN.`,
        error,
      );
      throw error;
    }
  }

  return bot;
}

export async function registerWebhook(): Promise<void> {
  const b = await ensureBot();
  const botConfig = await getTelegramBotDbConfig(BOT4_CONFIG_ID);
  const webhookUrl = `${botConfig.WEBHOOK_URL}/api/bot4-telegram/webhook`;

  try {
    await b.api.setWebhook(webhookUrl);
  } catch (error) {
    console.error("[telegram:bot4] Failed to register webhook:", error);
    throw error;
  }
}

export async function handleUpdate(body: unknown): Promise<void> {
  const b = await ensureBot();
  await b.handleUpdate(body as Parameters<Bot["handleUpdate"]>[0]);
}
