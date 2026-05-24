import type { Bot } from "grammy";
import { HTML_FORMATTED_MESSAGE2 } from "../messages/constants-mensages";

const DEFAULT_TELEGRAM_USER_NAME = "usuario";

export async function setupMessageHandler(
  bot: Bot,
  botConfig: { TELEGRAM_BOT_CHATID: string | null },
): Promise<void> {
  bot.on("message", async (ctx, next) => {
    try {
      // Se não for mensagem de texto, passa para o próximo handler
      if (!ctx.message.text) {
        await next();
        return;
      }

      const configuredChatId = botConfig.TELEGRAM_BOT_CHATID;
      const currentChatId = String(ctx.chat?.id ?? "");
      const userFirstName = ctx.from?.first_name ?? DEFAULT_TELEGRAM_USER_NAME;
      const userId = ctx.from?.id ?? "unknown";

      console.log(
        `[telegram] Received message from ${userFirstName} (ID: ${userId}): ${ctx.message.text}`,
      );

      if (!configuredChatId || currentChatId !== configuredChatId) {
        await ctx.reply("Sinto muito, mas eu so falo com o meu mestre");
        return;
      }

    //  await ctx.reply(HTML_FORMATTED_MESSAGE2, { parse_mode: "HTML" });
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
}
