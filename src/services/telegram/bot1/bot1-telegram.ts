import { Bot } from "grammy/web";
import { getTelegramBotDbConfig } from "@/services/db/config/config-cached.service";

let bot: Bot | null = null;
const DEFAULT_TELEGRAM_USER_NAME = "usuario";

async function ensureBot(): Promise<Bot> {
  if (!bot) {
    const botConfig = await getTelegramBotDbConfig();

    bot = new Bot(botConfig.TELEGRAM_BOT_TOKEN);

    bot.on("message", async (ctx, next) => {
      try {
        // Se não for mensagem de texto, passa para o próximo handler
        if (!ctx.message.text) {
          await next();
          return;
        }

        const configuredChatId = botConfig.TELEGRAM_BOT_CHATID;
        const currentChatId = String(ctx.chat?.id ?? "");
        const userFirstName =
          ctx.from?.first_name ?? DEFAULT_TELEGRAM_USER_NAME;
        const userId = ctx.from?.id ?? "unknown";

        console.log(
          `[telegram] Received message from ${userFirstName} (ID: ${userId}): ${ctx.message.text}`,
        );

        if (!configuredChatId || currentChatId !== configuredChatId) {
          await ctx.reply("Sinto muito, mas eu so falo com o meu mestre");
          return;
        }

        //  await ctx.reply(serverEnvs.TELEGRAM_MESSAGE_RESPONSE);
        //console.log(`[telegram] Response sent to chat ${ctx.chat.id}`);

        await ctx.reply(
          `seja bem ${userFirstName}, em breve teremos novidades, fique atento! 🚀`,
        );
        await next();
      } catch (error) {
        console.error(
          `[telegram] Failed to send response to chat ${ctx.chat.id}:`,
          error,
        );
      }
    });

    bot.on(":location", async (ctx) => {
      try {
        const location = ctx.msg.location;
        const latitude = location.latitude;
        const longitude = location.longitude;

        console.log(
          `[telegram] Received location from chat ${ctx.chat.id}: ${latitude}, ${longitude}`,
        );

        await ctx.reply(
          `Recebi sua localização! 📍\nLatitude: ${latitude}\nLongitude: ${longitude}`,
        );
      } catch (error) {
        console.error(
          `[telegram] Failed to process location from chat ${ctx.chat.id}:`,
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
