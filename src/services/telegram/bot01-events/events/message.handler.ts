import type { Bot } from "grammy";

const DEFAULT_TELEGRAM_USER_NAME = "usuario";
const UNAUTHORIZED_MESSAGE = "Sinto muito, mas eu so falo com o meu mestre";
const START_COMMAND_HINT =
  "use o comando /start para receber novidades sobre o projeto!";

type BotConfig = {
  TELEGRAM_BOT_CHATID: string | null;
};

export async function setupMessageHandler(
  bot: Bot,
  botConfig: BotConfig,
): Promise<void> {

  
  bot.use(async (ctx, next) => {
    const configuredUserId = botConfig.TELEGRAM_BOT_CHATID;
    const currentUserId = String(ctx.from?.id ?? "");

    if (!configuredUserId || currentUserId !== configuredUserId) {
      await ctx.reply(UNAUTHORIZED_MESSAGE);
      return;
    }

    await next();
  });

  bot.command("start", async (ctx) => {
    const userFirstName = ctx.from?.first_name ?? DEFAULT_TELEGRAM_USER_NAME;

    await ctx.reply(`Olá, ${userFirstName}! Seja bem vindo.`);
    await ctx.reply(
      "Em breve teremos novidades sobre o projeto, fique atento!",
    );
  });

  bot.on("message", async (ctx) => {
    console.log(
      `[telegram] Received message from ${ctx.from?.first_name ?? DEFAULT_TELEGRAM_USER_NAME} (ID: ${ctx.from?.id ?? "unknown"}): ${ctx.message.text ?? "[non-text message]"}`,
    );

    await ctx.reply(START_COMMAND_HINT);
  });
}
