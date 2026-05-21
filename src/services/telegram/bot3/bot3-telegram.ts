import { Bot } from "grammy";
import { getTelegramBotDbConfig } from "@/services/db/load-settings/config-cached.service";
import {
  setupUserIdShoppingListHandler,
  type UserIdShoppingListContext,
} from "./user-id-shopping-list/user-id-shopping-list";

const BOT2_CONFIG_ID = 8;

let bot: Bot<UserIdShoppingListContext> | null = null;

async function ensureBot(): Promise<Bot<UserIdShoppingListContext>> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig(BOT2_CONFIG_ID);

    bot = new Bot<UserIdShoppingListContext>(botConfig.TELEGRAM_BOT_TOKEN);

    // Configura handlers de eventos com middleware de autenticação por userId
    await setupUserIdShoppingListHandler(bot, {
      TELEGRAM_BOT_CHATID: botConfig.TELEGRAM_BOT_CHATID,
    });

    await bot.init();
  }

  return bot;
}

export async function registerWebhook(): Promise<void> {
  const b = await ensureBot();
  const botConfig = await getTelegramBotDbConfig(BOT2_CONFIG_ID);
  const webhookUrl = `${botConfig.WEBHOOK_URL}/api/bot3-telegram/webhook`;

  try {
    await b.api.setWebhook(webhookUrl);
  } catch (error) {
    console.error("[telegram:bot3] Failed to register webhook:", error);
    throw error;
  }
}

export async function handleUpdate(body: unknown): Promise<void> {
  const b = await ensureBot();
  await b.handleUpdate(body as Parameters<Bot["handleUpdate"]>[0]);
}
