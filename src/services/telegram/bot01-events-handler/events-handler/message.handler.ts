import type { Bot } from "grammy";
import { downloadVoice } from "./download-Voice";
import { downloadPhoto } from "./download-photo";

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

  // Listen specifically for text messages

  bot.on("message:text", async (ctx) => {
    console.log(
      `[telegram] Received text from ${ctx.from?.first_name ?? DEFAULT_TELEGRAM_USER_NAME} (ID: ${ctx.from?.id ?? "unknown"}): ${ctx.message.text}`,
    );

    await ctx.reply(START_COMMAND_HINT);
  });

  // Listen for location messages
  bot.on("message:location", async (ctx) => {
    try {
      const { latitude, longitude } = ctx.message.location;

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


  bot.on("message:contact", async (ctx) => {
    try {
      const contact = ctx.message.contact;
      const phoneNumber = contact.phone_number;
      const firstName = contact.first_name;
      const lastName = contact.last_name || "Não informado";
      const userId = contact.user_id || "Não disponível";

      console.log(
        `[telegram] Received contact from chat ${ctx.chat.id}: ${firstName} ${lastName} - ${phoneNumber}`,
      );

      await ctx.reply(
        `Recebi seu contato! 📞\n\nNome: ${firstName} ${lastName}\nTelefone: ${phoneNumber}\nID do usuário: ${userId}`,
      );
    } catch (error) {
      console.error(
        `[telegram] Failed to process contact from chat ${ctx.chat.id}:`,
        error,
      );
    }
  });

// Listen for voice messages
    bot.on(":voice", async (ctx) => {
      try {
        const voice = ctx.msg.voice;
        const fileId = voice.file_id;
        const duration = voice.duration;
        const mimeType = voice.mime_type || "audio/ogg";
  
        console.log(
          `[telegram] Received voice message from chat ${ctx.chat.id}: Duration ${duration}s, File ID: ${fileId}`,
        );
  
        const result = await downloadVoice(bot.token, fileId);
  
        if (result) {
          await ctx.reply(
            `Recebi sua mensagem de voz! 🎤\n\nDuração: ${duration} segundos\nTipo: ${mimeType}\nID do arquivo: ${fileId}\nArquivo salvo: ${result.fileName}`,
          );
        } else {
          await ctx.reply(
            `Recebi sua mensagem de voz! 🎤\n\nDuração: ${duration} segundos\nTipo: ${mimeType}\nID do arquivo: ${fileId}\n⚠️ Não foi possível salvar o arquivo.`,
          );
        }
      } catch (error) {
        console.error(
          `[telegram] Failed to process voice message from chat ${ctx.chat.id}:`,
          error,
        );
      }
    });

  bot.on(":photo", async (ctx) => {
    try {
      const photo = ctx.msg.photo;
      const photoCount = photo.length;
      const largestPhoto = photo[photoCount - 1];
      const fileId = largestPhoto.file_id;
      const width = largestPhoto.width;
      const height = largestPhoto.height;
      const fileSize = largestPhoto.file_size || "Não disponível";

      console.log(
        `[telegram] Received photo from chat ${ctx.chat.id}: ${width}x${height}, File ID: ${fileId}`,
      );

      const result = await downloadPhoto(bot.token, fileId);

      if (result) {
        await ctx.reply(
          `Recebi sua foto! 📷\n\nResolução: ${width}x${height}\nTamanho: ${fileSize} bytes\nID do arquivo: ${fileId}\nArquivo salvo: ${result.fileName}`,
        );
      } else {
        await ctx.reply(
          `Recebi sua foto! 📷\n\nResolução: ${width}x${height}\nTamanho: ${fileSize} bytes\nID do arquivo: ${fileId}\n⚠️ Não foi possível salvar o arquivo.`,
        );
      }
    } catch (error) {
      console.error(
        `[telegram] Failed to process photo from chat ${ctx.chat.id}:`,
        error,
      );
    }
  });

  // Listen for sticker messages

  bot.on(":sticker", async (ctx) => {
    try {
      const sticker = ctx.msg.sticker;
      const fileId = sticker.file_id;
      const width = sticker.width;
      const height = sticker.height;
      const isAnimated = sticker.is_animated || false;
      const isVideo = sticker.is_video || false;

      console.log(
        `[telegram] Received sticker from chat ${ctx.chat.id}: ${width}x${height}, Animated: ${isAnimated}, Video: ${isVideo}`,
      );

      const stickerType = isVideo
        ? "vídeo sticker"
        : isAnimated
          ? "sticker animado"
          : "sticker";

      await ctx.reply(
        `Recebi seu ${stickerType}! 🎨\n\nResolução: ${width}x${height}\nID do arquivo: ${fileId}`,
      );
    } catch (error) {
      console.error(
        `[telegram] Failed to process sticker from chat ${ctx.chat.id}:`,
        error,
      );
    }
  });

}
