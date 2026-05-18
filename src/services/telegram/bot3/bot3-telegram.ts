import { Bot } from "grammy";
import { getTelegramBotDbConfig } from "@/services/db/load-settings/config-cached.service";
import {
  setupShoppingListsSessionHandler,
  MyContext,
} from "./shopping-Lists-session/shopping-Lists-session";

const BOT2_CONFIG_ID = 8;

let bot: Bot<MyContext> | null = null;

async function ensureBot(): Promise<Bot<MyContext>> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig(BOT2_CONFIG_ID);

    bot = new Bot<MyContext>(botConfig.TELEGRAM_BOT_TOKEN);

    // Configura handlers de eventos
    await setupShoppingListsSessionHandler(bot);

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
