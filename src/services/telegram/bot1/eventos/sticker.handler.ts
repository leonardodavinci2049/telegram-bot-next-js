import type { Bot } from "grammy";

export async function setupStickerHandler(bot: Bot): Promise<void> {
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
