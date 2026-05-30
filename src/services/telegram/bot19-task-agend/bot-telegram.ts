import type { ConversationFlavor } from "@grammyjs/conversations";
import type { Context, SessionFlavor } from "grammy";
import { Bot } from "grammy";
import { getTelegramBotDbConfig } from "@/services/db/load-settings/config-cached.service";
import { setupTaskHandler } from "./task/task";

type BotContext = Context &
  SessionFlavor<Record<string, unknown>> &
  ConversationFlavor<Context>;

const BOT5_CONFIG_ID = 10;

let bot: Bot<BotContext> | null = null;

async function ensureBot(): Promise<Bot<BotContext>> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig(BOT5_CONFIG_ID);

    bot = new Bot<BotContext>(botConfig.TELEGRAM_BOT_TOKEN);

    await setupTaskHandler(bot);

    await bot.init();

    console.log(`[telegram] Bot initialized: @${bot.botInfo.username}`);
  }

  return bot;
}

export async function registerWebhook(): Promise<void> {
  const b = await ensureBot();
  const botConfig = await getTelegramBotDbConfig(BOT5_CONFIG_ID);
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
