import type { Bot } from "grammy";
import { createLogger } from "@/core/logger";

const logger = createLogger("TelegramChannelMessageService");

export async function sendHelloToChannel(
  bot: Bot,
  channelChatId: string,
): Promise<void> {
  await sendTextToChannel(bot, channelChatId, "ola");
}

export async function sendTextToChannel(
  bot: Bot,
  channelChatId: string,
  text: string,
): Promise<void> {
  try {
    await bot.api.sendMessage(channelChatId, text);
    logger.info("Message sent to Telegram channel", { channelChatId });
  } catch (error) {
    logger.error("Failed to send message to Telegram channel", error);
    throw error;
  }
}
