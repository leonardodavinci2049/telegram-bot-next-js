import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type Bot, InputFile } from "grammy";
import { HTML_FORMATTED_MESSAGE2 } from "../messages/constants-mensages";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_USER_IMAGE = new InputFile(
  readFileSync(join(__dirname, "../images/default-user-image.jpeg")),
  "default-user-image.jpeg",
);
const IMAGE_MESSAGE_COMMANDS = new Set(["/imagem", "imagem"]);

const DEFAULT_TELEGRAM_USER_NAME = "usuario";

type SetupMessageImageHandlerOptions = {
  respondToAllTextMessages?: boolean;
};

export async function setupMessageImageLocalHandler(
  bot: Bot,
  botConfig: { TELEGRAM_BOT_CHATID: string | null },
  options?: SetupMessageImageHandlerOptions,
): Promise<void> {
  bot.on("message", async (ctx, next) => {
    try {
      // Se não for mensagem de texto, passa para o próximo handler
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

      await ctx.replyWithPhoto(DEFAULT_USER_IMAGE, {
        caption: HTML_FORMATTED_MESSAGE2,
        parse_mode: "HTML",
      });
      //console.log(`[telegram] Response sent to chat ${ctx.chat.id}`);
      /* 
      await ctx.reply(
        `seja bem ${userFirstName}, em breve teremos novidades, fique atento! 🚀`,
      );
 */
    } catch (error) {
      console.error(
        `[telegram] Failed to send response to chat ${ctx.chat.id}:`,
        error,
      );
    }
  });
}
