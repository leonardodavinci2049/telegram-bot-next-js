import type { Bot } from "grammy";

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

      await ctx.reply(
        `Recebi sua mensagem de voz! 🎤\n\nDuração: ${duration} segundos\nTipo: ${mimeType}\nID do arquivo: ${fileId}`,
      );
    } catch (error) {
      console.error(
        `[telegram] Failed to process voice message from chat ${ctx.chat.id}:`,
        error,
      );
    }
  });
}
