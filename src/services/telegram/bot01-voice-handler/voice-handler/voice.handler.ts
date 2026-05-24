import type { Bot } from "grammy";
import { downloadVoice } from "./voice-upload";


export async function setupVoiceHandler(bot: Bot): Promise<void> {
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
}
