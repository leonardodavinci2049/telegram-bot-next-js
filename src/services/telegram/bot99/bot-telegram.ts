import { Bot } from "grammy";
import { serverEnvs } from "@/core/config/envs.server";
import { getTelegramBotDbConfig } from "@/services/db/load-settings/config-cached.service";
import { sendTextToChannel } from "./channels/channel-message.service";
import { setupMessageHandler } from "./eventos/message.handler";

const BOT5_CONFIG_ID = 11;

let bot: Bot | null = null;

async function ensureBot(): Promise<Bot> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig(BOT5_CONFIG_ID);

    bot = new Bot(botConfig.TELEGRAM_BOT_TOKEN);

    // Configura handlers de eventos
    await setupMessageHandler(bot, botConfig);

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

export async function sendHelloToConfiguredChannel(): Promise<void> {
  await sendTextToConfiguredChannel("ola");
}

export async function sendTextToConfiguredChannel(text: string): Promise<void> {
  const b = await ensureBot();
  const channelChatId = serverEnvs.TELEGRAM_BOT_CHANNEL_ID;

  if (!channelChatId) {
    throw new Error("Canal do Telegram não configurado");
  }

  await sendTextToChannel(b, channelChatId, text);
}

export async function handleUpdate(body: unknown): Promise<void> {
  const b = await ensureBot();
  await b.handleUpdate(body as Parameters<Bot["handleUpdate"]>[0]);
}
