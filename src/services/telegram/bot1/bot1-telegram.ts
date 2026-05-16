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
        const userFirstName =
          ctx.from?.first_name ?? DEFAULT_TELEGRAM_USER_NAME;

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

    bot.on("message", async (ctx) => {
      try {
        await ctx.reply("Olá, meu nome é oferta viva bot 🚀");
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
