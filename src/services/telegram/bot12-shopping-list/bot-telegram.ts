import { Bot } from "grammy";
import { getTelegramBotDbConfig } from "@/services/db/load-settings/config-cached.service";
import {
  setupUserIdShoppingListHandler,
  type UserIdShoppingListContext,
} from "./user-id-shopping-list/user-id-shopping-list";

const BOT_CONFIG_ID = 10;

let bot: Bot<UserIdShoppingListContext> | null = null;

async function ensureBot(): Promise<Bot<UserIdShoppingListContext>> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig(BOT_CONFIG_ID);

    bot = new Bot<UserIdShoppingListContext>(botConfig.TELEGRAM_BOT_TOKEN);

    // Configura handlers de eventos com middleware de autenticação por userId
    await setupUserIdShoppingListHandler(bot, {
      TELEGRAM_BOT_CHATID: botConfig.TELEGRAM_BOT_CHATID,
    });

    try {
      await bot.init();

      console.log(`[telegram] Bot initialized: @${bot.botInfo.username}`);
    } catch (error) {
      console.error(
        `[telegram:bot] Failed to initialize bot from config ${BOT_CONFIG_ID}. Check TELEGRAM_BOT_TOKEN.`,
        error,
      );
      throw error;
    }
  }

  return bot;
}

export async function registerWebhook(): Promise<void> {
  const b = await ensureBot();
  const botConfig = await getTelegramBotDbConfig(BOT_CONFIG_ID);
  const webhookUrl = `${botConfig.WEBHOOK_URL}/api/bot-telegram/webhook`;

  try {
    await b.api.setWebhook(webhookUrl);
  } catch (error) {
    console.error("[telegram:bot] Failed to register webhook:", error);
    throw error;
  }
}

export async function handleUpdate(body: unknown): Promise<void> {
  const b = await ensureBot();
  await b.handleUpdate(body as Parameters<Bot["handleUpdate"]>[0]);
}
