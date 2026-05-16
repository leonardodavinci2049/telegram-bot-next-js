import { type Bot, InputFile } from "grammy";
import { HTML_FORMATTED_MESSAGE2 } from "../messages/constants-mensages";

const IMAGE_WEB_URL = "https://picsum.photos/800/600";
const IMAGE_MESSAGE_COMMANDS = new Set(["/imagemweb", "imagemweb"]);

const DEFAULT_TELEGRAM_USER_NAME = "usuario";

type SetupMessageImageHandlerOptions = {
  respondToAllTextMessages?: boolean;
};

export async function setupMessageImageWebHandler(
  bot: Bot,
  botConfig: { TELEGRAM_BOT_CHATID: string | null },
  options?: SetupMessageImageHandlerOptions,
): Promise<void> {
  bot.on("message", async (ctx, next) => {
    try {
      if (!ctx.message.text) {
        await next();
        return;
      }

      const messageText = ctx.message.text.trim().toLowerCase();
      const shouldRespondToAllTextMessages =
        options?.respondToAllTextMessages ?? false;

      if (
        !shouldRespondToAllTextMessages &&
        !IMAGE_MESSAGE_COMMANDS.has(messageText)
      ) {
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

      await ctx.replyWithPhoto(new InputFile(new URL(IMAGE_WEB_URL)), {
        caption: HTML_FORMATTED_MESSAGE2,
        parse_mode: "HTML",
      });
    } catch (error) {
      console.error(
        `[telegram] Failed to send response to chat ${ctx.chat.id}:`,
        error,
      );
    }
  });
}
